(function() {

  QUnit.module('fabric.IText');

  test('constructor', function() {
    var iText = new fabric.IText('test');
    ok(iText instanceof fabric.IText);
  });

  test('initial properties', function() {
    var iText = new fabric.IText('test');
    ok(iText instanceof fabric.IText);

    equal(iText.text, 'test');
    equal(iText.type, 'i-text');
    deepEqual(iText.styles, { });
  });

  test('toObject', function() {
    var styles = {
      0: {
        0: { fill: 'red' },
        1: { textDecoration: 'underline' }
      }
    };
    var iText = new fabric.IText('test', {
      styles: styles
    });
    equal(typeof iText.toObject, 'function');

    var obj = iText.toObject();
    deepEqual(obj.styles, styles);
  });

  test('setSelectionStart', function() {
    var iText = new fabric.IText('test');

    equal(typeof iText.setSelectionStart, 'function');

    equal(iText.selectionStart, 0);

    iText.setSelectionStart(3);
    equal(iText.selectionStart, 3);
    equal(iText.selectionEnd, 0);
  });

  test('setSelectionEnd', function() {
    var iText = new fabric.IText('test');

    equal(typeof iText.setSelectionEnd, 'function');

    equal(iText.selectionEnd, 0);

    iText.setSelectionEnd(3);
    equal(iText.selectionEnd, 3);
    equal(iText.selectionStart, 0);
  });

  test('getSelectionStyles', function() {
    // TODO:
    ok(true);
  });

  test('setSelectionStyles', function() {
    // TODO:
    ok(true);
  });

  test('get2DCursorLocation', function() {
    // TODO:
    ok(true);
  });

  test('isEmptyStyles', function() {
    // TODO:
    ok(true);
  });

})();
