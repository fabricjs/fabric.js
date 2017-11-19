(function() {
  var IMG_SRC = fabric.isLikelyNode ? (__dirname + '/../fixtures/greyfloral.png') : '../fixtures/greyfloral.png';

  function createImageElement() {
    return fabric.isLikelyNode
      ? new (require(fabric.canvasModule).Image)()
      : fabric.document.createElement('img');
  }
  function setSrc(img, src, callback) {
    if (fabric.isLikelyNode) {
      require('fs').readFile(src, function(err, imgData) {
        if (err) { throw err; };
        img.src = imgData;
        img._src = src;
        callback && callback();
      });
    }
    else {
      img.src = src;
      callback && callback();
    }
  }

  QUnit.module('fabric.Pattern');

  var img = createImageElement();
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

  QUnit.test('constructor with source string and with callback', function(assert) {
    var done = assert.async();
    function callback(pattern) {
      if (fabric.isLikelyNode) {
        assert.equal(pattern.source.src, IMG_SRC, 'pattern source has been loaded');
      }
      else {
        assert.equal(pattern.source.complete, true, 'pattern source has been loaded');
      }
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
  });

  QUnit.test('toObject', function(assert) {
    var pattern = createPattern();

    assert.ok(typeof pattern.toObject === 'function');

    var object = pattern.toObject();

    // node-canvas doesn't give <img> "src"
    if (img.src) {
      assert.ok(object.source.indexOf('fixtures/greyfloral.png') > -1);
    }
    assert.equal(object.repeat, 'repeat');
    assert.equal(object.offsetX, 0);
    assert.equal(object.offsetY, 0);

    var patternWithGetSource = new fabric.Pattern({
      source: function() {return fabric.document.createElement('canvas');}
    });

    var object2 = patternWithGetSource.toObject();
    assert.equal(object2.source, 'function () {return fabric.document.createElement(\'canvas\');}');
    assert.equal(object2.repeat, 'repeat');
  });

  QUnit.test('toObject with custom props', function(assert) {
    var pattern = createPattern();
    pattern.id = 'myId';
    var object = pattern.toObject(['id']);
    assert.equal(object.id, 'myId');
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
    if (obj.src) {
      var patternDeserialized = new fabric.Pattern(obj);
      assert.equal(typeof patternDeserialized.source, 'object');
      assert.equal(patternDeserialized.repeat, 'repeat');
    }
    else {
      assert.ok(true);
    }
  });

  QUnit.test('toSVG', function(assert) {
    var pattern = createPattern();

    assert.ok(typeof pattern.toSVG === 'function');

    // TODO: test toSVG
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
