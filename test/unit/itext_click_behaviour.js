(function(){
  QUnit.module('iText click interaction');
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
    iText.canvas = {
      _activeObject: iText,
    };
    iText._mouseDownHandlerBefore({ e: {} });
    assert.equal(iText.selected, true, 'iText has selected property');
    assert.equal(iText.__lastSelected, undefined, 'iText has no __lastSelected property');
  });
  QUnit.test('_mouseUpHandler set selected as true', function(assert) {
    var iText = new fabric.IText('test');
    assert.equal(iText.selected, undefined, 'iText has no selected property');
    assert.equal(iText.__lastSelected, undefined, 'iText has no __lastSelected property');
    iText.canvas = {
      _activeObject: iText,
    };
    iText.mouseUpHandler({ e: {} });
    assert.equal(iText.selected, true, 'iText has selected property');
  });
  QUnit.test('_mouseUpHandler on a selected object enter edit', function(assert) {
    var iText = new fabric.IText('test');
    assert.equal(iText.isEditing, false, 'iText not editing');
    iText.canvas = new fabric.Canvas(fabric.util.createCanvasElement());
    iText.selected = true;
    iText.__lastSelected = true;
    iText.mouseUpHandler({ e: {} });
    assert.equal(iText.isEditing, true, 'iText entered editing');
    iText.canvas.cancelRequestedRender();
    iText.canvas.dispose();
  });
  QUnit.test('_mouseUpHandler on a selected text in a group DOES NOT enter edit', function(assert) {
    var iText = new fabric.IText('test');
    assert.equal(iText.isEditing, false, 'iText not editing');
    iText.canvas = new fabric.Canvas(fabric.util.createCanvasElement());
    iText.selected = true;
    iText.__lastSelected = true;
    iText.group = true;
    iText.mouseUpHandler({ e: {} });
    assert.equal(iText.isEditing, false, 'iText entered editing');
    iText.canvas.cancelRequestedRender();
    iText.canvas.dispose();
  });
  QUnit.test('_mouseUpHandler on a corner of selected text DOES NOT enter edit', function(assert) {
    var iText = new fabric.IText('test');
    assert.equal(iText.isEditing, false, 'iText not editing');
    iText.canvas = new fabric.Canvas(fabric.util.createCanvasElement());
    iText.selected = true;
    iText.__lastSelected = true;
    iText.__corner = 'mt';
    iText.mouseUpHandler({ e: {} });
    assert.equal(iText.isEditing, false, 'iText entered editing');
    iText.canvas.cancelRequestedRender();
    iText.canvas.dispose();
  });
})();

/*

this.__isMousedown = false;
if (!this.editable || this.group ||
  (options.transform && options.transform.actionPerformed) ||
  (options.e.button && options.e.button !== 1)) {
  return;
}

if (this.__lastSelected && !this.__corner) {
  this.selected = false;
  this.__lastSelected = false;
  this.enterEditing(options.e);
  if (this.selectionStart === this.selectionEnd) {
    this.initDelayedCursor(true);
  }
  else {
    this.renderCursorOrSelection();
  }
}
else {
  this.selected = true;
}

*/
