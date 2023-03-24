

function makeRect(options = {}) {
    return new fabric.Rect({ width: 10, height: 10, ...options });
}

function assertCanvasDisposing(klass) {

    QUnit.test('dispose', async function (assert) {
        const done = assert.async();
        const canvas = new klass(null, { renderOnAddRemove: false });
        assert.notOk(canvas.destroyed, 'should not have been destroyed yet');
        await canvas.dispose();
        assert.ok(canvas.destroyed, 'should have flagged `destroyed`');
        done();
    });

    QUnit.test('dispose: clear references', async function (assert) {
        const canvas = new klass(null, { renderOnAddRemove: false });
        assert.ok(typeof canvas.dispose === 'function');
        assert.ok(typeof canvas.destroy === 'function');
        canvas.add(makeRect(), makeRect(), makeRect());
        const lowerCanvas = canvas.lowerCanvasEl;
        assert.equal(lowerCanvas.getAttribute('data-fabric'), 'main', 'lowerCanvasEl should be marked by fabric');
        await canvas.dispose();
        assert.equal(canvas.destroyed, true, 'dispose should flag destroyed');
        assert.equal(canvas.getObjects().length, 0, 'dispose should clear canvas');
        assert.equal(canvas.lowerCanvasEl, null, 'dispose should clear lowerCanvasEl');
        assert.equal(lowerCanvas.hasAttribute('data-fabric'), false, 'dispose should clear lowerCanvasEl data-fabric attr');
        assert.equal(canvas.contextContainer, null, 'dispose should clear contextContainer');
    });

    QUnit.test('dispose edge case: multiple calls', async function (assert) {
        const done = assert.async();
        const canvas = new klass(null, { renderOnAddRemove: false });
        assert.notOk(canvas.destroyed, 'should not have been destroyed yet');
        const res = await Promise.all([
            canvas.dispose(),
            canvas.dispose(),
            canvas.dispose(),
        ]);
        assert.ok(canvas.disposed, 'should have flagged `disposed`');
        assert.ok(canvas.destroyed, 'should have flagged `destroyed`');
        assert.deepEqual(res, [true, false, false], 'should have disposed in the first call');
        done();
    });

    QUnit.test('dispose edge case: multiple calls after `requestRenderAll', async function (assert) {
        const done = assert.async();
        const canvas = new klass(null, { renderOnAddRemove: false });
        assert.notOk(canvas.destroyed, 'should not have been destroyed yet');
        canvas.requestRenderAll();
        const res = await Promise.allSettled([
            canvas.dispose(),
            canvas.dispose(),
            canvas.dispose(),
        ]);
        assert.ok(canvas.disposed, 'should have flagged `disposed`');
        assert.ok(canvas.destroyed, 'should have flagged `destroyed`');
        assert.deepEqual(res, [
            { status: 'rejected', reason: 'aborted' },
            { status: 'rejected', reason: 'aborted' },
            { status: 'fulfilled', value: true }
        ], 'should have disposed in the last call, aborting the other calls');
        done();
    });

    QUnit.test('dispose edge case: rendering after dispose', async function (assert) {
        const done = assert.async();
        const canvas = new klass(null, { renderOnAddRemove: false });
        let called = 0;
        assert.ok(await canvas.dispose(), 'should dispose');
        canvas.on('after:render', () => {
            called++;
        })
        canvas.fire('after:render');
        assert.equal(called, 1, 'should have fired');
        assert.equal(canvas.nextRenderHandle, undefined);
        canvas.requestRenderAll();
        assert.equal(canvas.nextRenderHandle, undefined, '`requestRenderAll` should have no affect');
        canvas.renderAll();
        assert.equal(called, 1, 'should not have rendered, should still equal 1');
        done();
    });

    QUnit.test('dispose edge case: `toCanvasElement` interrupting `requestRenderAll`', function (assert) {
        const done = assert.async();
        const canvas = new klass(null, { renderOnAddRemove: false });
        assert.equal(canvas.nextRenderHandle, undefined);
        canvas.nextRenderHandle = 1;
        canvas.toCanvasElement();
        assert.equal(canvas.nextRenderHandle, 1, 'should request rendering');
        done();
    });

    QUnit.test('dispose edge case: `toCanvasElement` after dispose', async function (assert) {
        const done = assert.async();
        const canvas = new klass(null, { renderOnAddRemove: false });
        const testImageData = colorByteVal => {
            return canvas
                .toCanvasElement()
                .getContext('2d')
                .getImageData(0, 0, 20, 20)
                .data
                .filter((x, i) => i % 4 === 0)
                .every(x => x === colorByteVal);
        }
        canvas.add(makeRect({ fill: 'red', width: 20, height: 20 }));
        assert.ok(testImageData(255), 'control');
        canvas.disposed = true;
        assert.ok(testImageData(255), 'should render canvas');
        canvas.destroyed = true;
        assert.ok(testImageData(0), 'should have disabled canvas rendering');
        canvas.destroyed = false;
        assert.ok(await canvas.dispose(), 'dispose');
        done();
    });

    QUnit.test('dispose edge case: during animation', function (assert) {
        const done = assert.async();
        const canvas = new klass(null, { renderOnAddRemove: false });
        let called = 0;
        const animate = () => fabric.util.animate({
            onChange() {
                if (called === 1) {
                    canvas.dispose().then(() => {
                        fabric.runningAnimations.cancelAll();
                        done();
                    });
                    assert.ok(canvas.disposed, 'should flag `disposed`');
                }
                called++;
                canvas.contextTopDirty = true;
                canvas.hasLostContext = true;
                canvas.renderAll();
            },
            onComplete() {
                animate();
            }
        });
        animate();
    });
}

