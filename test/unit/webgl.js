
QUnit.module('WebGL', hooks => {
    hooks.afterEach(() => {
        fabric.config.restoreDefaults();
    });

    QUnit.test('initFilterBackend exists', function (assert) {
        assert.ok(typeof fabric.initFilterBackend === 'function', 'initFilterBackend is a function');
    })

    QUnit[isNode() ? 'test' : 'skip']('initFilterBackend node', function (assert) {
        assert.ok(fabric.initFilterBackend() instanceof fabric.Canvas2dFilterBackend, 'should init 2d backend on node');
    });

    QUnit[!isNode() ? 'test' : 'skip']('initFilterBackend browser', function (assert) {
        assert.ok(fabric.config.enableGLFiltering, 'enableGLFiltering should be enabled by default');
        assert.ok(fabric.initFilterBackend() instanceof fabric.WebGLFilterBackend, 'should init webGL backend on browser');
        fabric.config.configure({ textureSize: Infinity });
        assert.ok(fabric.initFilterBackend() instanceof fabric.Canvas2dFilterBackend, 'should fallback to 2d backend if textureSize is too big');
        fabric.config.configure({ enableGLFiltering: false });
        assert.ok(fabric.initFilterBackend() instanceof fabric.Canvas2dFilterBackend, 'should init 2d backend if enableGLFiltering is false');
    });
})
