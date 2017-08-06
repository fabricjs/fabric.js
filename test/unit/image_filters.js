(function() {

  // function getAbsolutePath(path) {
  //   var isAbsolute = /^https?:/.test(path);
  //   if (isAbsolute) { return path; };
  //   var imgEl = _createImageElement();
  //   imgEl.src = path;
  //   var src = imgEl.src;
  //   imgEl = null;
  //   return src;
  // }

  var // IMG_SRC     = fabric.isLikelyNode ? (__dirname + '/../fixtures/test_image.gif') : getAbsolutePath('../fixtures/test_image.gif'),
      // IMG_WIDTH   = 276,
      // IMG_HEIGHT  = 110,
      canvas = fabric.isLikelyNode ? new (require(fabric.canvasModule))() : fabric.document.createElement('canvas'),
      context = canvas.getContext('2d');


  // var REFERENCE_IMG_OBJECT = {
  //   'type':               'image',
  //   'originX':            'left',
  //   'originY':            'top',
  //   'left':               0,
  //   'top':                0,
  //   'width':              IMG_WIDTH, // node-canvas doesn't seem to allow setting width/height on image objects
  //   'height':             IMG_HEIGHT, // or does it now?
  //   'fill':               'rgb(0,0,0)',
  //   'stroke':             null,
  //   'strokeWidth':        1,
  //   'strokeDashArray':    null,
  //   'strokeLineCap':      'butt',
  //   'strokeLineJoin':     'miter',
  //   'strokeMiterLimit':   10,
  //   'scaleX':             1,
  //   'scaleY':             1,
  //   'angle':              0,
  //   'flipX':              false,
  //   'flipY':              false,
  //   'opacity':            1,
  //   'src':                fabric.isLikelyNode ? undefined : IMG_SRC,
  //   'selectable':         true,
  //   'hasControls':        true,
  //   'hasBorders':         true,
  //   'hasRotatingPoint':   true,
  //   'transparentCorners': true,
  //   'perPixelTargetFind': false,
  //   'shadow':             null,
  //   'visible':            true,
  //   'clipTo':             null,
  //   'filters':            []
  // };

  // function _createImageElement() {
  //   return fabric.isLikelyNode ? new (require(fabric.canvasModule).Image)() : fabric.document.createElement('img');
  // }

  function _createImageData(context) {
    var imageData = context.createImageData(3, 1);
    imageData.data[0] = 200;
    imageData.data[1] = 100;
    imageData.data[2] = 50;
    imageData.data[3] = 1;
    imageData.data[4] = 30;
    imageData.data[5] = 255;
    imageData.data[6] = 10;
    imageData.data[7] = 1;
    imageData.data[8] = 255;
    imageData.data[9] = 255;
    imageData.data[10] = 3;
    imageData.data[11] = 1;
    return imageData;
  }

  // function _createImageObject(width, height, callback) {
  //   var elImage = _createImageElement();
  //   elImage.width = width;
  //   elImage.height = height;
  //   setSrc(elImage, IMG_SRC, function() {
  //     callback(new fabric.Image(elImage));
  //   });
  // }

  // function createImageObject(callback) {
  //   return _createImageObject(IMG_WIDTH, IMG_HEIGHT, callback);
  // }

  // function setSrc(img, src, callback) {
  //   if (fabric.isLikelyNode) {
  //     require('fs').readFile(src, function(err, imgData) {
  //       if (err) { throw err; };
  //       img.src = imgData;
  //       callback && callback();
  //     });
  //   }
  //   else {
  //     img.src = src;
  //     callback && callback();
  //   }
  // }

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

    var filter2 = new fabric.Image.filters.Brightness({brightness: 0.12});
    equal(filter2.brightness, 0.12);
  });

  test('applyTo2d', function() {
    var filter = new fabric.Image.filters.Brightness();
    ok(typeof filter.applyTo2d === 'function');
  });

  test('applyTo2d values', function() {
    var filter = new fabric.Image.filters.Brightness({brightness: 0.2});
    var options = { imageData: _createImageData(context) };
    filter.applyTo2d(options);
    var data = options.imageData.data;
    var expected = [251, 151, 101, 1, 81, 255, 61, 1, 255, 255, 54, 1];
    for (var i = 0; i < 12; i++) {
      equal(data[i], expected[i]);
    }
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.Brightness();
    ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Brightness","brightness":0}');

    filter.brightness = 100;

    object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Brightness","brightness":100}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.Brightness();
    ok(typeof filter.toJSON === 'function');

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

  QUnit.module('fabric.Image.filters.Composed');

  test('constructor', function() {
    ok(fabric.Image.filters.Composed);

    var filter = new fabric.Image.filters.Composed();
    ok(filter instanceof fabric.Image.filters.Composed, 'should inherit from fabric.Image.filters.Composed');
  });

  test('properties', function() {
    var filter = new fabric.Image.filters.Composed();

    equal(filter.type, 'Composed');

  });

  test('has not applyTo2d', function() {
    var filter = new fabric.Image.filters.Composed();
    ok(typeof filter.applyTo2d === 'undefined');
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.Composed();
    ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Composed","subFilters":[]}');

  });

  test('toObject with subfilters', function() {
    var filter = new fabric.Image.filters.Composed();
    var brightness = new fabric.Image.filters.Brightness();
    var contrast = new fabric.Image.filters.Contrast();
    filter.subFilters.push(brightness);
    filter.subFilters.push(contrast);
    var contrastObj = contrast.toObject();
    var brightnessObj = brightness.toObject();
    var object = filter.toObject();
    equal(object.subFilters.length, 2, 'there are 2 subfilters');
    deepEqual(object.subFilters[0], brightnessObj, 'the first subfilter has been serialized');
    deepEqual(object.subFilters[1], contrastObj, 'the second subfilter has been serialized');
  });

  test('toJSON', function() {
    var filter2 = new fabric.Image.filters.Composed();
    ok(typeof filter2.toJSON === 'function');

    var json = filter2.toJSON();
    equal(JSON.stringify(json), '{"type":"Composed","subFilters":[]}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Composed();

    var object = filter.toObject();

    deepEqual(fabric.Image.filters.Composed.fromObject(object), filter);
  });

  test('fromObject with subfilters', function() {
    var filter = new fabric.Image.filters.Composed();
    var brightness = new fabric.Image.filters.Brightness();
    var contrast = new fabric.Image.filters.Contrast();
    filter.subFilters.push(brightness);
    filter.subFilters.push(contrast);
    var toObject = filter.toObject();
    var newFilter = fabric.Image.filters.Composed.fromObject(toObject);
    ok(newFilter instanceof fabric.Image.filters.Composed, 'should inherit from fabric.Image.filters.Composed');
    ok(newFilter.subFilters[0] instanceof fabric.Image.filters.Brightness, 'should inherit from fabric.Image.filters.Brightness');
    ok(newFilter.subFilters[1] instanceof fabric.Image.filters.Contrast, 'should inherit from fabric.Image.filters.Contrast');
  });


  QUnit.module('fabric.Image.filters.ColorMatrix');

  test('constructor', function() {
    ok(fabric.Image.filters.ColorMatrix);

    var filter = new fabric.Image.filters.ColorMatrix();
    ok(filter instanceof fabric.Image.filters.ColorMatrix, 'should inherit from fabric.Image.filters.ColorMatrix');
  });

  test('properties', function() {
    var filter = new fabric.Image.filters.ColorMatrix();

    equal(filter.type, 'ColorMatrix');
    deepEqual(filter.matrix, [
      1, 0, 0, 0, 0,
      0, 1, 0, 0, 0,
      0, 0, 1, 0, 0,
      0, 0, 0, 1, 0
    ]);

    var filter2 = new fabric.Image.filters.ColorMatrix({matrix: [
      0, 1, 0, 0, 0.2,
      0, 0, 1, 0, 0.1,
      1, 0, 0, 0, 0.3,
      0, 0, 0, 1, 0
    ]});
    deepEqual(filter2.matrix, [
      0, 1, 0, 0, 0.2,
      0, 0, 1, 0, 0.1,
      1, 0, 0, 0, 0.3,
      0, 0, 0, 1, 0
    ]);
  });

  test('applyTo2d', function() {
    var filter = new fabric.Image.filters.ColorMatrix();
    ok(typeof filter.applyTo2d === 'function');
  });

  test('applyTo2d values', function() {
    var filter = new fabric.Image.filters.ColorMatrix({matrix: [
      0, 1, 0, 0, 0.2,
      0, 0, 1, 0, 0.1,
      1, 0, 0, 0, 0.3,
      0, 0, 0, 1, 0
    ]});
    var options = { imageData: _createImageData(context) };
    filter.applyTo2d(options);
    var data = options.imageData.data;
    var expected = [151, 76, 255, 1, 255, 36, 106, 1, 255, 28, 255, 1];
    for (var i = 0; i < 12; i++) {
      equal(data[i], expected[i]);
    }
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.ColorMatrix();
    ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"ColorMatrix","matrix":[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0]}');

    filter.matrix = [
      0, 1, 0, 0, 0.2,
      0, 0, 1, 0, 0.1,
      1, 0, 0, 0, 0.3,
      0, 0, 0, 1, 0
    ];

    object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"ColorMatrix","matrix":[0,1,0,0,0.2,0,0,1,0,0.1,1,0,0,0,0.3,0,0,0,1,0]}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.ColorMatrix();
    ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"ColorMatrix","matrix":[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0]}');

    filter.matrix = [
      0, 1, 0, 0, 0.2,
      0, 0, 1, 0, 0.1,
      1, 0, 0, 0, 0.3,
      0, 0, 0, 1, 0
    ];

    json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"ColorMatrix","matrix":[0,1,0,0,0.2,0,0,1,0,0.1,1,0,0,0,0.3,0,0,0,1,0]}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.ColorMatrix();

    var object = filter.toObject();

    deepEqual(fabric.Image.filters.ColorMatrix.fromObject(object), filter);
  });

  QUnit.module('fabric.Image.filters.HueRotation');

  test('constructor', function() {
    ok(fabric.Image.filters.HueRotation);

    var filter = new fabric.Image.filters.HueRotation();
    ok(filter instanceof fabric.Image.filters.ColorMatrix, 'should inherit from fabric.Image.filters.ColorMatrix');
    ok(filter instanceof fabric.Image.filters.HueRotation, 'should inherit from fabric.Image.filters.HueRotation');
  });

  test('properties', function() {
    var filter = new fabric.Image.filters.HueRotation();

    equal(filter.type, 'HueRotation');
    equal(filter.rotation, 0, 'default rotation is 0');

    var filter2 = new fabric.Image.filters.HueRotation({ rotation: 0.5 });
    equal(filter2.rotation, 0.5, 'rotation is 0.5');
  });

  test('applyTo2d', function() {
    var filter = new fabric.Image.filters.HueRotation();
    ok(typeof filter.applyTo2d === 'function');
  });

  test('applyTo2d values', function() {
    var filter = new fabric.Image.filters.HueRotation({ rotation: 0.5 });
    var options = { imageData: _createImageData(context) };
    filter.calculateMatrix();
    filter.applyTo2d(options);
    var data = options.imageData.data;
    var expected = [88, 203, 59, 1, 0, 110, 228, 1, 26, 255, 171, 1];
    for (var i = 0; i < 12; i++) {
      equal(data[i], expected[i]);
    }
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.HueRotation();
    ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"HueRotation","rotation":0}');

    filter.rotation = 0.6;

    object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"HueRotation","rotation":0.6}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.HueRotation();
    ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"HueRotation","rotation":0}');

    filter.rotation = 0.3;

    json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"HueRotation","rotation":0.3}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.HueRotation();

    var object = filter.toObject();

    deepEqual(fabric.Image.filters.HueRotation.fromObject(object), filter);
  });

  QUnit.module('fabric.Image.filters.Contrast');

  test('constructor', function() {
    ok(fabric.Image.filters.Contrast);

    var filter = new fabric.Image.filters.Contrast();
    ok(filter instanceof fabric.Image.filters.Contrast, 'should inherit from fabric.Image.filters.Contrast');
  });

  test('properties', function() {
    var filter = new fabric.Image.filters.Contrast();

    equal(filter.type, 'Contrast');
    equal(filter.contrast, 0);

    var filter2 = new fabric.Image.filters.Contrast({contrast: 0.12});
    equal(filter2.contrast, 0.12);
  });

  test('applyTo2d', function() {
    var filter = new fabric.Image.filters.Contrast();
    ok(typeof filter.applyTo2d === 'function');
  });

  test('applyTo2d values', function() {
    var filter = new fabric.Image.filters.Contrast({contrast: 0.2});
    var options = { imageData: _createImageData(context) };
    filter.applyTo2d(options);
    var data = options.imageData.data;
    var expected = [236, 86, 11, 1, 0, 255, 0, 1, 255, 255, 0, 1];
    for (var i = 0; i < 12; i++) {
      equal(data[i], expected[i]);
    }
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.Contrast();
    ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Contrast","contrast":0}');

    filter.contrast = 100;

    object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Contrast","contrast":100}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.Contrast();
    ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"Contrast","contrast":0}');

    filter.contrast = 100;

    json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"Contrast","contrast":100}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Contrast();

    var object = filter.toObject();

    deepEqual(fabric.Image.filters.Contrast.fromObject(object), filter);
  });

  QUnit.module('fabric.Image.filters.Saturation');

  test('constructor', function() {
    ok(fabric.Image.filters.Saturation);

    var filter = new fabric.Image.filters.Saturation();
    ok(filter instanceof fabric.Image.filters.Saturation, 'should inherit from fabric.Image.filters.Saturation');
  });

  test('properties', function() {
    var filter = new fabric.Image.filters.Saturation();

    equal(filter.type, 'Saturation');
    equal(filter.saturation, 0);

    var filter2 = new fabric.Image.filters.Saturation({saturation: 0.12});
    equal(filter2.saturation, 0.12);
  });

  test('applyTo2d', function() {
    var filter = new fabric.Image.filters.Saturation();
    ok(typeof filter.applyTo2d === 'function');
  });

  test('applyTo2d values Saturation', function() {
    var filter = new fabric.Image.filters.Saturation({saturation: 0.2});
    var options = { imageData: _createImageData(context) };
    filter.applyTo2d(options);
    var data = options.imageData.data;
    var expected = [200, 80, 20, 1, 0, 255, 0, 1, 255, 255, 0, 1];
    for (var i = 0; i < 12; i++) {
      equal(data[i], expected[i]);
    }
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.Saturation();
    ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Saturation","saturation":0}');

    filter.saturation = 100;

    object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Saturation","saturation":100}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.Saturation();
    ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"Saturation","saturation":0}');

    filter.saturation = 100;

    json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"Saturation","saturation":100}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Saturation();

    var object = filter.toObject();

    deepEqual(fabric.Image.filters.Saturation.fromObject(object), filter);
  });

  QUnit.module('fabric.Image.filters.Gamma');

  test('constructor', function() {
    ok(fabric.Image.filters.Gamma);

    var filter = new fabric.Image.filters.Gamma();
    ok(filter instanceof fabric.Image.filters.Gamma, 'should inherit from fabric.Image.filters.Gamma');
  });

  test('properties', function() {
    var filter = new fabric.Image.filters.Gamma();

    equal(filter.type, 'Gamma');
    deepEqual(filter.gamma, [1, 1, 1]);

    var filter2 = new fabric.Image.filters.Gamma({gamma: [0.1, 0.5, 1.3]});
    deepEqual(filter2.gamma, [0.1, 0.5, 1.3]);
  });

  test('applyTo2d', function() {
    var filter = new fabric.Image.filters.Gamma();
    ok(typeof filter.applyTo2d === 'function');
  });

  test('applyTo2d values', function() {
    var filter = new fabric.Image.filters.Gamma({gamma: [0.1, 0.5, 1.3]});
    var options = { imageData: _createImageData(context) };
    filter.applyTo2d(options);
    var data = options.imageData.data;
    var expected = [22, 39, 72, 1, 0, 255, 21, 1, 255, 255, 8, 1];
    for (var i = 0; i < 12; i++) {
      equal(data[i], expected[i]);
    }
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.Gamma();
    ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Gamma","gamma":[1,1,1]}');

    filter.gamma = [0.1, 0.5, 1.3];

    object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Gamma","gamma":[0.1,0.5,1.3]}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.Gamma();
    ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"Gamma","gamma":[1,1,1]}');

    filter.gamma = [1.5, 1.5, 1.5];

    json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"Gamma","gamma":[1.5,1.5,1.5]}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Gamma();

    var object = filter.toObject();

    deepEqual(fabric.Image.filters.Gamma.fromObject(object), filter);
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
    equal(filter.opaque, false);
    deepEqual(filter.matrix, [0,0,0,0,1,0,0,0,0]);

    var filter2 = new fabric.Image.filters.Convolute({opaque: 0.5, matrix: [1,-1,1,0,1,0,0,0,0]});
    equal(filter2.opaque, 0.5);
    deepEqual(filter2.matrix, [1,-1,1,0,1,0,0,0,0]);
  });

  test('applyTo2d', function() {
    var filter = new fabric.Image.filters.Convolute();
    ok(typeof filter.applyTo2d === 'function');
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.Convolute({opaque: 1});
    ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Convolute","opaque":1,"matrix":[0,0,0,0,1,0,0,0,0]}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.Convolute({opaque: 1});
    ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"Convolute","opaque":1,"matrix":[0,0,0,0,1,0,0,0,0]}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Convolute();

    var object = filter.toObject();

    deepEqual(fabric.Image.filters.Convolute.fromObject(object), filter);
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

  test('applyTo2d', function() {
    var filter = new fabric.Image.filters.Grayscale();
    ok(typeof filter.applyTo2d === 'function');
  });

  test('applyTo2d values Grayscale average', function() {
    var filter = new fabric.Image.filters.Grayscale({mode: 'average'});
    var options = { imageData: _createImageData(context) };
    filter.applyTo2d(options);
    var data = options.imageData.data;
    var expected = [117, 117, 117, 1, 98, 98, 98, 1, 171, 171, 171, 1];
    for (var i = 0; i < 12; i++) {
      equal(data[i], expected[i]);
    }
  });

  test('applyTo2d values Grayscale lightness', function() {
    var filter = new fabric.Image.filters.Grayscale({mode: 'lightness'});
    var options = { imageData: _createImageData(context) };
    filter.applyTo2d(options);
    var data = options.imageData.data;
    var expected = [125, 125, 125, 1, 132, 132, 132, 1, 129, 129, 129, 1];
    for (var i = 0; i < 12; i++) {
      equal(data[i], expected[i]);
    }
  });

  test('applyTo2d values Grayscale luminosity', function() {
    var filter = new fabric.Image.filters.Grayscale({mode: 'luminosity'});
    var options = { imageData: _createImageData(context) };
    filter.applyTo2d(options);
    var data = options.imageData.data;
    var expected = [118, 118, 118, 1, 191, 191, 191, 1, 237, 237, 237, 1];
    for (var i = 0; i < 12; i++) {
      equal(data[i], expected[i]);
    }
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.Grayscale({ mode: 'lightness'});
    ok(typeof filter.toObject === 'function');
    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Grayscale","mode":"lightness"}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.Grayscale();
    ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"Grayscale","mode":"average"}');
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

  test('applyTo2d', function() {
    var filter = new fabric.Image.filters.Invert();
    ok(typeof filter.applyTo2d === 'function');
  });

  test('applyTo2d values Invert', function() {
    var filter = new fabric.Image.filters.Invert();
    var options = { imageData: _createImageData(context) };
    filter.applyTo2d(options);
    var data = options.imageData.data;
    var expected = [55, 155, 205, 1, 225, 0, 245, 1, 0, 0, 252, 1];
    for (var i = 0; i < 12; i++) {
      equal(data[i], expected[i]);
    }
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.Invert();
    ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Invert","invert":true}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.Invert();
    ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"Invert","invert":true}');
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

  test('applyTo2d', function() {
    var filter = new fabric.Image.filters.Noise();
    ok(typeof filter.applyTo2d === 'function');
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.Noise();
    ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Noise","noise":0}');

    filter.noise = 100;

    object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Noise","noise":100}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.Noise();
    ok(typeof filter.toJSON === 'function');

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

  test('applyTo2d', function() {
    var filter = new fabric.Image.filters.Pixelate();
    ok(typeof filter.applyTo2d === 'function');
  });

  test('applyTo2d values Pixelate', function() {
    var filter = new fabric.Image.filters.Pixelate({blocksize: 2});
    var options = { imageData: _createImageData(context) };
    filter.applyTo2d(options);
    var data = options.imageData.data;
    var expected = [200, 100, 50, 1, 200, 100, 50, 1, 255, 255, 3, 1];
    for (var i = 0; i < 12; i++) {
      equal(data[i], expected[i]);
    }
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.Pixelate();
    ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Pixelate","blocksize":4}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.Pixelate();
    ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"Pixelate","blocksize":4}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Pixelate();

    var object = filter.toObject();

    deepEqual(fabric.Image.filters.Pixelate.fromObject(object), filter);
  });


  QUnit.module('fabric.Image.filters.RemoveColor');

  test('constructor', function() {
    ok(fabric.Image.filters.RemoveColor);

    var filter = new fabric.Image.filters.RemoveColor();
    ok(filter instanceof fabric.Image.filters.RemoveColor, 'should inherit from fabric.Image.filters.RemoveColor');
  });

  test('properties', function() {
    var filter = new fabric.Image.filters.RemoveColor();

    equal(filter.type, 'RemoveColor');
    equal(filter.distance, 0.02);
    equal(filter.color, '#FFFFFF');

    var filter2 = new fabric.Image.filters.RemoveColor({distance: 0.6, color: '#FF0000'});
    equal(filter2.distance, 0.6);
    equal(filter2.color, '#FF0000');
  });

  test('applyTo2d', function() {
    var filter = new fabric.Image.filters.RemoveColor();
    ok(typeof filter.applyTo2d === 'function');
  });

  test('applyTo2d', function() {
    var filter = new fabric.Image.filters.RemoveColor({ color: '#C86432' });
    ok(typeof filter.applyTo2d === 'function');
    var options = { imageData: _createImageData(context) };
    filter.applyTo2d(options);
    var data = options.imageData.data;
    var expected = [200, 100, 50, 0, 30, 255, 10, 1, 255, 255, 3, 1];
    for (var i = 0; i < 12; i++) {
      equal(data[i], expected[i]);
    }
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.RemoveColor();
    ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"RemoveColor","color":"#FFFFFF","distance":0.02}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.RemoveColor({ color: 'blue'});
    ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"RemoveColor","color":"blue","distance":0.02}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.RemoveColor();

    var object = filter.toObject();

    deepEqual(fabric.Image.filters.RemoveColor.fromObject(object), filter);
  });

  QUnit.module('fabric.Image.filters.Sepia');

  test('constructor', function() {
    ok(fabric.Image.filters.Sepia);

    var filter = new fabric.Image.filters.Sepia();
    ok(filter instanceof fabric.Image.filters.Sepia, 'should inherit from fabric.Image.filters.Sepia');
    ok(filter instanceof fabric.Image.filters.ColorMatrix, 'should inherit from fabric.Image.filters.ColorMatrix');
  });

  test('properties', function() {
    var filter = new fabric.Image.filters.Sepia();
    equal(filter.type, 'Sepia');
  });

  test('applyTo2d', function() {
    var filter = new fabric.Image.filters.Sepia();
    ok(typeof filter.applyTo2d === 'function');
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.Sepia();
    ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Sepia"}');
  });

  test('toJSON', function() {
    var filter = new fabric.Image.filters.Sepia();
    ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    equal(JSON.stringify(json), '{"type":"Sepia"}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Sepia();

    var object = filter.toObject();

    deepEqual(fabric.Image.filters.Sepia.fromObject(object), filter);
  });

  QUnit.module('fabric.Image.filters.Resize');

  test('constructor', function() {
    ok(fabric.Image.filters.Resize);

    var filter = new fabric.Image.filters.Resize();
    ok(filter instanceof fabric.Image.filters.Resize, 'should inherit from fabric.Image.filters.Resize');
  });

  test('properties', function() {
    var filter = new fabric.Image.filters.Resize();

    equal(filter.type, 'Resize');

    equal(filter.resizeType, 'hermite');
    equal(filter.lanczosLobes, 3);
    equal(filter.scaleX, 0);
    equal(filter.scaleY, 0);

    var filter2 = new fabric.Image.filters.Resize({resizeType: 'bilinear', scaleX: 0.3, scaleY: 0.3});
    equal(filter2.resizeType, 'bilinear');
    equal(filter2.scaleX, 0.3);
    equal(filter2.scaleY, 0.3);

  });

  test('applyTo2d', function() {
    var filter = new fabric.Image.filters.Resize();
    ok(typeof filter.applyTo2d === 'function');
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.Resize();
    ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Resize","scaleX":0,"scaleY":0,"resizeType":"hermite","lanczosLobes":3}');

    filter.resizeType = 'bilinear';
    object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Resize","scaleX":0,"scaleY":0,"resizeType":"bilinear","lanczosLobes":3}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Resize();

    var object = filter.toObject();
    var fromObject = fabric.Image.filters.Resize.fromObject(object);
    deepEqual(fromObject, filter);
    ok(fromObject instanceof fabric.Image.filters.Resize, 'should inherit from fabric.Image.filters.Resize');
    filter.resizeType = 'bilinear';
    filter.scaleX = 0.8;
    filter.scaleY = 0.8;
    deepEqual(fabric.Image.filters.Resize.fromObject(filter.toObject()), filter);
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