function testStaticCanvasDisposing() {
    QUnit.module('Static Canvas disposing', {
        beforeEach: function () {

        },
        afterEach: function () {
            fabric.config.restoreDefaults();
        }
    })
    assertCanvasDisposing(fabric.StaticCanvas);
}

function testCanvasDisposing() {
    QUnit.module('Canvas disposing', {
        beforeEach: function () {

        },
        afterEach: function () {
            fabric.config.restoreDefaults();
        }
    });

    assertCanvasDisposing(fabric.Canvas);

    QUnit.test('dispose: clear refs', async function (assert) {
        //made local vars to do not dispose the external canvas
        var el = fabric.getDocument().createElement('canvas'),
            parentEl = fabric.getDocument().createElement('div'),
            wrapperEl, lowerCanvasEl, upperCanvasEl;
        el.width = 200; el.height = 200;
        parentEl.className = 'rootNode';
        parentEl.appendChild(el);

        fabric.config.configure({ devicePixelRatio: 1.25 });

        assert.equal(parentEl.firstChild, el, 'canvas should be appended at partentEl');
        assert.equal(parentEl.childNodes.length, 1, 'parentEl has 1 child only');

        el.style.position = 'relative';
        var elStyle = el.style.cssText;
        assert.equal(elStyle, 'position: relative;', 'el style should not be empty');

        var canvas = new fabric.Canvas(el, { enableRetinaScaling: true, renderOnAddRemove: false });
        wrapperEl = canvas.wrapperEl;
        lowerCanvasEl = canvas.lowerCanvasEl;
        upperCanvasEl = canvas.upperCanvasEl;
        const activeSel = canvas.getActiveSelection();
        assert.equal(parentEl.childNodes.length, 1, 'parentEl has still 1 child only');
        assert.equal(wrapperEl.childNodes.length, 2, 'wrapper should have 2 children');
        assert.equal(wrapperEl.tagName, 'DIV', 'We wrapped canvas with DIV');
        assert.equal(wrapperEl.className, canvas.containerClass, 'DIV class should be set');
        assert.equal(wrapperEl.childNodes[0], lowerCanvasEl, 'First child should be lowerCanvas');
        assert.equal(wrapperEl.childNodes[1], upperCanvasEl, 'Second child should be upperCanvas');
        assert.equal(canvas._originalCanvasStyle, elStyle, 'saved original canvas style for disposal');
        assert.ok(activeSel instanceof fabric.ActiveSelection, 'active selection');
        assert.notEqual(el.style.cssText, canvas._originalCanvasStyle, 'canvas el style has been changed');
        if (!isNode()) {
            assert.equal(parentEl.childNodes[0], wrapperEl, 'wrapperEl is appendend to rootNode');
        }
        //looks like i cannot use parentNode
        //equal(wrapperEl, lowerCanvasEl.parentNode, 'lowerCanvas is appended to wrapperEl');
        //equal(wrapperEl, upperCanvasEl.parentNode, 'upperCanvas is appended to wrapperEl');
        //equal(parentEl, wrapperEl.parentNode, 'wrapperEl is appendend to rootNode');
        assert.equal(parentEl.childNodes.length, 1, 'parent div should have 1 child');
        assert.notEqual(parentEl.firstChild, canvas.getElement(), 'canvas should not be parent div firstChild');
        assert.ok(typeof canvas.dispose === 'function');
        assert.ok(typeof canvas.destroy === 'function');
        canvas.add(makeRect(), makeRect(), makeRect());
        canvas.item(0).animate({ scaleX: 10 });
        activeSel.add(canvas.item(1));
        assert.equal(fabric.runningAnimations.length, 1, 'should have a running animation');
        await canvas.dispose();
        assert.equal(fabric.runningAnimations.length, 0, 'dispose should clear running animations');
        assert.equal(canvas.getObjects().length, 0, 'dispose should clear canvas');
        assert.equal(canvas.getActiveSelection(), undefined, 'dispose should dispose active selection');
        assert.equal(activeSel.size(), 0, 'dispose should dispose active selection');
        assert.equal(parentEl.childNodes.length, 1, 'parent has always 1 child');
        if (!isNode()) {
            assert.equal(parentEl.childNodes[0], lowerCanvasEl, 'canvas should be back to its firstChild place');
        }
        assert.equal(canvas.wrapperEl, null, 'wrapperEl should be deleted');
        assert.equal(canvas.upperCanvasEl, null, 'upperCanvas should be deleted');
        assert.equal(canvas.lowerCanvasEl, null, 'lowerCanvasEl should be deleted');
        assert.equal(canvas.pixelFindCanvasEl, null, 'pixelFindCanvasEl should be deleted');
        assert.equal(canvas.contextTop, null, 'contextTop should be deleted');
        assert.equal(canvas.pixelFindContext, null, 'pixelFindContext should be deleted');
        assert.equal(canvas._originalCanvasStyle, undefined, 'removed original canvas style');
        assert.equal(el.style.cssText, elStyle, 'restored original canvas style');
        assert.equal(el.width, 200, 'restored width');
        assert.equal(el.height, 200, 'restored height');

    });

    // QUnit.test('dispose: events', async function(assert) {
    //   function invokeEventsOnCanvas() {
    //     // nextSibling because we need to invoke events on upper canvas
    //     simulateEvent(canvas.getElement().nextSibling, 'mousedown');
    //     simulateEvent(canvas.getElement().nextSibling, 'mouseup');
    //     simulateEvent(canvas.getElement().nextSibling, 'mousemove');
    //   }
    //   var assertInvocationsCount = function() {
    //     var message = 'event handler should not be invoked after `dispose`';
    //     assert.equal(handlerInvocationCounts.__onMouseDown, 1);
    //     assert.equal(handlerInvocationCounts.__onMouseUp, 1);
    //     assert.equal(handlerInvocationCounts.__onMouseMove, 1);
    //   };

    //   assert.ok(typeof canvas.dispose === 'function');
    //   canvas.add(makeRect(), makeRect(), makeRect());

    //   var handlerInvocationCounts = {
    //     __onMouseDown: 0, __onMouseUp: 0, __onMouseMove: 0
    //   };

    //   // hijack event handlers
    //   canvas.__onMouseDown = function() {
    //     handlerInvocationCounts.__onMouseDown++;
    //   };
    //   canvas.__onMouseUp = function() {
    //     handlerInvocationCounts.__onMouseUp++;
    //   };
    //   canvas.__onMouseMove = function() {
    //     handlerInvocationCounts.__onMouseMove++;
    //   };

    //   invokeEventsOnCanvas();
    //   assertInvocationsCount();

    //   await canvas.dispose();
    //   assert.equal(canvas.getObjects().length, 0, 'dispose should clear canvas');

    //   invokeEventsOnCanvas();
    //   assertInvocationsCount();
    // });
}

testStaticCanvasDisposing();
testCanvasDisposing();
