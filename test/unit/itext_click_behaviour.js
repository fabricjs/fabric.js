(function(){
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
  });
})();
