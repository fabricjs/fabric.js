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
      canvas = fabric.document.createElement('canvas'),
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
  //   'strokeMiterLimit':   4,
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

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Image.filters.Brightness);

    var filter = new fabric.Image.filters.Brightness();
    assert.ok(filter instanceof fabric.Image.filters.Brightness, 'should inherit from fabric.Image.filters.Brightness');
  });

  QUnit.test('properties', function(assert) {
    var filter = new fabric.Image.filters.Brightness();

    assert.equal(filter.type, 'Brightness');
    assert.equal(filter.brightness, 0);

    var filter2 = new fabric.Image.filters.Brightness({brightness: 0.12});
    assert.equal(filter2.brightness, 0.12);
  });

  QUnit.test('applyTo2d', function(assert) {
    var filter = new fabric.Image.filters.Brightness();
    assert.ok(typeof filter.applyTo2d === 'function');
  });

  QUnit.test('applyTo2d values', function(assert) {
    var filter = new fabric.Image.filters.Brightness({brightness: 0.2});
    var options = { imageData: _createImageData(context) };
    filter.applyTo2d(options);
    var data = options.imageData.data;
    var expected = [251, 151, 101, 1, 81, 255, 61, 1, 255, 255, 54, 1];
    for (var i = 0; i < 12; i++) {
      assert.equal(data[i], expected[i]);
    }
  });

  QUnit.test('toObject', function(assert) {
    var filter = new fabric.Image.filters.Brightness();
    assert.ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    assert.equal(JSON.stringify(object), '{"type":"Brightness","brightness":0}');

    filter.brightness = 100;

    object = filter.toObject();
    assert.equal(JSON.stringify(object), '{"type":"Brightness","brightness":100}');
  });

  QUnit.test('toJSON', function(assert) {
    var filter = new fabric.Image.filters.Brightness();
    assert.ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    assert.equal(JSON.stringify(json), '{"type":"Brightness","brightness":0}');

    filter.brightness = 100;

    json = filter.toJSON();
    assert.equal(JSON.stringify(json), '{"type":"Brightness","brightness":100}');
  });

  QUnit.test('fromObject', function(assert) {
    var filter = new fabric.Image.filters.Brightness();

    var object = filter.toObject();

    assert.deepEqual(fabric.Image.filters.Brightness.fromObject(object), filter);
  });

  QUnit.test('isNeutralState', function(assert) {
    var filter = new fabric.Image.filters.Brightness();

    assert.ok(filter.isNeutralState(), 'Is neutral when brightness is 0');
    filter.brightness = 0.15;
    assert.notOk(filter.isNeutralState(), 'Is not neutral when brightness change');
  });

  QUnit.module('fabric.Image.filters.Composed');

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Image.filters.Composed);

    var filter = new fabric.Image.filters.Composed();
    assert.ok(filter instanceof fabric.Image.filters.Composed, 'should inherit from fabric.Image.filters.Composed');
  });

  QUnit.test('properties', function(assert) {
    var filter = new fabric.Image.filters.Composed();

    assert.equal(filter.type, 'Composed');

  });

  QUnit.test('has not applyTo2d', function(assert) {
    var filter = new fabric.Image.filters.Composed();
    assert.ok(typeof filter.applyTo2d === 'undefined');
  });

  QUnit.test('toObject', function(assert) {
    var filter = new fabric.Image.filters.Composed();
    assert.ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    assert.equal(JSON.stringify(object), '{"type":"Composed","subFilters":[]}');

  });

  QUnit.test('toObject with subfilters', function(assert) {
    var filter = new fabric.Image.filters.Composed();
    var brightness = new fabric.Image.filters.Brightness();
    var contrast = new fabric.Image.filters.Contrast();
    filter.subFilters.push(brightness);
    filter.subFilters.push(contrast);
    var contrastObj = contrast.toObject();
    var brightnessObj = brightness.toObject();
    var object = filter.toObject();
    assert.equal(object.subFilters.length, 2, 'there are 2 subfilters');
    assert.deepEqual(object.subFilters[0], brightnessObj, 'the first subfilter has been serialized');
    assert.deepEqual(object.subFilters[1], contrastObj, 'the second subfilter has been serialized');
  });

  QUnit.test('toJSON', function(assert) {
    var filter2 = new fabric.Image.filters.Composed();
    assert.ok(typeof filter2.toJSON === 'function');

    var json = filter2.toJSON();
    assert.equal(JSON.stringify(json), '{"type":"Composed","subFilters":[]}');
  });

  QUnit.test('fromObject', function(assert) {
    var filter = new fabric.Image.filters.Composed();

    var object = filter.toObject();

    assert.deepEqual(fabric.Image.filters.Composed.fromObject(object), filter);
  });

  QUnit.test('fromObject with subfilters', function(assert) {
    var filter = new fabric.Image.filters.Composed();
    var brightness = new fabric.Image.filters.Brightness();
    var contrast = new fabric.Image.filters.Contrast();
    filter.subFilters.push(brightness);
    filter.subFilters.push(contrast);
    var toObject = filter.toObject();
    var newFilter = fabric.Image.filters.Composed.fromObject(toObject);
    assert.ok(newFilter instanceof fabric.Image.filters.Composed, 'should inherit from fabric.Image.filters.Composed');
    assert.ok(newFilter.subFilters[0] instanceof fabric.Image.filters.Brightness, 'should inherit from fabric.Image.filters.Brightness');
    assert.ok(newFilter.subFilters[1] instanceof fabric.Image.filters.Contrast, 'should inherit from fabric.Image.filters.Contrast');
  });

  QUnit.test('isNeutralState', function(assert) {
    var filter = new fabric.Image.filters.Composed();
    var brightness = new fabric.Image.filters.Brightness();
    var contrast = new fabric.Image.filters.Contrast();
    filter.subFilters.push(brightness);
    filter.subFilters.push(contrast);

    assert.ok(filter.isNeutralState(), 'Is neutral when all filters are neutral');
    filter.subFilters[0].brightness = 0.15;
    assert.notOk(filter.isNeutralState(), 'Is not neutral when one subfilter changes');
  });


  QUnit.module('fabric.Image.filters.ColorMatrix');

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Image.filters.ColorMatrix);

    var filter = new fabric.Image.filters.ColorMatrix();
    assert.ok(filter instanceof fabric.Image.filters.ColorMatrix, 'should inherit from fabric.Image.filters.ColorMatrix');
  });

  QUnit.test('properties', function(assert) {
    var filter = new fabric.Image.filters.ColorMatrix();

    assert.equal(filter.type, 'ColorMatrix');
    assert.deepEqual(filter.matrix, [
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
    assert.deepEqual(filter2.matrix, [
      0, 1, 0, 0, 0.2,
      0, 0, 1, 0, 0.1,
      1, 0, 0, 0, 0.3,
      0, 0, 0, 1, 0
    ]);
  });

  QUnit.test('applyTo2d', function(assert) {
    var filter = new fabric.Image.filters.ColorMatrix();
    assert.ok(typeof filter.applyTo2d === 'function');
  });

  QUnit.test('applyTo2d values', function(assert) {
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
      assert.equal(data[i], expected[i]);
    }
  });

  QUnit.test('toObject', function(assert) {
    var filter = new fabric.Image.filters.ColorMatrix();
    assert.ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    assert.equal(JSON.stringify(object), '{"type":"ColorMatrix","matrix":[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0]}');

    filter.matrix = [
      0, 1, 0, 0, 0.2,
      0, 0, 1, 0, 0.1,
      1, 0, 0, 0, 0.3,
      0, 0, 0, 1, 0
    ];

    object = filter.toObject();
    assert.equal(JSON.stringify(object), '{"type":"ColorMatrix","matrix":[0,1,0,0,0.2,0,0,1,0,0.1,1,0,0,0,0.3,0,0,0,1,0]}');
  });

  QUnit.test('toJSON', function(assert) {
    var filter = new fabric.Image.filters.ColorMatrix();
    assert.ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    assert.equal(JSON.stringify(json), '{"type":"ColorMatrix","matrix":[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0]}');

    filter.matrix = [
      0, 1, 0, 0, 0.2,
      0, 0, 1, 0, 0.1,
      1, 0, 0, 0, 0.3,
      0, 0, 0, 1, 0
    ];

    json = filter.toJSON();
    assert.equal(JSON.stringify(json), '{"type":"ColorMatrix","matrix":[0,1,0,0,0.2,0,0,1,0,0.1,1,0,0,0,0.3,0,0,0,1,0]}');
  });

  QUnit.test('fromObject', function(assert) {
    var filter = new fabric.Image.filters.ColorMatrix();

    var object = filter.toObject();

    assert.deepEqual(fabric.Image.filters.ColorMatrix.fromObject(object), filter);
  });

  QUnit.test('isNeutralState', function(assert) {
    var filter = new fabric.Image.filters.ColorMatrix();

    assert.ok(filter.isNeutralState(), 'Is neutral when matrix is identity');
    filter.matrix = [
      0, 1, 0, 0, 0.2,
      0, 0, 1, 0, 0.1,
      1, 0, 0, 0, 0.3,
      0, 0, 0, 1, 0
    ];
    assert.notOk(filter.isNeutralState(), 'Is not neutral when matrix changes');
  });

  QUnit.module('fabric.Image.filters.HueRotation');

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Image.filters.HueRotation);

    var filter = new fabric.Image.filters.HueRotation();
    assert.ok(filter instanceof fabric.Image.filters.ColorMatrix, 'should inherit from fabric.Image.filters.ColorMatrix');
    assert.ok(filter instanceof fabric.Image.filters.HueRotation, 'should inherit from fabric.Image.filters.HueRotation');
  });

  QUnit.test('properties', function(assert) {
    var filter = new fabric.Image.filters.HueRotation();

    assert.equal(filter.type, 'HueRotation');
    assert.equal(filter.rotation, 0, 'default rotation is 0');

    var filter2 = new fabric.Image.filters.HueRotation({ rotation: 0.5 });
    assert.equal(filter2.rotation, 0.5, 'rotation is 0.5');
  });

  QUnit.test('applyTo2d', function(assert) {
    var filter = new fabric.Image.filters.HueRotation();
    assert.ok(typeof filter.applyTo2d === 'function');
  });

  QUnit.test('applyTo2d values', function(assert) {
    var filter = new fabric.Image.filters.HueRotation({ rotation: 0.5 });
    var options = { imageData: _createImageData(context) };
    filter.calculateMatrix();
    filter.applyTo2d(options);
    var data = options.imageData.data;
    var expected = [88, 203, 59, 1, 0, 110, 228, 1, 26, 255, 171, 1];
    for (var i = 0; i < 12; i++) {
      assert.equal(data[i], expected[i]);
    }
  });

  QUnit.test('toObject', function(assert) {
    var filter = new fabric.Image.filters.HueRotation();
    assert.ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    assert.equal(JSON.stringify(object), '{"type":"HueRotation","rotation":0}');

    filter.rotation = 0.6;

    object = filter.toObject();
    assert.equal(JSON.stringify(object), '{"type":"HueRotation","rotation":0.6}');
  });

  QUnit.test('toJSON', function(assert) {
    var filter = new fabric.Image.filters.HueRotation();
    assert.ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    assert.equal(JSON.stringify(json), '{"type":"HueRotation","rotation":0}');

    filter.rotation = 0.3;

    json = filter.toJSON();
    assert.equal(JSON.stringify(json), '{"type":"HueRotation","rotation":0.3}');
  });

  QUnit.test('fromObject', function(assert) {
    var filter = new fabric.Image.filters.HueRotation();

    var object = filter.toObject();

    assert.deepEqual(fabric.Image.filters.HueRotation.fromObject(object), filter);
  });

  QUnit.test('isNeutralState', function(assert) {
    var filter = new fabric.Image.filters.HueRotation();

    assert.ok(filter.isNeutralState(), 'Is neutral when rotation is 0');
    filter.rotation = 0.6;
    assert.notOk(filter.isNeutralState(), 'Is not neutral when rotation changes');
  });

  QUnit.module('fabric.Image.filters.Contrast');

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Image.filters.Contrast);

    var filter = new fabric.Image.filters.Contrast();
    assert.ok(filter instanceof fabric.Image.filters.Contrast, 'should inherit from fabric.Image.filters.Contrast');
  });

  QUnit.test('properties', function(assert) {
    var filter = new fabric.Image.filters.Contrast();

    assert.equal(filter.type, 'Contrast');
    assert.equal(filter.contrast, 0);

    var filter2 = new fabric.Image.filters.Contrast({contrast: 0.12});
    assert.equal(filter2.contrast, 0.12);
  });

  QUnit.test('applyTo2d', function(assert) {
    var filter = new fabric.Image.filters.Contrast();
    assert.ok(typeof filter.applyTo2d === 'function');
  });

  QUnit.test('applyTo2d values', function(assert) {
    var filter = new fabric.Image.filters.Contrast({contrast: 0.2});
    var options = { imageData: _createImageData(context) };
    filter.applyTo2d(options);
    var data = options.imageData.data;
    var expected = [236, 86, 11, 1, 0, 255, 0, 1, 255, 255, 0, 1];
    for (var i = 0; i < 12; i++) {
      assert.equal(data[i], expected[i]);
    }
  });

  QUnit.test('toObject', function(assert) {
    var filter = new fabric.Image.filters.Contrast();
    assert.ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    assert.equal(JSON.stringify(object), '{"type":"Contrast","contrast":0}');

    filter.contrast = 100;

    object = filter.toObject();
    assert.equal(JSON.stringify(object), '{"type":"Contrast","contrast":100}');
  });

  QUnit.test('toJSON', function(assert) {
    var filter = new fabric.Image.filters.Contrast();
    assert.ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    assert.equal(JSON.stringify(json), '{"type":"Contrast","contrast":0}');

    filter.contrast = 100;

    json = filter.toJSON();
    assert.equal(JSON.stringify(json), '{"type":"Contrast","contrast":100}');
  });

  QUnit.test('fromObject', function(assert) {
    var filter = new fabric.Image.filters.Contrast();

    var object = filter.toObject();

    assert.deepEqual(fabric.Image.filters.Contrast.fromObject(object), filter);
  });

  QUnit.test('isNeutralState', function(assert) {
    var filter = new fabric.Image.filters.Contrast();

    assert.ok(filter.isNeutralState(), 'Is neutral when contrast is 0');
    filter.contrast = 0.6;
    assert.notOk(filter.isNeutralState(), 'Is not neutral when contrast changes');
  });

  QUnit.module('fabric.Image.filters.Saturation');

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Image.filters.Saturation);

    var filter = new fabric.Image.filters.Saturation();
    assert.ok(filter instanceof fabric.Image.filters.Saturation, 'should inherit from fabric.Image.filters.Saturation');
  });

  QUnit.test('properties', function(assert) {
    var filter = new fabric.Image.filters.Saturation();

    assert.equal(filter.type, 'Saturation');
    assert.equal(filter.saturation, 0);

    var filter2 = new fabric.Image.filters.Saturation({saturation: 0.12});
    assert.equal(filter2.saturation, 0.12);
  });

  QUnit.test('applyTo2d', function(assert) {
    var filter = new fabric.Image.filters.Saturation();
    assert.ok(typeof filter.applyTo2d === 'function');
  });

  QUnit.test('applyTo2d values Saturation', function(assert) {
    var filter = new fabric.Image.filters.Saturation({saturation: 0.2});
    var options = { imageData: _createImageData(context) };
    filter.applyTo2d(options);
    var data = options.imageData.data;
    var expected = [200, 80, 20, 1, 0, 255, 0, 1, 255, 255, 0, 1];
    for (var i = 0; i < 12; i++) {
      assert.equal(data[i], expected[i]);
    }
  });

  QUnit.test('toObject', function(assert) {
    var filter = new fabric.Image.filters.Saturation();
    assert.ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    assert.equal(JSON.stringify(object), '{"type":"Saturation","saturation":0}');

    filter.saturation = 100;

    object = filter.toObject();
    assert.equal(JSON.stringify(object), '{"type":"Saturation","saturation":100}');
  });

  QUnit.test('toJSON', function(assert) {
    var filter = new fabric.Image.filters.Saturation();
    assert.ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    assert.equal(JSON.stringify(json), '{"type":"Saturation","saturation":0}');

    filter.saturation = 100;

    json = filter.toJSON();
    assert.equal(JSON.stringify(json), '{"type":"Saturation","saturation":100}');
  });

  QUnit.test('fromObject', function(assert) {
    var filter = new fabric.Image.filters.Saturation();

    var object = filter.toObject();

    assert.deepEqual(fabric.Image.filters.Saturation.fromObject(object), filter);
  });

  QUnit.test('isNeutralState', function(assert) {
    var filter = new fabric.Image.filters.Saturation();

    assert.ok(filter.isNeutralState(), 'Is neutral when saturation is 0');
    filter.saturation = 0.6;
    assert.notOk(filter.isNeutralState(), 'Is not neutral when saturation changes');
  });

  QUnit.module('fabric.Image.filters.Gamma');

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Image.filters.Gamma);

    var filter = new fabric.Image.filters.Gamma();
    assert.ok(filter instanceof fabric.Image.filters.Gamma, 'should inherit from fabric.Image.filters.Gamma');
  });

  QUnit.test('properties', function(assert) {
    var filter = new fabric.Image.filters.Gamma();

    assert.equal(filter.type, 'Gamma');
    assert.deepEqual(filter.gamma, [1, 1, 1]);

    var filter2 = new fabric.Image.filters.Gamma({gamma: [0.1, 0.5, 1.3]});
    assert.deepEqual(filter2.gamma, [0.1, 0.5, 1.3]);
  });

  QUnit.test('applyTo2d', function(assert) {
    var filter = new fabric.Image.filters.Gamma();
    assert.ok(typeof filter.applyTo2d === 'function');
  });

  QUnit.test('applyTo2d values', function(assert) {
    var filter = new fabric.Image.filters.Gamma({gamma: [0.1, 0.5, 1.3]});
    var options = { imageData: _createImageData(context) };
    filter.applyTo2d(options);
    var data = options.imageData.data;
    var expected = [22, 39, 72, 1, 0, 255, 21, 1, 255, 255, 8, 1];
    for (var i = 0; i < 12; i++) {
      assert.equal(data[i], expected[i]);
    }
  });

  QUnit.test('toObject', function(assert) {
    var filter = new fabric.Image.filters.Gamma();
    assert.ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    assert.equal(JSON.stringify(object), '{"type":"Gamma","gamma":[1,1,1]}');

    filter.gamma = [0.1, 0.5, 1.3];

    object = filter.toObject();
    assert.equal(JSON.stringify(object), '{"type":"Gamma","gamma":[0.1,0.5,1.3]}');
  });

  QUnit.test('toJSON', function(assert) {
    var filter = new fabric.Image.filters.Gamma();
    assert.ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    assert.equal(JSON.stringify(json), '{"type":"Gamma","gamma":[1,1,1]}');

    filter.gamma = [1.5, 1.5, 1.5];

    json = filter.toJSON();
    assert.equal(JSON.stringify(json), '{"type":"Gamma","gamma":[1.5,1.5,1.5]}');
  });

  QUnit.test('fromObject', function(assert) {
    var filter = new fabric.Image.filters.Gamma();

    var object = filter.toObject();

    assert.deepEqual(fabric.Image.filters.Gamma.fromObject(object), filter);
  });

  QUnit.test('isNeutralState', function(assert) {
    var filter = new fabric.Image.filters.Gamma();

    assert.ok(filter.isNeutralState(), 'Is neutral when gamma is 1');
    filter.gamma = [1.5, 1.5, 1.5];
    assert.notOk(filter.isNeutralState(), 'Is not neutral when gamma changes');
  });

  QUnit.module('fabric.Image.filters.Convolute');

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Image.filters.Convolute);

    var filter = new fabric.Image.filters.Convolute();
    assert.ok(filter instanceof fabric.Image.filters.Convolute, 'should inherit from fabric.Image.filters.Convolute');
  });

  QUnit.test('properties', function(assert) {
    var filter = new fabric.Image.filters.Convolute();

    assert.equal(filter.type, 'Convolute');
    assert.equal(filter.opaque, false);
    assert.deepEqual(filter.matrix, [0,0,0,0,1,0,0,0,0]);

    var filter2 = new fabric.Image.filters.Convolute({opaque: 0.5, matrix: [1,-1,1,0,1,0,0,0,0]});
    assert.equal(filter2.opaque, 0.5);
    assert.deepEqual(filter2.matrix, [1,-1,1,0,1,0,0,0,0]);
  });

  QUnit.test('applyTo2d', function(assert) {
    var filter = new fabric.Image.filters.Convolute();
    assert.ok(typeof filter.applyTo2d === 'function');
  });

  QUnit.test('toObject', function(assert) {
    var filter = new fabric.Image.filters.Convolute({opaque: 1});
    assert.ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    assert.equal(JSON.stringify(object), '{"type":"Convolute","opaque":1,"matrix":[0,0,0,0,1,0,0,0,0]}');
  });

  QUnit.test('toJSON', function(assert) {
    var filter = new fabric.Image.filters.Convolute({opaque: 1});
    assert.ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    assert.equal(JSON.stringify(json), '{"type":"Convolute","opaque":1,"matrix":[0,0,0,0,1,0,0,0,0]}');
  });

  QUnit.test('fromObject', function(assert) {
    var filter = new fabric.Image.filters.Convolute();

    var object = filter.toObject();

    assert.deepEqual(fabric.Image.filters.Convolute.fromObject(object), filter);
  });

  QUnit.test('isNeutralState', function(assert) {
    var filter = new fabric.Image.filters.Convolute();
    assert.notOk(filter.isNeutralState(), 'Is not neutral');
  });

  QUnit.module('fabric.Image.filters.Grayscale');

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Image.filters.Grayscale);

    var filter = new fabric.Image.filters.Grayscale();
    assert.ok(filter instanceof fabric.Image.filters.Grayscale, 'should inherit from fabric.Image.filters.Grayscale');
  });

  QUnit.test('properties', function(assert) {
    var filter = new fabric.Image.filters.Grayscale();

    assert.equal(filter.type, 'Grayscale');
  });

  QUnit.test('applyTo2d', function(assert) {
    var filter = new fabric.Image.filters.Grayscale();
    assert.ok(typeof filter.applyTo2d === 'function');
  });

  QUnit.test('applyTo2d values Grayscale average', function(assert) {
    var filter = new fabric.Image.filters.Grayscale({mode: 'average'});
    var options = { imageData: _createImageData(context) };
    filter.applyTo2d(options);
    var data = options.imageData.data;
    var expected = [117, 117, 117, 1, 98, 98, 98, 1, 171, 171, 171, 1];
    for (var i = 0; i < 12; i++) {
      assert.equal(data[i], expected[i]);
    }
  });

  QUnit.test('applyTo2d values Grayscale lightness', function(assert) {
    var filter = new fabric.Image.filters.Grayscale({mode: 'lightness'});
    var options = { imageData: _createImageData(context) };
    filter.applyTo2d(options);
    var data = options.imageData.data;
    var expected = [125, 125, 125, 1, 132, 132, 132, 1, 129, 129, 129, 1];
    for (var i = 0; i < 12; i++) {
      assert.equal(data[i], expected[i]);
    }
  });

  QUnit.test('applyTo2d values Grayscale luminosity', function(assert) {
    var filter = new fabric.Image.filters.Grayscale({mode: 'luminosity'});
    var options = { imageData: _createImageData(context) };
    filter.applyTo2d(options);
    var data = options.imageData.data;
    var expected = [118, 118, 118, 1, 191, 191, 191, 1, 237, 237, 237, 1];
    for (var i = 0; i < 12; i++) {
      assert.equal(data[i], expected[i]);
    }
  });

  QUnit.test('toObject', function(assert) {
    var filter = new fabric.Image.filters.Grayscale({ mode: 'lightness'});
    assert.ok(typeof filter.toObject === 'function');
    var object = filter.toObject();
    assert.equal(JSON.stringify(object), '{"type":"Grayscale","mode":"lightness"}');
  });

  QUnit.test('toJSON', function(assert) {
    var filter = new fabric.Image.filters.Grayscale();
    assert.ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    assert.equal(JSON.stringify(json), '{"type":"Grayscale","mode":"average"}');
  });

  QUnit.test('fromObject', function(assert) {
    var filter = new fabric.Image.filters.Grayscale();

    var object = filter.toObject();

    assert.deepEqual(fabric.Image.filters.Grayscale.fromObject(object), filter);
  });

  QUnit.test('isNeutralState', function(assert) {
    var filter = new fabric.Image.filters.Grayscale();
    assert.notOk(filter.isNeutralState(), 'Is never neutral');
  });

  QUnit.module('fabric.Image.filters.Invert');

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Image.filters.Invert);

    var filter = new fabric.Image.filters.Invert();
    assert.ok(filter instanceof fabric.Image.filters.Invert, 'should inherit from fabric.Image.filters.Invert');
  });

  QUnit.test('properties', function(assert) {
    var filter = new fabric.Image.filters.Invert();

    assert.equal(filter.type, 'Invert');
  });

  QUnit.test('applyTo2d', function(assert) {
    var filter = new fabric.Image.filters.Invert();
    assert.ok(typeof filter.applyTo2d === 'function');
  });

  QUnit.test('applyTo2d values Invert', function(assert) {
    var filter = new fabric.Image.filters.Invert();
    var options = { imageData: _createImageData(context) };
    filter.applyTo2d(options);
    var data = options.imageData.data;
    var expected = [55, 155, 205, 1, 225, 0, 245, 1, 0, 0, 252, 1];
    for (var i = 0; i < 12; i++) {
      assert.equal(data[i], expected[i]);
    }
  });

  QUnit.test('toObject', function(assert) {
    var filter = new fabric.Image.filters.Invert();
    assert.ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    assert.equal(JSON.stringify(object), '{"type":"Invert","invert":true}');
  });

  QUnit.test('toJSON', function(assert) {
    var filter = new fabric.Image.filters.Invert();
    assert.ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    assert.equal(JSON.stringify(json), '{"type":"Invert","invert":true}');
  });

  QUnit.test('fromObject', function(assert) {
    var filter = new fabric.Image.filters.Invert();

    var object = filter.toObject();

    assert.deepEqual(fabric.Image.filters.Invert.fromObject(object), filter);
  });

  QUnit.test('isNeutralState', function(assert) {
    var filter = new fabric.Image.filters.Invert();
    assert.notOk(filter.isNeutralState(), 'Is not neutral when default');
    filter.invert = false;
    assert.ok(filter.isNeutralState(), 'Is not neutral when default');
  });

  QUnit.module('fabric.Image.filters.Noise');

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Image.filters.Noise);

    var filter = new fabric.Image.filters.Noise();
    assert.ok(filter instanceof fabric.Image.filters.Noise, 'should inherit from fabric.Image.filters.Noise');
  });

  QUnit.test('properties', function(assert) {
    var filter = new fabric.Image.filters.Noise();

    assert.equal(filter.type, 'Noise');
    assert.equal(filter.noise, 0);

    var filter2 = new fabric.Image.filters.Noise({noise: 200});
    assert.equal(filter2.noise, 200);
  });

  QUnit.test('applyTo2d', function(assert) {
    var filter = new fabric.Image.filters.Noise();
    assert.ok(typeof filter.applyTo2d === 'function');
  });

  QUnit.test('toObject', function(assert) {
    var filter = new fabric.Image.filters.Noise();
    assert.ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    assert.equal(JSON.stringify(object), '{"type":"Noise","noise":0}');

    filter.noise = 100;

    object = filter.toObject();
    assert.equal(JSON.stringify(object), '{"type":"Noise","noise":100}');
  });

  QUnit.test('toJSON', function(assert) {
    var filter = new fabric.Image.filters.Noise();
    assert.ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    assert.equal(JSON.stringify(json), '{"type":"Noise","noise":0}');

    filter.noise = 100;

    json = filter.toJSON();
    assert.equal(JSON.stringify(json), '{"type":"Noise","noise":100}');
  });

  QUnit.test('fromObject', function(assert) {
    var filter = new fabric.Image.filters.Noise();

    var object = filter.toObject();

    assert.deepEqual(fabric.Image.filters.Noise.fromObject(object), filter);
  });

  QUnit.test('isNeutralState', function(assert) {
    var filter = new fabric.Image.filters.Noise();
    assert.ok(filter.isNeutralState(), 'Is neutral when noise is 0');
    filter.noise = 1;
    assert.notOk(filter.isNeutralState(), 'Is no neutral when noise change');
  });

  QUnit.module('fabric.Image.filters.Pixelate');

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Image.filters.Pixelate);

    var filter = new fabric.Image.filters.Pixelate();
    assert.ok(filter instanceof fabric.Image.filters.Pixelate, 'should inherit from fabric.Image.filters.Pixelate');
  });

  QUnit.test('properties', function(assert) {
    var filter = new fabric.Image.filters.Pixelate();

    assert.equal(filter.type, 'Pixelate');
    assert.equal(filter.blocksize, 4);

    var filter2 = new fabric.Image.filters.Pixelate({blocksize: 8});
    assert.equal(filter2.blocksize, 8);
  });

  QUnit.test('applyTo2d', function(assert) {
    var filter = new fabric.Image.filters.Pixelate();
    assert.ok(typeof filter.applyTo2d === 'function');
  });

  QUnit.test('applyTo2d values Pixelate', function(assert) {
    var filter = new fabric.Image.filters.Pixelate({blocksize: 2});
    var options = { imageData: _createImageData(context) };
    filter.applyTo2d(options);
    var data = options.imageData.data;
    var expected = [200, 100, 50, 1, 200, 100, 50, 1, 255, 255, 3, 1];
    for (var i = 0; i < 12; i++) {
      assert.equal(data[i], expected[i]);
    }
  });

  QUnit.test('toObject', function(assert) {
    var filter = new fabric.Image.filters.Pixelate();
    assert.ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    assert.equal(JSON.stringify(object), '{"type":"Pixelate","blocksize":4}');
  });

  QUnit.test('toJSON', function(assert) {
    var filter = new fabric.Image.filters.Pixelate();
    assert.ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    assert.equal(JSON.stringify(json), '{"type":"Pixelate","blocksize":4}');
  });

  QUnit.test('fromObject', function(assert) {
    var filter = new fabric.Image.filters.Pixelate();

    var object = filter.toObject();

    assert.deepEqual(fabric.Image.filters.Pixelate.fromObject(object), filter);
  });

  QUnit.test('isNeutralState', function(assert) {
    var filter = new fabric.Image.filters.Pixelate();
    filter.blocksize = 1;
    assert.ok(filter.isNeutralState(), 'Is neutral when blockSize is 1');
    filter.blocksize = 4;
    assert.notOk(filter.isNeutralState(), 'Is no neutral when blockSize change');
  });

  QUnit.module('fabric.Image.filters.RemoveColor');

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Image.filters.RemoveColor);

    var filter = new fabric.Image.filters.RemoveColor();
    assert.ok(filter instanceof fabric.Image.filters.RemoveColor, 'should inherit from fabric.Image.filters.RemoveColor');
  });

  QUnit.test('properties', function(assert) {
    var filter = new fabric.Image.filters.RemoveColor();

    assert.equal(filter.type, 'RemoveColor');
    assert.equal(filter.distance, 0.02);
    assert.equal(filter.color, '#FFFFFF');

    var filter2 = new fabric.Image.filters.RemoveColor({distance: 0.6, color: '#FF0000'});
    assert.equal(filter2.distance, 0.6);
    assert.equal(filter2.color, '#FF0000');
  });

  QUnit.test('applyTo2d', function(assert) {
    var filter = new fabric.Image.filters.RemoveColor();
    assert.ok(typeof filter.applyTo2d === 'function');
  });

  QUnit.test('applyTo2d', function(assert) {
    var filter = new fabric.Image.filters.RemoveColor({ color: '#C86432' });
    assert.ok(typeof filter.applyTo2d === 'function');
    var options = { imageData: _createImageData(context) };
    filter.applyTo2d(options);
    var data = options.imageData.data;
    var expected = [200, 100, 50, 0, 30, 255, 10, 1, 255, 255, 3, 1];
    for (var i = 0; i < 12; i++) {
      assert.equal(data[i], expected[i]);
    }
  });

  QUnit.test('toObject', function(assert) {
    var filter = new fabric.Image.filters.RemoveColor();
    assert.ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    assert.equal(JSON.stringify(object), '{"type":"RemoveColor","color":"#FFFFFF","distance":0.02}');
  });

  QUnit.test('toJSON', function(assert) {
    var filter = new fabric.Image.filters.RemoveColor({ color: 'blue'});
    assert.ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    assert.equal(JSON.stringify(json), '{"type":"RemoveColor","color":"blue","distance":0.02}');
  });

  QUnit.test('fromObject', function(assert) {
    var filter = new fabric.Image.filters.RemoveColor();

    var object = filter.toObject();

    assert.deepEqual(fabric.Image.filters.RemoveColor.fromObject(object), filter);
  });

  QUnit.test('isNeutralState', function(assert) {
    var filter = new fabric.Image.filters.RemoveColor();
    assert.notOk(filter.isNeutralState(), 'Is never neutral');
  });

  QUnit.module('fabric.Image.filters.Sepia');

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Image.filters.Sepia);

    var filter = new fabric.Image.filters.Sepia();
    assert.ok(filter instanceof fabric.Image.filters.Sepia, 'should inherit from fabric.Image.filters.Sepia');
    assert.ok(filter instanceof fabric.Image.filters.ColorMatrix, 'should inherit from fabric.Image.filters.ColorMatrix');
  });

  QUnit.test('properties', function(assert) {
    var filter = new fabric.Image.filters.Sepia();
    assert.equal(filter.type, 'Sepia');
  });

  QUnit.test('applyTo2d', function(assert) {
    var filter = new fabric.Image.filters.Sepia();
    assert.ok(typeof filter.applyTo2d === 'function');
  });

  QUnit.test('toObject', function(assert) {
    var filter = new fabric.Image.filters.Sepia();
    assert.ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    assert.equal(JSON.stringify(object), '{"type":"Sepia"}');
  });

  QUnit.test('toJSON', function(assert) {
    var filter = new fabric.Image.filters.Sepia();
    assert.ok(typeof filter.toJSON === 'function');

    var json = filter.toJSON();
    assert.equal(JSON.stringify(json), '{"type":"Sepia"}');
  });

  QUnit.test('fromObject', function(assert) {
    var filter = new fabric.Image.filters.Sepia();

    var object = filter.toObject();

    assert.deepEqual(fabric.Image.filters.Sepia.fromObject(object), filter);
  });

  QUnit.test('isNeutralState', function(assert) {
    var filter = new fabric.Image.filters.Sepia();
    assert.notOk(filter.isNeutralState(), 'Is never neutral');
  });

  QUnit.module('fabric.Image.filters.Resize');

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Image.filters.Resize);

    var filter = new fabric.Image.filters.Resize();
    assert.ok(filter instanceof fabric.Image.filters.Resize, 'should inherit from fabric.Image.filters.Resize');
  });

  QUnit.test('properties', function(assert) {
    var filter = new fabric.Image.filters.Resize();

    assert.equal(filter.type, 'Resize');

    assert.equal(filter.resizeType, 'hermite');
    assert.equal(filter.lanczosLobes, 3);
    assert.equal(filter.scaleX, 1);
    assert.equal(filter.scaleY, 1);

    var filter2 = new fabric.Image.filters.Resize({resizeType: 'bilinear', scaleX: 0.3, scaleY: 0.3});
    assert.equal(filter2.resizeType, 'bilinear');
    assert.equal(filter2.scaleX, 0.3);
    assert.equal(filter2.scaleY, 0.3);

  });

  QUnit.test('applyTo2d', function(assert) {
    var filter = new fabric.Image.filters.Resize();
    assert.ok(typeof filter.applyTo2d === 'function');
  });

  QUnit.test('toObject', function(assert) {
    var filter = new fabric.Image.filters.Resize();
    assert.ok(typeof filter.toObject === 'function');

    var object = filter.toObject();
    assert.equal(JSON.stringify(object), '{"type":"Resize","scaleX":1,"scaleY":1,"resizeType":"hermite","lanczosLobes":3}');

    filter.resizeType = 'bilinear';
    object = filter.toObject();
    assert.equal(JSON.stringify(object), '{"type":"Resize","scaleX":1,"scaleY":1,"resizeType":"bilinear","lanczosLobes":3}');
  });

  QUnit.test('fromObject', function(assert) {
    var filter = new fabric.Image.filters.Resize();

    var object = filter.toObject();
    var fromObject = fabric.Image.filters.Resize.fromObject(object);
    assert.deepEqual(fromObject, filter);
    assert.ok(fromObject instanceof fabric.Image.filters.Resize, 'should inherit from fabric.Image.filters.Resize');
    filter.resizeType = 'bilinear';
    filter.scaleX = 0.8;
    filter.scaleY = 0.8;
    assert.deepEqual(fabric.Image.filters.Resize.fromObject(filter.toObject()), filter);
  });

  QUnit.test('isNeutralState', function(assert) {
    var filter = new fabric.Image.filters.Resize();
    assert.ok(filter.isNeutralState(), 'If scale is 1');
    filter.scaleX = 1.4;
    assert.notOk(filter.isNeutralState(), 'Is not neutral when gamma changes');
  });

  QUnit.module('fabric.Image.filters.Blur');

  QUnit.test('isNeutralState', function(assert) {
    var filter = new fabric.Image.filters.Blur();
    assert.ok(filter.isNeutralState(), 'Is neutral when blur is 0');
    filter.blur = 0.3;
    assert.notOk(filter.isNeutralState(), 'Is not neutral when blur changes');
  });
})();
