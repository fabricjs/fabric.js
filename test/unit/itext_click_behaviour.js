(function(){

  var canvas = new fabric.Canvas();

  QUnit.module('iText click interaction', {
    afterEach: function() {
      canvas.cancelRequestedRender();
    }
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
  });
})();
