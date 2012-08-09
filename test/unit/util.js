(function() {

  QUnit.module('fabric.util');

  test('fabric.util.toFixed', function(){
    ok(typeof fabric.util.toFixed == 'function');

    function test(what) {
      equal(fabric.util.toFixed(what, 2), 166.67, 'should leave 2 fractional digits');
      equal(fabric.util.toFixed(what, 5), 166.66667, 'should leave 5 fractional digits');
      equal(fabric.util.toFixed(what, 0), 167, 'should leave 0 fractional digits');

      var fractionless = (typeof what == 'number')
        ? parseInt(what)
        : what.substring(0, what.indexOf('.'));

      equal(fabric.util.toFixed(fractionless, 2), 166, 'should leave fractionless number as is');
    }

    test.call(this, '166.66666666666666666666'); // string
    test.call(this, 166.66666666666666666666); // number
  });

  test('fabric.util.removeFromArray', function() {
    var testArray = [1,2,3,4,5];

    ok(typeof fabric.util.removeFromArray == 'function');

    fabric.util.removeFromArray(testArray, 2);
    deepEqual([1,3,4,5], testArray);
    equal(fabric.util.removeFromArray(testArray, 1), testArray, 'should return reference to original array');

    testArray = [1,2,3,1];
    fabric.util.removeFromArray(testArray, 1);
    deepEqual([2,3,1], testArray, 'only first occurance of value should be deleted');

    testArray = [1,2,3];
    fabric.util.removeFromArray(testArray, 12);
    deepEqual([1,2,3], testArray, 'deleting unexistent value should not affect array');

    testArray = [];
    fabric.util.removeFromArray(testArray, 1);
    deepEqual([], testArray, 'deleting any value from empty array should not affect it');

    testArray = ['0'];
    fabric.util.removeFromArray(testArray, 0);
    deepEqual(['0'], testArray, 'should use (strict) identity comparison, rather than equality one');
  });

  test('fabric.util.degreesToRadians', function(){
    ok(typeof fabric.util.degreesToRadians == 'function');
    equal(fabric.util.degreesToRadians(0), 0);
    equal(fabric.util.degreesToRadians(90), Math.PI / 2);
    equal(fabric.util.degreesToRadians(180), Math.PI);

    deepEqual(fabric.util.degreesToRadians(), NaN);
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
    equal(fabric.util.falseFunction(), false);
  });

  test('String.prototype.trim', function() {
    ok(typeof String.prototype.trim == 'function');
    equal('\t\n   foo bar \n    \xA0  '.trim(), 'foo bar');
  });

  test('fabric.util.string.camelize', function() {
    var camelize = fabric.util.string.camelize;

    ok(typeof camelize == 'function');

    equal(camelize('foo'), 'foo');
    equal(camelize('foo-bar'), 'fooBar');
    equal(camelize('Foo-bar-Baz'), 'FooBarBaz');
    equal(camelize('FooBarBaz'), 'FooBarBaz');
    equal(camelize('-bar'), 'Bar');
    equal(camelize(''), '');
    equal(camelize('and_something_with_underscores'), 'and_something_with_underscores');
    equal(camelize('underscores_and-dashes'), 'underscores_andDashes');
    equal(camelize('--double'), 'Double');
  });

  test('fabric.util.string.capitalize', function() {
    var capitalize = fabric.util.string.capitalize;

    ok(typeof capitalize == 'function');

    equal(capitalize('foo'), 'Foo');
    equal(capitalize(''), '');
    equal(capitalize('Foo'), 'Foo');
    equal(capitalize('foo-bar-baz'), 'Foo-bar-baz');
    equal(capitalize('FOO'), 'Foo');
    equal(capitalize('FoobaR'), 'Foobar');
    equal(capitalize('2foo'), '2foo');
  });

  test('fabric.util.object.extend', function() {
    var extend = fabric.util.object.extend;

    ok(typeof extend == 'function');

    var destination = { x: 1 },
        source = { y: 2 };

    extend(destination, source);

    equal(destination.x, 1);
    equal(destination.y, 2);
    equal(source.x, undefined);
    equal(source.y, 2);

    destination = { x: 1 };
    source = { x: 2 };

    extend(destination, source);

    equal(destination.x, 2);
    equal(source.x, 2);
  });

  test('fabric.util.object.clone', function() {
    var clone = fabric.util.object.clone;

    ok(typeof clone == 'function');

    var obj = { x: 1, y: [1, 2, 3] },
        clone = clone(obj);

    equal(clone.x, 1);
    notEqual(obj, clone);
    equal(clone.y, obj.y);
  });

  test('Function.prototype.bind', function() {
    ok(typeof Function.prototype.bind == 'function');

    var obj = { };
    function fn() {
      return [this, arguments[0], arguments[1]];
    }

    var bound = fn.bind(obj);
    deepEqual([obj, undefined, undefined], bound());
    deepEqual([obj, 1, undefined], bound(1))
    deepEqual([obj, 1, null], bound(1, null));

    bound = fn.bind(obj, 1);
    deepEqual([obj, 1, undefined], bound());
    deepEqual([obj, 1, 2], bound(2));

    function Point(x, y) {
      this.x = x;
      this.y = y;
    }

    var obj = { }
    var YAxisPoint = Point.bind(obj, 0);
    var axisPoint = new YAxisPoint(5);

    deepEqual(0, axisPoint.x);
    deepEqual(5, axisPoint.y);

    ok(axisPoint instanceof Point);
    // ok(axisPoint instanceof YAxisPoint); <-- fails
  });

  test('fabric.util.getById', function() {
    ok(typeof fabric.util.getById == 'function');

    var el = fabric.document.createElement('div');
    el.id = 'foobarbaz';
    fabric.document.body.appendChild(el);

    equal(el, fabric.util.getById(el));
    equal(el, fabric.util.getById('foobarbaz'));
    equal(null, fabric.util.getById('likely-non-existent-id'));
  });

  test('fabric.util.toArray', function() {
    ok(typeof fabric.util.toArray == 'function');

    deepEqual(['x', 'y'], fabric.util.toArray({ 0: 'x', 1: 'y', length: 2 }));
    deepEqual([1, 3], fabric.util.toArray(function(){ return arguments }(1, 3)));

    var nodelist = fabric.document.getElementsByTagName('div'),
        converted = fabric.util.toArray(nodelist);

    ok(converted instanceof Array);
    equal(nodelist.length, converted.length);
    equal(nodelist[0], converted[0]);
    equal(nodelist[1], converted[1]);
  });

  test('fabric.util.makeElement', function() {
    var makeElement = fabric.util.makeElement;
    ok(typeof makeElement == 'function');

    var el = makeElement('div');

    equal(el.tagName.toLowerCase(), 'div');
    equal(el.nodeType, 1);

    el = makeElement('p', { 'class': 'blah', 'for': 'boo_hoo', 'some_random-attribute': 'woot' });

    equal(el.tagName.toLowerCase(), 'p');
    equal(el.nodeType, 1);
    equal(el.className, 'blah');
    equal(el.htmlFor, 'boo_hoo');
    equal(el.getAttribute('some_random-attribute'), 'woot');
  });

  test('fabric.util.addClass', function() {
    var addClass = fabric.util.addClass;
    ok(typeof addClass == 'function');

    var el = fabric.document.createElement('div');
    addClass(el, 'foo');
    equal(el.className, 'foo');

    addClass(el, 'bar');
    equal(el.className, 'foo bar');

    addClass(el, 'baz qux');
    equal(el.className, 'foo bar baz qux');

    addClass(el, 'foo');
    equal(el.className, 'foo bar baz qux');
  });

  test('fabric.util.wrapElement', function() {
    var wrapElement = fabric.util.wrapElement;
    ok(typeof wrapElement == 'function');

    var el = fabric.document.createElement('p');
    var wrapper = wrapElement(el, 'div');

    equal(wrapper.tagName.toLowerCase(), 'div');
    equal(wrapper.firstChild, el);

    el = fabric.document.createElement('p');
    wrapper = wrapElement(el, 'div', { 'class': 'foo' });

    equal(wrapper.tagName.toLowerCase(), 'div');
    equal(wrapper.firstChild, el);
    equal(wrapper.className, 'foo');

    var childEl = fabric.document.createElement('span');
    var parentEl = fabric.document.createElement('p');

    parentEl.appendChild(childEl);

    wrapper = wrapElement(childEl, 'strong');

    // wrapper is now in between parent and child
    equal(wrapper.parentNode, parentEl);
    equal(wrapper.firstChild, childEl);
  });

  test('fabric.util.makeElementUnselectable', function() {
    var makeElementUnselectable = fabric.util.makeElementUnselectable;

    ok(typeof makeElementUnselectable == 'function');

    var el = fabric.document.createElement('p');
    el.appendChild(fabric.document.createTextNode('foo'));

    equal(el, makeElementUnselectable(el), 'should be "chainable"');
    if (typeof el.onselectstart != 'undefined') {
      equal(el.onselectstart, fabric.util.falseFunction);
    }

    // not sure if it's a good idea to test implementation details here
    // functional test would probably make more sense
    if (typeof el.unselectable == 'string') {
      equal('on', el.unselectable);
    }
    else if (typeof el.userSelect != 'undefined') {
      equal('none', el.userSelect);
    }
  });

  test('fabric.util.makeElementSelectable', function() {
    var makeElementSelectable = fabric.util.makeElementSelectable,
        makeElementUnselectable = fabric.util.makeElementUnselectable;

    ok(typeof makeElementSelectable == 'function');

    var el = fabric.document.createElement('p');
    el.appendChild(fabric.document.createTextNode('foo'));

    makeElementUnselectable(el);
    makeElementSelectable(el);

    if (typeof el.onselectstart != 'undefined') {
      equal(el.onselectstart, null);
    }
    if (typeof el.unselectable == 'string') {
      equal('', el.unselectable);
    }
    else if (typeof el.userSelect != 'undefined') {
      equal('', el.userSelect);
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
      equal('red', loadedObjects[0].fill);
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
      equal('red', loadedObjects[0] && loadedObjects[0].fill);
      start();
    }, 1000);
  });

  // asyncTest('fabric.util.loadImage', function() {
  //   ok(typeof fabric.util.loadImage == 'function');

  //   var callbackInvoked = false,
  //       objectPassedToCallback;

  //   fabric.util.loadImage('../fixtures/very_large_image.jpg', function(obj) {
  //     callbackInvoked = true;
  //     objectPassedToCallback = obj;
  //   });

  //   setTimeout(function() {
  //     ok(callbackInvoked, 'callback should be invoked');

  //     if (objectPassedToCallback) {
  //       ok(objectPassedToCallback.tagName && objectPassedToCallback.tagName.toUpperCase() === 'IMG', 'object passed to callback should be an image element');
  //       var oImg = new fabric.Image(objectPassedToCallback);
  //       ok(/fixtures\/very_large_image\.jpg$/.test(oImg.getSrc()), 'image should have correct src');
  //     }

  //     start();
  //   }, 2000);
  // });

  var SVG_WITH_1_ELEMENT = '<?xml version="1.0"?>\
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
      <polygon fill="red" stroke="blue" stroke-width="10" points="350, 75 379,161 469,161\
        397,215 423,301 350,250 277,301 303,215 231,161 321,161" />\
    </svg>';

  var SVG_WITH_2_ELEMENTS = '<?xml version="1.0"?>\
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
      <polygon fill="red" stroke="blue" stroke-width="10" points="350, 75 379,161 469,161\
        397,215 423,301 350,250 277,301 303,215 231,161 321,161" />\
      <polygon fill="red" stroke="blue" stroke-width="10" points="350, 75 379,161 469,161\
        397,215 423,301 350,250 277,301 303,215 231,161 321,161" />\
    </svg>';

  asyncTest('fabric.util.groupSVGElements', function() {
    ok(typeof fabric.util.groupSVGElements == 'function');

    var group1, group2;
    fabric.loadSVGFromString(SVG_WITH_1_ELEMENT, function(objects, options) {
      group1 = fabric.util.groupSVGElements(objects, options);
    });
    fabric.loadSVGFromString(SVG_WITH_2_ELEMENTS, function(objects, options) {
      group2 = fabric.util.groupSVGElements(objects, options);
    });

    setTimeout(function() {
      ok(group1 instanceof fabric.Polygon);
      ok(group2 instanceof fabric.PathGroup);
      start();
    }, 1000);
  });

})();