(function() {

  function createTextObject() {
    return new fabric.Text('foo', {
      fontFamily: 'Modernist_One_400'
    });
  }

  var REFERENCE_TEXT_OBJECT = {
    'type':           'text',
    'left':           0,
    'top':            0,
    'width':          0,
    'height':         0,
    'fill':           'rgb(0,0,0)',
    'overlayFill':    null,
    'stroke':         null,
    'strokeWidth':    1,
    'scaleX':         1,
    'scaleY':         1,
    'angle':          0,
    'flipX':          false,
    'flipY':          false,
    'opacity':        1,
    'selectable':     true,
    'text':           'foo',
    'fontSize':       40,
    'fontWeight':     100,
    'fontFamily':     'Modernist_One_400',
    'lineHeight':     1.6,
    'textDecoration': '',
    'textShadow':     null,
    'textAlign':      'left',
    'strokeStyle':    '',
    'fontStyle':      '',
    'path':           null,
    'backgroundColor': ''
  };

  QUnit.module('fabric.Text');

  test('constructor', function() {
    ok(fabric.Text);
    var text = createTextObject();

    ok(text);
    ok(text instanceof fabric.Text);
    ok(text instanceof fabric.Object);

    equal(text.get('type'), 'text');
    equal(text.get('text'), 'foo');
  });

  test('toString', function() {
    var text = createTextObject();
    ok(typeof text.toString == 'function');
    equal(text.toString(), '#<fabric.Text (0): { "text": "foo", "fontFamily": "Modernist_One_400" }>');
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

  test('setFontsize', function(){
    var text = createTextObject();
    ok(typeof text.setFontsize == 'function');
    equal(text.setFontsize(12), text);
    equal(text.get('fontSize'), 12);
  });

  test('getText', function(){
    var text = createTextObject();
    ok(typeof text.getText == 'function');
    equal(text.getText(), 'foo');
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

});