(function() {
  var IMG_SRC = fabric.isLikelyNode ? ('file://' + __dirname + '/../fixtures/greyfloral.png') : '../fixtures/greyfloral.png';

  function setSrc(img, src, callback) {
    img.onload = callback;
    img.src = src;
  }

  QUnit.module('fabric.Pattern');

  var img = fabric.document.createElement('img');
  setSrc(img, IMG_SRC);

  function createPattern(callback) {
    return new fabric.Pattern({
      source: img
    }, callback);
  }

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Pattern);
    var pattern = createPattern();
    assert.ok(pattern instanceof fabric.Pattern, 'should inherit from fabric.Pattern');
  });

  QUnit.test('constructor with source string and with callback', function(assert) {
    var done = assert.async();
    function callback(pattern) {
      assert.equal(pattern.source.complete, true, 'pattern source has been loaded');
      done();
    }
    new fabric.Pattern({
      source: IMG_SRC
    }, callback);
  });

  QUnit.test('properties', function(assert) {
    var pattern = createPattern();
    assert.equal(pattern.source, img);
    assert.equal(pattern.repeat, 'repeat');
    assert.equal(pattern.offsetX, 0);
    assert.equal(pattern.offsetY, 0);
    assert.equal(pattern.crossOrigin, '');
  });

  QUnit.test('toObject', function(assert) {
    var pattern = createPattern();

    assert.ok(typeof pattern.toObject === 'function');

    var object = pattern.toObject();

    assert.ok(object.source.indexOf('fixtures/greyfloral.png') > -1);
    assert.equal(object.repeat, 'repeat');
    assert.equal(object.offsetX, 0);
    assert.equal(object.offsetY, 0);
    assert.equal(object.patternTransform, null);

    var patternWithGetSource = new fabric.Pattern({
      source: function () {return fabric.document.createElement('canvas');}
    });

    var object2 = patternWithGetSource.toObject();
    assert.equal(object2.source, 'function () {return fabric.document.createElement(\'canvas\');}');
    assert.equal(object2.repeat, 'repeat');
  });

  QUnit.test('toObject with custom props', function(assert) {
    var pattern = createPattern();
    pattern.patternTransform = [1, 0, 0, 2, 0, 0];
    pattern.id = 'myId';
    var object = pattern.toObject(['id']);
    assert.equal(object.id, 'myId');
    assert.deepEqual(object.patternTransform, pattern.patternTransform);
  });

  QUnit.test('toObject with custom props', function(assert) {
    var pattern = createPattern();
    pattern.patternTransform = [1, 0, 0, 2, 0, 0];
    pattern.id = 'myId';
    var object = pattern.toObject(['id']);
    assert.equal(object.id, 'myId');
    assert.deepEqual(object.patternTransform, pattern.patternTransform);
  });

  QUnit.test('toObject with crossOrigin', function(assert) {
    var pattern = new fabric.Pattern({
      source: IMG_SRC,
      crossOrigin: 'anonymous'
    });
    var object = pattern.toObject();
    assert.equal(object.crossOrigin, 'anonymous');
  });

  QUnit.test('fromObject with crossOrigin', function(assert) {
    var pattern = new fabric.Pattern({
      source: IMG_SRC,
      crossOrigin: 'anonymous'
    });

    var object = pattern.toObject();
    var pattern2 = new fabric.Pattern(object);
    assert.equal(pattern2.crossOrigin, 'anonymous');
  });

  QUnit.test('toLive', function(assert) {
    var pattern = createPattern();
    var canvas = new fabric.StaticCanvas(null, {enableRetinaScaling: false});
    assert.ok(typeof pattern.toLive === 'function');
    var created = pattern.toLive(canvas.contextContainer);
    assert.equal(created.toString(), '[object CanvasPattern]', 'is a gradient for canvas radial');
  });

  QUnit.test('pattern serialization / deserialization (function)', function(assert) {
    var patternSourceCanvas, padding;

    var pattern = new fabric.Pattern({
      source: function() {
        patternSourceCanvas.setDimensions({
          width: img.width + padding,
          height: img.height + padding
        });
        return patternSourceCanvas.getElement();
      },
      repeat: 'repeat'
    });

    var obj = pattern.toObject();
    var patternDeserialized = new fabric.Pattern(obj);

    assert.equal(typeof patternDeserialized.source, 'function');
    assert.equal(patternDeserialized.repeat, 'repeat');
  });

  QUnit.test('pattern serialization / deserialization (image source)', function(assert) {
    var pattern = createPattern();
    var obj = pattern.toObject();

    // node-canvas doesn't give <img> "src"
    var patternDeserialized = new fabric.Pattern(obj);
    assert.equal(typeof patternDeserialized.source, 'object');
    assert.equal(patternDeserialized.repeat, 'repeat');
  });

  QUnit.test('toSVG', function(assert) {
    fabric.Object.__uid = 0;
    var pattern = createPattern();
    var rect = new fabric.Rect({ width: 500, height: 500 });
    var expectedSVG = '<pattern id="SVGID_0" x="0" y="0" width="0.3" height="0.248">\n<image x="0" y="0" width="150" height="124" xlink:href="' + img.src + '"></image>\n</pattern>\n';
    assert.ok(typeof pattern.toSVG === 'function');
    assert.equal(pattern.toSVG(rect), expectedSVG, 'SVG match');
  });

  QUnit.test('toSVG repeat-y', function(assert) {
    fabric.Object.__uid = 0;
    var pattern = createPattern();
    pattern.repeat = 'repeat-y';
    var rect = new fabric.Rect({ width: 500, height: 500 });
    var expectedSVG = '<pattern id="SVGID_0" x="0" y="0" width="1" height="0.248">\n<image x="0" y="0" width="150" height="124" xlink:href="' + img.src + '"></image>\n</pattern>\n';
    assert.ok(typeof pattern.toSVG === 'function');
    assert.equal(pattern.toSVG(rect), expectedSVG, 'SVG match repeat-y');
  });

  QUnit.test('toSVG repeat-x', function(assert) {
    fabric.Object.__uid = 0;
    var pattern = createPattern();
    pattern.repeat = 'repeat-x';
    var rect = new fabric.Rect({ width: 500, height: 500 });
    var expectedSVG = '<pattern id="SVGID_0" x="0" y="0" width="0.3" height="1">\n<image x="0" y="0" width="150" height="124" xlink:href="' + img.src + '"></image>\n</pattern>\n';
    assert.ok(typeof pattern.toSVG === 'function');
    assert.equal(pattern.toSVG(rect), expectedSVG, 'SVG match repeat-x');
  });

  QUnit.test('toSVG no-repeat', function(assert) {
    fabric.Object.__uid = 0;
    var pattern = createPattern();
    pattern.repeat = 'no-repeat';
    var rect = new fabric.Rect({ width: 500, height: 500 });
    var expectedSVG = '<pattern id="SVGID_0" x="0" y="0" width="1" height="1">\n<image x="0" y="0" width="150" height="124" xlink:href="' + img.src + '"></image>\n</pattern>\n';
    assert.ok(typeof pattern.toSVG === 'function');
    assert.equal(pattern.toSVG(rect), expectedSVG, 'SVG match no-repeat');
  });

  QUnit.test('toSVG no-repeat offsetX and offsetY', function(assert) {
    fabric.Object.__uid = 0;
    var pattern = createPattern();
    pattern.repeat = 'no-repeat';
    pattern.offsetX = 50;
    pattern.offsetY = -50;
    var rect = new fabric.Rect({ width: 500, height: 500 });
    var expectedSVG = '<pattern id="SVGID_0" x="0.1" y="-0.1" width="1.1" height="1.1">\n<image x="0" y="0" width="150" height="124" xlink:href="' + img.src + '"></image>\n</pattern>\n';
    assert.ok(typeof pattern.toSVG === 'function');
    assert.equal(pattern.toSVG(rect), expectedSVG, 'SVG match no-repat offsetX and offsetY');
  });

  QUnit.test('initPattern from object', function(assert) {
    var fillObj = {
      type: 'pattern',
      source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=='
    };
    var obj = new fabric.Object({ fill: fillObj });
    assert.ok(obj.fill instanceof fabric.Pattern, 'the pattern is enlived');
  });

})();
