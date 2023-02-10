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
            assert.deepEqual({ ...hybrid }, { a, o, b });
            // mutate source
            assert.equal(hybrid.c, undefined, 'can\'t resolve key');
            const c = {};
            source.c = c;
            assert.equal(source.c, c, 'set source');
            assert.equal(hybrid.c, source.c, 'source is shared');
            // mutate target
            const z = {};
            hybrid.z = z;
            assert.equal(target.z, z, 'set target');
            assert.equal(hybrid.z, z, 'set target');
            assert.equal(source.z, undefined, 'mutating target doesn\'t mutate source');
            assert.deepEqual(Object.keys(hybrid), ['a', 'o', 'z', 'b', 'c'], 'keys');
            // monitored
            delete hybrid.z;
            source.z = {};
            hybrid.c = undefined;
            assert.equal(hybrid.__monitor__.z, true, '`z` was touched by target so it is monitored');
            assert.equal(hybrid.z, undefined, '`z` was touched by target so it is scoped');
            assert.equal(hybrid.__monitor__.c, true, '`c` was touched by target so it is monitored');
            assert.equal(hybrid.c, undefined, '`c` was touched by target so it is scoped');
            assert.equal(Object.getOwnPropertyDescriptor(hybrid, 'z'), undefined, 'no descriptor')
            assert.deepEqual(Object.getOwnPropertyDescriptor(hybrid, 'c'), {
                value: undefined,
                writable: true,
                enumerable: true,
                configurable: true
            }, 'descriptor');
            assert.deepEqual(Object.keys(hybrid), ['a', 'o', 'c', 'b'], 'keys without `z`');
            delete hybrid.__source__;
            assert.equal(hybrid.__source__, undefined, 'delete source');
            assert.deepEqual(Object.keys(hybrid), ['a', 'o', 'c'], 'target keys after deletion of source');
        });
        QUnit.test('mutating target: object descriptor', assert => {
            const target = createHybrid({
                a: {},
            }, {
                x: {}
            });
            assert.deepEqual(Object.getOwnPropertyDescriptor(target, 'x'), {
                value: {},
                writable: true,
                enumerable: true,
                configurable: true
            }, 'descriptor from source');
            target.x = undefined;
            assert.deepEqual(Object.getOwnPropertyDescriptor(target, 'x'), {
                value: undefined,
                writable: true,
                enumerable: true,
                configurable: true
            }, 'descriptor has been copied from source to target');
            target.__source__.c = {};
            assert.deepEqual(Object.getOwnPropertyDescriptor(target, 'c'), {
                value: {},
                writable: true,
                enumerable: true,
                configurable: true
            }, 'descriptor from source');
            delete target.c;
            assert.deepEqual(Object.getOwnPropertyDescriptor(target, 'c'), undefined, 'descriptor from target since `c` is monitored');
        });
        QUnit.test('key monitoring', assert => {
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
            assert.deepEqual(hybrid.__monitor__, { __monitor__: true, __source__: true, a: true, o: true }, 'monitoring defined keys');
            delete hybrid.z;
            source.z = {};
            hybrid.c = undefined;
            assert.equal(hybrid.__monitor__.z, true, '`z` was touched by target so it is monitored');
            assert.equal(hybrid.z, undefined, '`z` was touched by target so it is scoped');
            assert.equal(hybrid.__monitor__.c, true, '`c` was touched by target so it is monitored');
            assert.equal(hybrid.c, undefined, '`c` was touched by target so it is scoped');
            assert.deepEqual(hybrid.__monitor__, { __monitor__: true, __source__: true, a: true, o: true, z: true, c: true }, 'monitoring keys');
            assert.deepEqual(Object.keys(hybrid), ['a', 'o', 'c', 'b'], 'keys without `z`');
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
            assert.deepEqual({ ...hybrid }, { a, o, b });
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
            assert.deepEqual({ ...hybrid }, { a, o, b, x, y });
            // mutate source
            assert.equal(hybrid.c, undefined, 'can\'t resolve key');
            const c = {};
            source.__source__ = { c };
            assert.equal(hybrid.c, c, 'source is shared');
            assert.deepEqual(Object.keys(hybrid), ['a', 'o', 'b', 'x', 'c'], 'keys');
            // mutate target
            const z = {};
            target.z = z;
            assert.equal(source.z, undefined, 'mutating target doesn\'t mutate source');
            assert.equal(source.__source__.z, undefined, 'mutating target doesn\'t mutate source');
        });
        QUnit.test('set trap calls on change', assert => {
            const changes = [];
            let controller = true;
            const hybrid = createHybrid(Object.defineProperties({
                x: 1
            }, {
                onChange: {
                    enumerable: false,
                    value(key, value, prevValue) {
                        changes.push({ key, value, prevValue, accepted: controller });
                        return controller;
                    }
                }
            }), {
                z: 3
            });
            hybrid.x = 2;
            assert.equal(hybrid.x, 2, 'set');
            controller = false;
            hybrid.x = 3;
            assert.equal(hybrid.x, 2, 'refused to change');
            Object.assign(hybrid, { x: 4, y: 5 });
            Object.assign(hybrid, { y: 5 });
            assert.deepEqual(hybrid, { x: 2, z: 3 }, 'refused to change, deleted y');
            assert.deepEqual(hybrid.__monitor__, { __monitor__: true, __source__: true, x: true }, 'monitoring defined keys');
            controller = true;
            hybrid.x = 3;
            assert.equal(hybrid.x, 3, 'accepted');
            assert.deepEqual(Object.assign(hybrid, { x: 4, y: 5 }), { x: 4, y: 5, z: 3 }, 'changed x, y, skipped z');
            assert.deepEqual(hybrid, { x: 4, y: 5, z: 3 }, 'changed x, y, skipped z');
            delete hybrid.z;
            assert.ok(hybrid.__monitor__.z, 'monitoring');
            assert.deepEqual(Object.assign(hybrid, { z: 4 }), { x: 4, y: 5, z: 4 }, 'changed');
            assert.equal(hybrid.z, 4, 'accepted');
            delete hybrid.z;
            // no value change => no side effect
            hybrid.x = 4;
            Object.assign({ y: 5 });
            // check all
            assert.deepEqual(changes, [
                { key: 'x', value: 2, prevValue: 1, accepted: true },
                { key: 'x', value: 3, prevValue: 2, accepted: false },
                { key: 'x', value: 4, prevValue: 2, accepted: false },
                { key: 'y', value: 5, prevValue: undefined, accepted: false },
                { key: 'y', value: 5, prevValue: undefined, accepted: false },
                { key: 'x', value: 3, prevValue: 2, accepted: true },
                { key: 'x', value: 4, prevValue: 3, accepted: true },
                { key: 'y', value: 5, prevValue: undefined, accepted: true },
                { key: 'z', value: 4, prevValue: undefined, accepted: true },
                { key: 'z', value: undefined, prevValue: 4, accepted: true }
            ], 'called on change');
        });
        QUnit.test('transform value', assert => {
            const hybrid = createHybrid(Object.defineProperties({
                x: 1
            }, {
                transformValue: {
                    enumerable: false,
                    value(key, newValue, value) {
                        switch (key) {
                            case 'a':
                                return newValue + 5;
                            case 'x':
                                return value;
                            default:
                               return newValue
                        }
                    }
                },
            }), {
                z: 3
            });
            hybrid.a = 5;
            assert.equal(hybrid.a, 10, 'transform valued');
            hybrid.a = 25;
            assert.equal(hybrid.a, 30, 'transform valued');
            hybrid.x = 25;
            assert.equal(hybrid.x, 1, 'transform valued');
            hybrid.foo = 'bar';
            assert.equal(hybrid.foo, 'bar', 'transform valued');
        })
    });
});