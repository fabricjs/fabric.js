(function() {

  function getAbsolutePath(path) {
    var isAbsolute = /^https?:/.test(path);
    if (isAbsolute) return path;
    var imgEl = _createImageElement();
    imgEl.src = path;
    var src = imgEl.src;
    imgEl = null;
    return src;
  }

  var IMG_SRC     = fabric.isLikelyNode ? (__dirname + '/../fixtures/test_image.gif') : getAbsolutePath('../fixtures/test_image.gif'),
      IMG_WIDTH   = 276,
      IMG_HEIGHT  = 110;

  var REFERENCE_IMG_OBJECT = {
    'type':               'image',
    'originX':            'left',
    'originY':            'top',
    'left':               0,
    'top':                0,
    'width':              IMG_WIDTH, // node-canvas doesn't seem to allow setting width/height on image objects
    'height':             IMG_HEIGHT, // or does it now?
    'fill':               'rgb(0,0,0)',
    'stroke':             null,
    'strokeWidth':        1,
    'strokeDashArray':    null,
    'strokeLineCap':      'butt',
    'strokeLineJoin':     'miter',
    'strokeMiterLimit':   10,
    'scaleX':             1,
    'scaleY':             1,
    'angle':              0,
    'flipX':              false,
    'flipY':              false,
    'opacity':            1,
    'src':                fabric.isLikelyNode ? undefined : IMG_SRC,
    'selectable':         true,
    'hasControls':        true,
    'hasBorders':         true,
    'hasRotatingPoint':   true,
    'transparentCorners': true,
    'perPixelTargetFind': false,
    'shadow':             null,
    'visible':            true,
    'clipTo':             null,
    'filters':            []
  };

  function _createImageElement() {
    return fabric.isLikelyNode ? new (require('canvas').Image) : fabric.document.createElement('img');
  }

  function _createImageObject(width, height, callback) {
    var elImage = _createImageElement();
    elImage.width = width;
    elImage.height = height;
    setSrc(elImage, IMG_SRC, function() {
      callback(new fabric.Image(elImage));
    });
  }

  function createImageObject(callback) {
    return _createImageObject(IMG_WIDTH, IMG_HEIGHT, callback)
  }

  function setSrc(img, src, callback) {
    if (fabric.isLikelyNode) {
      require('fs').readFile(src, function(err, imgData) {
        if (err) throw err;
        img.src = imgData;
        callback && callback();
      });
    }
    else {
      img.src = src;
      callback && callback();
    }
  }

  QUnit.module('fabric.Image.filters.Brightness');

  test('constructor', function() {
    ok(fabric.Image.filters.Brightness);

    var filter = new fabric.Image.filters.Brightness();
    ok(filter instanceof fabric.Image.filters.Brightness, 'should inherit from fabric.Image.filters.Brightness');
  });

  test('properties', function() {
    var filter = new fabric.Image.filters.Brightness();

    equal(filter.type, 'Brightness');
    equal(filter.brightness, 0);

    var filter2 = new fabric.Image.filters.Brightness({brightness: 30});
    equal(filter2.brightness, 30);
  });

  test('applyTo', function() {
    var filter = new fabric.Image.filters.Brightness();
    ok(typeof filter.applyTo == 'function');
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.Brightness();
    ok(typeof filter.toObject == 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Brightness","brightness":0}');

    filter.brightness = 100;

    object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Brightness","brightness":100}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.Brightness();
    ok(typeof filter.toJSON == 'function');

    var json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"Brightness","brightness":0}');

    filter.brightness = 100;

    json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"Brightness","brightness":100}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Brightness();

    var object = filter.toObject();

    deepEqual(fabric.Image.filters.Brightness.fromObject(object), filter);
  });


  QUnit.module('fabric.Image.filters.Convolute');

  test('constructor', function() {
    ok(fabric.Image.filters.Convolute);

    var filter = new fabric.Image.filters.Convolute();
    ok(filter instanceof fabric.Image.filters.Convolute, 'should inherit from fabric.Image.filters.Convolute');
  });

  test('properties', function() {
    var filter = new fabric.Image.filters.Convolute();

    equal(filter.type, 'Convolute');
    equal(filter.opaque, undefined);
    deepEqual(filter.matrix, [0,0,0,0,1,0,0,0,0]);

    var filter2 = new fabric.Image.filters.Convolute({opaque: 0.5, matrix: [1,-1,1,0,1,0,0,0,0]});
    equal(filter2.opaque, 0.5);
    deepEqual(filter2.matrix, [1,-1,1,0,1,0,0,0,0]);
  });

  test('applyTo', function() {
    var filter = new fabric.Image.filters.Convolute();
    ok(typeof filter.applyTo == 'function');
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.Convolute({opaque: 1});
    ok(typeof filter.toObject == 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Convolute","opaque":1,"matrix":[0,0,0,0,1,0,0,0,0]}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.Convolute({opaque: 1});
    ok(typeof filter.toJSON == 'function');

    var json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"Convolute","opaque":1,"matrix":[0,0,0,0,1,0,0,0,0]}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Convolute();

    var object = filter.toObject();

    deepEqual(fabric.Image.filters.Convolute.fromObject(object), filter);
  });

  QUnit.module('fabric.Image.filters.GradientTransparency');

  test('constructor', function() {
    ok(fabric.Image.filters.GradientTransparency);

    var filter = new fabric.Image.filters.GradientTransparency();
    ok(filter instanceof fabric.Image.filters.GradientTransparency, 'should inherit from fabric.Image.filters.GradientTransparency');
  });

  test('properties', function() {
    var filter = new fabric.Image.filters.GradientTransparency();

    equal(filter.type, 'GradientTransparency');
    equal(filter.threshold, 100);

    var filter2 = new fabric.Image.filters.GradientTransparency({threshold: 50});
    equal(filter2.threshold, 50);
  });

  test('applyTo', function() {
    var filter = new fabric.Image.filters.GradientTransparency();
    ok(typeof filter.applyTo == 'function');
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.GradientTransparency();
    ok(typeof filter.toObject == 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"GradientTransparency","threshold":100}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.GradientTransparency();
    ok(typeof filter.toJSON == 'function');

    var json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"GradientTransparency","threshold":100}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.GradientTransparency();

    var object = filter.toObject();

    deepEqual(fabric.Image.filters.GradientTransparency.fromObject(object), filter);
  });


  QUnit.module('fabric.Image.filters.Grayscale');

  test('constructor', function() {
    ok(fabric.Image.filters.Grayscale);

    var filter = new fabric.Image.filters.Grayscale();
    ok(filter instanceof fabric.Image.filters.Grayscale, 'should inherit from fabric.Image.filters.Grayscale');
  });

  test('properties', function() {
    var filter = new fabric.Image.filters.Grayscale();

    equal(filter.type, 'Grayscale');
  });

  test('applyTo', function() {
    var filter = new fabric.Image.filters.Grayscale();
    ok(typeof filter.applyTo == 'function');
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.Grayscale();
    ok(typeof filter.toObject == 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Grayscale"}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.Grayscale();
    ok(typeof filter.toJSON == 'function');

    var json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"Grayscale"}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Grayscale();

    var object = filter.toObject();

    deepEqual(fabric.Image.filters.Grayscale.fromObject(object), filter);
  });


  QUnit.module('fabric.Image.filters.Invert');

  test('constructor', function() {
    ok(fabric.Image.filters.Invert);

    var filter = new fabric.Image.filters.Invert();
    ok(filter instanceof fabric.Image.filters.Invert, 'should inherit from fabric.Image.filters.Invert');
  });

  test('properties', function() {
    var filter = new fabric.Image.filters.Invert();

    equal(filter.type, 'Invert');
  });

  test('applyTo', function() {
    var filter = new fabric.Image.filters.Invert();
    ok(typeof filter.applyTo == 'function');
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.Invert();
    ok(typeof filter.toObject == 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Invert"}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.Invert();
    ok(typeof filter.toJSON == 'function');

    var json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"Invert"}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Invert();

    var object = filter.toObject();

    deepEqual(fabric.Image.filters.Invert.fromObject(object), filter);
  });


  QUnit.module('fabric.Image.filters.Noise');

  test('constructor', function() {
    ok(fabric.Image.filters.Noise);

    var filter = new fabric.Image.filters.Noise();
    ok(filter instanceof fabric.Image.filters.Noise, 'should inherit from fabric.Image.filters.Noise');
  });

  test('properties', function() {
    var filter = new fabric.Image.filters.Noise();

    equal(filter.type, 'Noise');
    equal(filter.noise, 0);

    var filter2 = new fabric.Image.filters.Noise({noise: 200});
    equal(filter2.noise, 200);
  });

  test('applyTo', function() {
    var filter = new fabric.Image.filters.Noise();
    ok(typeof filter.applyTo == 'function');
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.Noise();
    ok(typeof filter.toObject == 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Noise","noise":0}');

    filter.noise = 100;

    object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Noise","noise":100}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.Noise();
    ok(typeof filter.toJSON == 'function');

    var json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"Noise","noise":0}');

    filter.noise = 100;

    json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"Noise","noise":100}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Noise();

    var object = filter.toObject();

    deepEqual(fabric.Image.filters.Noise.fromObject(object), filter);
  });


  QUnit.module('fabric.Image.filters.Pixelate');

  test('constructor', function() {
    ok(fabric.Image.filters.Pixelate);

    var filter = new fabric.Image.filters.Pixelate();
    ok(filter instanceof fabric.Image.filters.Pixelate, 'should inherit from fabric.Image.filters.Pixelate');
  });

  test('properties', function() {
    var filter = new fabric.Image.filters.Pixelate();

    equal(filter.type, 'Pixelate');
    equal(filter.blocksize, 4);

    var filter2 = new fabric.Image.filters.Pixelate({blocksize: 8});
    equal(filter2.blocksize, 8);
  });

  test('applyTo', function() {
    var filter = new fabric.Image.filters.Pixelate();
    ok(typeof filter.applyTo == 'function');
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.Pixelate();
    ok(typeof filter.toObject == 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Pixelate","blocksize":4}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.Pixelate();
    ok(typeof filter.toJSON == 'function');

    var json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"Pixelate","blocksize":4}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Pixelate();

    var object = filter.toObject();

    deepEqual(fabric.Image.filters.Pixelate.fromObject(object), filter);
  });


  QUnit.module('fabric.Image.filters.RemoveWhite');

  test('constructor', function() {
    ok(fabric.Image.filters.RemoveWhite);

    var filter = new fabric.Image.filters.RemoveWhite();
    ok(filter instanceof fabric.Image.filters.RemoveWhite, 'should inherit from fabric.Image.filters.RemoveWhite');
  });

  test('properties', function() {
    var filter = new fabric.Image.filters.RemoveWhite();

    equal(filter.type, 'RemoveWhite');
    equal(filter.threshold, 30);
    equal(filter.distance, 20);

    var filter2 = new fabric.Image.filters.RemoveWhite({threshold: 10, distance: 60});
    equal(filter2.threshold, 10);
    equal(filter2.distance, 60);
  });

  test('applyTo', function() {
    var filter = new fabric.Image.filters.RemoveWhite();
    ok(typeof filter.applyTo == 'function');
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.RemoveWhite();
    ok(typeof filter.toObject == 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"RemoveWhite","threshold":30,"distance":20}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.RemoveWhite();
    ok(typeof filter.toJSON == 'function');

    var json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"RemoveWhite","threshold":30,"distance":20}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.RemoveWhite();

    var object = filter.toObject();

    deepEqual(fabric.Image.filters.RemoveWhite.fromObject(object), filter);
  });


  QUnit.module('fabric.Image.filters.Sepia2');

  test('constructor', function() {
    ok(fabric.Image.filters.Sepia2);

    var filter = new fabric.Image.filters.Sepia2();
    ok(filter instanceof fabric.Image.filters.Sepia2, 'should inherit from fabric.Image.filters.Sepia2');
  });

  test('properties', function() {
    var filter = new fabric.Image.filters.Sepia2();

    equal(filter.type, 'Sepia2');
  });

  test('applyTo', function() {
    var filter = new fabric.Image.filters.Sepia2();
    ok(typeof filter.applyTo == 'function');
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.Sepia2();
    ok(typeof filter.toObject == 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Sepia2"}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.Sepia2();
    ok(typeof filter.toJSON == 'function');

    var json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"Sepia2"}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Sepia2();

    var object = filter.toObject();

    deepEqual(fabric.Image.filters.Sepia2.fromObject(object), filter);
  });


  QUnit.module('fabric.Image.filters.Sepia');

  test('constructor', function() {
    ok(fabric.Image.filters.Sepia);

    var filter = new fabric.Image.filters.Sepia();
    ok(filter instanceof fabric.Image.filters.Sepia, 'should inherit from fabric.Image.filters.Sepia');
  });

  test('properties', function() {
    var filter = new fabric.Image.filters.Sepia();

    equal(filter.type, 'Sepia');
  });

  test('applyTo', function() {
    var filter = new fabric.Image.filters.Sepia();
    ok(typeof filter.applyTo == 'function');
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.Sepia();
    ok(typeof filter.toObject == 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Sepia"}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.Sepia();
    ok(typeof filter.toJSON == 'function');

    var json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"Sepia"}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Sepia();

    var object = filter.toObject();

    deepEqual(fabric.Image.filters.Sepia.fromObject(object), filter);
  });


  QUnit.module('fabric.Image.filters.Tint');

  test('constructor', function() {
    ok(fabric.Image.filters.Tint);

    var filter = new fabric.Image.filters.Tint();
    ok(filter instanceof fabric.Image.filters.Tint, 'should inherit from fabric.Image.filters.Tint');
  });

  test('properties', function() {
    var filter = new fabric.Image.filters.Tint();

    equal(filter.type, 'Tint');

    equal(filter.color, '#000000');
    equal(filter.opacity, 1);

    var filter2 = new fabric.Image.filters.Tint({color: 'rgba(0,0,255,0.5)', opacity: 0.2});
    equal(filter2.color, 'rgba(0,0,255,0.5)');
    equal(filter2.opacity, 0.2);

    var filter3 = new fabric.Image.filters.Tint({color: 'rgba(0,0,255,0.5)'});
    equal(filter3.color, 'rgba(0,0,255,0.5)');
    equal(filter3.opacity, 0.5);
  });

  test('applyTo', function() {
    var filter = new fabric.Image.filters.Tint();
    ok(typeof filter.applyTo == 'function');
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.Tint();
    ok(typeof filter.toObject == 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Tint","color":"#000000","opacity":1}');

    filter.color = '#FF00FF';
    filter.opacity = 0.2;
    equal(JSON.stringify(filter.toObject()), '{"type":"Tint","color":"#FF00FF","opacity":0.2}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.Tint();
    ok(typeof filter.toJSON == 'function');

    var json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"Tint","color":"#000000","opacity":1}');

    filter.color = '#FF00FF';
    filter.opacity = 0.2;
    equal(JSON.stringify(filter.toJSON()), '{"type":"Tint","color":"#FF00FF","opacity":0.2}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Tint();

    var object = filter.toObject();
    deepEqual(fabric.Image.filters.Tint.fromObject(object), filter);

    filter.color = '#FF0000';
    filter.opacity = 0.8;
    deepEqual(fabric.Image.filters.Tint.fromObject(filter.toObject()), filter);
  });

  QUnit.module('fabric.Image.filters.Mask');

  test('constructor', function() {
    ok(fabric.Image.filters.Mask);

    var filter = new fabric.Image.filters.Mask();
    ok(filter instanceof fabric.Image.filters.Mask, 'should inherit from fabric.Image.filters.Mask');
  });

  asyncTest('properties', function() {
    var filter = new fabric.Image.filters.Mask();

    equal(filter.type, 'Mask');
    equal(filter.mask, undefined);
    equal(filter.channel, 0);

    createImageObject(function(image) {
      var filter2 = new fabric.Image.filters.Mask({mask: image, channel: 2});
      equal(filter2.mask, image);
      equal(filter2.channel, 2);

      start();
    });
  });

  test('applyTo', function() {
    var filter = new fabric.Image.filters.Mask();
    ok(typeof filter.applyTo == 'function');
  });

  asyncTest('toObject', function() {
    createImageObject(function(image) {
      var filter = new fabric.Image.filters.Mask({mask: image});
      ok(typeof filter.toObject == 'function');

      var object = filter.toObject(),
          maskObj = object.mask;

      // workaround for node-canvas sometimes producing images with width/height and sometimes not
      if (maskObj.width === 0) {
        maskObj.width = IMG_WIDTH;
      }
      if (maskObj.height === 0) {
        maskObj.height = IMG_HEIGHT;
      }
      equal(JSON.stringify(object), '{"type":"Mask","mask":'+JSON.stringify(maskObj)+',"channel":0}');

      start();
    });
  });

  asyncTest('toJSON', function() {
    createImageObject(function(image) {
      var filter = new fabric.Image.filters.Mask({mask: image});
      ok(typeof filter.toJSON == 'function');

      var json = filter.toJSON(),
          maskObj = json.mask;

      // workaround for node-canvas sometimes producing images with width/height and sometimes not
      if (maskObj.width === 0) {
        maskObj.width = IMG_WIDTH;
      }
      if (maskObj.height === 0) {
        maskObj.height = IMG_HEIGHT;
      }
      equal(JSON.stringify(json), '{"type":"Mask","mask":'+JSON.stringify(maskObj)+',"channel":0}');

      start();
    });
  });

  // asyncTest('fromObject', function() {
  //   createImageObject(function(image) {
  //     var filter = new fabric.Image.filters.Mask({mask: image});

  //     var object = filter.toObject();

  //     fabric.Image.filters.Mask.fromObject(object, function(filterObj) {
  //       deepEqual(filterObj, filter);

  //       start();
  //     });
  //   });
  // });
})();
