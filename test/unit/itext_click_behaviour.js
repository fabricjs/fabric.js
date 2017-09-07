(function(){
  test('_getNewSelectionStartFromOffset end of line', function() {
    var iText = new fabric.IText('test need some word\nsecond line');
    var index = 10;
    var jlen = 20;
    var selection = iText._getNewSelectionStartFromOffset({ y: 1, x: 1000 }, 500, 520, index, jlen);
    equal(selection, index, 'index value did not change');
  });
  test('_getNewSelectionStartFromOffset middle of line', function() {
    var iText = new fabric.IText('test need some word\nsecond line');
    var index = 10;
    var jlen = 20;
    var selection = iText._getNewSelectionStartFromOffset({ y: 1, x: 519 }, 500, 520, index, jlen);
    equal(selection, index + 1, 'index value was moved to next char, since is very near');
  });
  test('_getNewSelectionStartFromOffset middle of line', function() {
    var iText = new fabric.IText('test need some word\nsecond line');
    var index = 10;
    var jlen = 20;
    var selection = iText._getNewSelectionStartFromOffset({ y: 1, x: 511 }, 500, 520, index, jlen);
    equal(selection, index, 'index value was NOT moved to next char, since is very near');
  });
  test('_getNewSelectionStartFromOffset middle of line', function() {
    var iText = new fabric.IText('test need some word\nsecond line');
    var index = 10;
    var jlen = 10;
    var selection = iText._getNewSelectionStartFromOffset({ y: 1, x: 1000 }, 500, 520, index, jlen);
    equal(selection, index, 'index value was NOT moved to next char, since is already at end of text');
  });
})();
