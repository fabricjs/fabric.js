(function() {
  var canvas = this.canvas = new fabric.Canvas();
  QUnit.module('fabric.Textbox', {
    before() {
      fabric.config.configure({ NUM_FRACTION_DIGITS: 2 });
    },
    after() {
      fabric.config.restoreDefaults();
    },
    afterEach() {
      canvas.clear();
    }
  });

  QUnit.test('constructor', function(assert) {
    var textbox = new fabric.Textbox('test');
    assert.ok(textbox instanceof fabric.Textbox);
    assert.ok(textbox instanceof fabric.IText);
    assert.ok(textbox instanceof fabric.FabricText);
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
    assert.equal(textbox.constructor.type, 'Textbox');
    assert.deepEqual(textbox.styles, { });
    assert.ok(fabric.Textbox.cacheProperties.indexOf('width') > -1, 'width is in cacheProperties');
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

  QUnit.test('isEmptyStyles does not crash on null styles', function(assert) {
    var textbox = new fabric.Textbox('x x', { width: 5 });
    textbox.styles = null;
    assert.equal(textbox._textLines.length, 2, 'lines are wrapped');
    assert.equal(textbox._unwrappedTextLines.length, 1, 'there is only one text line');
    assert.equal(textbox.isEmptyStyles(1), true, 'style is empty');
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
  QUnit.test('wrapping with splitByGrapheme and styles', function (assert) {
    const value = 'xaxbxcxdeyaybid'
    const textbox = new fabric.Textbox(value, {
      width: 190,
      splitByGrapheme: true,
      styles: fabric.util.stylesFromArray(
        [
          {
            style: {
              fontWeight: 'bold',
              fontSize: 64,
            },
            start: 0,
            end: 9,
          },
        ],
        value
      ),
    });
    assert.deepEqual(
      textbox.textLines,
      ['xaxbx', 'cxdeyay', 'bid'],
      'lines match splitByGrapheme with styles'
    );
  });
  QUnit.test('wrapping with charspacing and splitByGrapheme positive', function(assert) {
    var textbox = new fabric.Textbox('xaxbxcxdeyaybid', {
      width: 190,
      splitByGrapheme: true,
      charSpacing: 400
    });
    assert.deepEqual(
      textbox.textLines,
      ['xaxbx', 'cxdey', 'aybid'],
      'lines match splitByGrapheme charSpacing 400'
    );
  });
  QUnit.test('wrapping with charspacing and splitByGrapheme negative', function(assert) {
    var textbox = new fabric.Textbox('xaxbxcxdeyaybid', {
      width: 190,
      splitByGrapheme: true,
      charSpacing: -100
    });
    assert.deepEqual(
      textbox.textLines,
      ['xaxbxcxdeyay', 'bid'],
      'lines match splitByGrapheme charSpacing -100'
    );
  });
  QUnit.test('Measure words', function(assert) {
    const textbox = new fabric.Textbox('word word\nword\nword', { width: 300 });
    const { wordsData, largestWordWidth } = textbox.getGraphemeDataForRender(textbox.textLines);
    assert.deepEqual(
      wordsData[0],
      [{ word: ['w', 'o', 'r', 'd'], width: largestWordWidth }, { word: ['w', 'o', 'r', 'd'], width: largestWordWidth }],
      'All words have the same length line 0'
    );
    assert.deepEqual(
      wordsData[1],
      [{ word: ['w', 'o', 'r', 'd'], width: largestWordWidth }],
      'All words have the same length line1'
    );
    assert.equal(Math.round(largestWordWidth), 82, 'largest word is 82');
  });
  QUnit.test('Measure words with styles', function(assert) {
    const textbox = new fabric.Textbox('word word\nword\nword', { width: 300 });
    textbox.styles = {
      0: {
        5: {
          fontSize: 100,
        },
        6: {
          fontSize: 100,
        },
        7: {
          fontSize: 100,
        },
        8: {
          fontSize: 100,
        }
      },
      2: {
        0: {
          fontSize: 200,
        },
        1: {
          fontSize: 200,
        },
        2: {
          fontSize: 200,
        },
        3: {
          fontSize: 200,
        }
      }
    };
    const { wordsData, largestWordWidth } = textbox.getGraphemeDataForRender(textbox.textLines);
    assert.equal(
      Math.round(wordsData[0][0].width),
      82,
      'unstyle word is 82 wide'
    );
    assert.equal(
      Math.round(wordsData[0][1].width),
      206,
      'unstyle word is 206 wide'
    );
    assert.deepEqual(
      wordsData[2],
      [{ word: ['w', 'o', 'r', 'd'], width: largestWordWidth }],
      'All words have the same length line1'
    );
    assert.equal(Math.round(largestWordWidth), 411, 'largest word is 411');
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
    const wordsData = textbox.getGraphemeDataForRender(['xa xb xc xd xe ya yb id']);
    var line1 = textbox._wrapLine(0, 100, wordsData, 0);
    var expected1 =  [
      ['x', 'a', ' ', 'x', 'b'],
      ['x', 'c', ' ', 'x', 'd'],
      ['x', 'e', ' ', 'y', 'a'],
      ['y', 'b', ' ', 'i', 'd']];
    assert.deepEqual(line1, expected1, 'line1 match expected');
    assert.deepEqual(textbox.dynamicMinWidth, 40, 'texbox width is 40');
    var line2 = textbox._wrapLine(0, 100, wordsData, 50);
    var expected2 =  [
      ['x', 'a'],
      ['x', 'b'],
      ['x', 'c'],
      ['x', 'd'],
      ['x', 'e'],
      ['y', 'a'],
      ['y', 'b'],
      ['i', 'd']];
    assert.deepEqual(line2, expected2, 'line2 match expected');
    assert.deepEqual(textbox.dynamicMinWidth, 90, 'texbox width is 90');
  });
  QUnit.test('wrapping an empty line', function(assert) {
    var textbox = new fabric.Textbox('', {
      width: 10,
    });
    const wordsData = textbox.getGraphemeDataForRender(['']);
    var line1 = textbox._wrapLine(0, 100, wordsData, 0);
    assert.deepEqual(line1, [[]], 'wrapping without splitByGrapheme');
    textbox.splitByGrapheme = true;
    var line2 = textbox._wrapLine(0, 100, wordsData, 0);
    assert.deepEqual(line2, [[]], 'wrapping with splitByGrapheme');
  });
  QUnit.test('wrapping respects max line width', function (assert) {
    const a = 'xaxbxc xdxeyaybid xaxbxc';
    const b = 'xaxbxcxdxeyaybidxaxbxcxdxeyaybid';
    [true, false].forEach(order => {
      [true, false].forEach(space => {
        const ordered = order ? [a, b] : [b, a];
        const text = ordered.join(space ? ' ' : '\n');
        const { _textLines: lines } = new fabric.Textbox(text);
        assert.deepEqual(lines, ordered.map(line => line.split('')), `max line width should be respected for ${text}`);
      });
    });
  });
  QUnit.test('texbox will change width from the mr corner', function(assert) {
    var text = new fabric.Textbox('xa xb xc xd xe ya yb id', { strokeWidth: 0 });
    canvas.add(text);
    canvas.setActiveObject(text);
    var canvasEl = canvas.getElement();
    var eventStub = {
      clientX: text.width,
      clientY: text.oCoords.mr.corner.tl.y + 1,
      type: 'mousedown',
      target: canvas.upperCanvasEl
    };
    var originalWidth = text.width;
    canvas.__onMouseDown(eventStub);
    canvas.__onMouseMove({
      ...eventStub,
      clientX: eventStub.clientX + 20,
      clientY: eventStub.clientY,
      type: 'mousemove',
    });
    canvas.__onMouseUp({
      ...eventStub,
      clientX: eventStub.clientX + 20,
      clientY: eventStub.clientY,
      type: 'mouseup',
    });
    assert.equal(text.width, originalWidth + 20, 'width increased');
  });
  QUnit.test('texbox will change width from the ml corner', function(assert) {
    var text = new fabric.Textbox('xa xb xc xd xe ya yb id', { strokeWidth: 0, left: 40 });
    canvas.add(text);
    canvas.setActiveObject(text);
    var canvasEl = canvas.getElement();
    var eventStub = {
      clientX: text.left,
      clientY: text.oCoords.ml.corner.tl.y + 2,
      type: 'mousedown',
      target: canvas.upperCanvasEl
    };
    var originalWidth = text.width;
    canvas.__onMouseDown(eventStub);
    canvas.__onMouseMove({
      ...eventStub,
      clientX: eventStub.clientX - 20,
      clientY: eventStub.clientY,
      type: 'mousemove',
    });
    canvas.__onMouseUp({
      ...eventStub,
      clientX: eventStub.clientX + 20,
      clientY: eventStub.clientY,
      type: 'mouseup',
    });
    assert.equal(text.width, originalWidth + 20, 'width increased');
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

  QUnit.test('_deleteStyleDeclaration', function (assert) {
    var text = 'aaa aaq ggg gg oee eee';
    var styles = {};
    for (var index = 0; index < text.length; index++) {
      styles[index] = { fontSize: 4 };      
    }
    var textbox = new fabric.Textbox(text, {
      styles: { 0: styles },
      width: 5,
    });
    assert.equal(typeof textbox._deleteStyleDeclaration, 'function', 'function exists');
    textbox._deleteStyleDeclaration(2, 2);
    assert.equal(textbox.styles[0][10], undefined, 'style has been removed');
  });

  QUnit.test('_setStyleDeclaration', function(assert) {
    var text = 'aaa aaq ggg gg oee eee';
    var styles = {};
    for (var index = 0; index < text.length; index++) {
      styles[index] = { fontSize: 4 };

    }
    var textbox = new fabric.Textbox(text, {
      styles: { 0: styles },
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

  QUnit.test('The same text does not need to be wrapped.', function(assert) {
    var str = '0123456789';
    var measureTextbox = new fabric.Textbox(str, {
      fontSize: 20,
      splitByGrapheme: false,
    });
    var newTextbox = new fabric.Textbox(str, {
      width: measureTextbox.width,
      fontSize: 20,
      splitByGrapheme: true,
    });
    assert.equal(newTextbox.textLines.length, measureTextbox.textLines.length, 'The same text is not wrapped');
  });

})();
