(function() {

  QUnit.module('fabric.Text');

  function createTextObject() {
    return new fabric.Text('x');
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
    'fontStyle':                 '',
    'lineHeight':                1.16,
    'textDecoration':            '',
    'textAlign':                 'left',
    'textBackgroundColor':       '',
    'fillRule':                  'nonzero',
    'globalCompositeOperation':  'source-over',
    'skewX':                      0,
    'skewY':                      0,
    'transformMatrix':            null,
    'charSpacing':                0
  };

  var TEXT_SVG = '\t<g transform="translate(10.5 26.72)">\n\t\t<text font-family="Times New Roman" font-size="40" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" >\n\t\t\t<tspan x="-10" y="12.6" fill="rgb(0,0,0)">x</tspan>\n\t\t</text>\n\t</g>\n';
  var TEXT_SVG_JUSTIFIED = '\t<g transform="translate(50.5 26.72)">\n\t\t<text font-family="Times New Roman" font-size="40" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" >\n\t\t\t<tspan x="-50" y="12.6" fill="rgb(0,0,0)">x</tspan>\n\t\t\t<tspan x="30" y="12.6" fill="rgb(0,0,0)">y</tspan>\n\t\t</text>\n\t</g>\n';

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
      equal(fontDecl, 'normal  40px "Times New Roman"');
    }
    else {
      equal(fontDecl, ' normal 40px "Times New Roman"');
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
    text._initDimensions();
    var height = text.height;
    text.lineHeight = 0.5;
    text._initDimensions();
    var heightNew = text.height;
    equal(height, heightNew, 'text height does not change with one single line');
  });

  test('lineHeight with multi line', function() {
    var text = createTextObject();
    text.text = 'text with\ntwo lines';
    text.lineHeight = 0.1;
    text._initDimensions();
    var height = text.height,
        minimumHeight = text.fontSize * text._fontSizeMult;
    equal(height > minimumHeight, true, 'text height is always bigger than minimum Height');
  });

  test('set with "hash"', function() {
    var text = createTextObject();

    text.set({ opacity: 0.123, fill: 'red', fontFamily: 'blah' });

    equal(text.getOpacity(), 0.123);
    equal(text.getFill(), 'red');
    equal(text.get('fontFamily'), 'blah');
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

  test('setFontSize', function(){
    var text = createTextObject();
    ok(typeof text.setFontSize == 'function');
    equal(text.setFontSize(12), text, 'should be chainable');
    equal(text.get('fontSize'), 12);
  });

  test('getText', function(){
    var text = createTextObject();
    ok(typeof text.getText == 'function');
    equal(text.getText(), 'x');
    equal(text.getText(), text.get('text'));
  });

  test('setText', function(){
    var text = createTextObject();
    ok(typeof text.setText == 'function');
    equal(text.setText('bar'), text, 'should be chainable');
    equal(text.getText(), 'bar');
  });

  test('fabric.Text.fromObject', function(){
    ok(typeof fabric.Text.fromObject == 'function');
    var text = fabric.Text.fromObject(REFERENCE_TEXT_OBJECT);
    deepEqual(text.toObject(), REFERENCE_TEXT_OBJECT);
  });

  test('fabric.Text.fromElement', function() {
    ok(typeof fabric.Text.fromElement == 'function');

    var elText = fabric.document.createElement('text');
    elText.textContent = 'x';

    var text = fabric.Text.fromElement(elText);

    ok(text instanceof fabric.Text);

    // temp workaround for text objects not obtaining width under node
    // text.width = CHAR_WIDTH;

    var expectedObject = fabric.util.object.extend(fabric.util.object.clone(REFERENCE_TEXT_OBJECT), {
      left: 4,
      top: -5.14,
      width: 8,
      height: 18.08,
      fontSize: 16,
      originX: 'left'
    });

    deepEqual(text.toObject(), expectedObject);
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

    var textWithAttrs = fabric.Text.fromElement(elTextWithAttrs);
    // temp workaround for text objects not obtaining width under node
    textWithAttrs.width = CHAR_WIDTH;

    ok(textWithAttrs instanceof fabric.Text);

    var expectedObject = fabric.util.object.extend(fabric.util.object.clone(REFERENCE_TEXT_OBJECT), {
      /* left varies slightly due to node-canvas rendering */
      left:             fabric.util.toFixed(textWithAttrs.left + '', 2),
      top:              -16.76,
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
      textDecoration:   'underline',
      originX:          'center'
    });

    deepEqual(textWithAttrs.toObject(), expectedObject);
  });

  test('empty fromElement', function() {
    ok(fabric.Text.fromElement() === null);
  });

  test('dimensions after text change', function() {
    var text = new fabric.Text('x');
    equal(text.width, CHAR_WIDTH);

    text.setText('xx');
    equal(text.width, CHAR_WIDTH * 2);
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

    function removeTranslate(str) {
      return str.replace(/translate\(.*?\)/, '');
    }

    // temp workaround for text objects not obtaining width under node
    text.width = CHAR_WIDTH;

    equal(removeTranslate(text.toSVG()), removeTranslate(TEXT_SVG));

    text.setFontFamily('"Arial Black", Arial');
    // temp workaround for text objects not obtaining width under node
    text.width = CHAR_WIDTH;

    equal(removeTranslate(text.toSVG()), removeTranslate(TEXT_SVG.replace('font-family="Times New Roman"', 'font-family="\'Arial Black\', Arial"')));
  });
  test('toSVG justified', function() {
    var text = new fabric.Text('x y');

    function removeTranslate(str) {
      return str.replace(/translate\(.*?\)/, '');
    }

    // temp workaround for text objects not obtaining width under node
    text.width = 100;
    text.textAlign = 'justify';
    equal(removeTranslate(text.toSVG()), removeTranslate(TEXT_SVG_JUSTIFIED));
  });

})();
