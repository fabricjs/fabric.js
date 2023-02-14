QUnit.module('internals', (hooks) => {
    const createHybrid = fabric.util.createHybrid

    QUnit.module('Hybrid', () => {
        QUnit.test('default key order', (assert) => {
            const hybrid = createHybrid({ a: 0 }, { b: 1 });
            assert.deepEqual(Object.keys(hybrid), ['b', 'a'], 'source-target');
        });
        QUnit.test('source change bubbling', (assert) => {
            let changes = [];
            const controller = {
                a: true,
                b: true,
                c: true,
                d: true,
                e: true,
                x: false
            };
            function wrap(o, k) {
                return Object.defineProperties(o, {
                    onChange: {
                        enumerable: false,
                        value({ key, value, prevValue }) {
                            changes.push({ key, value, prevValue, target: k, accepted: controller[k] });
                            return controller[k];
                        }
                    }
                });
            }
            const src = createHybrid({ a: 0 });
            const hybrid = createHybrid(wrap({ d: 3 }, 'd'), createHybrid(wrap({ c: 2 }, 'c'), createHybrid(wrap({ b: 1 }, 'b'), src)));
            const e = createHybrid(wrap({ e: 4 }, 'e'), hybrid);
            const hybrid2 = createHybrid(wrap({ x: -1 }, 'x'), src);
            assert.equal(hybrid.__source__.__source__.__source__, src);
            assert.deepEqual(src, { a: 0 }, 'src');
            src.a = 1;
            assert.deepEqual(hybrid, { a: 1, b: 1, c: 2, d: 3 }, 'changed');
            assert.deepEqual(changes, [
                {
                    key: 'a',
                    value: 1,
                    prevValue: 0,
                    target: 'b',
                    accepted: true
                },
                {
                    key: 'a',
                    value: 1,
                    prevValue: 0,
                    target: 'c',
                    accepted: true
                },
                {
                    key: 'a',
                    value: 1,
                    prevValue: 0,
                    target: 'd',
                    accepted: true
                },
                {
                    key: 'a',
                    value: 1,
                    prevValue: 0,
                    target: 'e',
                    accepted: true
                },
                {
                    key: 'a',
                    value: 1,
                    prevValue: 0,
                    target: 'x',
                    accepted: false
                },
            ], 'changes bubbled');
            changes = [];
            controller.d = false;
            src.a = 2;
            assert.ok(hybrid.__monitor__.a, 'monitoring a because default was refused');
            assert.deepEqual(hybrid, { a: 1, b: 1, c: 2, d: 3 }, 'refused change');
            assert.deepEqual(e, { a: 1, b: 1, c: 2, d: 3, e: 4 }, 'e was not affected');
            assert.deepEqual(changes, [
                {
                    key: 'a',
                    value: 2,
                    prevValue: 1,
                    target: 'b',
                    accepted: true
                },
                {
                    key: 'a',
                    value: 2,
                    prevValue: 1,
                    target: 'c',
                    accepted: true
                },
                {
                    key: 'a',
                    value: 2,
                    prevValue: 1,
                    target: 'd',
                    accepted: false
                },
            ], 'changes bubbled, stopped by d not reaching e, stopped by x');
            changes = [];
            controller.d = true;
            src.a = 3;
            assert.deepEqual(changes, [
                {
                    key: 'a',
                    value: 3,
                    prevValue: 1,
                    target: 'b',
                    accepted: true
                },
                {
                    key: 'a',
                    value: 3,
                    prevValue: 1,
                    target: 'c',
                    accepted: true
                },
            ], 'changes bubbled, no effect on d, e, x');
            changes = [];
            delete hybrid.__source__.__source__.b;
            assert.deepEqual(changes, [
                {
                    key: 'b',
                    value: undefined,
                    prevValue: 1,
                    target: 'b',
                    accepted: true
                },
                {
                    key: 'b',
                    value: undefined,
                    prevValue: 1,
                    target: 'c',
                    accepted: true
                },
                {
                    key: 'b',
                    value: undefined,
                    prevValue: 1,
                    target: 'd',
                    accepted: true
                },
                {
                    key: 'b',
                    value: undefined,
                    prevValue: 1,
                    target: 'e',
                    accepted: true
                },
            ], 'delete changes bubbled');
            assert.deepEqual(hybrid, { a: 1, c: 2, d: 3 }, 'refused change');
            assert.deepEqual(e, { a: 1, c: 2, d: 3, e: 4 }, 'e was not affected');
            assert.deepEqual(hybrid2, { x: -1, a: 0 }, 'refused all changes');
            changes = [];
            delete e.__source__;
            hybrid.d = 5;
            assert.deepEqual(changes, [
                { key: 'd', value: 5, prevValue: 3, target: 'd', accepted: true }
            ], 'e was disconnected');
            changes = [];
            const c = hybrid.__source__;
            hybrid.__source__ = { z: 0 };
            c.c = 1;
            assert.deepEqual(changes, [
                { key: 'c', value: 1, prevValue: 2, target: 'c', accepted: true }
            ], 'c was disconnected');
            changes = [];
            hybrid.__source__.z = 1;
            assert.deepEqual(changes, [], 'changing z has no effect because it is not a hybrid');
            changes = [];
            hybrid.__source__ = createHybrid({ z: 0 });
            hybrid.__source__.z = 1;
            assert.deepEqual(changes, [
                {
                    key: 'z',
                    value: 1,
                    prevValue: 0,
                    target: 'd',
                    accepted: true
                }
            ], 'z was connected, changes bubbled');
        });
        ['source-target', 'target-source'].forEach((keyOrder) => {
            QUnit.module(`key order: ${keyOrder}`, (hooks) => {
                hooks.before(() => {
                    QUnit.assert.keyOrder = function (expected, targetSource, sourceTarget, message = 'key order') {
                        this.deepEqual(expected, keyOrder === 'target-source' ? targetSource : sourceTarget, message);
                    }
                });
                hooks.after(() => {
                    delete QUnit.assert.keyOrder;
                });
                QUnit.test('without source', assert => {
                    const a = {};
                    const o = {};
                    const target = {
                        a,
                        o,
                    };
                    const hybrid = createHybrid(target, undefined, keyOrder);
                    assert.equal(hybrid.__source__, undefined, 'source');
                    assert.equal(hybrid.a, a, 'get from target');
                    assert.equal(hybrid.o, o, 'get from target');
                    assert.equal(hybrid.z, undefined, 'doesn\'t exist');
                    assert.keyOrder(Object.keys(hybrid), ['a', 'o'] , ['a', 'o']);
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
                    const hybrid = createHybrid(target, source, keyOrder);
                    assert.equal(hybrid.__source__, source, 'source');
                    assert.equal(hybrid.a, a, 'get from target');
                    assert.equal(hybrid.o, o, 'get from target');
                    assert.equal(hybrid.b, b, 'get from source');
                    assert.equal(hybrid.z, undefined, 'doesn\'t exist');
                    assert.keyOrder(Object.keys(hybrid), ['a', 'o', 'b'], ['b', 'a', 'o']);
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
                    assert.keyOrder(Object.keys(hybrid), ['a', 'o', 'z', 'b', 'c'], ['b', 'c', 'a', 'o', 'z']);
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
                    assert.keyOrder(Object.keys(hybrid), ['a', 'o', 'c', 'b'], ['b', 'a', 'o', 'c'], 'keys without `z`');
                    delete hybrid.__source__;
                    assert.equal(hybrid.__source__, undefined, 'delete source');
                    assert.keyOrder(Object.keys(hybrid), ['a', 'o', 'c'], ['a', 'o', 'c'], 'target keys after deletion of source');
                });
                QUnit.test('mutating target: object descriptor', assert => {
                    const target = createHybrid({
                        a: {},
                    }, {
                        x: {}
                    }, keyOrder);
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
                    const hybrid = createHybrid(target, source, keyOrder);
                    assert.deepEqual(hybrid.__monitor__, { __monitor__: true, __source__: true, a: true, o: true }, 'monitoring defined keys');
                    delete hybrid.z;
                    source.z = {};
                    hybrid.c = undefined;
                    assert.equal(hybrid.__monitor__.z, true, '`z` was touched by target so it is monitored');
                    assert.equal(hybrid.z, undefined, '`z` was touched by target so it is scoped');
                    assert.equal(hybrid.__monitor__.c, true, '`c` was touched by target so it is monitored');
                    assert.equal(hybrid.c, undefined, '`c` was touched by target so it is scoped');
                    assert.deepEqual(hybrid.__monitor__, { __monitor__: true, __source__: true, a: true, o: true, z: true, c: true }, 'monitoring keys');
                    assert.keyOrder(Object.keys(hybrid), ['a', 'o', 'c', 'b'], ['b', 'a', 'o', 'c'], 'keys without `z`');
                    hybrid.__monitor__ = {};
                    assert.deepEqual(hybrid.__monitor__, { __monitor__: true, __source__: true, a: true, o: true, z: true, c: true }, 'monitor is readonly');
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
                    }, keyOrder);
                    hybrid.__source__ = source;
                    assert.equal(hybrid.__source__, source, 'source');
                    assert.equal(hybrid.a, a, 'get from target');
                    assert.equal(hybrid.o, o, 'get from target');
                    assert.equal(hybrid.b, b, 'get from source');
                    assert.keyOrder(Object.keys(hybrid), ['a', 'o', 'b'], ['b', 'a', 'o'], 'keys');
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
                    }, keyOrder);
                    const hybrid = createHybrid(target, source, keyOrder);
                    assert.equal(hybrid.__source__, source, 'source');
                    assert.equal(hybrid.a, a, 'get from target');
                    assert.equal(hybrid.o, o, 'get from target');
                    assert.equal(hybrid.b, b, 'get from source');
                    assert.equal(hybrid.x, x, 'get from source');
                    assert.equal(hybrid.y, y, 'get from source of source');
                    assert.equal(hybrid.z, undefined, 'doesn\'t exist');
                    assert.keyOrder(Object.keys(hybrid), ['a', 'o', 'b', 'x', 'y'], ['y', 'b', 'x', 'a', 'o']);
                    assert.deepEqual({ ...hybrid }, { ...source.__source__, ...source, ...target, });
                    assert.deepEqual({ ...hybrid }, { a, o, b, x, y });
                    // mutate source
                    assert.equal(hybrid.c, undefined, 'can\'t resolve key');
                    const c = {};
                    source.__source__ = { c };
                    assert.equal(hybrid.c, c, 'source is shared');
                    assert.keyOrder(Object.keys(hybrid), ['a', 'o', 'b', 'x', 'c'], ['c', 'b', 'x', 'a', 'o']);
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
                QUnit.test('delete trap call on change', assert => {
                    const changes = [];
                    let controller = true;
                    const hybrid = createHybrid(Object.defineProperties({
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
                    const hybrid = createHybrid(Object.defineProperties({
                        x: 1
                    }, {
                        transformValue: {
                            enumerable: false,
                            value({ operation, key, newValue, value }) {
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
                });
                QUnit.test('restore defaults', assert => {
                    const a = 1;
                    const o = 2;
                    const b = 3;
                    const x = 4;
                    const target = {
                        a,
                        o,
                        same: 5,
                        foo: 'bar'
                    };
                    const source = {
                        b,
                        o: x,
                        same: 5,
                        foo: 'baz'
                    };
                    const changes = [];
                    let controller = true;
                    const hybrid = createHybrid(Object.defineProperties(target, {
                        onChange: {
                            enumerable: false,
                            value({ key, value, prevValue }) {
                                changes.push({ key, value, prevValue, accepted: controller });
                                return controller;
                            }
                        }
                    }), source, keyOrder);
                    assert.ok(hybrid.restoreDefault('a'), 'restored');
                    assert.equal(hybrid.a, undefined, 'was deleted');
                    assert.ok(hybrid.restoreDefault('o'), 'restored');
                    assert.equal(hybrid.o, x, 'get from source');
                    assert.ok(!hybrid.restoreDefault('a'), 'should return false since restoring didn\'t occur');
                    assert.ok(!hybrid.restoreDefault('o'), 'should return false since restoring didn\'t occur');
                    assert.ok(!hybrid.restoreDefault('same'), 'should return false since restoring didn\'t occur - same value');
                    assert.ok(!hybrid.restoreDefault('bar'), 'should return false since restoring didn\'t occur - not defined');
                    assert.ok(!hybrid.restoreDefault('__source__'), 'should return false since restoring is not allowed');
                    assert.ok(!hybrid.restoreDefault('__monitor__'), 'should return false since restoring is not allowed');
                    assert.deepEqual(hybrid.restoreDefaults(), {
                        a: false,
                        foo: true,
                        o: false,
                        same: false
                    }, 'bulk action');
                    // check on change calls
                    assert.deepEqual(changes, [
                        { key: 'a', value: undefined, prevValue: 1, accepted: true },
                        { key: 'o', value: 4, prevValue: 2, accepted: true },
                        { key: 'foo', value: 'baz', prevValue: 'bar', accepted: true }
                    ], 'called on change');
                });
            });
        });
    });
});