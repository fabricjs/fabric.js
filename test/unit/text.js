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
    'globalCompositeOperation':  'source-over',
    'skewX':                      0,
    'skewY':                      0,
    'transformMatrix':            null,
    'charSpacing':                0,
    'styles':                     {}
  };

  var TEXT_SVG = '\t<g transform="translate(10.5 26.72)">\n\t\t<text xml:space="preserve" font-family="Times New Roman" font-size="40" font-style="normal" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;" >\n\t\t\t<tspan x="-10" y="12.57" >x</tspan>\n\t\t</text>\n\t</g>\n';
  var TEXT_SVG_JUSTIFIED = '\t<g transform="translate(50.5 26.72)">\n\t\t<text xml:space="preserve" font-family="Times New Roman" font-size="40" font-style="normal" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;" >\n\t\t\t<tspan x=\"-60\" y=\"-13.65\" >xxxxxx</tspan>\n\t\t\t<tspan x=\"-60\" y=\"38.78\" >x </tspan>\n\t\t\t<tspan x=\"40\" y=\"38.78\" >y</tspan>\n\t\t</text>\n\t</g>\n';

  test('constructor', function() {
    ok(fabric.Text);
    var text = createTextObject();

    ok(text);
    ok(text instanceof fabric.Text);
    ok(text instanceof fabric.Object);

    equal(text.get('type'), 'text');
    equal(text.get('text'), 'x');
  });

  test('toString', function() {
    var text = createTextObject();
    ok(typeof text.toString == 'function');
    equal(text.toString(), '#<fabric.Text (1): { "text": "x", "fontFamily": "Times New Roman" }>');
  });

  test('_getFontDeclaration', function() {
    var text = createTextObject();
    ok(typeof text._getFontDeclaration == 'function', 'has a private method _getFontDeclaration');
    var fontDecl = text._getFontDeclaration();
    ok(typeof fontDecl == 'string', 'it returns a string');
    if (fabric.isLikelyNode) {
      equal(fontDecl, 'normal normal 40px "Times New Roman"');
    }
    else {
      equal(fontDecl, 'normal normal 40px Times New Roman');
    }

  });

  test('toObject', function() {
    var text = createTextObject();
    ok(typeof text.toObject == 'function');
    deepEqual(text.toObject(), REFERENCE_TEXT_OBJECT);
  });

  test('complexity', function(){
    var text = createTextObject();
    ok(typeof text.complexity == 'function');
    equal(text.complexity(), 1);
  });

  test('set', function() {
    var text = createTextObject();
    ok(typeof text.set == 'function');
    equal(text.set('text', 'bar'), text, 'should be chainable');

    text.set({ left: 1234, top: 2345, angle: 55 });

    equal(text.get('left'), 1234);
    equal(text.get('top'), 2345);
    equal(text.get('angle'), 55);
  });

  test('lineHeight with single line', function() {
    var text = createTextObject();
    text.text = 'text with one line';
    text.lineHeight = 2;
    text.initDimensions();
    var height = text.height;
    text.lineHeight = 0.5;
    text.initDimensions();
    var heightNew = text.height;
    equal(height, heightNew, 'text height does not change with one single line');
  });

  test('lineHeight with multi line', function() {
    var text = createTextObject();
    text.text = 'text with\ntwo lines';
    text.lineHeight = 0.1;
    text.initDimensions();
    var height = text.height,
        minimumHeight = text.fontSize * text._fontSizeMult;
    equal(height > minimumHeight, true, 'text height is always bigger than minimum Height');
  });

  test('set with "hash"', function() {
    var text = createTextObject();

    text.set({ opacity: 0.123, fill: 'red', fontFamily: 'blah' });

    equal(text.opacity, 0.123);
    equal(text.fill, 'red');
    equal(text.fontFamily, 'blah');
  });

  test('get bounding rect after init', function() {
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
    deepEqual(br, br2, 'text bounding box is the same before and after calling setCoords');
  });

  test('setShadow', function(){
    var text = createTextObject();
    ok(typeof text.setShadow == 'function');
    equal(text.setShadow('10px 8px 2px red'), text, 'should be chainable');

    ok(text.shadow instanceof fabric.Shadow, 'should inherit from fabric.Shadow');
    equal(text.shadow.color, 'red');
    equal(text.shadow.offsetX, 10);
    equal(text.shadow.offsetY, 8);
    equal(text.shadow.blur, 2);
  });

  asyncTest('fabric.Text.fromObject', function(){
    ok(typeof fabric.Text.fromObject == 'function');
    fabric.Text.fromObject(REFERENCE_TEXT_OBJECT, function(text) {
      deepEqual(text.toObject(), REFERENCE_TEXT_OBJECT);
      start();
    });
  });

  test('fabric.Text.fromElement', function() {
    ok(typeof fabric.Text.fromElement === 'function');

    var elText = fabric.document.createElement('text');
    elText.textContent = 'x';

    fabric.Text.fromElement(elText, function(text) {
      ok(text instanceof fabric.Text);
      var expectedObject = fabric.util.object.extend(fabric.util.object.clone(REFERENCE_TEXT_OBJECT), {
        left: 0,
        top: -14.59,
        width: 8,
        height: 18.08,
        fontSize: 16,
        originX: 'left'
      });
      deepEqual(text.toObject(), expectedObject, 'parsed object is what expected');
    });
  });

  test('fabric.Text.fromElement with custom attributes', function() {

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

      ok(textWithAttrs instanceof fabric.Text);

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
        fontStyle:        'italic',
        fontWeight:       'bold',
        fontSize:         123,
        underline:        true,
      });

      deepEqual(textWithAttrs.toObject(), expectedObject);
    });
  });

  test('empty fromElement', function() {
    fabric.Text.fromElement(null, function(text) {
      equal(text, null);
    });
  });

  test('dimensions after text change', function() {
    var text = new fabric.Text('x');
    equal(text.width, CHAR_WIDTH);

    text.set('text', 'xx');
    equal(text.width, CHAR_WIDTH * 2);
  });

  test('dimensions without text', function() {
    var text = new fabric.Text('');
    equal(text.width, 2);
  });

  test('setting fontFamily', function() {
    var text = new fabric.Text('x');
    text.path = 'foobar.js';

    text.set('fontFamily', 'foobar');
    equal(text.get('fontFamily'), 'foobar');

    text.set('fontFamily', '"Arial Black", Arial');
    equal(text.get('fontFamily'), '"Arial Black", Arial');
  });

  test('toSVG', function() {
    var text = new fabric.Text('x');

    // temp workaround for text objects not obtaining width under node
    text.width = CHAR_WIDTH;

    equal(removeTranslate(text.toSVG()), removeTranslate(TEXT_SVG));

    text.set('fontFamily', '"Arial Black", Arial');
    // temp workaround for text objects not obtaining width under node
    text.width = CHAR_WIDTH;

    equal(removeTranslate(text.toSVG()), removeTranslate(TEXT_SVG.replace('font-family="Times New Roman"', 'font-family="\'Arial Black\', Arial"')));
  });
  test('toSVG justified', function() {
    var text = new fabric.Text('xxxxxx\nx y', {
      textAlign: 'justify',
    });

    equal(removeTranslate(text.toSVG()), removeTranslate(TEXT_SVG_JUSTIFIED));
  });

  test('text styleHas', function() {
    var text = new fabric.Text('xxxxxx\nx y');
    text.styles = { };
    ok(typeof text.styleHas === 'function');
    equal(text.styleHas('stroke'), false, 'the text style has no stroke');
    text.styles = { 1: { 0: { stroke: 'red' }}};
    equal(text.styleHas('stroke'), true, 'the text style has stroke');
  });

  test('text cleanStyle', function() {
    var text = new fabric.Text('xxxxxx\nx y');
    text.styles = { 1: { 0: { stroke: 'red' }}};
    text.stroke = 'red';
    ok(typeof text.cleanStyle === 'function');
    text.cleanStyle('stroke');
    equal(text.styles[1], undefined, 'the style has been cleaned since stroke was equal to text property');
    text.styles = { 1: { 0: { stroke: 'blue' }}};
    text.stroke = 'red';
    text.cleanStyle('stroke');
    equal(text.styles[1][0].stroke, 'blue', 'nothing to clean, style untouched');
  });

  test('text cleanStyle with empty styles', function() {
    var text = new fabric.Text('xxxxxx\nx y');
    text.styles = { 1: { 0: { }, 1: { }}, 2: { }, 3: { 4: { }}};
    text.cleanStyle('any');
    equal(text.styles[1], undefined, 'the style has been cleaned since there were no usefull informations');
    equal(text.styles[2], undefined, 'the style has been cleaned since there were no usefull informations');
    equal(text.styles[3], undefined, 'the style has been cleaned since there were no usefull informations');
  });

  test('text cleanStyle with full style', function() {
    var text = new fabric.Text('xxx');
    text.styles = { 0: { 0: { fill: 'blue' }, 1:  { fill: 'blue' }, 2:  { fill: 'blue' }}};
    text.fill = 'black';
    text.cleanStyle('fill');
    equal(text.fill, 'blue', 'the fill has been changed to blue');
    equal(text.styles[0], undefined, 'all the style has been removed');
  });

  test('text removeStyle with some style', function() {
    var text = new fabric.Text('xxx');
    text.styles = { 0: { 0: { stroke: 'black', fill: 'blue' }, 1:  { fill: 'blue' }, 2:  { fill: 'blue' }}};
    ok(typeof text.removeStyle === 'function');
    text.fill = 'red';
    text.removeStyle('fill');
    equal(text.fill, 'red', 'the fill has not been changed');
    equal(text.styles[0][0].stroke, 'black', 'the non fill part of the style is still there');
    equal(text.styles[0][0].fill, undefined, 'the fill part of the style has been removed');
    text.styles = { 0: { 0: { fill: 'blue' }, 1:  { fill: 'blue' }, 2:  { fill: 'blue' }}};
    text.removeStyle('fill');
    equal(text.styles[0], undefined, 'the styles got empty and has been removed');
  });

  test('getFontCache works with fontWeight numbers', function() {
    var text = new fabric.Text('xxx', { fontWeight: 400 });
    text.initDimensions();
    var cache = fabric.charWidthsCache[text.fontFamily.toLowerCase()];
    var cacheProp = text.fontStyle + '_400';
    equal(cacheProp in cache, true, '400 is converted to string');
  });

  test('getFontCache is case insensitive', function() {
    var text = new fabric.Text('xxx', { fontWeight: 'BOld', fontStyle: 'NormaL' });
    text.initDimensions();
    var text2 = new fabric.Text('xxx', { fontWeight: 'bOLd', fontStyle: 'nORMAl' });
    text2.initDimensions();
    var cache = text.getFontCache(text);
    var cache2 = text2.getFontCache(text2);
    equal(cache, cache2, 'you get the same cache');
  });
