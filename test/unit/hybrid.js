QUnit.module('internals', (hooks) => {
    const createHybrid = fabric.util.createHybrid

    QUnit.module('Hybrid', () => {
        QUnit.test('without source', assert => {
            const a = {};
            const o = {};
            const target = {
                a,
                o,
            };
            const hybrid = createHybrid(target);
            assert.equal(hybrid.__source__, undefined, 'source');
            assert.equal(hybrid.a, a, 'get from target');
            assert.equal(hybrid.o, o, 'get from target');
            assert.equal(hybrid.z, undefined, 'doesn\'t exist');
            assert.deepEqual(Object.keys(hybrid), ['a', 'o'], 'keys');
            assert.deepEqual({ ...hybrid }, target);
            // mutate target
            const z = {};
            target.z = z;
            assert.equal(target.z, z, 'set target');
            assert.equal(hybrid.__source__, undefined, 'mutating target doesn\'t mutate source');
        });
        QUnit.test('with source', assert => {
            const a = {};
            const o = {};
            const b = {};
            const x = {};
            const target = {
                a,
                o,
            };
            const source = {
                b,
                o: x,
            };
            const hybrid = createHybrid(target, source);
            assert.equal(hybrid.__source__, source, 'source');
            assert.equal(hybrid.a, a, 'get from target');
            assert.equal(hybrid.o, o, 'get from target');
            assert.equal(hybrid.b, b, 'get from source');
            assert.equal(hybrid.z, undefined, 'doesn\'t exist');
            assert.deepEqual(Object.keys(hybrid), ['a', 'o', 'b'], 'keys');
            assert.deepEqual({ ...hybrid }, { ...source, ...target, });
            // mutate source
            assert.equal(hybrid.c, undefined, 'can\'t resolve key');
            const c = {};
            source.c = c;
            assert.equal(source.c, c, 'set source');
            assert.equal(hybrid.c, source.c, 'source is shared');
            // mutate target
            const z = {};
            target.z = z;
            assert.equal(target.z, z, 'set target');
            assert.equal(source.z, undefined, 'mutating target doesn\'t mutate source');
            assert.deepEqual(Object.keys(hybrid), ['a', 'o', 'z', 'b', 'c'], 'keys');
            delete hybrid.__source__;
            assert.equal(hybrid.__source__, undefined, 'delete source');
            assert.deepEqual(Object.keys(hybrid), ['a', 'o', 'z'], 'keys');
        });
        QUnit.test('changing source after creation', assert => {
            const a = {};
            const o = {};
            const b = {};
            const x = {};
            const target = {
                a,
                o,
            };
            const source = {
                b,
                o: x,
            };
            const hybrid = createHybrid(target, {
                a: {},
                o: {},
                b: {}
            });
            hybrid.__source__ = source;
            assert.equal(hybrid.__source__, source, 'source');
            assert.equal(hybrid.a, a, 'get from target');
            assert.equal(hybrid.o, o, 'get from target');
            assert.equal(hybrid.b, b, 'get from source');
            assert.deepEqual(Object.keys(hybrid), ['a', 'o', 'b'], 'keys');
            assert.deepEqual({ ...hybrid }, { ...source, ...target, });
        });
        QUnit.test('with hybrid set as source', assert => {
            const a = {};
            const o = {};
            const b = {};
            const o1 = {};
            const x = {};
            const o2 = {};
            const x1 = {};
            const y = {};
            const target = {
                a,
                o
            };
            const source = createHybrid({
                b,
                o: o1,
                x,
            }, {
                o: o2,
                x: x1,
                y,
            });
            const hybrid = createHybrid(target, source);
            assert.equal(hybrid.__source__, source, 'source');
            assert.equal(hybrid.a, a, 'get from target');
            assert.equal(hybrid.o, o, 'get from target');
            assert.equal(hybrid.b, b, 'get from source');
            assert.equal(hybrid.x, x, 'get from source');
            assert.equal(hybrid.y, y, 'get from source of source');
            assert.equal(hybrid.z, undefined, 'doesn\'t exist');
            assert.deepEqual(Object.keys(hybrid), ['a', 'o', 'b', 'x', 'y'], 'keys');
            assert.deepEqual({ ...hybrid }, { ...source.__source__, ...source, ...target, });
            // mutate source
            assert.equal(hybrid.c, undefined, 'can\'t resolve key');
            const c = {};
            source.__source__ = { c };
            assert.equal(hybrid.c, c, 'source is shared');
            // mutate target
            const z = {};
            target.z = z;
            assert.equal(source.z, undefined, 'mutating target doesn\'t mutate source');
            assert.equal(source.__source__.z, undefined, 'mutating target doesn\'t mutate source');
        });
    });
});