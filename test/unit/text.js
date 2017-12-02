(function() {

  QUnit.module('fabric.Text');

  function createTextObject(text) {
    return new fabric.Text(text || 'x');
  }

  function removeTranslate(str) {
    return str.replace(/translate\(.*?\)/, '');
  }

  var CHAR_WIDTH = 20;

  var REFERENCE_TEXT_OBJECT = {
    'version':                   fabric.version,
    'type':                      'text',
    'originX':                   'left',
    'originY':                   'top',
    'left':                      0,
    'top':                       0,
    'width':                     CHAR_WIDTH,
    'height':                    45.2,
    'fill':                      'rgb(0,0,0)',
    'stroke':                    null,
    'strokeWidth':               1,
    'strokeDashArray':           null,
    'strokeLineCap':             'butt',
    'strokeLineJoin':            'miter',
    'strokeMiterLimit':          10,
    'scaleX':                    1,
    'scaleY':                    1,
    'angle':                     0,
    'flipX':                     false,
    'flipY':                     false,
    'opacity':                   1,
    'shadow':                    null,
    'visible':                   true,
    'clipTo':                    null,
    'backgroundColor':           '',
    'text':                      'x',
    'fontSize':                  40,
    'fontWeight':                'normal',
    'fontFamily':                'Times New Roman',
    'fontStyle':                 'normal',
    'lineHeight':                1.16,
    'underline':                 false,
    'overline':                  false,
    'linethrough':               false,
    'textAlign':                 'left',
    'textBackgroundColor':       '',
    'fillRule':                  'nonzero',
    'paintFirst':               'fill',
    'globalCompositeOperation':  'source-over',
    'skewX':                      0,
    'skewY':                      0,
    'transformMatrix':            null,
    'charSpacing':                0,
    'styles':                     {}
  };

  var TEXT_SVG = '\t<g transform="translate(10.5 26.72)">\n\t\t<text xml:space="preserve" font-family="Times New Roman" font-size="40" font-style="normal" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-10" y="12.57" >x</tspan></text>\n\t</g>\n';
  var TEXT_SVG_JUSTIFIED = '\t<g transform="translate(50.5 26.72)">\n\t\t<text xml:space="preserve" font-family="Times New Roman" font-size="40" font-style="normal" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-60" y="-13.65" >xxxxxx</tspan><tspan x="-60" y="38.78" style="white-space: pre; ">x </tspan><tspan x=\"40\" y=\"38.78\" >y</tspan></text>\n\t</g>\n';

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Text);
    var text = createTextObject();

    assert.ok(text);
    assert.ok(text instanceof fabric.Text);
    assert.ok(text instanceof fabric.Object);

    assert.equal(text.get('type'), 'text');
    assert.equal(text.get('text'), 'x');
  });

  QUnit.test('toString', function(assert) {
    var text = createTextObject();
    assert.ok(typeof text.toString === 'function');
    assert.equal(text.toString(), '#<fabric.Text (1): { "text": "x", "fontFamily": "Times New Roman" }>');
  });

  QUnit.test('_getFontDeclaration', function(assert) {
    var text = createTextObject();
    assert.ok(typeof text._getFontDeclaration === 'function', 'has a private method _getFontDeclaration');
    var fontDecl = text._getFontDeclaration();
    assert.ok(typeof fontDecl == 'string', 'it returns a string');
    if (fabric.isLikelyNode) {
      assert.equal(fontDecl, 'normal normal 40px "Times New Roman"');
    }
    else {
      assert.equal(fontDecl, 'normal normal 40px Times New Roman');
    }

  });

  QUnit.test('toObject', function(assert) {
    var text = createTextObject();
    assert.ok(typeof text.toObject === 'function');
    assert.deepEqual(text.toObject(), REFERENCE_TEXT_OBJECT);
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

  QUnit.test('setShadow', function(assert) {
    var text = createTextObject();
    assert.ok(typeof text.setShadow === 'function');
    assert.equal(text.setShadow('10px 8px 2px red'), text, 'should be chainable');

    assert.ok(text.shadow instanceof fabric.Shadow, 'should inherit from fabric.Shadow');
    assert.equal(text.shadow.color, 'red');
    assert.equal(text.shadow.offsetX, 10);
    assert.equal(text.shadow.offsetY, 8);
    assert.equal(text.shadow.blur, 2);
  });

  QUnit.test('fabric.Text.fromObject', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.Text.fromObject === 'function');
    fabric.Text.fromObject(REFERENCE_TEXT_OBJECT, function(text) {
      assert.deepEqual(text.toObject(), REFERENCE_TEXT_OBJECT);
      done();
    });
  });

  QUnit.test('fabric.Text.fromElement', function(assert) {
    assert.ok(typeof fabric.Text.fromElement === 'function');

    var elText = fabric.document.createElement('text');
    elText.textContent = 'x';

    fabric.Text.fromElement(elText, function(text) {
      assert.ok(text instanceof fabric.Text);
      var expectedObject = fabric.util.object.extend(fabric.util.object.clone(REFERENCE_TEXT_OBJECT), {
        left: 0,
        top: -14.59,
        width: 8,
        height: 18.08,
        fontSize: 16,
        originX: 'left'
      });
      assert.deepEqual(text.toObject(), expectedObject, 'parsed object is what expected');
    });
  });

  QUnit.test('fabric.Text.fromElement with custom attributes', function(assert) {

    var elTextWithAttrs = fabric.document.createElement('text');
    elTextWithAttrs.textContent = 'x';

    elTextWithAttrs.setAttribute('x', 10);
    elTextWithAttrs.setAttribute('y', 20);
    elTextWithAttrs.setAttribute('fill', 'rgb(255,255,255)');
    elTextWithAttrs.setAttribute('opacity', 0.45);
    elTextWithAttrs.setAttribute('stroke', 'blue');
    elTextWithAttrs.setAttribute('stroke-width', 3);
    elTextWithAttrs.setAttribute('stroke-dasharray', '5, 2');
    elTextWithAttrs.setAttribute('stroke-linecap', 'round');
    elTextWithAttrs.setAttribute('stroke-linejoin', 'bevil');
    elTextWithAttrs.setAttribute('stroke-miterlimit', 5);
    elTextWithAttrs.setAttribute('font-family', 'Monaco');
    elTextWithAttrs.setAttribute('font-style', 'italic');
    elTextWithAttrs.setAttribute('font-weight', 'bold');
    elTextWithAttrs.setAttribute('font-size', '123');
    elTextWithAttrs.setAttribute('text-decoration', 'underline');
    elTextWithAttrs.setAttribute('text-anchor', 'middle');

    fabric.Text.fromElement(elTextWithAttrs, function(textWithAttrs) {
      // temp workaround for text objects not obtaining width under node
      textWithAttrs.width = CHAR_WIDTH;

      assert.ok(textWithAttrs instanceof fabric.Text);

      var expectedObject = fabric.util.object.extend(fabric.util.object.clone(REFERENCE_TEXT_OBJECT), {
        /* left varies slightly due to node-canvas rendering */
        left:             fabric.util.toFixed(textWithAttrs.left + '', 2),
        top:              -82.43,
        width:            CHAR_WIDTH,
        height:           138.99,
        fill:             'rgb(255,255,255)',
        opacity:          0.45,
        stroke:           'blue',
        strokeWidth:      3,
        strokeDashArray:  [5, 2],
        strokeLineCap:    'round',
        strokeLineJoin:   'bevil',
        strokeMiterLimit: 5,
        fontFamily:       'Monaco',
        paintFirst:       'fill',
        fontStyle:        'italic',
        fontWeight:       'bold',
        fontSize:         123,
        underline:        true,
      });

      assert.deepEqual(textWithAttrs.toObject(), expectedObject);
    });
  });

  QUnit.test('empty fromElement', function(assert) {
    fabric.Text.fromElement(null, function(text) {
      assert.equal(text, null);
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

  QUnit.test('toSVG', function(assert) {
    var text = new fabric.Text('x');

    // temp workaround for text objects not obtaining width under node
    text.width = CHAR_WIDTH;

    assert.equal(removeTranslate(text.toSVG()), removeTranslate(TEXT_SVG));

    text.set('fontFamily', '"Arial Black", Arial');
    // temp workaround for text objects not obtaining width under node
    text.width = CHAR_WIDTH;

    assert.equal(removeTranslate(text.toSVG()), removeTranslate(TEXT_SVG.replace('font-family="Times New Roman"', 'font-family="\'Arial Black\', Arial"')));
  });
  QUnit.test('toSVG justified', function(assert) {
    var text = new fabric.Text('xxxxxx\nx y', {
      textAlign: 'justify',
    });

    assert.equal(removeTranslate(text.toSVG()), removeTranslate(TEXT_SVG_JUSTIFIED));
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

  QUnit.test('text cleanStyle with empty styles', function(assert) {
    var text = new fabric.Text('xxxxxx\nx y');
    text.styles = { 1: { 0: { }, 1: { }}, 2: { }, 3: { 4: { }}};
    text.cleanStyle('any');
    assert.equal(text.styles[1], undefined, 'the style has been cleaned since there were no usefull informations');
    assert.equal(text.styles[2], undefined, 'the style has been cleaned since there were no usefull informations');
    assert.equal(text.styles[3], undefined, 'the style has been cleaned since there were no usefull informations');
  });

  QUnit.test('text cleanStyle with full style', function(assert) {
    var text = new fabric.Text('xxx');
    text.styles = { 0: { 0: { fill: 'blue' }, 1:  { fill: 'blue' }, 2:  { fill: 'blue' }}};
    text.fill = 'black';
    text.cleanStyle('fill');
    assert.equal(text.fill, 'blue', 'the fill has been changed to blue');
    assert.equal(text.styles[0], undefined, 'all the style has been removed');
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

  QUnit.test('getFontCache works with fontWeight numbers', function(assert) {
    var text = new fabric.Text('xxx', { fontWeight: 400 });
    text.initDimensions();
    var cache = fabric.charWidthsCache[text.fontFamily.toLowerCase()];
    var cacheProp = text.fontStyle + '_400';
    assert.equal(cacheProp in cache, true, '400 is converted to string');
  });

  QUnit.test('getFontCache is case insensitive', function(assert) {
    var text = new fabric.Text('xxx', { fontWeight: 'BOld', fontStyle: 'NormaL' });
    text.initDimensions();
    var text2 = new fabric.Text('xxx', { fontWeight: 'bOLd', fontStyle: 'nORMAl' });
    text2.initDimensions();
    var cache = text.getFontCache(text);
    var cache2 = text2.getFontCache(text2);
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

  QUnit.test('_splitText', function(assert) {
    var text = new fabric.Text('test foo bar-baz\nqux', {});
    var test = text._splitText();
    assert.equal(test.lines[0], 'test foo bar-baz', 'first line is correct');
    assert.equal(test.lines[1], 'qux', 'second line is correct');
    assert.deepEqual(test.graphemeLines[0], ['t','e','s','t',' ','f','o','o',' ','b','a','r','-','b','a','z'], 'first line is correct');
    assert.deepEqual(test.graphemeLines[1], ['q','u','x'], 'second line is correct');
  });

  QUnit.test('getStyleAtPosition complete', function(assert) {
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

    assert.deepEqual(iText.getStyleAtPosition(2, true), {
      stroke: null,
      strokeWidth: 1,
      fill: 'rgb(0,0,0)',
      fontFamily: 'Times New Roman',
      fontSize: 40,
      fontWeight: 'normal',
      fontStyle: 'normal',
      underline: false,
      overline: false,
      linethrough: false,
      textBackgroundColor: ''
    });
  });
})();
