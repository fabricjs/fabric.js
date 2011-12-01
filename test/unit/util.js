(function() {
  
  module('fabric.util');
  
  test('fabric.util.toFixed', function(){
    ok(typeof fabric.util.toFixed == 'function');
    
    function test(what) {
      equals(fabric.util.toFixed(what, 2), 166.67, 'should leave 2 fractional digits');
      equals(fabric.util.toFixed(what, 5), 166.66667, 'should leave 5 fractional digits');
      equals(fabric.util.toFixed(what, 0), 167, 'should leave 0 fractional digits');
      
      var fractionless = (typeof what == 'number') 
        ? parseInt(what) 
        : what.substring(0, what.indexOf('.'));
        
      equals(fabric.util.toFixed(fractionless, 2), 166, 'should leave fractionless number as is');
    }
    
    test.call(this, '166.66666666666666666666'); // string
    test.call(this, 166.66666666666666666666); // number
  });
  
  test('fabric.util.removeFromArray', function() {
    var testArray = [1,2,3,4,5];
    
    ok(typeof fabric.util.removeFromArray == 'function');
    
    fabric.util.removeFromArray(testArray, 2);
    same([1,3,4,5], testArray);
    equals(fabric.util.removeFromArray(testArray, 1), testArray, 'should return reference to original array');
    
    testArray = [1,2,3,1];
    fabric.util.removeFromArray(testArray, 1);
    same([2,3,1], testArray, 'only first occurance of value should be deleted');
    
    testArray = [1,2,3];
    fabric.util.removeFromArray(testArray, 12);
    same([1,2,3], testArray, 'deleting unexistent value should not affect array');
    
    testArray = [];
    fabric.util.removeFromArray(testArray, 1);
    same([], testArray, 'deleting any value from empty array should not affect it');
    
    testArray = ['0'];
    fabric.util.removeFromArray(testArray, 0);
    same(['0'], testArray, 'should use (strict) identity comparison, rather than equality one');
  });
  
  test('fabric.util.degreesToRadians', function(){
    ok(typeof fabric.util.degreesToRadians == 'function');
    equals(fabric.util.degreesToRadians(0), 0);
    equals(fabric.util.degreesToRadians(90), Math.PI / 2);
    equals(fabric.util.degreesToRadians(180), Math.PI);
    
    same(fabric.util.degreesToRadians(), NaN);
  });
  
  test('fabric.util.getRandomInt', function() {
    ok(typeof fabric.util.getRandomInt == 'function');
    
    var randomInts = [];
    for (var i = 100; i--; ) {
      var randomInt = fabric.util.getRandomInt(100, 200); 
      randomInts.push(randomInt);
      ok(randomInt >= 100 && randomInt <= 200);
    }
    
    var areAllTheSame = randomInts.every(function(value){ 
      return value === randomInts[0];
    });
    
    ok(!areAllTheSame);
  });
  
  test('fabric.util.falseFunction', function() {
    ok(typeof fabric.util.falseFunction == 'function');
    equals(fabric.util.falseFunction(), false);
  });
  
  test('String.prototype.trim', function() {
    ok(typeof String.prototype.trim == 'function');
    equals('\t\n   foo bar \n    \xA0  '.trim(), 'foo bar');
  });
  
  test('fabric.util.string.camelize', function() {
    var camelize = fabric.util.string.camelize;
    
    ok(typeof camelize == 'function');
    
    equals(camelize('foo'), 'foo');
    equals(camelize('foo-bar'), 'fooBar');
    equals(camelize('Foo-bar-Baz'), 'FooBarBaz');
    equals(camelize('FooBarBaz'), 'FooBarBaz');
    equals(camelize('-bar'), 'Bar');
    equals(camelize(''), '');
    equals(camelize('and_something_with_underscores'), 'and_something_with_underscores');
    equals(camelize('underscores_and-dashes'), 'underscores_andDashes');
    equals(camelize('--double'), 'Double');
  });
  
  test('fabric.util.string.capitalize', function() {
    var capitalize = fabric.util.string.capitalize;
    
    ok(typeof capitalize == 'function');
    
    equals(capitalize('foo'), 'Foo');
    equals(capitalize(''), '');
    equals(capitalize('Foo'), 'Foo');
    equals(capitalize('foo-bar-baz'), 'Foo-bar-baz');
    equals(capitalize('FOO'), 'Foo');
    equals(capitalize('FoobaR'), 'Foobar');
    equals(capitalize('2foo'), '2foo');
  });
  
  test('fabric.util.object.extend', function() {
    var extend = fabric.util.object.extend;
    
    ok(typeof extend == 'function');
    
    var destination = { x: 1 },
        source = { y: 2 };
        
    extend(destination, source);
    
    equals(destination.x, 1);
    equals(destination.y, 2);
    equals(source.x, undefined);
    equals(source.y, 2);
    
    destination = { x: 1 };
    source = { x: 2 };
    
    extend(destination, source);
    
    equals(destination.x, 2);
    equals(source.x, 2);
  });
  
  test('fabric.util.object.clone', function() {
    var clone = fabric.util.object.clone;
    
    ok(typeof clone == 'function');
    
    var obj = { x: 1, y: [1, 2, 3] },
        clone = clone(obj);
    
    equals(clone.x, 1);
    notEqual(obj, clone);
    equals(clone.y, obj.y);
  });
  
  test('Function.prototype.bind', function() {
    ok(typeof Function.prototype.bind == 'function');
    
    var obj = { };
    function fn() {
      return [this, arguments[0], arguments[1]];
    }
    
    var bound = fn.bind(obj);
    same([obj, undefined, undefined], bound());
    same([obj, 1, undefined], bound(1))
    same([obj, 1, null], bound(1, null));
    
    bound = fn.bind(obj, 1);
    same([obj, 1, undefined], bound());
    same([obj, 1, 2], bound(2));
    
    function Point(x, y) { 
      this.x = x; 
      this.y = y;
    }
    
    var obj = { }
    var YAxisPoint = Point.bind(obj, 0);
    var axisPoint = new YAxisPoint(5);
    
    same(0, axisPoint.x);
    same(5, axisPoint.y);
    
    ok(axisPoint instanceof Point);
    // ok(axisPoint instanceof YAxisPoint); <-- fails
  });
  
  test('fabric.util.getById', function() {
    ok(typeof fabric.util.getById == 'function');
    
    var el = document.createElement('div');
    el.id = 'foobarbaz';
    document.body.appendChild(el);
    
    equals(el, fabric.util.getById(el));
    equals(el, fabric.util.getById('foobarbaz'));
    equals(null, fabric.util.getById('likely-non-existent-id'));
  });
  
  test('fabric.util.toArray', function() {
    ok(typeof fabric.util.toArray == 'function');
    
    same(['x', 'y'], fabric.util.toArray({ 0: 'x', 1: 'y', length: 2 }));
    same([1, 3], fabric.util.toArray(function(){ return arguments }(1, 3)));
    
    var nodelist = document.getElementsByTagName('div'),
        converted = fabric.util.toArray(nodelist);
        
    ok(converted instanceof Array);
    equals(nodelist.length, converted.length);
    equals(nodelist[0], converted[0]);
    equals(nodelist[1], converted[1]);
  });
  
  test('fabric.util.makeElement', function() {
    var makeElement = fabric.util.makeElement;
    ok(typeof makeElement == 'function');
    
    var el = makeElement('div');
    
    equals(el.tagName.toLowerCase(), 'div');
    equals(el.nodeType, 1);
    
    el = makeElement('p', { 'class': 'blah', 'for': 'boo_hoo', 'some_random-attribute': 'woot' });
    
    equals(el.tagName.toLowerCase(), 'p');
    equals(el.nodeType, 1);
    equals(el.className, 'blah');
    equals(el.htmlFor, 'boo_hoo');
    equals(el.getAttribute('some_random-attribute'), 'woot');
  });
  
  test('fabric.util.addClass', function() {
    var addClass = fabric.util.addClass;
    ok(typeof addClass == 'function');
    
    var el = document.createElement('div');
    addClass(el, 'foo');
    equals(el.className, 'foo');
    
    addClass(el, 'bar');
    equals(el.className, 'foo bar');
    
    addClass(el, 'baz qux');
    equals(el.className, 'foo bar baz qux');
    
    addClass(el, 'foo');
    equals(el.className, 'foo bar baz qux');
  });
  
  test('fabric.util.wrapElement', function() {
    var wrapElement = fabric.util.wrapElement;
    ok(typeof wrapElement == 'function');
    
    var el = document.createElement('p');
    var wrapper = wrapElement(el, 'div');
    
    equals(wrapper.tagName.toLowerCase(), 'div');
    equals(wrapper.firstChild, el);
    
    el = document.createElement('p');
    wrapper = wrapElement(el, 'div', { 'class': 'foo' });
    
    equals(wrapper.tagName.toLowerCase(), 'div');
    equals(wrapper.firstChild, el);
    equals(wrapper.className, 'foo');
    
    var childEl = document.createElement('span');
    var parentEl = document.createElement('p');
    
    parentEl.appendChild(childEl);
    
    wrapper = wrapElement(childEl, 'strong');
    
    // wrapper is now in between parent and child
    equals(wrapper.parentNode, parentEl);
    equals(wrapper.firstChild, childEl);
  });
  
  test('fabric.util.makeElementUnselectable', function() {
    var makeElementUnselectable = fabric.util.makeElementUnselectable;
    
    ok(typeof makeElementUnselectable == 'function');
    
    var el = document.createElement('p');
    el.appendChild(document.createTextNode('foo'));
    
    equals(el, makeElementUnselectable(el), 'should be "chainable"');
    if (typeof el.onselectstart != 'undefined') {
      equals(el.onselectstart, fabric.util.falseFunction);
    }
    
    // not sure if it's a good idea to test implementation details here
    // functional test would probably make more sense
    if (typeof el.unselectable == 'string') {
      equals('on', el.unselectable);
    }
    else if (typeof el.userSelect != 'undefined') {
      equals('none', el.userSelect);
    }
  });
  
  test('fabric.util.makeElementSelectable', function() {
    var makeElementSelectable = fabric.util.makeElementSelectable,
        makeElementUnselectable = fabric.util.makeElementUnselectable;
    
    ok(typeof makeElementSelectable == 'function');
    
    var el = document.createElement('p');
    el.appendChild(document.createTextNode('foo'));
    
    makeElementUnselectable(el);
    makeElementSelectable(el);
    
    if (typeof el.onselectstart != 'undefined') {
      equals(el.onselectstart, null);
    }
    if (typeof el.unselectable == 'string') {
      equals('', el.unselectable);
    }
    else if (typeof el.userSelect != 'undefined') {
      equals('', el.userSelect);
    }
  });
  
  test('fabric.loadSVGFromURL', function() {
    equal("function", typeof fabric.loadSVGFromURL);
  });
  
  var SVG_DOC_AS_STRING = '<?xml version="1.0"?>\
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
      <polygon fill="red" stroke="blue" stroke-width="10" points="350, 75 379,161 469,161\
        397,215 423,301 350,250 277,301 303,215 231,161 321,161" />\
    </svg>';
  
  asyncTest('fabric.loadSVGFromString', function() {
    equal("function", typeof fabric.loadSVGFromString);
    
    var loadedObjects = [ ];
    fabric.loadSVGFromString(SVG_DOC_AS_STRING, function(objects) {
      loadedObjects = objects;
    });
    
    setTimeout(function() {
      ok(loadedObjects[0] instanceof fabric.Polygon);
      equals('red', loadedObjects[0].fill);
      start();
    }, 1000);
  });
  
  asyncTest('fabric.loadSVGFromString with surrounding whitespace', function() {
    var loadedObjects = [ ];
    fabric.loadSVGFromString('   \n\n  ' + SVG_DOC_AS_STRING + '  ', function(objects) {
      loadedObjects = objects;
    });
    
    setTimeout(function() {
      ok(loadedObjects[0] instanceof fabric.Polygon);
      equals('red', loadedObjects[0] && loadedObjects[0].fill);
      start();
    }, 1000);
  });
  
  asyncTest('fabric.util.loadImage', function() {
    ok(typeof fabric.util.loadImage == 'function');
    
    var callbackInvoked = false,
        objectPassedToCallback;
        
    fabric.util.loadImage('../fixtures/very_large_image.jpg', function(obj) {
      callbackInvoked = true;
      objectPassedToCallback = obj;
    });
    
    setTimeout(function() {
      ok(callbackInvoked, 'callback should be invoked');
      
      if (objectPassedToCallback) {
        ok(objectPassedToCallback.tagName.toUpperCase() === 'IMG', 'object passed to callback should be an image element');
        var oImg = new fabric.Image(objectPassedToCallback);
        ok(/fixtures\/very_large_image\.jpg$/.test(oImg.getSrc()), 'image should have correct src');
      }
      
      start();
    }, 2000);
  });
  
  
})();