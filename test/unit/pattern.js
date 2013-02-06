(function() {

  function createImageElement() {
    return fabric.isLikelyNode ? new (require('canvas').Image) : fabric.document.createElement('img');
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
  setSrc(img, fabric.isLikelyNode ?
    (__dirname + '/../fixtures/greyfloral.png')
    : '../fixtures/greyfloral.png');

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
  });

  test('toObject', function() {
    var pattern = createPattern();

    ok(typeof pattern.toObject == 'function');

    var object = pattern.toObject();

    // node-canvas doesn't give <img> "src"
    if (img.src) {
      equal(object.source, '../fixtures/greyfloral.png');
    }
    equal(object.repeat, 'repeat');

    var sourceExecuted;
    var patternWithGetSource = new fabric.Pattern({
      source: function() {return fabric.document.createElement("canvas")}
    });

    var object2 = patternWithGetSource.toObject();
    equal(object2.source, 'return fabric.document.createElement("canvas")');
    equal(object2.repeat, 'repeat');
  });

  test('toLive', function() {
    var pattern = createPattern();

    ok(typeof pattern.toLive == 'function');
  });

})();