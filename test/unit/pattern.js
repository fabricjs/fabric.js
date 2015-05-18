(function() {
  var IMG_SRC = fabric.isLikelyNode ? (__dirname + '/../fixtures/greyfloral.png') : '../fixtures/greyfloral.png';

  function createImageElement() {
    return fabric.isLikelyNode
            ? new (require('canvas').Image)()
            : fabric.document.createElement('img');
  }
  function setSrc(img, src, callback) {
    if (fabric.isLikelyNode) {
      require('fs').readFile(src, function(err, imgData) {
        if (err) throw err;
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

  test('constructor', function() {
    ok(fabric.Pattern);

    var pattern = createPattern();
    ok(pattern instanceof fabric.Pattern, 'should inherit from fabric.Pattern');
  });

  test('properties', function() {
    var pattern = createPattern();

    equal(pattern.source, img);
    equal(pattern.repeat, 'repeat');
    equal(pattern.offsetX, 0);
    equal(pattern.offsetY, 0);
  });

  test('toObject', function() {
    var pattern = createPattern();

    ok(typeof pattern.toObject == 'function');

    var object = pattern.toObject();

    // node-canvas doesn't give <img> "src"
    if (img.src) {
      ok(object.source.indexOf('fixtures/greyfloral.png') > -1);
    }
    equal(object.repeat, 'repeat');
    equal(object.offsetX, 0);
    equal(object.offsetY, 0);

    var patternWithGetSource = new fabric.Pattern({
      source: function() {return fabric.document.createElement("canvas")}
    });

    var object2 = patternWithGetSource.toObject();
    equal(object2.source, 'function () {return fabric.document.createElement("canvas")}');
    equal(object2.repeat, 'repeat');
  });

  test('toLive', function() {
    var pattern = createPattern();

    ok(typeof pattern.toLive == 'function');
  });

  test('pattern serialization / deserialization (function)', function() {
    var patternSourceCanvas, padding;

    var pattern = new fabric.Pattern({
      source: function() {
        patternSourceCanvas.setDimensions({
          width: img.getWidth() + padding,
          height: img.getHeight() + padding
        });
        return patternSourceCanvas.getElement();
      },
      repeat: 'repeat'
    });

    var obj = pattern.toObject();
    var patternDeserialized = new fabric.Pattern(obj);

    equal(typeof patternDeserialized.source, 'function');
    equal(patternDeserialized.repeat, 'repeat');
  });

  test('pattern serialization / deserialization (image source)', function() {
    var pattern = createPattern();
    var obj = pattern.toObject();

    // node-canvas doesn't give <img> "src"
    if (obj.src) {
      var patternDeserialized = new fabric.Pattern(obj);
      equal(typeof patternDeserialized.source, 'object');
      equal(patternDeserialized.repeat, 'repeat');
    }
    else {
      ok(true);
    }
  });

  test('toSVG', function() {
    var pattern = createPattern();

    ok(typeof pattern.toSVG == 'function');

    // TODO: test toSVG
  });

})();
