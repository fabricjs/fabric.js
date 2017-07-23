(function() {

  QUnit.module('fabric.util');

  function _createImageElement() {
    return fabric.isLikelyNode
            ? new (require(fabric.canvasModule).Image)()
            : fabric.document.createElement('img');
  }

  function getAbsolutePath(path) {
    var isAbsolute = /^https?:/.test(path);
    if (isAbsolute) { return path; };
    var imgEl = _createImageElement();
    imgEl.src = path;
    var src = imgEl.src;
    imgEl = null;
    return src;
  }

  var IMG_URL = fabric.isLikelyNode
    ? require('path').join(__dirname, '../fixtures/', 'very_large_image.jpg')
    : getAbsolutePath('../fixtures/very_large_image.jpg');

  var IMG_URL_NON_EXISTING = 'http://www.google.com/non-existing';

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

  test('fabric.util.radiansToDegrees', function(){
    ok(typeof fabric.util.radiansToDegrees == 'function');

    equal(fabric.util.radiansToDegrees(0), 0);
    equal(fabric.util.radiansToDegrees(Math.PI / 2), 90);
    equal(fabric.util.radiansToDegrees(Math.PI), 180);

    deepEqual(fabric.util.radiansToDegrees(), NaN);
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

  test('fabric.util.string.graphemeSplit', function() {
    var gSplit = fabric.util.string.graphemeSplit;

    ok(typeof gSplit === 'function');

    deepEqual(gSplit('foo'), ['f', 'o', 'o'], 'normal test get splitted by char');
    deepEqual(gSplit('f🙂o'), ['f', '🙂', 'o'], 'normal test get splitted by char');
  });

  test('fabric.util.string.escapeXml', function() {
    var escapeXml = fabric.util.string.escapeXml;

    ok(typeof escapeXml == 'function');

    // borrowed from Prototype.js
    equal('foo bar', escapeXml('foo bar'));
    equal('foo &lt;span&gt;bar&lt;/span&gt;', escapeXml('foo <span>bar</span>'));
    //equal('foo ß bar', escapeXml('foo ß bar'));

    //equal('ウィメンズ2007\nクルーズコレクション', escapeXml('ウィメンズ2007\nクルーズコレクション'));

    equal('a&lt;a href=&quot;blah&quot;&gt;blub&lt;/a&gt;b&lt;span&gt;&lt;div&gt;&lt;/div&gt;&lt;/span&gt;cdef&lt;strong&gt;!!!!&lt;/strong&gt;g',
          escapeXml('a<a href="blah">blub</a>b<span><div></div></span>cdef<strong>!!!!</strong>g'));

    equal('1\n2', escapeXml('1\n2'));
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

  test('fabric.util.object.extend deep', function() {
    var extend = fabric.util.object.extend;
    var d = function() { };
    var destination = { x: 1 },
        source = { y: 2, a: { b: 1, c: [1, 2, 3, d] } };

    extend(destination, source, true);

    equal(destination.x, 1, 'x is still in destination');
    equal(destination.y, 2, 'y has been added');
    deepEqual(destination.a, source.a, 'a has been copied deeply');
    notEqual(destination.a, source.a, 'is not the same object');
    ok(typeof source.a.c[3] === 'function', 'is a function');
    equal(destination.a.c[3], source.a.c[3], 'functions get referenced');
  });

  test('fabric.util.object.clone', function() {
    var clone = fabric.util.object.clone;

    ok(typeof clone == 'function');

    var obj = { x: 1, y: [1, 2, 3] },
        _clone = clone(obj);

    equal(_clone.x, 1);
    notEqual(obj, _clone);
    equal(_clone.y, obj.y);
  });

  test('Function.prototype.bind', function() {
    ok(typeof Function.prototype.bind == 'function');

    var obj = { };
    function fn() {
      return [this, arguments[0], arguments[1]];
    }

    var bound = fn.bind(obj);
    deepEqual([obj, undefined, undefined], bound());
    deepEqual([obj, 1, undefined], bound(1));
    deepEqual([obj, 1, null], bound(1, null));

    bound = fn.bind(obj, 1);
    deepEqual([obj, 1, undefined], bound());
    deepEqual([obj, 1, 2], bound(2));

    function Point(x, y) {
      this.x = x;
      this.y = y;
    }

    obj = { };
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
    deepEqual([1, 3], fabric.util.toArray((function(){ return arguments; })(1, 3)));

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
    equal('function', typeof fabric.loadSVGFromURL);
  });

  var SVG_DOC_AS_STRING = '<?xml version="1.0"?>\
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
      <polygon fill="red" stroke="blue" stroke-width="10" points="350, 75 379,161 469,161\
        397,215 423,301 350,250 277,301 303,215 231,161 321,161" />\
    </svg>';

  asyncTest('fabric.loadSVGFromString', function() {
    equal('function', typeof fabric.loadSVGFromString);

    fabric.loadSVGFromString(SVG_DOC_AS_STRING, function(loadedObjects) {
      ok(loadedObjects[0] instanceof fabric.Polygon);
      equal('red', loadedObjects[0].fill);
      setTimeout(start, 1000);
    });
  });

  asyncTest('fabric.loadSVGFromString with surrounding whitespace', function() {
    var loadedObjects = [];
    fabric.loadSVGFromString('   \n\n  ' + SVG_DOC_AS_STRING + '  ', function(objects) {
      loadedObjects = objects;
    });

    setTimeout(function() {
      ok(loadedObjects[0] instanceof fabric.Polygon);
      equal('red', loadedObjects[0] && loadedObjects[0].fill);
      start();
    }, 1000);
  });

  asyncTest('fabric.util.loadImage', function() {
    ok(typeof fabric.util.loadImage === 'function');

    if (IMG_URL.indexOf('/home/travis') === 0) {
      // image can not be accessed on travis so we're returning early
      start();
      return;
    }

    fabric.util.loadImage(IMG_URL, function(obj) {
      if (obj) {
        var oImg = new fabric.Image(obj);
        ok(/fixtures\/very_large_image\.jpg$/.test(oImg.getSrc()), 'image should have correct src');
      }
      start();
    });
  });

  asyncTest('fabric.util.loadImage with no args', function() {
    if (IMG_URL.indexOf('/home/travis') === 0) {
      // image can not be accessed on travis so we're returning early
      expect(0);
      start();
      return;
    }

    fabric.util.loadImage('', function() {
      ok(1, 'callback should be invoked');
      start();
    });
  });

  asyncTest('fabric.util.loadImage with crossOrigin', function() {
    if (IMG_URL.indexOf('/home/travis') === 0) {
      // image can not be accessed on travis so we're returning early
      expect(0);
      start();
      return;
    }

    fabric.util.loadImage(IMG_URL, function(img) {
      equal(img.src || img._src, IMG_URL, 'src is set');
      // equal(img.crossOrigin, 'anonymous', 'crossOrigin is set');
      start();
    }, null, 'anonymous');
  });


  asyncTest('fabric.util.loadImage with url for a non exsiting image', function() {
    fabric.util.loadImage(IMG_URL_NON_EXISTING, function(img, error) {
      equal(error, true, 'callback should be invoked with error set to true');
      start();
    });
  });

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

    var group1;
    fabric.loadSVGFromString(SVG_WITH_1_ELEMENT, function(objects, options) {
      group1 = fabric.util.groupSVGElements(objects, options);
      ok(group1 instanceof fabric.Polygon, 'it returns just the first element in case is just one');
      start();
    });
  });

  asyncTest('fabric.util.groupSVGElements #2', function() {

    var group2;
    fabric.loadSVGFromString(SVG_WITH_2_ELEMENTS, function(objects, options) {
      group2 = fabric.util.groupSVGElements(objects, options);
      ok(group2 instanceof fabric.Group);
      start();
    });
  });

  test('fabric.util.createClass', function() {
    var Klass = fabric.util.createClass();

    ok(typeof Klass === 'function');
    ok(typeof new Klass() === 'object');

    var Person = fabric.util.createClass({
      initialize: function(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
      },
      toString: function() {
        return 'My name is ' + this.firstName + ' ' + this.lastName;
      }
    });

    ok(typeof Person === 'function');
    ok(typeof new Person() === 'object');

    var john = new Person('John', 'Meadows');
    ok(john instanceof Person);

    equal(john.firstName, 'John');
    equal(john.lastName, 'Meadows');
    equal(john + '', 'My name is John Meadows');


    var WebDeveloper = fabric.util.createClass(Person, {
      initialize: function(firstName, lastName, skills) {
        this.callSuper('initialize', firstName, lastName);
        this.skills = skills;
      },
      toString: function() {
        return this.callSuper('toString') + ' and my skills are ' + this.skills.join(', ');
      }
    });

    ok(typeof WebDeveloper === 'function');
    var dan = new WebDeveloper('Dan', 'Trink', ['HTML', 'CSS', 'Javascript']);
    ok(dan instanceof Person);
    ok(dan instanceof WebDeveloper);

    equal(dan.firstName, 'Dan');
    equal(dan.lastName, 'Trink');
    deepEqual(dan.skills, ['HTML', 'CSS', 'Javascript']);

    equal(dan + '', 'My name is Dan Trink and my skills are HTML, CSS, Javascript');
  });

  // element doesn't seem to have style on node
  if (!fabric.isLikelyNode) {
    test('fabric.util.setStyle', function() {

      ok(typeof fabric.util.setStyle === 'function');

      var el = fabric.document.createElement('div');

      fabric.util.setStyle(el, 'color:red');
      equal(el.style.color, 'red');
    });
  }

  test('fabric.util.request', function() {
    ok(typeof fabric.util.request === 'function', 'fabric.util.request is a function');
  });

  test('fabric.util.getPointer', function() {
    ok(typeof fabric.util.getPointer === 'function', 'fabric.util.getPointer is a function');
  });

  test('fabric.util.addListener', function() {
    ok(typeof fabric.util.addListener === 'function', 'fabric.util.addListener is a function');
  });

  test('fabric.util.removeListener', function() {
    ok(typeof fabric.util.removeListener === 'function', 'fabric.util.removeListener is a function');
  });

  test('fabric.util.drawDashedLine', function() {
    ok(typeof fabric.util.drawDashedLine === 'function');

    var el = fabric.document.createElement('canvas');
    var canvas = fabric.isLikelyNode
      ? fabric.createCanvasForNode()
      : new fabric.Canvas(el);

    var ctx = canvas.getContext('2d');

    fabric.util.drawDashedLine(ctx, 0, 0, 100, 100, [5, 5]);
  });

  test('fabric.util.array.invoke', function() {
    ok(typeof fabric.util.array.invoke === 'function');

    var obj1 = { toString: function(){ return 'obj1'; } };
    var obj2 = { toString: function(){ return 'obj2'; } };
    var obj3 = { toString: function(){ return 'obj3'; } };

    deepEqual(['obj1', 'obj2', 'obj3'],
      fabric.util.array.invoke([obj1, obj2, obj3], 'toString'));

    deepEqual(['f', 'b', 'b'],
      fabric.util.array.invoke(['foo', 'bar', 'baz'], 'charAt', 0));

    deepEqual(['o', 'a', 'a'],
      fabric.util.array.invoke(['foo', 'bar', 'baz'], 'charAt', 1));
  });

  test('fabric.util.array.min', function() {
    ok(typeof fabric.util.array.min === 'function');

    equal(1, fabric.util.array.min([1, 3, 2]));
    equal(-1, fabric.util.array.min([3, 1, 'f', 3, -1, 3]));
    equal(-3, fabric.util.array.min([-1, -2, -3]));
    equal('a', fabric.util.array.min(['a', 'c', 'b']));

    var obj1 = { valueOf: function(){ return 1; } };
    var obj2 = { valueOf: function(){ return 2; } };
    var obj3 = { valueOf: function(){ return 3; } };

    equal(obj1, fabric.util.array.min([obj1, obj3, obj2]));
  });

  test('fabric.util.array.max', function() {
    ok(typeof fabric.util.array.max === 'function');

    equal(3, fabric.util.array.max([1, 3, 2]));
    equal(3, fabric.util.array.max([3, 1, 'f', 3, -1, 3]));
    equal(-1, fabric.util.array.max([-1, -2, -3]));
    equal('c', fabric.util.array.max(['a', 'c', 'b']));

    var obj1 = { valueOf: function(){ return 1; } };
    var obj2 = { valueOf: function(){ return 2; } };
    var obj3 = { valueOf: function(){ return 3; } };

    equal(obj3, fabric.util.array.max([obj1, obj3, obj2]));
  });

  test('fabric.util.populateWithProperties', function() {
    ok(typeof fabric.util.populateWithProperties == 'function');

    var source = {
          foo: 'bar',
          baz: 123,
          qux: function() { }
        },
        destination = { };

    fabric.util.populateWithProperties(source, destination);
    ok(typeof destination.foo === 'undefined');
    ok(typeof destination.baz === 'undefined');
    ok(typeof destination.qux === 'undefined');

    fabric.util.populateWithProperties(source, destination, ['foo']);
    equal(destination.foo, 'bar');
    ok(typeof destination.baz === 'undefined');
    ok(typeof destination.qux === 'undefined');

    fabric.util.populateWithProperties(source, destination, ['foo', 'baz', 'ffffffffff']);
    equal(destination.foo, 'bar');
    equal(destination.baz, 123);
    ok(typeof destination.qux === 'undefined');
    ok(typeof destination.ffffffffff === 'undefined');
  });

  test('fabric.util.getFunctionBody', function() {
    equal(fabric.util.getFunctionBody('function(){}'), '');

    equal(fabric.util.getFunctionBody('function(){return 1 + 2}'),
      'return 1 + 2');

    equal(fabric.util.getFunctionBody('function () {\n  return "blah" }'),
      '\n  return "blah" ');

    equal(fabric.util.getFunctionBody('function foo (a , boo_bar, baz123 )\n{\n if (1) { alert(12345) } }'),
      '\n if (1) { alert(12345) } ');
  });

  test('getKlass', function() {
    equal(fabric.util.getKlass('circle'), fabric.Circle);
    equal(fabric.util.getKlass('rect'), fabric.Rect);
    equal(fabric.util.getKlass('RemoveWhite', 'fabric.Image.filters'), fabric.Image.filters.RemoveWhite);
    equal(fabric.util.getKlass('Sepia2', 'fabric.Image.filters'), fabric.Image.filters.Sepia2);
  });

  test('resolveNamespace', function() {
    equal(fabric.util.resolveNamespace('fabric'), fabric);
    equal(fabric.util.resolveNamespace('fabric.Image'), fabric.Image);
    equal(fabric.util.resolveNamespace('fabric.Image.filters'), fabric.Image.filters);
  });

  test('clearFabricFontCache', function() {
    ok(typeof fabric.util.clearFabricFontCache == 'function');
    fabric.charWidthsCache = { arial: { some: 'cache'}, helvetica: { some: 'cache'} };
    fabric.util.clearFabricFontCache('arial');
    equal(fabric.charWidthsCache.arial,  undefined, 'arial cache is deleted');
    equal(fabric.charWidthsCache.helvetica.some, 'cache', 'helvetica cache is still available');
    fabric.util.clearFabricFontCache();
    deepEqual(fabric.charWidthsCache, { }, 'all cache is deleted');
  });

  test('parsePreserveAspectRatioAttribute', function() {
    ok(typeof fabric.util.parsePreserveAspectRatioAttribute == 'function');
    var parsed;
    parsed = fabric.util.parsePreserveAspectRatioAttribute('none');
    equal(parsed.meetOrSlice, 'meet');
    equal(parsed.alignX, 'none');
    equal(parsed.alignY, 'none');
    parsed = fabric.util.parsePreserveAspectRatioAttribute('none slice');
    equal(parsed.meetOrSlice, 'slice');
    equal(parsed.alignX, 'none');
    equal(parsed.alignY, 'none');
    parsed = fabric.util.parsePreserveAspectRatioAttribute('XmidYmax meet');
    equal(parsed.meetOrSlice, 'meet');
    equal(parsed.alignX, 'mid');
    equal(parsed.alignY, 'max');
  });

  test('multiplyTransformMatrices', function() {
    ok(typeof fabric.util.multiplyTransformMatrices == 'function');
    var m1 = [1, 1, 1, 1, 1, 1], m2 = [1, 1, 1, 1, 1, 1], m3;
    m3 = fabric.util.multiplyTransformMatrices(m1, m2);
    deepEqual(m3, [2, 2, 2, 2, 3, 3]);
    m3 = fabric.util.multiplyTransformMatrices(m1, m2, true);
    deepEqual(m3, [2, 2, 2, 2, 0, 0]);
  });

  test('customTransformMatrix', function() {
    ok(typeof fabric.util.customTransformMatrix == 'function');
    var m1 = fabric.util.customTransformMatrix(5, 4, 45);
    deepEqual(m1, [5, 0, 4.999999999999999, 4, 0, 0]);
  });

  test('resetObjectTransform', function() {
    ok(typeof fabric.util.resetObjectTransform == 'function');
    var rect = new fabric.Rect({
      top: 1,
      width: 100,
      height: 100,
      angle: 30,
      scaleX: 2,
      scaleY: 1,
      flipX: true,
      flipY: true,
      skewX: 30,
      skewY: 30
    });
    equal(rect.skewX, 30);
    equal(rect.skewY, 30);
    equal(rect.scaleX, 2);
    equal(rect.scaleY, 1);
    equal(rect.flipX, true);
    equal(rect.flipY, true);
    equal(rect.angle, 30);
    fabric.util.resetObjectTransform(rect);
    equal(rect.skewX, 0);
    equal(rect.skewY, 0);
    equal(rect.scaleX, 1);
    equal(rect.scaleY, 1);
    equal(rect.flipX, false);
    equal(rect.flipY, false);
    equal(rect.angle, 0);
  });

  test('invertTransform', function() {
    ok(typeof fabric.util.invertTransform == 'function');
    var m1 = [1, 2, 3, 4, 5, 6], m3;
    m3 = fabric.util.invertTransform(m1);
    deepEqual(m3, [-2, 1, 1.5, -0.5, 1, -2]);
  });

  test('rotateVector', function() {
    ok(typeof fabric.util.rotateVector == 'function');
  });

  test('rotatePoint', function() {
    ok(typeof fabric.util.rotatePoint == 'function');
  });

  test('transformPoint', function() {
    ok(typeof fabric.util.transformPoint == 'function');
  });

  test('makeBoundingBoxFromPoints', function() {
    ok(typeof fabric.util.makeBoundingBoxFromPoints == 'function');
  });

  test('parseUnit', function() {
    ok(typeof fabric.util.parseUnit == 'function');
    equal(Math.round(fabric.util.parseUnit('30mm'), 0), 113, '30mm is pixels');
    equal(Math.round(fabric.util.parseUnit('30cm'), 0), 1134, '30cm is pixels');
    equal(Math.round(fabric.util.parseUnit('30in'), 0), 2880, '30in is pixels');
    equal(Math.round(fabric.util.parseUnit('30pt'), 0), 40, '30mm is pixels');
    equal(Math.round(fabric.util.parseUnit('30pc'), 0), 480, '30mm is pixels');
  });

  test('createCanvasElement', function() {
    ok(typeof fabric.util.createCanvasElement == 'function');
  });

  test('createImage', function() {
    ok(typeof fabric.util.createImage == 'function');
  });

  test('createAccessors', function() {
    ok(typeof fabric.util.createAccessors == 'function');
  });

  test('qrDecompose', function() {
    ok(typeof fabric.util.qrDecompose == 'function');
  });

  test('drawArc', function() {
    ok(typeof fabric.util.drawArc == 'function');
    var canvas = this.canvas = fabric.isLikelyNode ? fabric.createCanvasForNode(600, 600, {enableRetinaScaling: false}) : new fabric.Canvas(null, {enableRetinaScaling: false});
    var ctx = canvas.contextContainer;
    fabric.util.drawArc(ctx, 0, 0, [
      50,
      30,
      0,
      1,
      1,
      100,
      100,
    ]);
    fabric.util.drawArc(ctx, 0, 0, [
      50,
      30,
      0,
      1,
      1,
      100,
      100,
    ]);
  });

  test('get bounds of arc', function() {
    ok(typeof fabric.util.getBoundsOfArc == 'function');
    var bounds = fabric.util.getBoundsOfArc(0, 0, 50, 30, 0, 1, 1, 100, 100);
    var expectedBounds = [
      { x: 0, y: -8.318331151877368 },
      { x: 133.33333333333331, y: 19.99999999999999 },
      { x: 100.00000000000003, y: 19.99999999999999 },
      { x: 147.19721858646224, y: 100 }
    ];
    deepEqual(bounds, expectedBounds, 'bounds are as expected');
  });
})();
