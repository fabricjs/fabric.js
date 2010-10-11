(function() {
  
  var REFERENCE_TEXT_OBJECT = {
    'type':         'text', 
    'left':         10, 
    'top':          10, 
    'width':        100, 
    'height':       100, 
    'fill':         'rgb(0,0,0)', 
    'overlayFill':  null,
    'stroke':       null, 
    'strokeWidth':  1, 
    'scaleX':       1, 
    'scaleY':       1, 
    'angle':        0, 
    'flipX':        false, 
    'flipY':        false, 
    'opacity':      1, 
    'text':         'foo', 
    'fontsize':     20, 
    'fontweight':   100, 
    'fontfamily':   'Modernist_One_400', 
    'path':         null
  };
  
  module('fabric.Text');
  
  test('constructor', function() {
    ok(fabric.Text);
    var text = new fabric.Text('foo');
    
    ok(text instanceof fabric.Text);
    ok(text instanceof fabric.Object);
    
    equals(text.get('type'), 'text');
    equals(text.get('text'), 'foo');
  });
  
  test('toString', function() {
    var text = new fabric.Text('foo');
    ok(typeof text.toString == 'function');
    equals(text.toString(), '#<fabric.Text (0): {"text":"foo","fontfamily":"Modernist_One_400"}>');
  });
  
  test('toObject', function() {
    var text = new fabric.Text('foo');
    ok(typeof text.toObject == 'function');
    same(text.toObject(), REFERENCE_TEXT_OBJECT);
  });
  
  test('complexity', function(){
    var text = new fabric.Text('foo');
    ok(typeof text.complexity == 'function');
  });
  
  test('set', function() {
    var text = new fabric.Text('foo');
    ok(typeof text.set == 'function');
    equals(text.set('text', 'bar'), text, 'should be chainable');
  });
  
  test('setColor', function(){
    var text = new fabric.Text('foo');
    ok(typeof text.setColor == 'function');
    equals(text.setColor('123456'), text, 'should be chainable');
    equals(text.get('fill'), '123456');
  });
  
  test('setFontsize', function(){
    var text = new fabric.Text('foo');
    ok(typeof text.setFontsize == 'function');
    equals(text.setFontsize(12), text);
    equals(text.get('fontsize'), 12);
  });
  
  test('getText', function(){
    var text = new fabric.Text('foo');
    ok(typeof text.getText == 'function');
    equals(text.getText(), 'foo');
    equals(text.getText(), text.get('text'));
  });
  
  test('setText', function(){
    var text = new fabric.Text('foo');
    ok(typeof text.setText == 'function');
    equals(text.setText('bar'), text, 'should be chainable');
    equals(text.getText(), 'bar');
  });
  
  test('fabric.Text.fromObject', function(){
    ok(typeof fabric.Text.fromObject == 'function');
    var text = fabric.Text.fromObject(REFERENCE_TEXT_OBJECT);
    same(text.toObject(), REFERENCE_TEXT_OBJECT);
  });
  
  asyncTest('Text already defined', function() {
    var warnWasCalled = false, originalWarn = fabric.warn;
    
    function warn() {
      warnWasCalled = true;
    }
    fabric.warn = warn;
    
    var el = document.createElement('script');
    el.src = '../../src/text.class.js';
    document.body.appendChild(el);

    setTimeout(function() {
      ok(warnWasCalled);
      
      fabric.warn = originalWarn;
      
      start();
    }, 500);
    
  });
  
  asyncTest('Object doesn\'t exist', function() {
    var warnWasCalled = false, originalWarn = fabric.warn;
    function warn() {
      warnWasCalled = true;
    }
    fabric.warn = warn;
    
    var originalObject = fabric.Object;
    var originalText = fabric.Text;

    delete fabric.Text;
    delete fabric.Object;

    var el = document.createElement('script');
    el.src = '../../src/text.class.js';
    document.body.appendChild(el);

    setTimeout(function() {
      ok(warnWasCalled);

      fabric.Object = originalObject;
      fabric.Text = originalText;
      
      fabric.warn = originalWarn;

      start();
    }, 500);
  });
  
})();