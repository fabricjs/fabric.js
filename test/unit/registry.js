

QUnit.module('IO Registry', hook => {

    const registry = fabric.registry;
    
    QUnit.test('existing', assert => {
        assert.ok(registry, 'should exist');
        assert.ok(typeof registry.assertJSONHandler({ type: 'rect' }) === 'function', 'should exist');
    });

    QUnit.test('register resolver', assert => {
        const stubData = {
            foo: 'bar'
        };
        const stubResolver = () => { };
        const stubSVG = {};
        registry.registerResolver('json', (a) => {
            assert.equal(a, stubData);
            return { handler: stubResolver, key: 'stub' };
        });
        registry.registerResolver('svg', ({ element, key }) => {
            assert.equal(element, stubSVG);
            assert.equal(key, 'stub');
            return { handler: stubResolver, key: 'stub' };
        });
        assert.ok(registry.resolver.json, 'should add resolver');
        assert.ok(registry.resolver.svg, 'should add resolver');
        assert.deepEqual(registry.resolver.json(stubData), { handler: stubResolver, key: 'stub' }, 'should return resolver');
        assert.deepEqual(registry.resolver.svg({ element: stubSVG, key: 'stub' }), { handler: stubResolver, key: 'stub' }, 'should return resolver');
        assert.ok(registry.assertJSONHandler(stubData), stubResolver, 'should pass back a custom resolver');
        assert.ok(registry.assertSVGHandler({ element: stubSVG, key: 'stub' }), stubResolver, 'should pass back a custom resolver');
        registry.unregisterResolver('json');
        registry.unregisterResolver('svg');
        assert.ok(!registry.resolver.json, 'should remove resolver');
        assert.ok(!registry.resolver.svg, 'should remove resolver');
        assert.throws(() => registry.assertJSONHandler(stubData), 'no resolver');
        assert.throws(() => registry.assertSVGHandler(stubData), 'no resolver');
    });

    QUnit.test('fail assertion', assert => {
        assert.throws(() => registry.assertJSONHandler({
            foo: 'bar'
        }), 'no resolver');
        assert.throws(() => registry.assertJSONHandler({
            foo: 'bar',
            type: 'unicorn'
        }), 'no resolver');
        assert.throws(() => registry.assertSVGHandler({key:'NON_EXISTING',element:null}), 'no resolver');
    });
});