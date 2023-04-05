(function() {
  var IMG_SRC = isNode() ? ('file://' + __dirname + '/../fixtures/greyfloral.png') : '../fixtures/greyfloral.png';

  function setSrc(img, src, callback) {
    img.onload = callback;
    img.src = src;
  }

  QUnit.module('fabric.Pattern');

  var img = fabric.getDocument().createElement('img');
  setSrc(img, IMG_SRC);

  function createPattern() {
    return new fabric.Pattern({
      source: img
    });
  }

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Pattern);
    var pattern = createPattern();
    assert.ok(pattern instanceof fabric.Pattern, 'should inherit from fabric.Pattern');
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
    var done = assert.async();
    fabric.Pattern.fromObject({
      source: IMG_SRC,
      crossOrigin: 'anonymous',
      type: 'Pattern',
    }).then(function(patternEnlived) {
      var object = patternEnlived.toObject();
      fabric.Pattern.fromObject(object).then(function(patternAgain) {
        assert.equal(patternAgain.crossOrigin, 'anonymous');
        done();
      });
    });
  });

  QUnit.test('toLive', function(assert) {
    var pattern = createPattern();
    var canvas = new fabric.StaticCanvas(null, {enableRetinaScaling: false});
    var patternHTML = canvas.contextContainer.createPattern(img, 'repeat');
    assert.ok(typeof pattern.toLive === 'function');
    var created = pattern.toLive(canvas.contextContainer);
    assert.equal(created.toString(), patternHTML.toString(), 'is a pattern');
  });

  QUnit.test('pattern serialization / deserialization (image source)', function(assert) {
    var done = assert.async();
    var pattern = createPattern();
    var obj = pattern.toObject();

    // node-canvas doesn't give <img> "src"
    fabric.Pattern.fromObject(obj).then(function(patternDeserialized) {
      assert.equal(typeof patternDeserialized.source, 'object');
      assert.equal(patternDeserialized.repeat, 'repeat');
      done();
    });
  });

  QUnit.test('toSVG', function(assert) {
    var pattern = createPattern();
    var rect = new fabric.Rect({ width: 500, height: 500 });
    var expectedSVG = '<pattern id="SVGID_0" x="0" y="0" width="0.3" height="0.248">\n<image x="0" y="0" width="150" height="124" xlink:href="' + img.src + '"></image>\n</pattern>\n';
    assert.ok(typeof pattern.toSVG === 'function');
    assert.equalSVG(pattern.toSVG(rect), expectedSVG, 'SVG match');
  });

  QUnit.test('toSVG repeat-y', function(assert) {
    var pattern = createPattern();
    pattern.repeat = 'repeat-y';
    var rect = new fabric.Rect({ width: 500, height: 500 });
    var expectedSVG = '<pattern id="SVGID_0" x="0" y="0" width="1" height="0.248">\n<image x="0" y="0" width="150" height="124" xlink:href="' + img.src + '"></image>\n</pattern>\n';
    assert.ok(typeof pattern.toSVG === 'function');
    assert.equalSVG(pattern.toSVG(rect), expectedSVG, 'SVG match repeat-y');
  });

  QUnit.test('toSVG repeat-x', function(assert) {
    var pattern = createPattern();
    pattern.repeat = 'repeat-x';
    var rect = new fabric.Rect({ width: 500, height: 500 });
    var expectedSVG = '<pattern id="SVGID_0" x="0" y="0" width="0.3" height="1">\n<image x="0" y="0" width="150" height="124" xlink:href="' + img.src + '"></image>\n</pattern>\n';
    assert.ok(typeof pattern.toSVG === 'function');
    assert.equalSVG(pattern.toSVG(rect), expectedSVG, 'SVG match repeat-x');
  });

  QUnit.test('toSVG no-repeat', function(assert) {
    var pattern = createPattern();
    pattern.repeat = 'no-repeat';
    var rect = new fabric.Rect({ width: 500, height: 500 });
    var expectedSVG = '<pattern id="SVGID_0" x="0" y="0" width="1" height="1">\n<image x="0" y="0" width="150" height="124" xlink:href="' + img.src + '"></image>\n</pattern>\n';
    assert.ok(typeof pattern.toSVG === 'function');
    assert.equalSVG(pattern.toSVG(rect), expectedSVG, 'SVG match no-repeat');
  });

  QUnit.test('toSVG no-repeat offsetX and offsetY', function(assert) {
    var pattern = createPattern();
    pattern.repeat = 'no-repeat';
    pattern.offsetX = 50;
    pattern.offsetY = -50;
    var rect = new fabric.Rect({ width: 500, height: 500 });
    var expectedSVG = '<pattern id="SVGID_0" x="0.1" y="-0.1" width="1.1" height="1.1">\n<image x="0" y="0" width="150" height="124" xlink:href="' + img.src + '"></image>\n</pattern>\n';
    assert.ok(typeof pattern.toSVG === 'function');
    assert.equalSVG(pattern.toSVG(rect), expectedSVG, 'SVG match no-repat offsetX and offsetY');
  });

  QUnit.test('initPattern from object', function(assert) {
    var done = assert.async();
    var rectObj = {
      fill: {
        type: 'Pattern',
        source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
      },
    };
    fabric.Rect.fromObject(rectObj).then(function(obj){
      assert.ok(obj.fill instanceof fabric.Pattern, 'the pattern is enlived');
      done();
    });
  });

})();
