QUnit.module('Proxy', () => {
    const createProxy = fabric.util.createProxy
    QUnit.test('sanity check', assert => {
        const a = {};
        const o = {};
        const target = {
            a,
            o,
        };
        const proxy = createProxy(target);
        assert.equal(proxy.a, a, 'get from target');
        assert.equal(proxy.o, o, 'get from target');
        assert.equal(proxy.z, undefined, 'doesn\'t exist');
        assert.deepEqual(Object.keys(proxy), ['a', 'o']);
        assert.deepEqual({ ...proxy }, target);
        // mutate target
        const z = {};
        target.z = z;
        assert.equal(target.z, z, 'set target');
        assert.deepEqual(Object.getOwnPropertyDescriptor(target, 'z'), {
            value: z,
            writable: true,
            enumerable: true,
            configurable: true
        }, 'descriptor is correct');
    });
    QUnit.test('set trap calls on change', assert => {
        const changes = [];
        let controller = true;
        const proxy = createProxy(Object.defineProperties({
            x: 1
        }, {
            onChange: {
                enumerable: false,
                value({ key, value, prevValue }, receiver) {
                    assert.equal(receiver, proxy, 'same ref');
                    changes.push({ key, value, prevValue, accepted: controller });
                    return controller;
                }
            },
            bar: {
                value: 0,
                enumerable: false,
                configurable: true,
                writable: true,
            }
        }));
        proxy.x = 2;
        assert.equal(proxy.x, 2, 'set');
        controller = false;
        proxy.x = 3;
        assert.equal(proxy.x, 2, 'refused to change');
        Object.assign(proxy, { x: 4, y: 5 });
        Object.assign(proxy, { y: 5 });
        assert.deepEqual(proxy, { x: 2 }, 'refused to change, deleted y');
        controller = true;
        proxy.x = 3;
        assert.equal(proxy.x, 3, 'accepted');
        assert.deepEqual(Object.assign(proxy, { x: 4, y: 5 }), { x: 4, y: 5 }, 'changed x, y');
        assert.deepEqual(proxy, { x: 4, y: 5 }, 'changed x, y');
        delete proxy.z;
        assert.deepEqual(Object.assign(proxy, { z: 4 }), { x: 4, y: 5, z: 4 }, 'changed');
        assert.equal(proxy.z, 4, 'accepted');
        proxy.bar = 1;
        assert.equal(proxy.bar, 1, 'accepted bar');
        controller = false;
        proxy.bar = 2;
        assert.equal(proxy.bar, 2, 'accepted bar because it is not enumerable');
        controller = true;
        // no value change => no side effect
        proxy.x = 4;
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
            { key: 'z', value: 4, prevValue: undefined, accepted: true },
        ], 'called on change');
    });
    QUnit.test('delete trap calls on change', assert => {
        const changes = [];
        let controller = true;
        const proxy = createProxy(Object.defineProperties({
            x: 1,
            z: 3,
        }, {
            onChange: {
                enumerable: false,
                value({ key, value, prevValue }, receiver) {
                    assert.equal(receiver, proxy, 'same ref');
                    changes.push({ key, value, prevValue, accepted: controller });
                    return controller;
                }
            },
            bar: {
                value: 1,
                enumerable: false,
                configurable: true,
                writable: true,
            }
        }));
        controller = false;
        delete proxy.x;
        delete proxy.z;
        controller = true;
        delete proxy.x;
        assert.deepEqual(proxy, { z: 3 }, 'removed x');
        delete proxy.z;
        assert.deepEqual(proxy, {}, 'removed z');
            
        // delete, on change edge cases
        // deleted already
        delete proxy.x;
        delete proxy.z;
        // not enumerable
        delete proxy.bar;
        // doesn't exist
        delete proxy.y;
            
        // check on change calls
        assert.deepEqual(changes, [
            { key: 'x', value: undefined, prevValue: 1, accepted: false },
            { key: 'z', value: undefined, prevValue: 3, accepted: false },
            { key: 'x', value: undefined, prevValue: 1, accepted: true },
            { key: 'z', value: undefined, prevValue: 3, accepted: true },
        ], 'called on change');
    });
    QUnit.test('transform value', assert => {
        const calls = [];
        const proxy = createProxy(Object.defineProperties({
            x: 1
        }, {
            _x: {
                enumerable: true,
                configurable: true,
                writable: false,
                value: 0
            },
            _X: {
                enumerable: true,
                configurable: true,
                writable: false,
                value: 0
            },
            transformValue: {
                enumerable: false,
                value({ operation, key, newValue, value }, receiver) {
                    assert.equal(receiver, proxy, 'same ref');
                    calls.push({ operation, key, newValue, value })
                    if (operation === 'set') {
                        // setting target prop shouldn't trigger the proxy
                        this.baz = typeof this.baz === 'number' ? this.baz++ : 0;
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
                            case '_x':
                                return this.x;
                            case '_X':
                                return receiver.x;
                            default:
                                return value;
                        }
                    }
                }
            },
        }));
        proxy.a = 5;
        assert.equal(proxy.a, 10, 'transform set value');
        proxy.a = 25;
        assert.equal(proxy.a, 30, 'transform set value');
        proxy.x = 25;
        assert.equal(proxy.x, 3, 'transform get value, set value blocked');
        assert.equal(proxy._x, 1, 'get target value');
        assert.equal(proxy._X, 3, 'get receiver value');
        proxy.foo = 'bar';
        // no change does not invoke the method
        proxy.foo = 'bar';
        proxy.foo = 'bar';
        proxy.foo = 'bar';
        assert.equal(proxy.foo, 'bar', 'transform value');
        Object.defineProperty(proxy, 'z', {
            value: 0,
            configurable: true,
            enumerable: false,
            writable: true
        });
        proxy.z = 1;
        assert.deepEqual(calls, [
            { operation: 'set', key: 'a', newValue: 5, value: undefined },
            { operation: 'get', key: 'a', newValue: undefined, value: 10 },
            { operation: 'set', key: 'a', newValue: 25, value: 10 },
            { operation: 'get', key: 'a', newValue: undefined, value: 30 },
            { operation: 'set', key: 'x', newValue: 25, value: 1 },
            { operation: 'get', key: 'x', newValue: undefined, value: 1 },
            { operation: 'get', key: '_x', newValue: undefined, value: 0 },
            { operation: 'get', key: '_X', newValue: undefined, value: 0 },
            // `onChange` accessing `x` from `receiver`
            { operation: 'get', key: 'x', newValue: undefined, value: 1 },
            { operation: 'set', key: 'foo', newValue: 'bar', value: undefined },
            { operation: 'get', key: 'foo', newValue: undefined, value: 'bar' }
        ], 'transform value calls, changes to non enumerable keys do not get called');
    });
});