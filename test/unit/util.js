(function() {

  QUnit.module('fabric.util');

  function _createImageElement() {
    return fabric.getDocument().createElement('img');
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

  function basename(path) {
    return path.slice(Math.max(path.lastIndexOf('\\'), path.lastIndexOf('/')) + 1);
  }

  function roundArray(array) {
    return array.map((val) => val.toFixed(4));
  }

  var IMG_URL = isNode()
    ? 'file://' + require('path').join(__dirname, '../fixtures/', 'very_large_image.jpg')
    : getAbsolutePath('../fixtures/very_large_image.jpg');

  var IMG_URL_NON_EXISTING = 'http://www.google.com/non-existing';

  QUnit.test('fabric.util.toFixed', function(assert) {
    assert.ok(typeof fabric.util.toFixed === 'function');

    function test(what) {
      assert.equal(fabric.util.toFixed(what, 2), 166.67, 'should leave 2 fractional digits');
      assert.equal(fabric.util.toFixed(what, 5), 166.66667, 'should leave 5 fractional digits');
      assert.equal(fabric.util.toFixed(what, 0), 167, 'should leave 0 fractional digits');

      var fractionless = (typeof what === 'number')
        ? parseInt(what)
        : what.substring(0, what.indexOf('.'));

      assert.equal(fabric.util.toFixed(fractionless, 2), 166, 'should leave fractionless number as is');
    }

    test.call(this, '166.66666666666666666666'); // string
    test.call(this, 166.66666666666666666666); // number
  });

  QUnit.test('fabric.util.removeFromArray', function(assert) {
    var testArray = [1,2,3,4,5];

    assert.ok(typeof fabric.util.removeFromArray === 'function');

    fabric.util.removeFromArray(testArray, 2);
    assert.deepEqual([1,3,4,5], testArray);
    assert.equal(fabric.util.removeFromArray(testArray, 1), testArray, 'should return reference to original array');

    testArray = [1,2,3,1];
    fabric.util.removeFromArray(testArray, 1);
    assert.deepEqual([2,3,1], testArray, 'only first occurance of value should be deleted');

    testArray = [1,2,3];
    fabric.util.removeFromArray(testArray, 12);
    assert.deepEqual([1,2,3], testArray, 'deleting unexistent value should not affect array');

    testArray = [];
    fabric.util.removeFromArray(testArray, 1);
    assert.deepEqual([], testArray, 'deleting any value from empty array should not affect it');

    testArray = ['0'];
    fabric.util.removeFromArray(testArray, 0);
    assert.deepEqual(['0'], testArray, 'should use (strict) identity comparison, rather than equality one');
  });

  QUnit.test('fabric.util.degreesToRadians', function(assert) {
    assert.ok(typeof fabric.util.degreesToRadians === 'function');
    assert.equal(fabric.util.degreesToRadians(0), 0);
    assert.equal(fabric.util.degreesToRadians(90), Math.PI / 2);
    assert.equal(fabric.util.degreesToRadians(180), Math.PI);

    assert.deepEqual(fabric.util.degreesToRadians(), NaN);
  });

  QUnit.test('fabric.util.radiansToDegrees', function(assert) {
    assert.ok(typeof fabric.util.radiansToDegrees === 'function');

    assert.equal(fabric.util.radiansToDegrees(0), 0);
    assert.equal(fabric.util.radiansToDegrees(Math.PI / 2), 90);
    assert.equal(fabric.util.radiansToDegrees(Math.PI), 180);

    assert.deepEqual(fabric.util.radiansToDegrees(), NaN);
  });

  QUnit.test('calcRotateMatrix', function (assert) {
    assert.ok(typeof fabric.util.calcRotateMatrix === 'function', 'calcRotateMatrix should exist');
    var matrix = fabric.util.calcRotateMatrix({ angle: 90 });
    var expected = [
      0,
      1,
      -1,
      0,
      0,
      0
    ];
    assert.deepEqual(matrix, expected, 'rotate matrix is equal');
  });

  QUnit.test('fabric.util.getRandomInt', function(assert) {
    assert.ok(typeof fabric.util.getRandomInt === 'function');

    var randomInts = [];
    for (var i = 100; i--; ) {
      var randomInt = fabric.util.getRandomInt(100, 200);
      randomInts.push(randomInt);
      assert.ok(randomInt >= 100 && randomInt <= 200);
    }

    var areAllTheSame = randomInts.every(function(value){
      return value === randomInts[0];
    });

    assert.ok(!areAllTheSame);
  });

  QUnit.test('fabric.util.string.graphemeSplit', function(assert) {
    var gSplit = fabric.util.string.graphemeSplit;

    assert.ok(typeof gSplit === 'function');

    assert.deepEqual(gSplit('foo'), ['f', 'o', 'o'], 'normal test get splitted by char');
    assert.deepEqual(gSplit('f🙂o'), ['f', '🙂', 'o'], 'normal test get splitted by char');
  });

  QUnit.test('fabric.util.string.escapeXml', function(assert) {
    var escapeXml = fabric.util.string.escapeXml;

    assert.ok(typeof escapeXml === 'function');

    // borrowed from Prototype.js
    assert.equal('foo bar', escapeXml('foo bar'));
    assert.equal('foo &lt;span&gt;bar&lt;/span&gt;', escapeXml('foo <span>bar</span>'));
    //equal('foo ß bar', escapeXml('foo ß bar'));

    //equal('ウィメンズ2007\nクルーズコレクション', escapeXml('ウィメンズ2007\nクルーズコレクション'));

    assert.equal('a&lt;a href=&quot;blah&quot;&gt;blub&lt;/a&gt;b&lt;span&gt;&lt;div&gt;&lt;/div&gt;&lt;/span&gt;cdef&lt;strong&gt;!!!!&lt;/strong&gt;g',
      escapeXml('a<a href="blah">blub</a>b<span><div></div></span>cdef<strong>!!!!</strong>g'));

    assert.equal('1\n2', escapeXml('1\n2'));
  });

  QUnit.test('fabric.util.string.capitalize', function(assert) {
    var capitalize = fabric.util.string.capitalize;

    assert.ok(typeof capitalize === 'function');

    assert.equal(capitalize('foo'), 'Foo');
    assert.equal(capitalize(''), '');
    assert.equal(capitalize('Foo'), 'Foo');
    assert.equal(capitalize('foo-bar-baz'), 'Foo-bar-baz');
    assert.equal(capitalize('FOO'), 'Foo');
    assert.equal(capitalize('FoobaR'), 'Foobar');
    assert.equal(capitalize('2foo'), '2foo');
  });

  QUnit.test('fabric.util.wrapElement', function(assert) {
    var wrapElement = fabric.util.wrapElement;
    assert.ok(typeof wrapElement === 'function');
    var wrapper = fabric.getDocument().createElement('div');
    var el = fabric.getDocument().createElement('p');
    var wrapper = wrapElement(el, wrapper);

    assert.equal(wrapper.tagName.toLowerCase(), 'div');
    assert.equal(wrapper.firstChild, el);

    var childEl = fabric.getDocument().createElement('span');
    var parentEl = fabric.getDocument().createElement('p');

    parentEl.appendChild(childEl);

    wrapper = wrapElement(childEl, fabric.getDocument().createElement('strong'));

    // wrapper is now in between parent and child
    assert.equal(wrapper.parentNode, parentEl);
    assert.equal(wrapper.firstChild, childEl);
  });

  QUnit.test('fabric.util.makeElementUnselectable', function(assert) {
    var makeElementUnselectable = fabric.util.makeElementUnselectable;

    assert.ok(typeof makeElementUnselectable === 'function');

    var el = fabric.getDocument().createElement('p');
    el.appendChild(fabric.getDocument().createTextNode('foo'));

    assert.equal(el, makeElementUnselectable(el), 'should be "chainable"');

    if (typeof el.onselectstart !== 'undefined') {
      assert.equal(el.onselectstart.toString(), (() => false).toString());
    }

    // not sure if it's a good idea to test implementation details here
    // functional test would probably make more sense
    if (typeof el.unselectable === 'string') {
      assert.equal('on', el.unselectable);
    }
    else if (typeof el.userSelect !== 'undefined') {
      assert.equal('none', el.userSelect);
    }
  });

  QUnit.test('fabric.util.makeElementSelectable', function(assert) {
    var makeElementSelectable = fabric.util.makeElementSelectable,
        makeElementUnselectable = fabric.util.makeElementUnselectable;

    assert.ok(typeof makeElementSelectable === 'function');

    var el = fabric.getDocument().createElement('p');
    el.appendChild(fabric.getDocument().createTextNode('foo'));

    makeElementUnselectable(el);
    makeElementSelectable(el);

    if (typeof el.onselectstart !== 'undefined') {
      assert.equal(el.onselectstart, null);
    }
    if (typeof el.unselectable === 'string') {
      assert.equal('', el.unselectable);
    }
    else if (typeof el.userSelect !== 'undefined') {
      assert.equal('', el.userSelect);
    }
  });

  QUnit.test('fabric.loadSVGFromURL', function(assert) {
    assert.equal('function', typeof fabric.loadSVGFromURL);
  });

  var SVG_DOC_AS_STRING = '<?xml version="1.0"?>\
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
      <polygon fill="red" stroke="blue" stroke-width="10" points="350, 75 379,161 469,161\
        397,215 423,301 350,250 277,301 303,215 231,161 321,161" />\
    </svg>';

  QUnit.test('fabric.loadSVGFromString', function(assert) {
    var done = assert.async();
    assert.equal('function', typeof fabric.loadSVGFromString);

    fabric.loadSVGFromString(SVG_DOC_AS_STRING, function(loadedObjects) {
      assert.ok(loadedObjects[0] instanceof fabric.Polygon);
      assert.equal('red', loadedObjects[0].fill);
      setTimeout(done, 1000);
    });
  });

  QUnit.test('fabric.loadSVGFromString with surrounding whitespace', function(assert) {
    var done = assert.async();
    var loadedObjects = [];
    fabric.loadSVGFromString('   \n\n  ' + SVG_DOC_AS_STRING + '  ', function(objects) {
      loadedObjects = objects;
    });

    setTimeout(function() {
      assert.ok(loadedObjects[0] instanceof fabric.Polygon);
      assert.equal('red', loadedObjects[0] && loadedObjects[0].fill);
      done();
    }, 1000);
  });

  QUnit.test('fabric.util.loadImage', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.loadImage === 'function');

    if (IMG_URL.indexOf('/home/travis') === 0) {
      // image can not be accessed on travis so we're returning early
      done();
      return;
    }

    fabric.util.loadImage(IMG_URL).then(function(obj) {
      if (obj) {
        var oImg = new fabric.Image(obj);
        assert.ok(/fixtures\/very_large_image\.jpg$/.test(oImg.getSrc()), 'image should have correct src');
      }
      done();
    });
  });

  QUnit.test('fabric.util.loadImage with no args', function(assert) {
    var done = assert.async();
    if (IMG_URL.indexOf('/home/travis') === 0) {
      // image can not be accessed on travis so we're returning early
      assert.expect(0);
      done();
      return;
    }

    fabric.util.loadImage('').then(function() {
      assert.ok(1, 'callback should be invoked');
      done();
    });
  });

  QUnit.test('fabric.util.loadImage with crossOrigin', function(assert) {
    var done = assert.async();
    if (IMG_URL.indexOf('/home/travis') === 0) {
      // image can not be accessed on travis so we're returning early
      assert.expect(0);
      done();
      return;
    }
    try {
      fabric.util.loadImage(IMG_URL, { crossOrigin: 'anonymous' }).then(function(img, isError) {
        assert.equal(basename(img.src), basename(IMG_URL), 'src is set');
        assert.equal(img.crossOrigin, 'anonymous', 'crossOrigin is set');
        assert.ok(!isError);
        done();
      });
    }
    catch (e) {
      console.log(e);
    }
  });

  QUnit.test('fabric.util.loadImage with url for a non exsiting image', function(assert) {
    var done = assert.async();
    fabric.util.loadImage(IMG_URL_NON_EXISTING).catch(function(err) {
      assert.ok(err instanceof Error, 'callback should be invoked with error set to true');
      done();
    });
  });

  QUnit.test('fabric.util.loadImage with AbortController', function (assert) {
    var done = assert.async();
    var abortController = new AbortController();
    fabric.util.loadImage(IMG_URL, { signal: abortController.signal })
      .catch(function (err) {
        assert.equal(err.type, 'abort', 'should be an abort event');
        done();
      });
    abortController.abort();
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

  QUnit.test('fabric.util.groupSVGElements', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.util.groupSVGElements === 'function');

    var group1;
    fabric.loadSVGFromString(SVG_WITH_1_ELEMENT, function(objects, options) {
      group1 = fabric.util.groupSVGElements(objects, options);
      assert.ok(group1 instanceof fabric.Polygon, 'it returns just the first element in case is just one');
      done();
    });
  });

  QUnit.test('fabric.util.groupSVGElements #2', function(assert) {
    var done = assert.async();
    var group2;
    fabric.loadSVGFromString(SVG_WITH_2_ELEMENTS, function(objects, options) {
      group2 = fabric.util.groupSVGElements(objects, options);
      assert.ok(group2 instanceof fabric.Group);
      done();
    });
  });

  // element doesn't seem to have style on node
  if (!isNode()) {
    QUnit.test('fabric.util.setStyle', function(assert) {

      assert.ok(typeof fabric.util.setStyle === 'function');

      var el = fabric.getDocument().createElement('div');

      fabric.util.setStyle(el, 'color:red');
      assert.equal(el.style.color, 'red');
      fabric.util.setStyle(el, 'color:blue;border-radius:3px');
      assert.equal(el.style.color, 'blue');
      assert.equal(el.style.borderRadius, '3px');
      fabric.util.setStyle(el, { color: 'yellow', width: '45px' });
      assert.equal(el.style.color, 'yellow');
      assert.equal(el.style.width, '45px');
    });
  }

  QUnit.test('fabric.util.pick', function(assert) {
    assert.ok(typeof fabric.util.pick === 'function');

    var source = {
      foo: 'bar',
      baz: 123,
      qux: function () { }
    };

    let destination = fabric.util.pick(source);
    assert.ok(typeof destination.foo === 'undefined');
    assert.ok(typeof destination.baz === 'undefined');
    assert.ok(typeof destination.qux === 'undefined');

    destination = fabric.util.pick(source, ['foo']);
    assert.equal(destination.foo, 'bar');
    assert.ok(typeof destination.baz === 'undefined');
    assert.ok(typeof destination.qux === 'undefined');

    destination = fabric.util.pick(source, ['foo', 'baz', 'ffffffffff']);
    assert.equal(destination.foo, 'bar');
    assert.equal(destination.baz, 123);
    assert.ok(typeof destination.qux === 'undefined');
    assert.ok(typeof destination.ffffffffff === 'undefined');
  });

  QUnit.test('clearFontCache', function(assert) {
    assert.ok(typeof fabric.cache.clearFontCache === 'function');
    fabric.cache.charWidthsCache = { arial: { some: 'cache'}, helvetica: { some: 'cache'} };
    fabric.cache.clearFontCache('arial');
    assert.equal(fabric.cache.charWidthsCache.arial,  undefined, 'arial cache is deleted');
    assert.equal(fabric.cache.charWidthsCache.helvetica.some, 'cache', 'helvetica cache is still available');
    fabric.cache.clearFontCache();
    assert.deepEqual(fabric.cache.charWidthsCache, { }, 'all cache is deleted');
  });

  QUnit.test('clearFontCache wrong case', function(assert) {
    fabric.cache.charWidthsCache = { arial: { some: 'cache'}, helvetica: { some: 'cache'} };
    fabric.cache.clearFontCache('ARIAL');
    assert.equal(fabric.cache.charWidthsCache.arial,  undefined, 'arial cache is deleted');
    assert.equal(fabric.cache.charWidthsCache.helvetica.some, 'cache', 'helvetica cache is still available');
  });

  QUnit.test('parsePreserveAspectRatioAttribute', function(assert) {
    assert.ok(typeof fabric.util.parsePreserveAspectRatioAttribute === 'function');
    var parsed;
    parsed = fabric.util.parsePreserveAspectRatioAttribute('none');
    assert.equal(parsed.meetOrSlice, 'meet');
    assert.equal(parsed.alignX, 'none');
    assert.equal(parsed.alignY, 'none');
    parsed = fabric.util.parsePreserveAspectRatioAttribute('none slice');
    assert.equal(parsed.meetOrSlice, 'slice');
    assert.equal(parsed.alignX, 'none');
    assert.equal(parsed.alignY, 'none');
    parsed = fabric.util.parsePreserveAspectRatioAttribute('XmidYmax meet');
    assert.equal(parsed.meetOrSlice, 'meet');
    assert.equal(parsed.alignX, 'mid');
    assert.equal(parsed.alignY, 'max');
    parsed = fabric.util.parsePreserveAspectRatioAttribute('XmidYmin');
    assert.equal(parsed.meetOrSlice, 'meet');
    assert.equal(parsed.alignX, 'mid');
    assert.equal(parsed.alignY, 'min');
  });

  QUnit.test('multiplyTransformMatrices', function(assert) {
    assert.ok(typeof fabric.util.multiplyTransformMatrices === 'function');
    var m1 = [1, 1, 1, 1, 1, 1], m2 = [1, 1, 1, 1, 1, 1], m3;
    m3 = fabric.util.multiplyTransformMatrices(m1, m2);
    assert.deepEqual(m3, [2, 2, 2, 2, 3, 3]);
    m3 = fabric.util.multiplyTransformMatrices(m1, m2, true);
    assert.deepEqual(m3, [2, 2, 2, 2, 0, 0]);
  });

  QUnit.test('resetObjectTransform', function(assert) {
    assert.ok(typeof fabric.util.resetObjectTransform === 'function');
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
    assert.equal(rect.skewX, 30);
    assert.equal(rect.skewY, 30);
    assert.equal(rect.scaleX, 2);
    assert.equal(rect.scaleY, 1);
    assert.equal(rect.flipX, true);
    assert.equal(rect.flipY, true);
    assert.equal(rect.angle, 30);
    fabric.util.resetObjectTransform(rect);
    assert.equal(rect.skewX, 0);
    assert.equal(rect.skewY, 0);
    assert.equal(rect.scaleX, 1);
    assert.equal(rect.scaleY, 1);
    assert.equal(rect.flipX, false);
    assert.equal(rect.flipY, false);
    assert.equal(rect.angle, 0);
  });

  QUnit.test('saveObjectTransform', function(assert) {
    assert.ok(typeof fabric.util.saveObjectTransform === 'function');
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
    var transform = fabric.util.saveObjectTransform(rect);
    assert.equal(transform.skewX, 30);
    assert.equal(transform.skewY, 30);
    assert.equal(transform.scaleX, 2);
    assert.equal(transform.scaleY, 1);
    assert.equal(transform.flipX, true);
    assert.equal(transform.flipY, true);
    assert.equal(transform.angle, 30);
  });

  QUnit.test('isIdentityMatrix', function(assert) {
    assert.equal(fabric.util.isIdentityMatrix([1, 0, 0, 1, 0, 0]), true, 'is identity');
    assert.equal(fabric.util.isIdentityMatrix([1, 2, 3, 4, 5, 6]), false, 'is not identity');
  });

  QUnit.test('invertTransform', function(assert) {
    assert.ok(typeof fabric.util.invertTransform === 'function');
    var m1 = [1, 2, 3, 4, 5, 6], m3;
    m3 = fabric.util.invertTransform(m1);
    assert.deepEqual(m3, [-2, 1, 1.5, -0.5, 1, -2]);
  });

  QUnit.test('fabric.util.request', function(assert) {
    assert.ok(typeof fabric.util.request === 'function', 'fabric.util.request is a function');
  });

  QUnit.test('fabric.util.getPointer', function(assert) {
    assert.ok(typeof fabric.util.getPointer === 'function', 'fabric.util.getPointer is a function');
  });

  QUnit.test('rotateVector', function(assert) {
    assert.ok(typeof fabric.util.rotateVector === 'function');
  });

  QUnit.test('rotatePoint', function(assert) {
    assert.ok(typeof fabric.util.rotatePoint === 'function');
    var origin = new fabric.Point(3, 0);
    var point = new fabric.Point(4, 0);
    var rotated = fabric.util.rotatePoint(point, origin, Math.PI);
    assert.equal(Math.round(rotated.x), 2);
    assert.equal(Math.round(rotated.y), 0);
    var rotated = fabric.util.rotatePoint(point, origin, Math.PI / 2);
    assert.equal(Math.round(rotated.x), 3);
    assert.equal(Math.round(rotated.y), 1);
  });

  QUnit.test('transformPoint', function(assert) {
    assert.ok(typeof fabric.util.transformPoint === 'function');
    var point = new fabric.Point(2, 2);
    var matrix = [3, 0, 0, 2, 10, 4];
    var tp = fabric.util.transformPoint(point, matrix);
    assert.equal(Math.round(tp.x), 16);
    assert.equal(Math.round(tp.y), 8);
  });

  /**
   *
   * @param {*} actual
   * @param {*} expected
   * @param {*} [message]
   * @param {number} [error] floating point precision, defaults to 10
   */
  QUnit.assert.matrixIsEqualEnough = function (actual, expected, message, error) {
    var error = Math.pow(10, error ? -error : -10);
    this.pushResult({
      result: actual.every((x, i) => Math.abs(x - expected[i]) < error),
      actual: actual,
      expected: expected,
      message: message
    })
  }

  QUnit.test('calcPlaneChangeMatrix', function (assert) {
    assert.ok(typeof fabric.util.calcPlaneChangeMatrix === 'function');
    const m1 = [1, 2, 3, 4, 5, 6];
    const s = [2, 0, 0, 0.5, 0, 0];
    assert.deepEqual(fabric.util.calcPlaneChangeMatrix(), fabric.iMatrix);
    assert.deepEqual(fabric.util.calcPlaneChangeMatrix(undefined, m1), fabric.util.invertTransform(m1));
    assert.deepEqual(fabric.util.calcPlaneChangeMatrix(fabric.iMatrix, m1), fabric.util.invertTransform(m1));
    assert.deepEqual(fabric.util.calcPlaneChangeMatrix(m1, undefined), m1);
    assert.deepEqual(fabric.util.calcPlaneChangeMatrix(m1, fabric.iMatrix), m1);
    assert.deepEqual(fabric.util.calcPlaneChangeMatrix(m1, m1), fabric.iMatrix);
    assert.deepEqual(fabric.util.calcPlaneChangeMatrix(m1, s), fabric.util.multiplyTransformMatrices(fabric.util.invertTransform(s), m1));
  })

  QUnit.test('sendPointToPlane', function (assert) {
    assert.ok(typeof fabric.util.sendPointToPlane === 'function');
    var m1 = [3, 0, 0, 2, 10, 4],
      m2 = [1, 2, 3, 4, 5, 6],
      p, t,
      obj1 = new fabric.Object(),
      obj2 = new fabric.Object(),
      point = new fabric.Point(2, 2),
      applyTransformToObject = fabric.util.applyTransformToObject,
      invert = fabric.util.invertTransform,
      multiply = fabric.util.multiplyTransformMatrices,
      transformPoint = fabric.util.transformPoint;

    function sendPointToPlane(point, from, to, relationFrom, relationTo) {
      return fabric.util.sendPointToPlane(
        point,
        from ?
          relationFrom === 'child' ? from.calcTransformMatrix() : from.group?.calcTransformMatrix() :
          undefined,
        to ?
          relationTo === 'child' ? to.calcTransformMatrix() : to.group?.calcTransformMatrix() :
          undefined
      );
    }

    applyTransformToObject(obj1, m1);
    applyTransformToObject(obj2, m2);
    obj1.group = new fabric.Object();
    obj2.group = new fabric.Object();
    applyTransformToObject(obj1.group, m1);
    applyTransformToObject(obj2.group, m2);
    p = sendPointToPlane(point, obj1, obj2, 'child', 'child');
    t = multiply(invert(obj2.calcTransformMatrix()), obj1.calcTransformMatrix());
    assert.deepEqual(p, transformPoint(point, t));
    p = sendPointToPlane(point, obj1, obj2, 'sibling', 'child');
    t = multiply(invert(obj2.calcTransformMatrix()), obj1.group.calcTransformMatrix());
    assert.deepEqual(p, transformPoint(point, t));
    p = sendPointToPlane(point, obj1, obj2, 'child', 'sibling');
    t = multiply(invert(obj2.group.calcTransformMatrix()), obj1.calcTransformMatrix());
    assert.deepEqual(p, transformPoint(point, t));
    p = sendPointToPlane(point, obj1, obj2, 'sibling', 'sibling');
    t = multiply(invert(obj2.group.calcTransformMatrix()), obj1.group.calcTransformMatrix());
    assert.deepEqual(p, transformPoint(point, t));
    p = sendPointToPlane(point, null, obj2, null, 'sibling');
    t = invert(obj2.group.calcTransformMatrix());
    assert.deepEqual(p, transformPoint(point, t));

    var obj = new fabric.Rect({ left: 20, top: 20, width: 60, height: 60, strokeWidth: 0 });
    var group = new fabric.Group([obj], { strokeWidth: 0 });
    var sentPoint = sendPointToPlane(new fabric.Point(50, 50), null, obj, null, 'sibling');
    assert.deepEqual(sentPoint, new fabric.Point(0, 0));
    sentPoint = sendPointToPlane(new fabric.Point(50, 50), null, group, null, 'child');
    assert.deepEqual(sentPoint, new fabric.Point(0, 0));
    group.scaleX = 2;
    sentPoint = sendPointToPlane(new fabric.Point(80, 50), null, obj, null, 'sibling');
    assert.deepEqual(sentPoint, new fabric.Point(0, 0));
    sentPoint = sendPointToPlane(new fabric.Point(80, 50), null, group, null, 'child');
    assert.deepEqual(sentPoint, new fabric.Point(0, 0));
    assert.deepEqual(sendPointToPlane(point), point, 'sending to nowhere, point remains unchanged');
  });

  QUnit.test('transformPointRelativeToCanvas', function(assert) {
    assert.ok(typeof fabric.util.transformPointRelativeToCanvas === 'function');
    var point = new fabric.Point(2, 2);
    var matrix = [3, 0, 0, 2, 10, 4];
    var canvas = {
      viewportTransform: matrix
    }
    var transformPoint = fabric.util.transformPoint;
    var invertTransform = fabric.util.invertTransform;
    var transformPointRelativeToCanvas = fabric.util.transformPointRelativeToCanvas;
    var p = transformPointRelativeToCanvas(point, canvas, 'sibling', 'child');
    assert.deepEqual(p, transformPoint(point, invertTransform(matrix)));
    p = transformPointRelativeToCanvas(point, canvas, 'child', 'sibling');
    assert.deepEqual(p, transformPoint(point, matrix));
    p = transformPointRelativeToCanvas(point, canvas, 'child', 'child');
    assert.deepEqual(p, point);
    p = transformPointRelativeToCanvas(point, canvas, 'sibling', 'sibling');
    assert.deepEqual(p, point);
    assert.throws(function () {
      transformPointRelativeToCanvas(point, canvas, 'sibling');
    });
    assert.throws(function () {
      transformPointRelativeToCanvas(point, canvas, 'sibling', true);
    });
    assert.throws(function () {
      transformPointRelativeToCanvas(point, canvas, 'sibling', 'chil');
    });
  });

  QUnit.test('sendObjectToPlane', function (assert) {
    assert.ok(typeof fabric.util.sendObjectToPlane === 'function');
    var m = [6, Math.SQRT1_2, 0, 3, 2, 1],
      m1 = [3, 0, 0, 2, 10, 4],
      m2 = [1, Math.SQRT1_2, Math.SQRT1_2, 4, 5, 6],
      actual, expected,
      obj1 = new fabric.Object(),
      obj2 = new fabric.Object(),
      obj = new fabric.Object(),
      sendObjectToPlane = fabric.util.sendObjectToPlane,
      applyTransformToObject = fabric.util.applyTransformToObject,
      invert = fabric.util.invertTransform,
      multiply = fabric.util.multiplyTransformMatrices;
    //  silence group check
    obj1.isOnACache = () => false;

    applyTransformToObject(obj, m);
    applyTransformToObject(obj1, m1);
    applyTransformToObject(obj2, m2);
    obj.group = obj1;
    actual = sendObjectToPlane(obj, obj1.calcTransformMatrix(), obj2.calcTransformMatrix());
    expected = multiply(invert(obj2.calcTransformMatrix()), obj1.calcTransformMatrix());
    assert.matrixIsEqualEnough(actual, expected);
    assert.matrixIsEqualEnough(obj.calcOwnMatrix(), multiply(actual, m));
    obj.group = obj2;
    assert.matrixIsEqualEnough(obj.calcTransformMatrix(), multiply(multiply(obj2.calcTransformMatrix(), actual), m));
    assert.deepEqual(sendObjectToPlane(obj2), fabric.iMatrix, 'sending to nowhere, no transform was applied');
    assert.matrixIsEqualEnough(obj2.calcOwnMatrix(), m2, 'sending to nowhere, no transform was applied');
  });

  QUnit.test('makeBoundingBoxFromPoints', function(assert) {
    assert.ok(typeof fabric.util.makeBoundingBoxFromPoints === 'function');
    assert.deepEqual(fabric.util.makeBoundingBoxFromPoints([
      new fabric.Point(50, 50),
      new fabric.Point(-50, 50),
      new fabric.Point(50, -50),
      new fabric.Point(-50, -50),
      new fabric.Point(50, 50),
      new fabric.Point(80, -30),
      new fabric.Point(100, 50),
    ]), {
      left: -50,
      top: -50,
      width: 150,
      height: 100
    }, 'bbox should match');
  });

  QUnit.test('parseUnit', function(assert) {
    assert.ok(typeof fabric.util.parseUnit === 'function');
    assert.equal(Math.round(fabric.util.parseUnit('30mm'), 0), 113, '30mm is pixels');
    assert.equal(Math.round(fabric.util.parseUnit('30cm'), 0), 1134, '30cm is pixels');
    assert.equal(Math.round(fabric.util.parseUnit('30in'), 0), 2880, '30in is pixels');
    assert.equal(Math.round(fabric.util.parseUnit('30pt'), 0), 40, '30mm is pixels');
    assert.equal(Math.round(fabric.util.parseUnit('30pc'), 0), 480, '30mm is pixels');
  });

  QUnit.test('createCanvasElement', function(assert) {
    assert.ok(typeof fabric.util.createCanvasElement === 'function');
    var element = fabric.util.createCanvasElement();
    assert.ok(element.getContext);
  });

  QUnit.test('createImage', function(assert) {
    assert.ok(typeof fabric.util.createImage === 'function');
    var element = fabric.util.createImage();
    assert.equal(element.naturalHeight, 0);
    assert.equal(element.naturalWidth, 0);
  });

  QUnit.test('qrDecompose with identity matrix', function(assert) {
    assert.ok(typeof fabric.util.qrDecompose === 'function');
    var options = fabric.util.qrDecompose(fabric.iMatrix);
    assert.equal(options.scaleX, 1, 'imatrix has scale 1');
    assert.equal(options.scaleY, 1, 'imatrix has scale 1');
    assert.equal(options.skewX, 0, 'imatrix has skewX 0');
    assert.equal(options.skewY, 0, 'imatrix has skewY 0');
    assert.equal(options.angle, 0, 'imatrix has angle 0');
    assert.equal(options.translateX, 0, 'imatrix has translateX 0');
    assert.equal(options.translateY, 0, 'imatrix has translateY 0');
  });

  QUnit.test('qrDecompose with matrix', function(assert) {
    assert.ok(typeof fabric.util.qrDecompose === 'function');
    var options = fabric.util.qrDecompose([2, 0.4, 0.5, 3, 100, 200]);
    assert.equal(Math.round(options.scaleX, 4), 2, 'imatrix has scale');
    assert.equal(Math.round(options.scaleY, 4), 3, 'imatrix has scale');
    assert.equal(Math.round(options.skewX, 4), 28, 'imatrix has skewX');
    assert.equal(options.skewY, 0, 'imatrix has skewY 0');
    assert.equal(Math.round(options.angle, 4), 11, 'imatrix has angle 0');
    assert.equal(options.translateX, 100, 'imatrix has translateX 100');
    assert.equal(options.translateY, 200, 'imatrix has translateY 200');
  });

  QUnit.test('composeMatrix with defaults', function(assert) {
    assert.ok(typeof fabric.util.composeMatrix === 'function');
    var matrix = fabric.util.composeMatrix({
      scaleX: 2,
      scaleY: 3,
      skewX: 28,
      angle: 11,
      translateX: 100,
      translateY: 200,
    }).map(function(val) {
      return fabric.util.toFixed(val, 2);
    });
    assert.deepEqual(matrix, [1.96, 0.38, 0.47, 3.15, 100, 200], 'default is identity matrix');
  });

  QUnit.test('composeMatrix with options', function(assert) {
    assert.ok(typeof fabric.util.composeMatrix === 'function');
    var matrix = fabric.util.composeMatrix({});
    assert.deepEqual(matrix, fabric.iMatrix, 'default is identity matrix');
  });

  QUnit.test('fabric.util.capValue ar < 1', function(assert) {
    assert.ok(typeof fabric.util.capValue === 'function');
    var val = fabric.util.capValue(3, 10, 70);
    assert.equal(val, 10, 'value is not capped');
  });

  QUnit.test('fabric.util.capValue ar < 1', function(assert) {
    assert.ok(typeof fabric.util.capValue === 'function');
    var val = fabric.util.capValue(3, 1, 70);
    assert.equal(val, 3, 'min cap');
  });

  QUnit.test('fabric.util.capValue ar < 1', function(assert) {
    assert.ok(typeof fabric.util.capValue === 'function');
    var val = fabric.util.capValue(3, 80, 70);
    assert.equal(val, 70, 'max cap');
  });

  QUnit.test('fabric.util.cos', function(assert) {
    assert.ok(typeof fabric.util.cos === 'function');
    assert.equal(fabric.util.cos(0), 1, 'cos 0 correct');
    assert.equal(fabric.util.cos(Math.PI / 2), 0, 'cos 90 correct');
    assert.equal(fabric.util.cos(Math.PI), -1, 'cos 180 correct');
    assert.equal(fabric.util.cos(3 * Math.PI / 2), 0,' cos 270 correct');
  });

  QUnit.test('fabric.util.getSvgAttributes', function(assert) {
    assert.ok(typeof fabric.util.getSvgAttributes === 'function');
    assert.deepEqual(fabric.util.getSvgAttributes(''),
      ['instantiated_by_use', 'style', 'id', 'class'], 'common attribs');
    assert.deepEqual(fabric.util.getSvgAttributes('linearGradient'),
      ['instantiated_by_use', 'style', 'id', 'class', 'x1', 'y1', 'x2', 'y2', 'gradientUnits', 'gradientTransform'],
      'linearGradient attribs');
    assert.deepEqual(fabric.util.getSvgAttributes('radialGradient'),
      ['instantiated_by_use', 'style', 'id', 'class', 'gradientUnits', 'gradientTransform', 'cx', 'cy', 'r', 'fx', 'fy', 'fr'],
      'radialGradient attribs');
    assert.deepEqual(fabric.util.getSvgAttributes('stop'),
      ['instantiated_by_use', 'style', 'id', 'class', 'offset', 'stop-color', 'stop-opacity'],
      'stop attribs');
  });

  QUnit.test('fabric.util.copyCanvasElement', function(assert) {
    assert.ok(typeof fabric.util.copyCanvasElement === 'function');
    var c = fabric.util.createCanvasElement();
    c.width = 10;
    c.height = 20;
    c.getContext('2d').fillStyle = 'red';
    c.getContext('2d').fillRect(0, 0, 10, 10);
    var b = fabric.util.copyCanvasElement(c);
    assert.equal(b.width, 10, 'width has been copied');
    assert.equal(b.height, 20, 'height has been copied');
    var data = b.getContext('2d').getImageData(1,1,1,1).data;
    assert.equal(data[0], 255, 'red color has been copied');
    assert.equal(data[1], 0, 'red color has been copied');
    assert.equal(data[2], 0, 'red color has been copied');
    assert.equal(data[3], 255, 'red color has been copied');
  });

  QUnit.test('fabric.util.findScaleToCover', function(assert) {
    assert.ok(typeof fabric.util.findScaleToCover === 'function');
    var scale = fabric.util.findScaleToCover({
      width: 100,
      height: 200,
    }, {
      width: 50,
      height: 50,
    });
    assert.equal(scale, 0.5, 'scaleToCover is 0.5');
    var scale = fabric.util.findScaleToCover({
      width: 10,
      height: 25,
    }, {
      width: 50,
      height: 50,
    });
    assert.equal(scale, 5, 'scaleToCover is 5');
  });

  QUnit.test('fabric.util.findScaleToFit', function(assert) {
    assert.ok(typeof fabric.util.findScaleToFit === 'function');
    var scale = fabric.util.findScaleToFit({
      width: 100,
      height: 200,
    }, {
      width: 50,
      height: 50,
    });
    assert.equal(scale, 0.25, 'findScaleToFit is 0.25');
    var scale = fabric.util.findScaleToFit({
      width: 10,
      height: 25,
    }, {
      width: 50,
      height: 50,
    });
    assert.equal(scale, 2, 'findScaleToFit is 2');
  });

  QUnit.test('fabric.util.isTouchEvent', function(assert) {
    assert.ok(typeof fabric.util.isTouchEvent === 'function');
    assert.ok(fabric.util.isTouchEvent({ type: 'touchstart' }));
    assert.ok(fabric.util.isTouchEvent({ type: 'touchend' }));
    assert.ok(fabric.util.isTouchEvent({ type: 'touchmove' }));
    assert.ok(fabric.util.isTouchEvent({ pointerType: 'touch' }));
    assert.notOk(fabric.util.isTouchEvent({ type: 'mousedown' }));
    assert.notOk(fabric.util.isTouchEvent({ pointerType: 'mouse' }));
  });

  QUnit.test('fabric.util.transformPath can scale a path by 2', function(assert) {
    assert.ok(typeof fabric.util.transformPath === 'function');
    var path = new fabric.Path('M 100 100 L 200 100 L 170 200 z');
    var oldPath = path.path;
    var newPath = fabric.util.transformPath(path.path, [2, 0, 0, 2, 0, 0]);
    assert.equal(fabric.util.joinPath(oldPath), 'M 100 100 L 200 100 L 170 200 Z');
    assert.equal(fabric.util.joinPath(newPath), 'M 200 200 L 400 200 L 340 400 Z');
  });
  QUnit.test('fabric.util.transformPath can apply a generic transform', function(assert) {
    var path = new fabric.Path('M 100 100 L 200 100 L 170 200 z');
    var oldPath = path.path;
    var newPath = fabric.util.transformPath(path.path, [1, 2, 3, 4, 5, 6], path.pathOffset);
    assert.equal(fabric.util.joinPath(oldPath), 'M 100 100 L 200 100 L 170 200 Z');
    assert.equal(fabric.util.joinPath(newPath), 'M -195 -294 L -95 -94 L 175 246 Z');
  });

  QUnit.test('fabric.util.calcDimensionsMatrix', function(assert) {
    assert.ok(typeof fabric.util.calcDimensionsMatrix === 'function', 'fabric.util.calcDimensionsMatrix should exist');
    var matrix = fabric.util.calcDimensionsMatrix({
      scaleX: 2,
      scaleY: 3,
      skewY: 10,
      skewX: 5,
    });
    var expected = [
      2.03085322377149,
      0.5289809421253949,
      0.17497732705184801,
      3,
      0,
      0
    ];
    assert.deepEqual(matrix, expected, 'dimensions matrix is equal');
    matrix = fabric.util.calcDimensionsMatrix({
      scaleX: 2,
      scaleY: 3,
      skewY: 10,
      skewX: 5,
      flipX: true,
      flipY: true,
    });
    expected = [
      -2.03085322377149,
      -0.5289809421253949,
      -0.17497732705184801,
      -3,
      0,
      0
    ];
    assert.deepEqual(matrix, expected, 'dimensions matrix flipped is equal');
  });
  QUnit.test('mergeClipPaths', function(assert) {
    var rectA = new fabric.Rect({ width: 100, height: 100, scaleX: 2, skewX: 3, angle: 10 });
    var clipPathA = new fabric.Group([rectA], { scaleY: 3, angle: -18 });
    var rectB = new fabric.Rect({ width: 100, height: 100, scaleY: 2.4, skewX: 3, skewY: 5, angle: 10 });
    var clipPathB = new fabric.Group([rectB], { skewX: 34, angle: 36 });
    var result = fabric.util.mergeClipPaths(clipPathA, clipPathB);
    var resultingMatrix = result.clipPath.calcTransformMatrix();
    var expectedMatrix = roundArray([
      0.5877852522924731,
      0.2696723314583158,
      -0.41255083562929973,
      0.37782470175621224,
      -153.32445710769997,
      1.7932869074173539,
    ]);
    assert.equal(result.inverted, false, 'the final clipPathB is not inverted')
    assert.equal(result.clipPath, clipPathB, 'clipPathB is the final clipPath');
    assert.deepEqual(roundArray(resultingMatrix), expectedMatrix, 'the clipPath has a new transform');
  });
  QUnit.test('mergeClipPaths with swapping', function(assert) {
    var rectA = new fabric.Rect({ width: 100, height: 100, scaleX: 2, skewX: 3, angle: 10 });
    var clipPathA = new fabric.Group([rectA], { scaleY: 3, angle: -18, inverted: true });
    var rectB = new fabric.Rect({ width: 100, height: 100, scaleY: 2.4, skewX: 3, skewY: 5, angle: 10 });
    var clipPathB = new fabric.Group([rectB], { skewX: 34, angle: 36 });
    var result = fabric.util.mergeClipPaths(clipPathA, clipPathB);
    var resultingMatrix = result.clipPath.calcTransformMatrix();
    var expectedMatrix = roundArray([
      1.1335,
      -0.8090,
      1.2377,
      1.7634,
      171.5698,
      -127.2043,
    ]);
    assert.equal(result.inverted, false, 'the final clipPathA is not inverted')
    assert.equal(result.clipPath, clipPathA, 'clipPathA is the final clipPath');
    assert.deepEqual(roundArray(resultingMatrix), expectedMatrix, 'the clipPath has a new transform');
  });
  QUnit.test('mergeClipPaths with swapping', function(assert) {
    var rectA = new fabric.Rect({ width: 100, height: 100, scaleX: 2, skewX: 3, angle: 10 });
    var clipPathA = new fabric.Group([rectA], { scaleY: 3, angle: -18, inverted: true });
    var rectB = new fabric.Rect({ width: 100, height: 100, scaleY: 2.4, skewX: 3, skewY: 5, angle: 10 });
    var clipPathB = new fabric.Group([rectB], { skewX: 34, angle: 36, inverted: true });
    var result = fabric.util.mergeClipPaths(clipPathA, clipPathB);
    var resultingMatrix = result.clipPath.calcTransformMatrix();
    assert.equal(result.inverted, true, 'the final clipPathB is inverted')
    assert.equal(result.clipPath, clipPathB, 'clipPathB is the final clipPath');
  });
})();
