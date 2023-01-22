(function(){
  QUnit.module('iText click interaction', function (hooks) {
    var canvas;
    hooks.before(function () {
      canvas = new fabric.Canvas(null, {
        enableRetinaScaling: false
      });
    });
    hooks.after(() => canvas.dispose());
    hooks.afterEach(function () {
      canvas.clear();
      canvas.cancelRequestedRender();
    });

    function assertCursorAnimation(assert, text, active = false) {
      const cursorState = [text._currentTickState, text._currentTickCompleteState].some(
        (cursorAnimation) => cursorAnimation && !cursorAnimation.isDone()
      );
      assert.equal(cursorState, active, `cursor animation state should be ${active}`);
    }

    function wait(ms = 32) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    QUnit.test('doubleClickHandler', async function (assert) {
      var done = assert.async();
      var iText = new fabric.IText('test need some word\nsecond line');
      iText.canvas = canvas;
      var eventData = {
        which: 1,
        target: canvas.upperCanvasEl,
        clientX: 40,
        clientY: 10
      };
      iText.enterEditing();
      assertCursorAnimation(assert, iText, true);
      iText.doubleClickHandler({
        e: eventData
      });
      assert.equal(iText.selectionStart, 0, 'dblClick selection start is');
      assert.equal(iText.selectionEnd, 4, 'dblClick selection end is');
      // wait for cursor animation tick to run
      await wait();
      assertCursorAnimation(assert, iText);
      eventData = {
        which: 1,
        target: canvas.upperCanvasEl,
        clientX: 40,
        clientY: 60
      };
      iText.doubleClickHandler({
        e: eventData
      });
      assert.equal(iText.selectionStart, 20, 'second dblClick selection start is');
      assert.equal(iText.selectionEnd, 26, 'second dblClick selection end is');
      assertCursorAnimation(assert, iText);
      iText.exitEditing();
      done();
    });
    QUnit.test('doubleClickHandler no editing', function (assert) {
      var iText = new fabric.IText('test need some word\nsecond line');
      iText.canvas = canvas;
      var eventData = {
        which: 1,
        target: canvas.upperCanvasEl,
        clientX: 40,
        clientY: 10
      };
      iText.doubleClickHandler({
        e: eventData
      });
      assert.equal(iText.selectionStart, 0, 'dblClick selection start is');
      assert.equal(iText.selectionEnd, 0, 'dblClick selection end is');
      assertCursorAnimation(assert, iText);
    });
    QUnit.test('tripleClickHandler', async function (assert) {
      var done = assert.async();
      var iText = new fabric.IText('test need some word\nsecond line');
      iText.canvas = canvas;
      var eventData = {
        which: 1,
        target: canvas.upperCanvasEl,
        clientX: 40,
        clientY: 10
      };
      iText.enterEditing();
      assertCursorAnimation(assert, iText, true);
      iText.tripleClickHandler({
        e: eventData
      });
      assert.equal(iText.selectionStart, 0, 'tripleClick selection start is');
      assert.equal(iText.selectionEnd, 19, 'tripleClick selection end is');
      // wait for cursor animation tick to run
      await wait();
      assertCursorAnimation(assert, iText);
      eventData = {
        which: 1,
        target: canvas.upperCanvasEl,
        clientX: 40,
        clientY: 60
      };
      iText.tripleClickHandler({
        e: eventData
      });
      assert.equal(iText.selectionStart, 20, 'second tripleClick selection start is');
      assert.equal(iText.selectionEnd, 31, 'second tripleClick selection end is');
      assertCursorAnimation(assert, iText);
      iText.exitEditing();
      done();
    });
    QUnit.test('tripleClickHandler', function (assert) {
      var iText = new fabric.IText('test need some word\nsecond line');
      iText.canvas = canvas;
      var eventData = {
        which: 1,
        target: canvas.upperCanvasEl,
        clientX: 40,
        clientY: 10
      };
      iText.tripleClickHandler({
        e: eventData
      });
      assert.equal(iText.selectionStart, 0, 'tripleClick selection start is');
      assert.equal(iText.selectionEnd, 0, 'tripleClick selection end is');
    });
    QUnit.test('_getNewSelectionStartFromOffset end of line', function (assert) {
      var iText = new fabric.IText('test need some word\nsecond line');
      var index = 10;
      var jlen = 20;
      var selection = iText._getNewSelectionStartFromOffset({ y: 1, x: 1000 }, 500, 520, index, jlen);
      assert.equal(selection, index, 'index value did not change');
    });
    QUnit.test('_getNewSelectionStartFromOffset middle of line', function (assert) {
      var iText = new fabric.IText('test need some word\nsecond line');
      var index = 10;
      var jlen = 20;
      var selection = iText._getNewSelectionStartFromOffset({ y: 1, x: 519 }, 500, 520, index, jlen);
      assert.equal(selection, index + 1, 'index value was moved to next char, since is very near');
    });
    QUnit.test('_getNewSelectionStartFromOffset middle of line', function (assert) {
      var iText = new fabric.IText('test need some word\nsecond line');
      var index = 10;
      var jlen = 20;
      var selection = iText._getNewSelectionStartFromOffset({ y: 1, x: 502 }, 500, 520, index, jlen);
      assert.equal(selection, index, 'index value was NOT moved to next char, since is very near to first one');
    });
    QUnit.test('_getNewSelectionStartFromOffset middle of line', function (assert) {
      var iText = new fabric.IText('test need some word\nsecond line');
      var index = 10;
      var jlen = 10;
      var selection = iText._getNewSelectionStartFromOffset({ y: 1, x: 1000 }, 500, 520, index, jlen);
      assert.equal(selection, index, 'index value was NOT moved to next char, since is already at end of text');
    });
    QUnit.test('getSelectionStartFromPointer with scale', function (assert) {
      const eventData = {
        which: 1,
        target: canvas.upperCanvasEl,
        clientX: 70,
        clientY: 10
      };
      const iText = new fabric.IText('test need some word\nsecond line', { scaleX: 3, scaleY: 2, canvas });
      assert.equal(iText.getSelectionStartFromPointer(eventData), 2, 'index');
      assert.equal(iText.getSelectionStartFromPointer({ ...eventData, clientY: 20 }), 2, 'index');
      iText.set({ scaleX: 0.5, scaleY: 0.25 });
      assert.equal(iText.getSelectionStartFromPointer(eventData), 9, 'index');
      assert.equal(iText.getSelectionStartFromPointer({ ...eventData, clientY: 20 }), 29, 'index');
      iText.set({ scaleX: 1, scaleY: 1 });
      assert.equal(iText.getSelectionStartFromPointer(eventData), 5, 'index');
      assert.equal(iText.getSelectionStartFromPointer({ ...eventData, clientY: 20 }), 5, 'index');
    });
    QUnit.test('_mouseDownHandlerBefore set up selected property', function (assert) {
      var iText = new fabric.IText('test need some word\nsecond line');
      assert.equal(iText.selected, undefined, 'iText has no selected property');
      canvas.setActiveObject(iText);
      iText.canvas = canvas;
      iText._mouseDownHandlerBefore({ e: {} });
      assert.equal(iText.selected, true, 'iText has selected property');
      assert.equal(iText.__lastSelected, undefined, 'iText has no __lastSelected property');
    });
    QUnit.test('mouse down aborts cursor animation', function (assert) {
      var iText = new fabric.IText('test need some word\nsecond line', { canvas });
      assert.ok(typeof iText._animateCursor === 'function', 'method is defined');
      let animate = 0, aborted = 0;
      iText._animateCursor = () => animate++;
      iText.abortCursorAnimation = () => aborted++;
      canvas.setActiveObject(iText);
      iText.enterEditing();
      iText._mouseDownHandler({ e: {} });
      assert.equal(animate, 1, 'called from enterEditing');
      assert.equal(aborted, 1, 'called from render');
    });
    QUnit.test('_mouseUpHandler set selected as true', function (assert) {
      var iText = new fabric.IText('test');
      iText.initDelayedCursor = function () { };
      iText.renderCursorOrSelection = function () { };
      assert.equal(iText.selected, undefined, 'iText has no selected property');
      assert.equal(iText.__lastSelected, undefined, 'iText has no __lastSelected property');
      canvas.setActiveObject(iText);
      iText.canvas = canvas;
      iText.mouseUpHandler({ e: {} });
      assert.equal(iText.selected, true, 'iText has selected property');
    });
    QUnit.test('_mouseUpHandler on a selected object enter edit', function (assert) {
      var iText = new fabric.IText('test');
      iText.initDelayedCursor = function () { };
      iText.renderCursorOrSelection = function () { };
      assert.equal(iText.isEditing, false, 'iText not editing');
      iText.canvas = canvas;
      canvas._activeObject = null;
      iText.selected = true;
      iText.__lastSelected = true;
      iText.mouseUpHandler({ e: {} });
      assert.equal(iText.isEditing, true, 'iText entered editing');
      assertCursorAnimation(assert, iText, true);
      iText.exitEditing();
    });
    QUnit.test('_mouseUpHandler on a selected object does enter edit if there is an activeObject', function (assert) {
      var iText = new fabric.IText('test');
      iText.initDelayedCursor = function () { };
      iText.renderCursorOrSelection = function () { };
      assert.equal(iText.isEditing, false, 'iText not editing');
      iText.canvas = canvas;
      canvas._activeObject = new fabric.IText('test2');
      iText.selected = true;
      iText.__lastSelected = true;
      iText.mouseUpHandler({ e: {} });
      assert.equal(iText.isEditing, false, 'iText should not enter editing');
      assertCursorAnimation(assert, iText);
      iText.exitEditing();
    });
    QUnit.test('_mouseUpHandler on a selected text in a group does NOT enter editing', function (assert) {
      var iText = new fabric.IText('test');
      iText.initDelayedCursor = function () { };
      iText.renderCursorOrSelection = function () { };
      assert.equal(iText.isEditing, false, 'iText not editing');
      var group = new fabric.Group([iText], { subTargetCheck: false });
      canvas.add(group);
      iText.selected = true;
      iText.__lastSelected = true;
      canvas.__onMouseUp({ clientX: 1, clientY: 1 });
      assert.equal(canvas._target, group, 'group should be found as target');
      assert.equal(iText.isEditing, false, 'iText should not enter editing');
      iText.exitEditing();
    });
    QUnit.test('_mouseUpHandler on a text in a group', function (assert) {
      var iText = new fabric.IText('test');
      iText.initDelayedCursor = function () { };
      iText.renderCursorOrSelection = function () { };
      assert.equal(iText.isEditing, false, 'iText not editing');
      var group = new fabric.Group([iText], { subTargetCheck: true, interactive: true });
      canvas.add(group);
      iText.selected = true;
      iText.__lastSelected = true;
      canvas.__onMouseUp({ clientX: 1, clientY: 1 });
      assert.equal(iText.isEditing, true, 'iText should enter editing');
      assertCursorAnimation(assert, iText, true);
      iText.exitEditing();
      group.interactive = false;
      iText.selected = true;
      iText.__lastSelected = true;
      canvas.__onMouseUp({ clientX: 1, clientY: 1 });
      assert.equal(iText.isEditing, false, 'iText should not enter editing');
    });
    QUnit.test('_mouseUpHandler on a corner of selected text DOES NOT enter edit', function (assert) {
      var iText = new fabric.IText('test');
      iText.initDelayedCursor = function () { };
      iText.renderCursorOrSelection = function () { };
      assert.equal(iText.isEditing, false, 'iText not editing');
      iText.canvas = canvas;
      iText.selected = true;
      iText.__lastSelected = true;
      iText.__corner = 'mt';
      iText.mouseUpHandler({ e: {} });
      assert.equal(iText.isEditing, false, 'iText should not enter editing');
      iText.exitEditing();
      canvas.renderAll();
    });

    [true, false].forEach(enableRetinaScaling => {
      QUnit.module(`enableRetinaScaling = ${enableRetinaScaling}`, function (hooks) {
        let canvas, eventData, iText;
        let count = 0, countCanvas = 0;
        hooks.before(() => {
          fabric.config.configure({ devicePixelRatio: 2 });
        });
        hooks.after(() => {
          fabric.config.restoreDefaults();
        });
        hooks.beforeEach(() => {
          canvas = new fabric.Canvas(null, {
            enableRetinaScaling,
          });
          eventData = {
            which: 1,
            target: canvas.upperCanvasEl,
            ...(enableRetinaScaling ? {
              clientX: 60,
              clientY: 30
            } : {
              clientX: 30,
              clientY: 15
            })
          };
          count = 0;
          countCanvas = 0;
          iText = new fabric.IText('test test');
          canvas.add(iText);
          canvas.on('text:selection:changed', () => {
            countCanvas++;
          });
          iText.on('selection:changed', () => {
            count++;
          });
        });
        hooks.afterEach(() => canvas.dispose());

        QUnit.test(`click on editing itext make selection:changed fire`, function (assert) {
          var done = assert.async();
          assert.equal(canvas._isRetinaScaling(), enableRetinaScaling, 'test state is correct');
          assert.equal(canvas.getActiveObject(), null, 'no active object exist');
          assert.equal(count, 0, 'no selection:changed fired yet');
          assert.equal(countCanvas, 0, 'no text:selection:changed fired yet');
          canvas._onMouseDown(eventData);
          canvas._onMouseUp(eventData);
          assert.equal(canvas.getActiveObject(), iText, 'Itext got selected');
          assert.equal(iText.isEditing, false, 'Itext is not editing yet');
          assert.equal(count, 0, 'no selection:changed fired yet');
          assert.equal(countCanvas, 0, 'no text:selection:changed fired yet');
          assert.equal(iText.selectionStart, 0, 'Itext did not set the selectionStart');
          assert.equal(iText.selectionEnd, 0, 'Itext did not set the selectionend');
          // make a little delay or it will act as double click and select everything
          setTimeout(function () {
            canvas._onMouseDown(eventData);
            canvas._onMouseUp(eventData);
            assert.equal(iText.isEditing, true, 'Itext entered editing');
            assert.equal(iText.selectionStart, 2, 'Itext set the selectionStart');
            assert.equal(iText.selectionEnd, 2, 'Itext set the selectionend');
            assertCursorAnimation(assert, iText, true);
            assert.equal(count, 1, 'no selection:changed fired yet');
            assert.equal(countCanvas, 1, 'no text:selection:changed fired yet');
            done();
          }, 500);
        });
      });
    });
  });
})();
