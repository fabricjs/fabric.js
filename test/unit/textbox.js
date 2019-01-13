(function() {
  var canvas = this.canvas = new fabric.Canvas();
  QUnit.module('fabric.Textbox', {
    afterEach: function() {
      canvas.clear();
    }
  });

  var TEXTBOX_OBJECT = {
    version: fabric.version,
    type: 'textbox',
    originX: 'left',
    originY: 'top',
    left: 0,
    top: 0,
    width: 20,
    height: 45.2,
    fill: 'rgb(0,0,0)',
    stroke: null,
    strokeWidth: 1,
    strokeDashArray: null,
    strokeLineCap: 'butt',
    strokeDashOffset: 0,
    strokeLineJoin: 'miter',
    strokeMiterLimit: 4,
    scaleX: 1,
    scaleY: 1,
    angle: 0,
    flipX: false,
    flipY: false,
    opacity: 1,
    shadow: null,
    visible: true,
    clipTo: null,
    text: 'x',
    fontSize: 40,
    fontWeight: 'normal',
    fontFamily: 'Times New Roman',
    fontStyle: 'normal',
    lineHeight: 1.16,
    underline: false,
    overline: false,
    linethrough: false,
    textAlign: 'left',
    backgroundColor: '',
    textBackgroundColor: '',
    fillRule: 'nonzero',
    paintFirst: 'fill',
    globalCompositeOperation: 'source-over',
    skewX: 0,
    skewY: 0,
    transformMatrix: null,
    charSpacing: 0,
    styles: { },
    minWidth: 20,
    splitByGrapheme: false,
  };

  QUnit.test('constructor', function(assert) {
    var textbox = new fabric.Textbox('test');
    assert.ok(textbox instanceof fabric.Textbox);
    assert.ok(textbox instanceof fabric.IText);
    assert.ok(textbox instanceof fabric.Text);
  });

  QUnit.test('constructor with width', function(assert) {
    var textbox = new fabric.Textbox('test', { width: 400 });
    assert.equal(textbox.width, 400, 'width is taken by contstructor');
  });

  QUnit.test('constructor with width too small', function(assert) {
    var textbox = new fabric.Textbox('test', { width: 5 });
    assert.equal(Math.round(textbox.width), 56, 'width is calculated by constructor');
  });

  QUnit.test('initial properties', function(assert) {
    var textbox = new fabric.Textbox('test');
    assert.equal(textbox.text, 'test');
    assert.equal(textbox.type, 'textbox');
    assert.deepEqual(textbox.styles, { });
    assert.ok(textbox.cacheProperties.indexOf('width') > -1, 'width is in cacheProperties');
  });

  QUnit.test('toObject', function(assert) {
    var textbox = new fabric.Textbox('x');
    var obj = textbox.toObject();
    assert.deepEqual(obj, TEXTBOX_OBJECT, 'JSON OUTPUT MATCH');
  });

  QUnit.test('isEmptyStyles', function(assert) {
    var textbox = new fabric.Textbox('x x', { width: 5, styles: { 0: { 0: { fill: 'red' } } } });
    assert.equal(textbox._textLines.length, 2, 'lines are wrapped');
    assert.equal(textbox._unwrappedTextLines.length, 1, 'there is only one text line');
    assert.equal(textbox.isEmptyStyles(), false, 'style is not empty');
    assert.equal(textbox.isEmptyStyles(0), false, 'style is not empty at line 0');
    assert.equal(textbox.isEmptyStyles(1), true, 'style is empty at line 1');
  });

  QUnit.test('isEmptyStyles alternate lines', function(assert) {
    var textbox = new fabric.Textbox('xa xb xc xd xe\nya yb', {
      width: 5,
      styles: {
        0: { 0: { fill: 'red' }, 1: { fill: 'blue' }, 9: { fill: 'red' }, 10: { fill: 'blue' } },
        1: { 3: { fill: 'red' }, 4: { fill: 'blue' } },
      }
    });
    assert.equal(textbox._textLines.length, 7, 'lines are wrapped');
    assert.equal(textbox._unwrappedTextLines.length, 2, 'there is only one text line');
    assert.equal(textbox.isEmptyStyles(), false, 'style is not empty');
    assert.equal(textbox.isEmptyStyles(0), false, 'style is not empty at line 0');
    assert.equal(textbox.isEmptyStyles(1), true, 'style is empty at line 1');
    assert.equal(textbox.isEmptyStyles(2), true, 'style is empty at line 2');
    assert.equal(textbox.isEmptyStyles(3), false, 'style is empty at line 3');
    assert.equal(textbox.isEmptyStyles(4), true, 'style is empty at line 4');
    assert.equal(textbox.isEmptyStyles(5), true, 'style is empty at line 5');
    assert.equal(textbox.isEmptyStyles(6), false, 'style is empty at line 6');
  });
  QUnit.test('wrapping with charspacing', function(assert) {
    var textbox = new fabric.Textbox('xa xb xc xd xe ya yb id', {
      width: 190,
    });
    assert.equal(textbox.textLines[0], 'xa xb xc xd', 'first line match expectations');
    textbox.charSpacing = 100;
    textbox.initDimensions();
    assert.equal(textbox.textLines[0], 'xa xb xc', 'first line match expectations spacing 100');
    textbox.charSpacing = 300;
    textbox.initDimensions();
    assert.equal(textbox.textLines[0], 'xa xb', 'first line match expectations spacing 300');
    textbox.charSpacing = 800;
    textbox.initDimensions();
    assert.equal(textbox.textLines[0], 'xa', 'first line match expectations spacing 800');
  });
  QUnit.test('wrapping with different things', function(assert) {
    var textbox = new fabric.Textbox('xa\u200Bxb\u200Bxc\u200Cxd\u200Cxe ya yb id', {
      width: 16,
    });
    assert.equal(textbox.textLines[0], 'xa', '0 line match expectations');
    assert.equal(textbox.textLines[1], 'xb', '1 line match expectations');
    assert.equal(textbox.textLines[2], 'xc', '2 line match expectations');
    assert.equal(textbox.textLines[3], 'xd', '3 line match expectations');
    assert.equal(textbox.textLines[4], 'xe', '4 line match expectations');
    assert.equal(textbox.textLines[5], 'ya', '5 line match expectations');
    assert.equal(textbox.textLines[6], 'yb', '6 line match expectations');
  });
  QUnit.test('wrapping with splitByGrapheme', function(assert) {
    var textbox = new fabric.Textbox('xaxbxcxdxeyaybid', {
      width: 1,
      splitByGrapheme: true,
    });
    assert.equal(textbox.textLines[0], 'x', '0 line match expectations splitByGrapheme');
    assert.equal(textbox.textLines[1], 'a', '1 line match expectations splitByGrapheme');
    assert.equal(textbox.textLines[2], 'x', '2 line match expectations splitByGrapheme');
    assert.equal(textbox.textLines[3], 'b', '3 line match expectations splitByGrapheme');
    assert.equal(textbox.textLines[4], 'x', '4 line match expectations splitByGrapheme');
    assert.equal(textbox.textLines[5], 'c', '5 line match expectations splitByGrapheme');
  });
  QUnit.test('wrapping with custom space', function(assert) {
    var textbox = new fabric.Textbox('xa xb xc xd xe ya yb id', {
      width: 2000,
    });
    var line1 = textbox._wrapLine('xa xb xc xd xe ya yb id', 0, 100, 0);
    var expected1 =  [
      ['x', 'a', ' ', 'x', 'b'],
      ['x', 'c', ' ', 'x', 'd'],
      ['x', 'e', ' ', 'y', 'a'],
      ['y', 'b', ' ', 'i', 'd']];
    assert.deepEqual(line1, expected1, 'wrapping without reserved');
    assert.deepEqual(textbox.dynamicMinWidth, 40, 'wrapping without reserved');
    var line2 = textbox._wrapLine('xa xb xc xd xe ya yb id', 0, 100, 50);
    var expected2 =  [
      ['x', 'a'],
      ['x', 'b'],
      ['x', 'c'],
      ['x', 'd'],
      ['x', 'e'],
      ['y', 'a'],
      ['y', 'b'],
      ['i', 'd']];
    assert.deepEqual(line2, expected2, 'wrapping without reserved');
    assert.deepEqual(textbox.dynamicMinWidth, 90, 'wrapping without reserved');
  });
  QUnit.test('_scaleObject with textbox', function(assert) {
    var text = new fabric.Textbox('xa xb xc xd xe ya yb id', { strokeWidth: 0 });
    canvas.add(text);
    var canvasEl = canvas.getElement(),
        canvasOffset = fabric.util.getElementOffset(canvasEl);
    var eventStub = {
      clientX: canvasOffset.left + text.width,
      clientY: canvasOffset.top + text.oCoords.mr.corner.tl.y + 1,
    };
    var originalWidth = text.width;
    canvas._setupCurrentTransform(eventStub, text, true);
    var scaled = canvas._scaleObject(eventStub.clientX + 20, eventStub.clientY, 'x');
    assert.equal(scaled, true, 'return true if textbox scaled');
    assert.equal(text.width, originalWidth + 20, 'width increased');
    assert.equal(canvas._currentTransform.newScaleX, text.width / originalWidth, 'newScaleX is not undefined');
  });
})();
