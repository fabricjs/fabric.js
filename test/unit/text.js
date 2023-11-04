(function() {

  QUnit.module('fabric.Text', {
    before() {
      fabric.config.configure({ NUM_FRACTION_DIGITS: 2 });
    },
    after() {
      fabric.config.restoreDefaults();
    }
  });

  function createTextObject(text) {
    return new fabric.Text(text || 'x');
  }

  var CHAR_WIDTH = 20;

  var REFERENCE_TEXT_OBJECT = {
    version:                   fabric.version,
    type:                      'Text',
    originX:                   'left',
    originY:                   'top',
    left:                      0,
    top:                       0,
    width:                     CHAR_WIDTH,
    height:                    45.2,
    fill:                      'rgb(0,0,0)',
    stroke:                    null,
    strokeWidth:               1,
    strokeDashArray:           null,
    strokeLineCap:             'butt',
    strokeDashOffset:         0,
    strokeLineJoin:            'miter',
    strokeMiterLimit:          4,
    scaleX:                    1,
    scaleY:                    1,
    angle:                     0,
    flipX:                     false,
    flipY:                     false,
    opacity:                   1,
    shadow:                    null,
    visible:                   true,
    backgroundColor:           '',
    text:                      'x',
    fontSize:                  40,
    fontWeight:                'normal',
    fontFamily:                'Times New Roman',
    fontStyle:                 'normal',
    lineHeight:                1.16,
    underline:                 false,
    overline:                  false,
    linethrough:               false,
    textAlign:                 'left',
    textBackgroundColor:       '',
    fillRule:                  'nonzero',
    paintFirst:                'fill',
    globalCompositeOperation:  'source-over',
    skewX:                      0,
    skewY:                      0,
    charSpacing:                0,
    styles:                     [],
    path:                       undefined,
    strokeUniform:              false,
    direction:                  'ltr',
    pathStartOffset:            0,
    pathSide:                   'left',
    pathAlign:                  'baseline'
  };

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Text);
    var text = createTextObject();

    assert.ok(text);
    assert.ok(text instanceof fabric.FabricText);
    assert.ok(text instanceof fabric.FabricObject);

    assert.equal(text.constructor.type, 'Text');
    assert.equal(text.get('text'), 'x');
  });

  QUnit.test('toString', function(assert) {
    var text = createTextObject();
    assert.ok(typeof text.toString === 'function');
    assert.equal(text.toString(), '#<Text (1): { "text": "x", "fontFamily": "Times New Roman" }>');
  });

  QUnit.test('_getFontDeclaration', function(assert) {
    var text = createTextObject();
    assert.ok(typeof text._getFontDeclaration === 'function', 'has a private method _getFontDeclaration');
    var fontDecl = text._getFontDeclaration();
    assert.ok(typeof fontDecl === 'string', 'it returns a string');
    assert.equal(fontDecl, 'normal normal 40px "Times New Roman"');
    text.fontFamily = '"Times New Roman"';
    fontDecl = text._getFontDeclaration();
    assert.equal(fontDecl, 'normal normal 40px "Times New Roman"');
    text.fontFamily = '\'Times New Roman\'';
    fontDecl = text._getFontDeclaration();
    assert.equal(fontDecl, 'normal normal 40px \'Times New Roman\'');
    fontDecl = text._getFontDeclaration({ fontFamily: 'Arial' });
    assert.equal(fontDecl, 'normal normal 40px \"Arial\"', 'passed style should take precedence');
  });

  QUnit.test('_getFontDeclaration with coma', function(assert) {
    var text = createTextObject();
    text.fontFamily = 'Arial, sans-serif';
    var fontDecl = text._getFontDeclaration();
    assert.equal(fontDecl, 'normal normal 40px Arial, sans-serif', 'if multiple font name detected no quotes added.');
  });

  fabric.Text.genericFonts.forEach(function(fontName) {
    QUnit.test('_getFontDeclaration with genericFonts', function(assert) {
      var text = createTextObject();
      text.fontFamily = fontName;
      var fontDecl = text._getFontDeclaration();
      assert.equal(fontDecl, 'normal normal 40px ' + fontName, 'it does not quote ' + fontName);
      text.fontFamily = fontName.toUpperCase();
      var fontDecl = text._getFontDeclaration();
      assert.equal(fontDecl, 'normal normal 40px ' + fontName.toUpperCase(), 'it uses a non case sensitive logic');
    });
  });

  QUnit.test('complexity', function(assert) {
    var text = createTextObject();
    assert.ok(typeof text.complexity === 'function');
    assert.equal(text.complexity(), 1);
  });

  QUnit.test('set', function(assert) {
    var text = createTextObject();
    assert.ok(typeof text.set === 'function');
    assert.equal(text.set('text', 'bar'), text, 'should be chainable');

    text.set({ left: 1234, top: 2345, angle: 55 });

    assert.equal(text.get('left'), 1234);
    assert.equal(text.get('top'), 2345);
    assert.equal(text.get('angle'), 55);
  });

  QUnit.test('lineHeight with single line', function(assert) {
    var text = createTextObject();
    text.text = 'text with one line';
    text.lineHeight = 2;
    text.initDimensions();
    var height = text.height;
    text.lineHeight = 0.5;
    text.initDimensions();
    var heightNew = text.height;
    assert.equal(height, heightNew, 'text height does not change with one single line');
  });

  QUnit.test('lineHeight with multi line', function(assert) {
    var text = createTextObject();
    text.text = 'text with\ntwo lines';
    text.lineHeight = 0.1;
    text.initDimensions();
    var height = text.height,
        minimumHeight = text.fontSize * text._fontSizeMult;
    assert.equal(height > minimumHeight, true, 'text height is always bigger than minimum Height');
  });

  QUnit.test('set with "hash"', function(assert) {
    var text = createTextObject();

    text.set({ opacity: 0.123, fill: 'red', fontFamily: 'blah' });

    assert.equal(text.opacity, 0.123);
    assert.equal(text.fill, 'red');
    assert.equal(text.fontFamily, 'blah');
  });

  QUnit.test('get bounding rect after init', function(assert) {
    var string = 'Some long text, the quick brown fox jumps over the lazy dog etc... blah blah blah';
    var text = new fabric.Text(string, {
      left: 30,
      top: 30,
      fill: '#ffffff',
      fontSize: 24,
      fontWeight: 'normal',
      fontFamily: 'Arial',
      originY: 'bottom'
    });
    var br = text.getBoundingRect();
    text.setCoords();
    var br2 = text.getBoundingRect();
    assert.deepEqual(br, br2, 'text bounding box is the same before and after calling setCoords');
  });

  QUnit.test('fabric.Text.fromElement', function(assert) {
    assert.ok(typeof fabric.Text.fromElement === 'function');

    var elText = fabric.getFabricDocument().createElement('text');
    elText.textContent = 'x';

    fabric.Text.fromElement(elText, function(text) {
      assert.ok(text instanceof fabric.FabricText);
      var expectedObject = {
        ...REFERENCE_TEXT_OBJECT,
        left: 0,
        top: -14.05,
        width: 8,
        height: 18.08,
        fontSize: 16,
        originX: 'left'
      };
      assert.deepEqual(text.toObject(), expectedObject, 'parsed object is what expected');
    });
  });

  QUnit.test('fabric.Text.fromElement with custom attributes', function(assert) {
    var done = assert.async();
    var namespace = 'http://www.w3.org/2000/svg';
    var elTextWithAttrs = fabric.getFabricDocument().createElementNS(namespace, 'text');
    elTextWithAttrs.textContent = 'x';

    elTextWithAttrs.setAttributeNS(namespace, 'x', 10);
    elTextWithAttrs.setAttributeNS(namespace, 'y', 20);
    elTextWithAttrs.setAttributeNS(namespace, 'fill', 'rgb(255,255,255)');
    elTextWithAttrs.setAttributeNS(namespace, 'opacity', 0.45);
    elTextWithAttrs.setAttributeNS(namespace, 'stroke', 'blue');
    elTextWithAttrs.setAttributeNS(namespace, 'stroke-width', 3);
    elTextWithAttrs.setAttributeNS(namespace, 'stroke-dasharray', '5, 2');
    elTextWithAttrs.setAttributeNS(namespace, 'stroke-linecap', 'round');
    elTextWithAttrs.setAttributeNS(namespace, 'stroke-linejoin', 'bevel');
    elTextWithAttrs.setAttributeNS(namespace, 'stroke-miterlimit', 5);
    elTextWithAttrs.setAttributeNS(namespace, 'font-family', 'Monaco');
    elTextWithAttrs.setAttributeNS(namespace, 'font-style', 'italic');
    elTextWithAttrs.setAttributeNS(namespace, 'font-weight', 'bold');
    elTextWithAttrs.setAttributeNS(namespace, 'font-size', '123');
    elTextWithAttrs.setAttributeNS(namespace, 'letter-spacing', '1em');
    elTextWithAttrs.setAttributeNS(namespace, 'text-decoration', 'underline');
    elTextWithAttrs.setAttributeNS(namespace, 'text-anchor', 'middle');

    fabric.Text.fromElement(elTextWithAttrs).then((textWithAttrs) => {
      // temp workaround for text objects not obtaining width under node
      textWithAttrs.width = CHAR_WIDTH;

      assert.ok(textWithAttrs instanceof fabric.FabricText);

      var expectedObject = {
        ...REFERENCE_TEXT_OBJECT,
        /* left varies slightly due to node-canvas rendering */
        left:             fabric.util.toFixed(textWithAttrs.left + '', 2),
        top:              -88.03,
        width:            CHAR_WIDTH,
        height:           138.99,
        fill:             'rgb(255,255,255)',
        opacity:          0.45,
        stroke:           'blue',
        strokeWidth:      3,
        strokeDashArray:  [5, 2],
        strokeLineCap:    'round',
        strokeLineJoin:   'bevel',
        strokeMiterLimit: 5,
        fontFamily:       'Monaco',
        paintFirst:       'fill',
        fontStyle:        'italic',
        charSpacing:      1000,
        fontWeight:       'bold',
        fontSize:         123,
        underline:        true,
      };
      assert.deepEqual(textWithAttrs.toObject(), expectedObject);
      done();
    });
  });

  QUnit.test('dimensions after text change', function(assert) {
    var text = new fabric.Text('x');
    assert.equal(text.width, CHAR_WIDTH);

    text.set('text', 'xx');
    assert.equal(text.width, CHAR_WIDTH * 2);
  });

  QUnit.test('dimensions without text', function(assert) {
    var text = new fabric.Text('');
    assert.equal(text.width, 2);
  });

  QUnit.test('setting fontFamily', function(assert) {
    var text = new fabric.Text('x');
    text.path = 'foobar.js';

    text.set('fontFamily', 'foobar');
    assert.equal(text.get('fontFamily'), 'foobar');

    text.set('fontFamily', '"Arial Black", Arial');
    assert.equal(text.get('fontFamily'), '"Arial Black", Arial');
  });

  QUnit.test('text styleHas', function(assert) {
    var text = new fabric.Text('xxxxxx\nx y');
    text.styles = { };
    assert.ok(typeof text.styleHas === 'function');
    assert.equal(text.styleHas('stroke'), false, 'the text style has no stroke');
    text.styles = { 1: { 0: { stroke: 'red' }}};
    assert.equal(text.styleHas('stroke'), true, 'the text style has stroke');
  });

  QUnit.test('text cleanStyle', function(assert) {
    var text = new fabric.Text('xxxxxx\nx y');
    text.styles = { 1: { 0: { stroke: 'red' }}};
    text.stroke = 'red';
    assert.ok(typeof text.cleanStyle === 'function');
    text.cleanStyle('stroke');
    assert.equal(text.styles[1], undefined, 'the style has been cleaned since stroke was equal to text property');
    text.styles = { 1: { 0: { stroke: 'blue' }}};
    text.stroke = 'red';
    text.cleanStyle('stroke');
    assert.equal(text.styles[1][0].stroke, 'blue', 'nothing to clean, style untouched');
  });

  QUnit.test('text cleanStyle with different sub styles styles', function(assert) {
    var text = new fabric.Text('xxxxxx\nx y');
    text.styles = { 1: { 0: { fill: 'red' }, 1: { stroke: 'red' }, 2: { stroke: 'blue' }}};
    text.stroke = 'red';
    text.cleanStyle('stroke');
    assert.equal(text.stroke, 'red', 'the stroke stays red');
    assert.equal(text.styles[1][0].fill, 'red', 'the style has not been changed since it\'s a different property');
    assert.equal(text.styles[1][0].stroke, undefined, 'the style has been cleaned since stroke was equal to text property');
    assert.equal(text.styles[1][1], undefined, 'the style remains undefined');
    assert.equal(text.styles[1][2].stroke, 'blue', 'the style remains unchanged');
  });

  QUnit.test('text cleanStyle with undefined and set styles', function(assert) {
    var text = new fabric.Text('xxxxxx\nx y');
    text.styles = { 1: { 1: { stroke: 'red' }, 3: { stroke: 'red' }}};
    text.stroke = 'red';
    text.cleanStyle('stroke');
    assert.equal(text.stroke, 'red', 'the stroke stays red');
    assert.equal(text.styles[1], undefined, 'the style has been cleaned since stroke was equal to text property');
  });

  QUnit.test('text cleanStyle with empty styles', function(assert) {
    var text = new fabric.Text('xxxxxx\nx y');
    text.styles = { 1: { 0: { }, 1: { }}, 2: { }, 3: { 4: { }}};
    text.cleanStyle('any');
    assert.equal(text.styles[1], undefined, 'the style has been cleaned since there was no useful information');
    assert.equal(text.styles[2], undefined, 'the style has been cleaned since there was no useful information');
    assert.equal(text.styles[3], undefined, 'the style has been cleaned since there was no useful information');
  });

  QUnit.test('text cleanStyle with full style', function(assert) {
    var text = new fabric.Text('xxx');
    text.styles = { 0: { 0: { fill: 'blue' }, 1:  { fill: 'blue' }, 2:  { fill: 'blue' }}};
    text.fill = 'black';
    text.cleanStyle('fill');
    assert.equal(text.fill, 'blue', 'the fill has been changed to blue');
    assert.equal(text.styles[0], undefined, 'all the style has been removed');
  });

  QUnit.test('text cleanStyle with no relevant style', function(assert) {
    var text = new fabric.Text('xxx');
    text.styles = { 0: { 0: { other: 'value1' }, 1:  { other: 'value2' }, 2:  { other: 'value3' }}};
    text.fill = 'black';
    text.cleanStyle('fill');
    assert.equal(text.fill, 'black', 'the fill remains black');
    assert.equal(text.styles[0][0].other, 'value1', 'style remains the same');
    assert.equal(text.styles[0][0].full, undefined, 'style remains undefined');
    assert.equal(text.styles[0][1].other, 'value2', 'style remains the same');
    assert.equal(text.styles[0][1].full, undefined, 'style remains undefined');
    assert.equal(text.styles[0][2].other, 'value3', 'style remains the same');
    assert.equal(text.styles[0][2].full, undefined, 'style remains undefined');
  });

  QUnit.test('text removeStyle with some style', function(assert) {
    var text = new fabric.Text('xxx');
    text.styles = { 0: { 0: { stroke: 'black', fill: 'blue' }, 1:  { fill: 'blue' }, 2:  { fill: 'blue' }}};
    assert.ok(typeof text.removeStyle === 'function');
    text.fill = 'red';
    text.removeStyle('fill');
    assert.equal(text.fill, 'red', 'the fill has not been changed');
    assert.equal(text.styles[0][0].stroke, 'black', 'the non fill part of the style is still there');
    assert.equal(text.styles[0][0].fill, undefined, 'the fill part of the style has been removed');
    text.styles = { 0: { 0: { fill: 'blue' }, 1:  { fill: 'blue' }, 2:  { fill: 'blue' }}};
    text.removeStyle('fill');
    assert.equal(text.styles[0], undefined, 'the styles got empty and has been removed');
  });

  QUnit.test('text toObject removes empty style object', function(assert) {
    var text = new fabric.Text('xxx');
    text.styles = { 0: { 0: {} } };
    var obj = text.toObject();
    assert.deepEqual(obj.styles, [], 'empty style object has been removed');
  });

  QUnit.test('text toObject can handle style objects with only a textBackgroundColor property', function(assert) {
    var text = new fabric.Text('xxx');
    text.styles = { 0: { 0: { textBackgroundColor: 'blue' } } };
    var obj = text.toObject();
    assert.deepEqual(
      obj.styles,
      [{ start: 0, end: 1, style: { textBackgroundColor: 'blue' }}],
      'styles with only a textBackgroundColor property do not throw an error'
    );
  });

  QUnit.test('getFontCache works with fontWeight numbers', function(assert) {
    var text = new fabric.Text('xxx', { fontWeight: 400 });
    text.initDimensions();
    var cache = fabric.cache.charWidthsCache[text.fontFamily.toLowerCase()];
    var cacheProp = text.fontStyle + '_400';
    assert.equal(cacheProp in cache, true, '400 is converted to string');
  });

  QUnit.test('getFontCache is case insensitive', function(assert) {
    var text = new fabric.Text('xxx', { fontWeight: 'BOld', fontStyle: 'NormaL' });
    text.initDimensions();
    var text2 = new fabric.Text('xxx', { fontWeight: 'bOLd', fontStyle: 'nORMAl' });
    text2.initDimensions();
    var cache = fabric.cache.getFontCache(text);
    var cache2 = fabric.cache.getFontCache(text2);
    assert.equal(cache, cache2, 'you get the same cache');
  });
  // moved
  QUnit.test('getSelectionStyles with no arguments', function(assert) {
    var iText = new fabric.Text('test foo bar-baz\nqux', {
      styles: {
        0: {
          0: { textDecoration: 'underline' },
          2: { textDecoration: 'overline' },
          4: { textBackgroundColor: '#ffc' }
        },
        1: {
          0: { fill: 'red' },
          1: { fill: 'green' },
          2: { fill: 'blue' }
        }
      }
    });

    assert.equal(typeof iText.getSelectionStyles, 'function');

    assert.deepEqual(iText.getSelectionStyles(), []);

  });

  QUnit.test('getSelectionStyles with 2 args', function(assert) {
    var iText = new fabric.Text('test foo bar-baz\nqux', {
      styles: {
        0: {
          0: { textDecoration: 'underline' },
          2: { textDecoration: 'overline' },
          4: { textBackgroundColor: '#ffc' }
        },
        1: {
          0: { fill: 'red' },
          1: { fill: 'green' },
          2: { fill: 'blue' }
        }
      }
    });

    assert.deepEqual(iText.getSelectionStyles(0, 5), [
      { textDecoration: 'underline' },
      {},
      { textDecoration: 'overline' },
      {},
      { textBackgroundColor: '#ffc' },
    ]);

    assert.deepEqual(iText.getSelectionStyles(2, 2), [
    ]);
  });

  QUnit.test('setSelectionStyles', function(assert) {
    var iText = new fabric.Text('test foo bar-baz\nqux', {
      styles: {
        0: {
          0: { fill: '#112233' },
          2: { stroke: '#223344' }
        }
      }
    });

    assert.equal(typeof iText.setSelectionStyles, 'function');

    iText.setSelectionStyles({
      fill: 'red',
      stroke: 'yellow'
    });

    assert.deepEqual(iText.styles[0][0], {
      fill: '#112233'
    });

    iText.setSelectionStyles({
      fill: 'red',
      stroke: 'yellow'
    }, 0, 1);

    assert.deepEqual(iText.styles[0][0], {
      fill: 'red',
      stroke: 'yellow'
    });

    iText.setSelectionStyles({
      fill: '#998877',
      stroke: 'yellow'
    }, 2, 3);

    assert.deepEqual(iText.styles[0][2], {
      fill: '#998877',
      stroke: 'yellow'
    });
  });

  QUnit.test('getStyleAtPosition', function(assert) {
    var iText = new fabric.Text('test foo bar-baz\nqux', {
      styles: {
        0: {
          0: { textDecoration: 'underline' },
          2: { textDecoration: 'overline' },
          4: { textBackgroundColor: '#ffc' }
        },
        1: {
          0: { fill: 'red' },
          1: { fill: 'green' },
          2: { fill: 'blue' }
        }
      }
    });

    assert.equal(typeof iText.getStyleAtPosition, 'function');

    assert.deepEqual(iText.getStyleAtPosition(2), { textDecoration: 'overline' });

    assert.deepEqual(iText.getStyleAtPosition(1), { });

    assert.deepEqual(iText.getStyleAtPosition(18), { fill: 'green' });
  });

  QUnit.test('getStyleAtPosition complete', function(assert) {
    var iText = new fabric.Text('test foo bar-baz\nqux', {
      styles: {
        0: {
          0: { underline: true },
          2: { overline: true },
          4: { textBackgroundColor: '#ffc' }
        },
        1: {
          0: { fill: 'red' },
          1: { fill: 'green' },
          2: { fill: 'blue' }
        }
      }
    });

    var expectedStyle0 = {
      stroke: null,
      strokeWidth: 1,
      fill: 'rgb(0,0,0)',
      fontFamily: 'Times New Roman',
      fontSize: 40,
      fontWeight: 'normal',
      fontStyle: 'normal',
      underline: true,
      overline: false,
      linethrough: false,
      textBackgroundColor: '',
      deltaY: 0,
    };

    var expectedStyle2 = {
      stroke: null,
      strokeWidth: 1,
      fill: 'rgb(0,0,0)',
      fontFamily: 'Times New Roman',
      fontSize: 40,
      fontWeight: 'normal',
      fontStyle: 'normal',
      underline: false,
      overline: true,
      linethrough: false,
      textBackgroundColor: '',
      deltaY: 0,
    };

    assert.equal(typeof iText.getStyleAtPosition, 'function');

    assert.deepEqual(iText.getStyleAtPosition(0, true), expectedStyle0, 'styles do match at 0');

    assert.deepEqual(iText.getStyleAtPosition(2, true), expectedStyle2, 'styles do match at 2');
  });

  QUnit.test('getSvgSpanStyles produces correct output', function(assert) {
    var iText = new fabric.IText('test foo bar-baz');
    var styleObject = {
      fill: 'red',
      strokeWidth: 30,
      fontFamily: 'Verdana',
      fontSize: 25,
    };
    var styleString = iText.getSvgSpanStyles(styleObject);
    var expected = 'stroke-width: 30; font-family: \'Verdana\'; font-size: 25px; fill: rgb(255,0,0); ';
    assert.equal(styleString, expected, 'style is as expected');
  });
  QUnit.test('getSvgSpanStyles produces correct output with useWhiteSpace', function(assert) {
    var iText = new fabric.IText('test foo bar-baz');
    var styleObject = {
      fill: 'red',
      strokeWidth: 30,
      fontFamily: 'Verdana',
      fontSize: 25,
    };
    var styleString = iText.getSvgSpanStyles(styleObject, true);
    var expected = 'stroke-width: 30; font-family: \'Verdana\'; font-size: 25px; fill: rgb(255,0,0); white-space: pre; ';
    assert.equal(styleString, expected, 'style is as expected');
  });
  QUnit.test('getSvgTextDecoration with overline true produces correct output', function(assert){
    var iText = new fabric.IText('test foo bar-baz');
    var styleObject = {
      overline: true,
    };
    var styleString = iText.getSvgTextDecoration(styleObject);
    var expected = 'overline';
    assert.equal(styleString, expected, 'style is as expected');
  });
  QUnit.test('getSvgTextDecoration with overline underline true produces correct output', function(assert){
    var iText = new fabric.IText('test foo bar-baz');
    var styleObject = {
      overline: true,
      underline: true,
    };
    var styleString = iText.getSvgTextDecoration(styleObject);
    var expected = 'overline underline';
    assert.equal(styleString, expected, 'style is as expected with overline underline');
  });
  QUnit.test('getSvgTextDecoration with overline underline true produces correct output', function(assert){
    var iText = new fabric.IText('test foo bar-baz');
    var styleObject = {
      overline: true,
      underline: true,
      linethrough: true,
    };
    var styleString = iText.getSvgTextDecoration(styleObject);
    var expected = 'overline underline line-through';
    assert.equal(styleString, expected, 'style is as expected with overline underline');
  });

  QUnit.test('getSvgTextDecoration with overline underline true produces correct output', function(assert){
    var iText = new fabric.IText('test foo bar-baz');
    var styleObject = {
      overline: true,
      underline: true,
      linethrough: true,
    };
    var styleString = iText.getSvgTextDecoration(styleObject);
    var expected = 'overline underline line-through';
    assert.equal(styleString, expected, 'style is as expected with overline underline');
  });

  QUnit.test('getHeightOfLine measures height of aline', function(assert) {
    var text = new fabric.Text('xxx\n');
    var height1 = text.getHeightOfLine(0);
    var height2 = text.getHeightOfLine(1);
    assert.equal(Math.round(height1), 52, 'height of line with text is ok');
    assert.equal(Math.round(height2), 52, 'height of empty line is ok');
    assert.equal(height1, height2, 'should have same height');
  });

  QUnit.test('_measureChar handles 0 width chars', function(assert) {
    fabric.cache.clearFontCache();
    var zwc =  '\u200b';
    var text = new fabric.Text('');
    var style = text.getCompleteStyleDeclaration(0, 0);
    var box = text._measureChar('a', style, zwc, style);
    var box2 = text._measureChar('a', style, zwc, style);
    assert.equal(fabric.cache.charWidthsCache[text.fontFamily.toLowerCase()].normal_normal[zwc], 0, 'zwc is a 0 width char');
    assert.equal(box.kernedWidth, box2.kernedWidth, '2 measurements of the same string return the same number');
  });

  QUnit.test('_deleteStyleDeclaration', function(assert) {
    var text = new fabric.Text('aaa aaq ggg gg oee eee', {
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
    text._deleteStyleDeclaration(0, 10);
    assert.equal(text.styles[0][10], undefined, 'style has been removed');
  });

  QUnit.test('_setStyleDeclaration', function(assert) {
    var text = new fabric.Text('aaa aaq ggg gg oee eee', {
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
    assert.equal(typeof text._setStyleDeclaration, 'function', 'function exists');
    var newStyle = { fontSize: 10 };
    text._setStyleDeclaration(0, 10, newStyle);
    assert.equal(text.styles[0][10], newStyle, 'style has been changed');
  });

  QUnit.test('styleHas', function(assert) {
    var textbox = new fabric.Textbox('aaa\naaq ggg gg oee eee', {
      styles: {
        0: {
          0: { fontSize: 4 },
          1: { fontSize: 4 },
          2: { fontSize: 4 },
        },
        1: {
          0: { fontFamily: 'Arial' },
          1: { fontFamily: 'Arial' },
          2: { fontFamily: 'Arial' },
        },
      },
      width: 5,
    });
    assert.equal(textbox.styleHas('fontSize'), true, 'style has fontSize');
    assert.equal(textbox.styleHas('fontSize', 0), true, 'style has fontSize on line 0');
    assert.equal(textbox.styleHas('fontSize', 1), false, 'style does not have fontSize on line 1');
    assert.equal(textbox.styleHas('fontFamily'), true, 'style has fontFamily');
    assert.equal(textbox.styleHas('fontFamily', 0), false, 'style does not have fontFamily on line 0');
    assert.equal(textbox.styleHas('fontFamily', 1), true, 'style has fontFamily on line 1');
  });

  QUnit.test('text with a path', function(assert) {
    var text = new fabric.Text('a', {
      path: new fabric.Path('M0 0 h 100 v 100 h -100 z')
    });
    assert.ok(text.path, 'text has a path');
    assert.ok(text.path.segmentsInfo, 'text has segmentsInfo calculated');
    assert.equal(text.width, 100, 'text is big as the path width');
    assert.equal(text.height, 100, 'text is big as the path height');
  });

  QUnit.test('text with a path toObject', function(assert) {
    var text = new fabric.Text('a', {
      path: new fabric.Path('M0 0 h 100 v 100 h -100 z')
    });
    var toObject = text.toObject();
    assert.ok(toObject.path, 'export has a path');
  });

  QUnit.test('text with a path fromObject', function(assert) {
    var done = assert.async();
    var text = new fabric.Text('a', {
      path: new fabric.Path('M0 0 h 100 v 100 h -100 z')
    });
    var toObject = text.toObject();
    fabric.Text.fromObject(toObject).then(function(text) {
      assert.equal(text.path.constructor.type, 'Path', 'the path is restored');
      assert.ok(text.path instanceof fabric.Path, 'the path is a path');
      assert.ok(toObject.path, 'the input has still a path property');
      done();
    });
  });

  QUnit.test('cacheProperties for text', function(assert) {
    var text = new fabric.Text('a');
    assert.equal(fabric.Text.cacheProperties.join('-'), 'fill-stroke-strokeWidth-strokeDashArray-width-height-paintFirst-strokeUniform-strokeLineCap-strokeDashOffset-strokeLineJoin-strokeMiterLimit-backgroundColor-clipPath-fontSize-fontWeight-fontFamily-fontStyle-lineHeight-text-charSpacing-textAlign-styles-path-pathStartOffset-pathSide-pathAlign-underline-overline-linethrough-textBackgroundColor-direction');
  });

  QUnit.test('_getLineLeftOffset', function(assert) {
    var text = new fabric.Text('long line of text\nshort');
    assert.equal(text._getLineLeftOffset(1), 0, 'with align left is 0');
    text.textAlign = 'right';
    assert.equal(Math.round(text._getLineLeftOffset(1)), 174, 'with align right is diff between width and lineWidth');
    text.textAlign = 'center';
    assert.equal(Math.round(text._getLineLeftOffset(1)), 87, 'with align center is split in 2');
    text.textAlign = 'justify';
    assert.equal(text._getLineLeftOffset(1), 0);
    text.textAlign = 'justify-center';
    assert.equal(text._getLineLeftOffset(0), 0, 'is zero for any line but not the last center');
    assert.equal(Math.round(text._getLineLeftOffset(1)), 87, 'like align center');
    text.textAlign = 'justify-left';
    assert.equal(text._getLineLeftOffset(0), 0, 'is zero for any line but not the last left');
    assert.equal(text._getLineLeftOffset(1), 0, 'like align left');
    text.textAlign = 'justify-right';
    assert.equal(text._getLineLeftOffset(0), 0, 'is zero for any line but not the last right');
    assert.equal(Math.round(text._getLineLeftOffset(1)), 174, 'like align right');
  });

  QUnit.test('_getLineLeftOffset with direction rtl', function(assert) {
    var text = new fabric.Text('long line of text\nshort');
    text.direction = 'rtl';
    assert.equal(Math.round(text._getLineLeftOffset(1)), -174, 'with align left is diff between width and lineWidth, negative');
    text.textAlign = 'right';
    assert.equal(text._getLineLeftOffset(1), 0, 'with align right is 0');
    text.textAlign = 'center';
    assert.equal(Math.round(text._getLineLeftOffset(1)), -87, 'with align center is split in 2');
    text.textAlign = 'justify';
    assert.equal(text._getLineLeftOffset(1), 0);
    text.textAlign = 'justify-center';
    assert.equal(text._getLineLeftOffset(0), 0, 'is zero for any line but not the last center');
    assert.equal(Math.round(text._getLineLeftOffset(1)), -87, 'like align center');
    text.textAlign = 'justify-left';
    assert.equal(text._getLineLeftOffset(0), 0, 'is zero for any line but not the last left');
    assert.equal(Math.round(text._getLineLeftOffset(1)), -174, 'like align left with rtl');
    text.textAlign = 'justify-right';
    assert.equal(text._getLineLeftOffset(0), 0, 'is zero for any line but not the last right');
    assert.equal(text._getLineLeftOffset(1), 0, 'like align right with rtl');
  });

})();
