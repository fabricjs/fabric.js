(function() {

  QUnit.module('fabric.Image.filters.Brightness');

  test('constructor', function() {
    ok(fabric.Image.filters.Brightness);

    var filter = new fabric.Image.filters.Brightness();
    ok(filter instanceof fabric.Image.filters.Brightness, 'should inherit from fabric.Image.filters.Brightness');
  });

  test('properties', function() {
    var filter = new fabric.Image.filters.Brightness();

    equal(filter.type, 'Brightness');
    equal(filter.brightness, 100);

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
    equal(JSON.stringify(object), '{"type":"Brightness","brightness":100}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Brightness();

    deepEqual(fabric.Image.filters.Brightness.fromObject(filter), filter);
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

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Convolute();

    deepEqual(fabric.Image.filters.Convolute.fromObject(filter), filter);
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

  test('fromObject', function() {
    var filter = new fabric.Image.filters.GradientTransparency();

    deepEqual(fabric.Image.filters.GradientTransparency.fromObject(filter), filter);
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

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Grayscale();

    deepEqual(fabric.Image.filters.Grayscale.fromObject(filter), filter);
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

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Invert();

    deepEqual(fabric.Image.filters.Invert.fromObject(filter), filter);
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
    equal(filter.noise, 100);

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
    equal(JSON.stringify(object), '{"type":"Noise","noise":100}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Noise();

    deepEqual(fabric.Image.filters.Noise.fromObject(filter), filter);
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

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Pixelate();

    deepEqual(fabric.Image.filters.Pixelate.fromObject(filter), filter);
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

  test('fromObject', function() {
    var filter = new fabric.Image.filters.RemoveWhite();

    deepEqual(fabric.Image.filters.RemoveWhite.fromObject(filter), filter);
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

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Sepia2();

    deepEqual(fabric.Image.filters.Sepia2.fromObject(filter), filter);
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

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Sepia();

    deepEqual(fabric.Image.filters.Sepia.fromObject(filter), filter);
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
    equal(filter.color, 0);

    var filter2 = new fabric.Image.filters.Tint({color: 122});
    equal(filter2.color, 122);
  });

  test('applyTo', function() {
    var filter = new fabric.Image.filters.Tint();
    ok(typeof filter.applyTo == 'function');
  });

  test('toObject', function() {
    var filter = new fabric.Image.filters.Tint();
    ok(typeof filter.toObject == 'function');

    var object = filter.toObject();
    equal(JSON.stringify(object), '{"type":"Tint","color":0}');
  });

  test('fromObject', function() {
    var filter = new fabric.Image.filters.Tint();

    deepEqual(fabric.Image.filters.Tint.fromObject(filter), filter);
  });
})();