QUnit.module('Proxy', () => {
    const createProxy = fabric.util.createProxy
    QUnit.test('sanity check', assert => {
        const a = {};
        const o = {};
        const target = {
            a,
            o,
        };
        const hybrid = createProxy(target);
        assert.equal(hybrid.a, a, 'get from target');
        assert.equal(hybrid.o, o, 'get from target');
        assert.equal(hybrid.z, undefined, 'doesn\'t exist');
        assert.deepEqual(Object.keys(hybrid), ['a', 'o']);
        assert.deepEqual({ ...hybrid }, target);
        // mutate target
        const z = {};
        target.z = z;
        assert.equal(target.z, z, 'set target');
        assert.deepEqual(Object.getOwnPropertyDescriptor(target, 'z'), {
            value: undefined,
            writable: true,
            enumerable: true,
            configurable: true
        }, 'descriptor is correct');
    });
    QUnit.test('set trap calls on change', assert => {
        const changes = [];
        let controller = true;
        const hybrid = createProxy(Object.defineProperties({
            x: 1
        }, {
            onChange: {
                enumerable: false,
                value({ key, value, prevValue }) {
                    changes.push({ key, value, prevValue, accepted: controller });
                    return controller;
                }
            }
        }), {
            z: 3
        }, keyOrder);
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
        assert.deepEqual(hybrid.__monitor__, { __monitor__: true, __source__: true, x: true, y: true }, 'monitoring keys');
        delete hybrid.z;
        assert.ok(hybrid.__monitor__.z, 'monitoring z');
        assert.deepEqual(Object.assign(hybrid, { z: 4 }), { x: 4, y: 5, z: 4 }, 'changed');
        assert.equal(hybrid.z, 4, 'accepted');
        hybrid.__source__.bar = 1;
        hybrid.bar = 1; // no on change call
        hybrid.bar = 2;
        // no value change => no side effect
        hybrid.x = 4;
        Object.assign({ y: 5 });
            
        // check on change calls
        assert.deepEqual(changes, [
            { key: 'x', value: 2, prevValue: 1, accepted: true },
            { key: 'x', value: 3, prevValue: 2, accepted: false },
            { key: 'x', value: 4, prevValue: 2, accepted: false },
            { key: 'y', value: 5, prevValue: undefined, accepted: false },
            { key: 'y', value: 5, prevValue: undefined, accepted: false },
            { key: 'x', value: 3, prevValue: 2, accepted: true },
            { key: 'x', value: 4, prevValue: 3, accepted: true },
            { key: 'y', value: 5, prevValue: undefined, accepted: true },
            { key: 'z', value: undefined, prevValue: 3, accepted: true },
            { key: 'z', value: 4, prevValue: undefined, accepted: true },
            { key: 'bar', value: 2, prevValue: 1, accepted: true }
        ], 'called on change');
    });
    QUnit.test('delete trap calls on change', assert => {
        const changes = [];
        let controller = true;
        const hybrid = createProxy(Object.defineProperties({
            x: 1
        }, {
            onChange: {
                enumerable: false,
                value({ key, value, prevValue }) {
                    changes.push({ key, value, prevValue, accepted: controller });
                    return controller;
                }
            }
        }), {
            z: 3
        }, keyOrder);
        controller = false;
        delete hybrid.x;
        delete hybrid.z;
        assert.deepEqual(hybrid.__monitor__, { __monitor__: true, __source__: true, x: true }, 'monitoring defined keys');
        controller = true;
        delete hybrid.x;
        assert.deepEqual(hybrid, { z: 3 }, 'removed x');
        assert.deepEqual(hybrid.__monitor__, { __monitor__: true, __source__: true, x: true }, 'monitoring defined keys');
        delete hybrid.z;
        assert.deepEqual(hybrid, {}, 'removed z');
        assert.deepEqual(hybrid.__monitor__, { __monitor__: true, __source__: true, x: true, z: true }, 'monitoring deleted keys');
            
        // delete, on change edge cases
        // deleted already
        delete hybrid.x;
        delete hybrid.z;
        // not monitored
        hybrid.__source__.bar = 1;
        delete hybrid.bar;
        // doesn't exist
        delete hybrid.y;
            
        // check on change calls
        assert.deepEqual(changes, [
            { key: 'x', value: undefined, prevValue: 1, accepted: false },
            { key: 'z', value: undefined, prevValue: 3, accepted: false },
            { key: 'x', value: undefined, prevValue: 1, accepted: true },
            { key: 'z', value: undefined, prevValue: 3, accepted: true },
            { key: 'bar', value: undefined, prevValue: 1, accepted: true }
        ], 'called on change');
    });
    QUnit.test('transform value', assert => {
        const calls = [];
        const hybrid = createProxy(Object.defineProperties({
            x: 1
        }, {
            transformValue: {
                enumerable: false,
                value({ operation, key, newValue, value }) {
                    calls.push({ operation, key, newValue, value })
                    if (operation === 'set') {
                        switch (key) {
                            case 'a':
                                return newValue + 5;
                            case 'x':
                                return value;
                            default:
                                return newValue;
                        }
                    } else {
                        switch (key) {
                            case 'x':
                                return value + 2;
                            default:
                                return value;
                        }
                    }
                }
            },
        }), {
            z: 3
        }, keyOrder);
        hybrid.a = 5;
        assert.equal(hybrid.a, 10, 'transform set value');
        hybrid.a = 25;
        assert.equal(hybrid.a, 30, 'transform set value');
        hybrid.x = 25;
        assert.equal(hybrid.x, 3, 'transform get value, set value blocked');
        hybrid.foo = 'bar';
        assert.equal(hybrid.foo, 'bar', 'transform value');
        Object.defineProperty(hybrid, 'z', {
            value: 0,
            configurable: true,
            enumerable: false,
            writable: true
        });
        hybrid.z = 1;
        assert.deepEqual(calls, [
            { operation: 'set', key: 'a', newValue: 5, value: undefined },
            { operation: 'get', key: 'a', newValue: undefined, value: 10 },
            { operation: 'set', key: 'a', newValue: 25, value: 10 },
            { operation: 'get', key: 'a', newValue: undefined, value: 30 },
            { operation: 'set', key: 'x', newValue: 25, value: 1 },
            { operation: 'get', key: 'x', newValue: undefined, value: 1 },
            { operation: 'set', key: 'foo', newValue: 'bar', value: undefined },
            { operation: 'get', key: 'foo', newValue: undefined, value: 'bar' }
        ], 'transform value calls, changes to non enumerable keys do not get called');
    });
});