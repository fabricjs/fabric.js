QUnit.module('env', (hooks) => {
    QUnit[fabric.getEnv().isLikelyNode ? 'test' : 'skip']('SSR: importing fabric before window/document are defined', async assert => {
        const done = assert.async();
        const fabric = require('../..');
        global.window = { devicePixelRatio: 1.25 };
        global.document = { foo: 'bar' };
        assert.deepEqual(fabric.getEnv(), {
            document: { foo: 'bar' },
            window: { devicePixelRatio: 1.25 },
            isTouchSupported: undefined,
            isLikelyNode: false,
            copyPasteData: {}
        }, 'env should match');
        delete global.window;
        delete global.document;
        done();
    });
})