QUnit.module('env', (hooks) => {
    (fabric.getEnv().isLikelyNode ? QUnit.module : QUnit.module.skip)('node', (hooks) => {
        hooks.afterEach(() => {
            delete global.window;
            delete global.document;
        })

        QUnit.test('import/require sets env', async assert => {
            const done = assert.async();
            global.window = { devicePixelRatio: 1.25 };
            global.document = { foo: 'bar' };
            const imported = await import('../../dist/fabric.node.cjs');
            const required = require('../..');
            assert.equal(imported.getEnv().isLikelyNode, true, 'should be node env');
            assert.equal(required.getEnv().isLikelyNode, true, 'should be node env');
            done();
        });

        QUnit.test('SSR: importing fabric before window/document are defined', async assert => {
            const done = assert.async();
            const imported = await import('../../dist/fabric.cjs');
            const required = require('../../dist/fabric.cjs');
            assert.notOk(global.window, 'no window');
            assert.notOk(global.document, 'no document');
            global.window = { devicePixelRatio: 1.25 };
            global.document = { foo: 'bar' };
            const expected = {
                document: { foo: 'bar' },
                window: { devicePixelRatio: 1.25 },
                isTouchSupported: undefined,
                isLikelyNode: false,
                copyPasteData: {}
            };
            assert.deepEqual(imported.getEnv(), expected, 'env should match');
            assert.deepEqual(required.getEnv(), expected, 'env should match');
            done();
        });
    });

    (!fabric.getEnv().isLikelyNode ? QUnit.module : QUnit.module.skip)('browser', (hooks) => { 
        QUnit.test('env', assert => {
            assert.equal(fabric.getWindow(), window, 'window should be set');
            assert.equal(fabric.getDocument(), document, 'window should be set');
        })
    });
});