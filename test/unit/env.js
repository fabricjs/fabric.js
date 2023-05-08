QUnit.module('env', (hooks) => {
    (isNode() ? QUnit.module : QUnit.module.skip)('node', (hooks) => {
        hooks.afterEach(() => {
            delete global.window;
            delete global.document;
        })

        QUnit.test('import/require sets env', async assert => {
            const done = assert.async();
            global.window = { devicePixelRatio: 1.25 };
            global.document = { foo: 'bar' };
            const imported = await import('../../dist/index.node.cjs');
            const required = require('../..');
            assert.equal(imported.getEnv().document.foo, undefined, 'should be node env');
            assert.equal(required.getEnv().document.foo, undefined, 'should be node env');
            done();
        });

        QUnit.test('SSR: importing fabric before window/document are defined', async assert => {
            const done = assert.async();
            const imported = await import('../../dist/index.js');
            const required = require('../../dist/index.js');
            assert.notOk(global.window, 'no window');
            assert.notOk(global.document, 'no document');
            const win = { devicePixelRatio: 1.25 };
            const doc = { foo: 'bar' };
            global.window = win;
            global.document = doc;
            [imported, required].forEach(fabric => {
                assert.equal(fabric.getEnv().window, win, 'window should match');
                assert.equal(fabric.getEnv().document, doc, 'document should match');
            });
            done();
        });
    });

    (!isNode() ? QUnit.module : QUnit.module.skip)('browser', (hooks) => {
        QUnit.test('env', assert => {
            assert.equal(fabric.getWindow(), window, 'window should be set');
            assert.equal(fabric.getDocument(), document, 'window should be set');
        })
    });
});
