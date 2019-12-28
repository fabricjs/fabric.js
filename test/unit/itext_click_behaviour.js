(function(){
  var canvas;
  QUnit.module('iText click interaction', function(hooks) {
    hooks.beforeEach(function() {
      canvas = new fabric.Canvas(null, {
        enableRetinaScaling: false
      });
    });
    hooks.afterEach(function() {
      canvas.clear();
      canvas.cancelRequestedRender();
    });
    QUnit.test('doubleClickHandler', function(assert) {
      var iText = new fabric.IText('test need some word\nsecond line');
      iText.canvas = canvas;
      var eventData = {
        which: 1,
        target: canvas.upperCanvasEl,
        clientX: 40,
        clientY: 10
      };
      iText.enterEditing();
      iText.doubleClickHandler({
        e: eventData
      });
      assert.equal(iText.selectionStart, 0, 'dblClcik selection start is');
      assert.equal(iText.selectionEnd, 4, 'dblClcik selection end is');
      var eventData = {
        which: 1,
        target: canvas.upperCanvasEl,
        clientX: 40,
        clientY: 60
      };
      iText.doubleClickHandler({
        e: eventData
      });
      assert.equal(iText.selectionStart, 20, 'second dblClcik selection start is');
      assert.equal(iText.selectionEnd, 26, 'second dblClcik selection end is');
      iText.exitEditing();
    });
    QUnit.test('doubleClickHandler no editing', function(assert) {
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
      assert.equal(iText.selectionStart, 0, 'dblClcik selection start is');
      assert.equal(iText.selectionEnd, 0, 'dblClcik selection end is');
    });
    QUnit.test('tripleClickHandler', function(assert) {
      var iText = new fabric.IText('test need some word\nsecond line');
      iText.canvas = canvas;
      var eventData = {
        which: 1,
        target: canvas.upperCanvasEl,
        clientX: 40,
        clientY: 10
      };
      iText.enterEditing();
      iText.tripleClickHandler({
        e: eventData
      });
      assert.equal(iText.selectionStart, 0, 'tripleClick selection start is');
      assert.equal(iText.selectionEnd, 19, 'tripleClick selection end is');
      var eventData = {
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
      iText.exitEditing();
    });
    QUnit.test('tripleClickHandler', function(assert) {
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
    QUnit.test('_getNewSelectionStartFromOffset end of line', function(assert) {
      var iText = new fabric.IText('test need some word\nsecond line');
      var index = 10;
      var jlen = 20;
      var selection = iText._getNewSelectionStartFromOffset({ y: 1, x: 1000 }, 500, 520, index, jlen);
      assert.equal(selection, index, 'index value did not change');
    });
    QUnit.test('_getNewSelectionStartFromOffset middle of line', function(assert) {
      var iText = new fabric.IText('test need some word\nsecond line');
      var index = 10;
      var jlen = 20;
      var selection = iText._getNewSelectionStartFromOffset({ y: 1, x: 519 }, 500, 520, index, jlen);
      assert.equal(selection, index + 1, 'index value was moved to next char, since is very near');
    });
    QUnit.test('_getNewSelectionStartFromOffset middle of line', function(assert) {
      var iText = new fabric.IText('test need some word\nsecond line');
      var index = 10;
      var jlen = 20;
      var selection = iText._getNewSelectionStartFromOffset({ y: 1, x: 502 }, 500, 520, index, jlen);
      assert.equal(selection, index, 'index value was NOT moved to next char, since is very near to first one');
    });
    QUnit.test('_getNewSelectionStartFromOffset middle of line', function(assert) {
      var iText = new fabric.IText('test need some word\nsecond line');
      var index = 10;
      var jlen = 10;
      var selection = iText._getNewSelectionStartFromOffset({ y: 1, x: 1000 }, 500, 520, index, jlen);
      assert.equal(selection, index, 'index value was NOT moved to next char, since is already at end of text');
    });
    QUnit.test('_mouseDownHandlerBefore set up selected property', function(assert) {
      var iText = new fabric.IText('test need some word\nsecond line');
      assert.equal(iText.selected, undefined, 'iText has no selected property');
      canvas.setActiveObject(iText);
      iText.canvas = canvas;
      iText._mouseDownHandlerBefore({ e: {} });
      assert.equal(iText.selected, true, 'iText has selected property');
      assert.equal(iText.__lastSelected, undefined, 'iText has no __lastSelected property');
    });
    QUnit.test('_mouseUpHandler set selected as true', function(assert) {
      var iText = new fabric.IText('test');
      iText.initDelayedCursor = function() {};
      iText.renderCursorOrSelection = function() {};
      assert.equal(iText.selected, undefined, 'iText has no selected property');
      assert.equal(iText.__lastSelected, undefined, 'iText has no __lastSelected property');
      canvas.setActiveObject(iText);
      iText.canvas = canvas;
      iText.mouseUpHandler({ e: {} });
      assert.equal(iText.selected, true, 'iText has selected property');
    });
    QUnit.test('_mouseUpHandler on a selected object enter edit', function(assert) {
      var iText = new fabric.IText('test');
      iText.initDelayedCursor = function() {};
      iText.renderCursorOrSelection = function() {};
      assert.equal(iText.isEditing, false, 'iText not editing');
      iText.canvas = canvas;
      canvas._activeObject = null;
      iText.selected = true;
      iText.__lastSelected = true;
      iText.mouseUpHandler({ e: {} });
      assert.equal(iText.isEditing, true, 'iText entered editing');
      iText.exitEditing();
    });
    QUnit.test('_mouseUpHandler on a selected object does enter edit if there is an activeObject', function(assert) {
      var iText = new fabric.IText('test');
      iText.initDelayedCursor = function() {};
      iText.renderCursorOrSelection = function() {};
      assert.equal(iText.isEditing, false, 'iText not editing');
      iText.canvas = canvas;
      canvas._activeObject = new fabric.IText('test2');
      iText.selected = true;
      iText.__lastSelected = true;
      iText.mouseUpHandler({ e: {} });
      assert.equal(iText.isEditing, false, 'iText did not enter editing');
      iText.exitEditing();
    });
    QUnit.test('_mouseUpHandler on a selected text in a group DOES NOT enter edit', function(assert) {
      var iText = new fabric.IText('test');
      iText.initDelayedCursor = function() {};
      iText.renderCursorOrSelection = function() {};
      assert.equal(iText.isEditing, false, 'iText not editing');
      iText.canvas = canvas;
      iText.selected = true;
      iText.__lastSelected = true;
      iText.group = true;
      iText.mouseUpHandler({ e: {} });
      assert.equal(iText.isEditing, false, 'iText did not entered editing');
      iText.exitEditing();
    });
    QUnit.test('_mouseUpHandler on a corner of selected text DOES NOT enter edit', function(assert) {
      var iText = new fabric.IText('test');
      iText.initDelayedCursor = function() {};
      iText.renderCursorOrSelection = function() {};
      assert.equal(iText.isEditing, false, 'iText not editing');
      iText.canvas = canvas;
      iText.selected = true;
      iText.__lastSelected = true;
      iText.__corner = 'mt';
      iText.mouseUpHandler({ e: {} });
      assert.equal(iText.isEditing, false, 'iText did not entered editing');
      iText.exitEditing();
      canvas.renderAll();
    });

    QUnit.module('iText click interaction with canvas.enableRetinaScaling = false', function(hooks) {
      hooks.beforeEach(function() {
        canvas.enableRetinaScaling = false;
      });
      QUnit.test('click on editing itext make selection:changed fire', function(assert) {
        var done = assert.async();
        var eventData = {
          which: 1,
          target: canvas.upperCanvasEl,
          clientX: 30,
          clientY: 10
        };
        var count = 0;
        var countCanvas = 0;
        var iText = new fabric.IText('test test');
        canvas.on('text:selection:changed', function() {
          countCanvas++;
        });
        iText.on('selection:changed', function() {
          count++;
        });
        canvas.add(iText);
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
        setTimeout(function() {
          canvas._onMouseDown(eventData);
          canvas._onMouseUp(eventData);
          assert.equal(iText.isEditing, true, 'Itext entered editing');
          assert.equal(iText.selectionStart, 2, 'Itext set the selectionStart');
          assert.equal(iText.selectionEnd, 2, 'Itext set the selectionend');
          assert.equal(count, 1, 'no selection:changed fired yet');
          assert.equal(countCanvas, 1, 'no text:selection:changed fired yet');
          done();
        }, 500);
      });
    });

    QUnit.module('iText click interaction with canvas.enableRetinaScaling = true', function(hooks) {
      hooks.beforeEach(function() {
        fabric.devicePixelRatio = 2;
        canvas = new fabric.Canvas(null, {
          enableRetinaScaling: true,
        });
      });
      QUnit.test('click on editing itext make selection:changed fire', function(assert) {
        var done = assert.async();
        var eventData = {
          which: 1,
          target: canvas.upperCanvasEl,
          clientX: 60,
          clientY: 30
        };
        var count = 0;
        var countCanvas = 0;
        var iText = new fabric.IText('test test');
        canvas.on('text:selection:changed', function() {
          countCanvas++;
        });
        iText.on('selection:changed', function() {
          count++;
        });
        canvas.add(iText);
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
        setTimeout(function() {
          canvas._onMouseDown(eventData);
          canvas._onMouseUp(eventData);
          assert.equal(iText.isEditing, true, 'Itext entered editing');
          assert.equal(iText.selectionStart, 2, 'Itext set the selectionStart');
          assert.equal(iText.selectionEnd, 2, 'Itext set the selectionend');
          assert.equal(count, 1, 'no selection:changed fired yet');
          assert.equal(countCanvas, 1, 'no text:selection:changed fired yet');
          done();
        }, 500);
      });
    });
  });
})();
