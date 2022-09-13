

QUnit.module('IO Registry', hook => {

    const registry = fabric.registry;
    
    QUnit.test('existing', assert => {
        assert.ok(registry, 'should exist');
    });

    QUnit.test('register resolver', assert => {
        const stubData = {
            foo: 'bar'
        };
        const stubResolver = () => { };
        registry.registerResolver('json', (a) => {
            assert.equal(a, stubData);
            return { handler: stubResolver, key: 'stub' };
        })
        assert.ok(registry.resolver.json, 'should add resolver');
        assert.deepEqual(registry.resolver.json(stubData), { handler: stubResolver, key: 'stub' }, 'should return resolver');
        assert.ok(registry.assertJSONHandler(stubData), stubResolver, 'should pass back a custom resolver');
        registry.unregisterResolver('json');
        assert.ok(!registry.resolver.json, 'should remove resolver');
        assert.throws(() => registry.assertJSONHandler(stubData), 'no resolver');
    });

    QUnit.test('fail assertion', assert => {
        const stubData = {
            foo: 'bar'
        };
        assert.throws(() => registry.assertJSONHandler(stubData), 'no resolver');
        assert.throws(() => registry.assertSVGHandler({key:'NON_EXISTING',element:null}), 'no resolver');
    });
});