

QUnit.module('IO Registry', hook => {

    const registry = fabric.registry;
    
    QUnit.test('existing', assert => {
        assert.ok(registry, 'should exist');
    });

    // QUnit.test('register', assert => {
    //     registry.register({
    //          json:sinon
    //      })
    //     assert.ok(fabric.registry, 'should exist');
    //  });
    
    // QUnit.test('unregister', assert => {
    //     assert.ok(fabric.registry, 'should exist');
    // });

    // QUnit.test('register resolver', assert => {
    //     assert.ok(fabric.registry, 'should exist');
    // });

    //  QUnit.test('register resolver', assert => {
    //     assert.ok(fabric.registry, 'should exist');
    // });
});