// moved
  test('getSelectionStyles with no arguments', function() {
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

    equal(typeof iText.getSelectionStyles, 'function');

    deepEqual(iText.getSelectionStyles(), []);

  });

  test('getSelectionStyles with 2 args', function() {
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

    deepEqual(iText.getSelectionStyles(0, 5), [
      { textDecoration: 'underline' },
      {},
      { textDecoration: 'overline' },
      {},
      { textBackgroundColor: '#ffc' },
    ]);

    deepEqual(iText.getSelectionStyles(2, 2), [
    ]);
  });

  test('setSelectionStyles', function() {
    var iText = new fabric.Text('test foo bar-baz\nqux', {
      styles: {
        0: {
          0: { fill: '#112233' },
          2: { stroke: '#223344' }
        }
      }
    });

    equal(typeof iText.setSelectionStyles, 'function');

    iText.setSelectionStyles({
      fill: 'red',
      stroke: 'yellow'
    });

    deepEqual(iText.styles[0][0], {
      fill: '#112233'
    });

    iText.setSelectionStyles({
      fill: 'red',
      stroke: 'yellow'
    }, 0, 1);

    deepEqual(iText.styles[0][0], {
      fill: 'red',
      stroke: 'yellow'
    });

    iText.setSelectionStyles({
      fill: '#998877',
      stroke: 'yellow'
    }, 2, 3);

    deepEqual(iText.styles[0][2], {
      fill: '#998877',
      stroke: 'yellow'
    });
  });

  test('getStyleAtPosition', function() {
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

    equal(typeof iText.getStyleAtPosition, 'function');

    deepEqual(iText.getStyleAtPosition(2), { textDecoration: 'overline' });

    deepEqual(iText.getStyleAtPosition(1), { });

    deepEqual(iText.getStyleAtPosition(18), { fill: 'green' });
  });

  test('getStyleAtPosition complete', function() {
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

    equal(typeof iText.getStyleAtPosition, 'function');

    deepEqual(iText.getStyleAtPosition(2, true), {
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
