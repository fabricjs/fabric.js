(function() {

  QUnit.module('fabric.Text');

  function createTextObject() {
    return new fabric.Text('x');
  }

  var REFERENCE_TEXT_OBJECT = {
    'type':             'text',
    'originX':          'center',
    'originY':          'center',
    'left':             0,
    'top':              0,
    'width':            20,
    'height':           52,
    'fill':             'rgb(0,0,0)',
    'overlayFill':      null,
    'stroke':           null,
    'strokeWidth':      1,
    'strokeDashArray':  null,
    'scaleX':           1,
    'scaleY':           1,
    'angle':            0,
    'flipX':            false,
    'flipY':            false,
    'opacity':          1,
    'selectable':       true,
    'hasControls':      true,
    'hasBorders':       true,
    'hasRotatingPoint': true,
    'transparentCorners': true,
    'perPixelTargetFind': false,
    'shadow':           null,
    'visible':          true,
    'text':             'x',
    'fontSize':         40,
    'fontWeight':       'normal',
    'fontFamily':       'Times New Roman',
    'fontStyle':        '',
    'lineHeight':       1.3,
    'textDecoration':   '',
    'textShadow':       '',
    'textAlign':        'left',
    'path':             null,
    'strokeStyle':      '',
    'backgroundColor':  '',
    'textBackgroundColor':  '',
    'useNative':        true
  };

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
    equal(text.toString(), '#<fabric.Text (0): { "text": "x", "fontFamily": "Times New Roman" }>');
  });

  test('toObject', function() {
    var text = createTextObject();
    ok(typeof text.toObject == 'function');
    deepEqual(text.toObject(), REFERENCE_TEXT_OBJECT);
  });

  test('complexity', function(){
    var text = createTextObject();
    ok(typeof text.complexity == 'function');
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

  test('set with "hash"', function() {
    var text = createTextObject();

    text.set({ opacity: 0.123, fill: 'red', fontFamily: 'blah' });

    equal(0.123, text.getOpacity());
    equal('red', text.getFill());
    equal('blah', text.get('fontFamily'));
  });

  test('setColor', function(){
    var text = createTextObject();
    ok(typeof text.setColor == 'function');
    equal(text.setColor('123456'), text, 'should be chainable');
    equal(text.get('fill'), '123456');
  });

  test('setFontSize', function(){
    var text = createTextObject();
    ok(typeof text.setFontSize == 'function');
    equal(text.setFontSize(12), text);
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
    // text.width = 20;

    var expectedObject = fabric.util.object.extend(fabric.util.object.clone(REFERENCE_TEXT_OBJECT), {
      left: 10,
      top: -26
    });

    deepEqual(text.toObject(), expectedObject);
  });

  test('fabric.Text.fromElement with custom attributes', function() {

    var elTextWithAttrs = fabric.document.createElement('text');
    elTextWithAttrs.textContent = 'x';

    elTextWithAttrs.setAttribute('x', 10);
    elTextWithAttrs.setAttribute('y', 20);
    elTextWithAttrs.setAttribute('fill', 'rgb(255,255,255)');
    elTextWithAttrs.setAttribute('fill-opacity', 0.45);
    elTextWithAttrs.setAttribute('stroke', 'blue');
    elTextWithAttrs.setAttribute('stroke-width', 3);
    elTextWithAttrs.setAttribute('font-family', 'Monaco');
    elTextWithAttrs.setAttribute('font-style', 'italic');
    elTextWithAttrs.setAttribute('font-weight', 'bold');
    elTextWithAttrs.setAttribute('font-size', '123');
    elTextWithAttrs.setAttribute('text-decoration', 'underline');

    var textWithAttrs = fabric.Text.fromElement(elTextWithAttrs);
    // temp workaround for text objects not obtaining width under node
    textWithAttrs.width = 20;

    ok(textWithAttrs instanceof fabric.Text);

    var expectedObject = fabric.util.object.extend(fabric.util.object.clone(REFERENCE_TEXT_OBJECT), {
      /* left varies slightly due to node-canvas rendering */
      left: fabric.util.toFixed(textWithAttrs.left + '', 2),
      top: -59.95,
      width: 20,
      height: 159.9,
      fill: 'rgb(255,255,255)',
      opacity: 0.45,
      stroke: 'blue',
      strokeWidth: 3,
      fontFamily: 'Monaco',
      fontStyle: 'italic',
      fontWeight: 'bold',
      fontSize: 123,
      textDecoration: 'underline'
    });

    deepEqual(textWithAttrs.toObject(), expectedObject);
  });

  test('empty fromElement', function() {
    ok(fabric.Text.fromElement() === null);
  });

  test('dimensions after text change', function() {
    var text = new fabric.Text('x');
    equal(20, text.width);

    text.setText('xx');
    equal(40, text.width);
  });

  test('setting fontFamily', function() {
    var text = new fabric.Text('x');
    text.path = 'foobar.js';

    text.set('fontFamily', 'foobar');
    equal('foobar', text.get('fontFamily'));
  });

})();