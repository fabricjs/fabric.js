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

  QUnit.test('fromObject', function(assert) {
    var done = assert.async();
    fabric.Textbox.fromObject(TEXTBOX_OBJECT, function(textbox) {
      assert.equal(textbox.text, 'x', 'properties are respected');
      assert.ok(textbox instanceof fabric.Textbox, 'the generated object is a textbox');
      done();
    });
  });

  QUnit.test('isEndOfWrapping', function(assert) {
    var textbox = new fabric.Textbox('a q o m s g\np q r s t w', {
      width: 70,
    });
    assert.equal(textbox.isEndOfWrapping(0), false, 'first line is not end of wrapping');
    assert.equal(textbox.isEndOfWrapping(1), false, 'second line is not end of wrapping');
    assert.equal(textbox.isEndOfWrapping(2), true, 'line before an hard break is end of wrapping');
    assert.equal(textbox.isEndOfWrapping(3), false, 'line 3 is not end of wrapping');
    assert.equal(textbox.isEndOfWrapping(4), false, 'line 4 is not end of wrapping');
    assert.equal(textbox.isEndOfWrapping(5), true, 'last line is end of wrapping');
  });

  QUnit.test('_removeExtraneousStyles', function(assert) {
    var textbox = new fabric.Textbox('a q o m s g\np q r s t w', {
      width: 40,
      styles: {
        0: { 0: { fontSize: 4 } },
        1: { 0: { fontSize: 4 } },
        2: { 0: { fontSize: 4 } },
        3: { 0: { fontSize: 4 } },
        4: { 0: { fontSize: 4 } },
        5: { 0: { fontSize: 4 } },
      }
    });
    assert.deepEqual(textbox.styles[3], { 0: { fontSize: 4 } }, 'style line 3 exists');
    assert.deepEqual(textbox.styles[4], { 0: { fontSize: 4 } }, 'style line 4 exists');
    assert.deepEqual(textbox.styles[5], { 0: { fontSize: 4 } }, 'style line 5 exists');
    textbox._removeExtraneousStyles();
    assert.equal(textbox.styles[2], undefined, 'style line 2 has been removed');
    assert.equal(textbox.styles[3], undefined, 'style line 3 has been removed');
    assert.equal(textbox.styles[4], undefined, 'style line 4 has been removed');
    assert.equal(textbox.styles[5], undefined, 'style line 5 has been removed');
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
    var textbox = new fabric.Textbox('xa xb\txc\rxd xe ya yb id', {
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
  QUnit.test('wrapping an empty line', function(assert) {
    var textbox = new fabric.Textbox('', {
      width: 10,
    });
    var line1 = textbox._wrapLine('', 0, 100, 0);
    assert.deepEqual(line1, [[]], 'wrapping without splitByGrapheme');
    textbox.splitByGrapheme = true;
    var line2 = textbox._wrapLine('', 0, 100, 0);
    assert.deepEqual(line2, [[]], 'wrapping with splitByGrapheme');
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
  QUnit.test('_removeExtraneousStyles', function(assert) {
    var iText = new fabric.Textbox('a\nq\qo', { styles: {
      0: { 0: { fontSize: 4 } },
      1: { 0: { fontSize: 4 } },
      2: { 0: { fontSize: 4 } },
      3: { 0: { fontSize: 4 } },
      4: { 0: { fontSize: 4 } },
    } });
    assert.deepEqual(iText.styles[3], { 0: { fontSize: 4 } }, 'style line 3 exists');
    assert.deepEqual(iText.styles[4], { 0: { fontSize: 4 } }, 'style line 4 exists');
    iText._removeExtraneousStyles();
    assert.equal(iText.styles[3], undefined, 'style line 3 has been removed');
    assert.equal(iText.styles[4], undefined, 'style line 4 has been removed');
  });

  QUnit.test('get2DCursorLocation with splitByGrapheme', function(assert) {
    var iText = new fabric.Textbox('aaaaaaaaaaaaaaaaaaaaaaaa',
      { width: 60, splitByGrapheme: true });
    var loc = iText.get2DCursorLocation();

    // [ [ '由', '石', '墨' ],
    //   [ '分', '裂', '的' ],
    //   [ '石', '墨', '分' ],
    //   [ '裂', '由', '石' ],
    //   [ '墨', '分', '裂' ],
    //   [ '由', '石', '墨' ],
    //   [ '分', '裂', '的' ],
    //   [ '石', '墨', '分' ],
    //   [ '裂' ] ]

    assert.equal(loc.lineIndex, 0);
    assert.equal(loc.charIndex, 0);

    // '由石墨|分裂的石墨分裂由石墨分裂由石墨分裂的石墨分裂'
    iText.selectionStart = iText.selectionEnd = 4;
    loc = iText.get2DCursorLocation();

    assert.equal(loc.lineIndex, 1, 'selection end 4 line 1');
    assert.equal(loc.charIndex, 1, 'selection end 4 char 1');

    iText.selectionStart = iText.selectionEnd = 7;
    loc = iText.get2DCursorLocation();

    assert.equal(loc.lineIndex, 2, 'selection end 7 line 2');
    assert.equal(loc.charIndex, 1, 'selection end 7 char 1');

    iText.selectionStart = iText.selectionEnd = 14;
    loc = iText.get2DCursorLocation();

    assert.equal(loc.lineIndex, 4, 'selection end 14 line 4');
    assert.equal(loc.charIndex, 2, 'selection end 14 char 2');
  });

  QUnit.test('missingNewlineOffset with splitByGrapheme', function(assert) {
    var textbox = new fabric.Textbox('aaa\naaaaaa\na\naaaaaaaaaaaa\naaa',
      { width: 80, splitByGrapheme: true });

    // [ [ 'a', 'a', 'a' ],
    //   [ 'a', 'a', 'a', 'a' ],
    //   [ 'a', 'a' ],
    //   [ 'a' ],
    //   [ 'a', 'a', 'a', 'a' ],
    //   [ 'a', 'a', 'a', 'a' ],
    //   [ 'a', 'a', 'a', 'a' ],
    //   [ 'a', 'a', 'a' ] ]

    var offset = textbox.missingNewlineOffset(0);
    assert.equal(offset, 1, 'line 0 is interrupted by a \n so has an offset of 1');

    offset = textbox.missingNewlineOffset(1);
    assert.equal(offset, 0, 'line 1 is wrapped without a \n so it does have an extra char count');
  });

  QUnit.test('missingNewlineOffset with normal split', function(assert) {
    var texbox = new fabric.Textbox('aaa\naaaaaa\na\naaaaaaaaaaaa\naaa',
      { width: 160 });

    var offset = texbox.missingNewlineOffset(0);
    assert.equal(offset, 1, 'it returns always 1');
    var offset = texbox.missingNewlineOffset(1);
    assert.equal(offset, 1, 'it returns always 1');
    var offset = texbox.missingNewlineOffset(2);
    assert.equal(offset, 1, 'it returns always 1');
  });

  QUnit.test('_getLineStyle', function(assert) {
    var textbox = new fabric.Textbox('aaa aaq ggg gg\noee eee', {
      styles: {
        1: { 0: { fontSize: 4 } },
      },
      width: 80,
    });

    assert.equal(textbox._getLineStyle(0), false, 'wrapped line 0 has no style');
    assert.equal(textbox._getLineStyle(1), false, 'wrapped line 1 has no style');
    assert.equal(textbox._getLineStyle(4), true, 'wrapped line 2 has style');
  });

  QUnit.test('_setLineStyle', function(assert) {
    var textbox = new fabric.Textbox('aaa aaq ggg gg\noee eee', {
      styles: {
        1: { 0: { fontSize: 4 } },
      },
      width: 80,
    });

    assert.equal(textbox._getLineStyle(0), false, 'wrapped line 0 has no style');
    assert.equal(textbox._getLineStyle(1), false, 'wrapped line 1 has no style');
    assert.equal(textbox._getLineStyle(2), false, 'wrapped line 2 has no style');
    assert.equal(textbox._getLineStyle(3), false, 'wrapped line 3 has no style');

    assert.deepEqual(textbox.styles[0], undefined, 'style is undefined');
    textbox._setLineStyle(0);

    assert.equal(textbox._getLineStyle(0), true, 'wrapped line 0 has style');
    assert.equal(textbox._getLineStyle(1), true, 'wrapped line 1 has style');
    assert.equal(textbox._getLineStyle(2), true, 'wrapped line 2 has style');
    assert.equal(textbox._getLineStyle(3), true, 'wrapped line 3 has style');

    assert.deepEqual(textbox.styles[0], {}, 'style is an empty object');
  });

  QUnit.test('_deleteStyleDeclaration', function(assert) {
    var textbox = new fabric.Textbox('aaa aaq ggg gg oee eee', {
      styles: {
        0: {
          0: { fontSize: 4 },
          1: { fontSize: 4 },
          2: { fontSize: 4 },
          3: { fontSize: 4 },
          4: { fontSize: 4 },
          5: { fontSize: 4 },
          6: { fontSize: 4 },
          7: { fontSize: 4 },
          8: { fontSize: 4 },
          9: { fontSize: 4 },
          10: { fontSize: 4 },
          11: { fontSize: 4 },
          12: { fontSize: 4 },
          13: { fontSize: 4 },
          14: { fontSize: 4 },
          15: { fontSize: 4 },
          16: { fontSize: 4 },
        },
      },
      width: 5,
    });
    textbox._deleteStyleDeclaration(2, 2);
    assert.equal(textbox.styles[0][10], undefined, 'style has been removed');
  });

  QUnit.test('_setStyleDeclaration', function(assert) {
    var textbox = new fabric.Textbox('aaa aaq ggg gg oee eee', {
      styles: {
        0: {
          0: { fontSize: 4 },
          1: { fontSize: 4 },
          2: { fontSize: 4 },
          3: { fontSize: 4 },
          4: { fontSize: 4 },
          5: { fontSize: 4 },
          6: { fontSize: 4 },
          7: { fontSize: 4 },
          8: { fontSize: 4 },
          9: { fontSize: 4 },
          10: { fontSize: 4 },
          11: { fontSize: 4 },
          12: { fontSize: 4 },
          13: { fontSize: 4 },
          14: { fontSize: 4 },
          15: { fontSize: 4 },
          16: { fontSize: 4 },
        },
      },
      width: 5,
    });
    assert.equal(typeof textbox._setStyleDeclaration, 'function', 'function exists');
    var newStyle = { fontSize: 10 };
    textbox._setStyleDeclaration(2, 2, newStyle);
    assert.equal(textbox.styles[0][10], newStyle, 'style has been changed');
  });

  QUnit.test('styleHas', function(assert) {
    var textbox = new fabric.Textbox('aaa aaq ggg gg oee eee', {
      styles: {
        0: {
          0: { fontSize: 4 },
          1: { fontSize: 4 },
          2: { fontSize: 4 },
          4: { fontFamily: 'Arial' },
          5: { fontFamily: 'Arial' },
          6: { fontFamily: 'Arial' },
        },
      },
      width: 5,
    });
    assert.equal(textbox.styleHas('fontSize'), true, 'style has fontSize');
    assert.equal(textbox.styleHas('fontSize', 0), true, 'style has fontSize on line 0');
    // assert.equal(textbox.styleHas('fontSize', 1), false, 'style does not have fontSize on line 1');
    assert.equal(textbox.styleHas('fontFamily'), true, 'style has fontFamily');
    // assert.equal(textbox.styleHas('fontFamily', 0), false, 'style does not have fontFamily on line 0');
    assert.equal(textbox.styleHas('fontFamily', 1), true, 'style has fontFamily on line 1');
  });

})();
