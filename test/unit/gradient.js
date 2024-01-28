(function() {

  QUnit.module('fabric.Gradient');

  function createLinearGradient(units) {
    return new fabric.Gradient({
      type: 'linear',
      gradientUnits: units || 'pixels',
      coords: {
        x1: 0,
        y1: 10,
        x2: 100,
        y2: 200,
      },
      colorStops: [
        { offset: 0, color: 'red', opacity: 0 },
        { offset: 1, color: 'green' }
      ]
    });
  }

  function createRadialGradient(units) {
    return new fabric.Gradient({
      type: 'radial',
      gradientUnits: units || 'pixels',
      coords: {
        x1: 0,
        y1: 10,
        x2: 100,
        y2: 200,
        r1: 0,
        r2: 50
      },
      colorStops: [
        { offset: 0, color: 'red' },
        { offset: 1, color: 'green', opacity: 0 }
      ]
    });
  }

  function createRadialGradientWithInternalRadius() {
    return new fabric.Gradient({
      type: 'radial',
      coords: {
        x1: 0,
        y1: 10,
        x2: 100,
        y2: 200,
        r1: 10,
        r2: 50
      },
      colorStops: [
        { offset: 0, color: 'red' },
        { offset: 1, color: 'green', opacity: 0 }
      ]
    });
  }

  function createRadialGradientSwapped() {
    return new fabric.Gradient({
      type: 'radial',
      coords: {
        x1: 0,
        y1: 10,
        x2: 100,
        y2: 200,
        r1: 50,
        r2: 10
      },
      colorStops: [
        { offset: 0, color: 'red' },
        { offset: 1, color: 'green', opacity: 0 }
      ]
    });
  }

  var SVG_LINEAR = '<linearGradient id=\"SVGID_0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(1 0 0 1 -50 -50)\"  x1=\"0\" y1=\"10\" x2=\"100\" y2=\"200\">\n<stop offset=\"0%\" style=\"stop-color:red;stop-opacity: 0\"/>\n<stop offset=\"100%\" style=\"stop-color:green;\"/>\n</linearGradient>\n';
  var SVG_RADIAL = '<radialGradient id=\"SVGID_0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(1 0 0 1 -50 -50)\"  cx=\"100\" cy=\"200\" r=\"50\" fx=\"0\" fy=\"10\">\n<stop offset=\"0%\" style=\"stop-color:red;\"/>\n<stop offset=\"100%\" style=\"stop-color:green;stop-opacity: 0\"/>\n</radialGradient>\n';
  var SVG_INTERNALRADIUS = '<radialGradient id=\"SVGID_0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(1 0 0 1 -50 -50)\"  cx=\"100\" cy=\"200\" r=\"50\" fx=\"0\" fy=\"10\">\n<stop offset=\"20%\" style=\"stop-color:red;\"/>\n<stop offset=\"100%\" style=\"stop-color:green;stop-opacity: 0\"/>\n</radialGradient>\n';
  var SVG_SWAPPED = '<radialGradient id=\"SVGID_0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(1 0 0 1 -50 -50)\"  cx=\"0\" cy=\"10\" r=\"50\" fx=\"100\" fy=\"200\">\n<stop offset=\"20%\" style=\"stop-color:green;stop-opacity: 0\"/>\n<stop offset=\"100%\" style=\"stop-color:red;\"/>\n</radialGradient>\n';
  var SVG_LINEAR_PERCENTAGE = '<linearGradient id=\"SVGID_0\" gradientUnits=\"objectBoundingBox\" gradientTransform=\"matrix(1 0 0 1 0 0)\"  x1=\"0\" y1=\"10\" x2=\"100\" y2=\"200\">\n<stop offset=\"0%\" style=\"stop-color:red;stop-opacity: 0\"/>\n<stop offset=\"100%\" style=\"stop-color:green;\"/>\n</linearGradient>\n';
  var SVG_RADIAL_PERCENTAGE = '<radialGradient id=\"SVGID_0\" gradientUnits=\"objectBoundingBox\" gradientTransform=\"matrix(1 0 0 1 0 0)\"  cx=\"100\" cy=\"200\" r=\"50\" fx=\"0\" fy=\"10\">\n<stop offset=\"0%\" style=\"stop-color:red;\"/>\n<stop offset=\"100%\" style=\"stop-color:green;stop-opacity: 0\"/>\n</radialGradient>\n';

  QUnit.test('constructor linearGradient', function(assert) {
    assert.ok(fabric.Gradient);

    var gradient = createLinearGradient();
    assert.ok(gradient instanceof fabric.Gradient, 'should inherit from fabric.Gradient');
  });

  QUnit.test('constructor radialGradient', function(assert) {
    assert.ok(fabric.Gradient);

    var gradient = createRadialGradient();
    assert.ok(gradient instanceof fabric.Gradient, 'should inherit from fabric.Gradient');
  });

  QUnit.test('properties linearGradient', function(assert) {
    var gradient = createLinearGradient();

    assert.equal(gradient.coords.x1, 0);
    assert.equal(gradient.coords.y1, 10);
    assert.equal(gradient.coords.x2, 100);
    assert.equal(gradient.coords.y2, 200);

    assert.equal(gradient.type, 'linear');

    assert.equal(gradient.colorStops[0].offset, 0);
    assert.equal(gradient.colorStops[0].color, 'red');
    assert.equal(gradient.colorStops[0].opacity, 0);

    assert.equal(gradient.colorStops[1].offset, 1);
    assert.equal(gradient.colorStops[1].color, 'green');
    assert.ok(!('opacity' in gradient.colorStops[1]));
  });

  QUnit.test('properties radialGradient', function(assert) {
    var gradient = createRadialGradient();

    assert.equal(gradient.coords.x1, 0);
    assert.equal(gradient.coords.y1, 10);
    assert.equal(gradient.coords.x2, 100);
    assert.equal(gradient.coords.y2, 200);
    assert.equal(gradient.coords.r1, 0);
    assert.equal(gradient.coords.r2, 50);

    assert.equal(gradient.type, 'radial');

    assert.equal(gradient.colorStops[0].offset, 0);
    assert.equal(gradient.colorStops[0].color, 'red');
    assert.ok(!('opacity' in gradient.colorStops[0]));

    assert.equal(gradient.colorStops[1].offset, 1);
    assert.equal(gradient.colorStops[1].color, 'green');
    assert.equal(gradient.colorStops[1].opacity, 0);
  });

  QUnit.test('toObject linearGradient', function(assert) {
    var gradient = createLinearGradient();
    gradient.gradientTransform = [1, 0, 0, 1, 50, 50];
    assert.ok(typeof gradient.toObject === 'function');

    var object = gradient.toObject();

    assert.deepEqual(object.coords, gradient.coords);
    assert.equal(object.gradientUnits, gradient.gradientUnits);
    assert.equal(object.type, gradient.type);
    assert.deepEqual(object.gradientTransform, gradient.gradientTransform);
    assert.deepEqual(object.colorStops, gradient.colorStops);
  });

  QUnit.test('toObject with custom props', function(assert) {
    var gradient = createLinearGradient();
    gradient.id = 'myId';
    var object = gradient.toObject(['id']);
    assert.equal(object.id, 'myId');
  });

  QUnit.test('toObject radialGradient', function(assert) {
    var gradient = createRadialGradient();

    assert.ok(typeof gradient.toObject === 'function');

    var object = gradient.toObject();

    assert.deepEqual(object.coords, gradient.coords);
    assert.equal(object.type, gradient.type);
    assert.deepEqual(object.colorStops, gradient.colorStops);
  });

  QUnit.test('toLive linearGradient', function(assert) {
    var canvas = new fabric.StaticCanvas(null, {enableRetinaScaling: false});
    var gradient = createLinearGradient();
    var gradientHTML = canvas.contextContainer.createLinearGradient(0, 0, 1, 1);
    assert.ok(typeof gradient.toLive === 'function');
    var gradientCtx = gradient.toLive(canvas.contextContainer);
    assert.equal(gradientCtx.toString(), gradientHTML.toString(), 'is a gradient for canvas radial');
  });

  QUnit.test('toLive radialGradient', function(assert) {
    var canvas = new fabric.StaticCanvas(null, {enableRetinaScaling: false });
    var gradient = createRadialGradient();
    var gradientHTML = canvas.contextContainer.createRadialGradient(0, 0, 1, 1, 2, 2);
    assert.ok(typeof gradient.toLive === 'function');
    var gradientCtx = gradient.toLive(canvas.contextContainer);
    assert.equal(gradientCtx.toString(), gradientHTML.toString(), 'is a gradient for canvas radial');
  });

  QUnit.test('toSVG', function(assert) {
    var gradient = createLinearGradient();
    assert.ok(typeof gradient.toSVG === 'function');
  });

  QUnit.test('toSVG linear', function(assert) {
    var gradient = createLinearGradient();
    var obj = new fabric.Object({ width: 100, height: 100 });
    assert.equalSVG(gradient.toSVG(obj), SVG_LINEAR);
  });

  QUnit.test('toSVG radial', function(assert) {
    var gradient = createRadialGradient();
    var obj = new fabric.Object({ width: 100, height: 100 });
    assert.equalSVG(gradient.toSVG(obj), SVG_RADIAL);
  });

  QUnit.test('toSVG radial with r1 > 0', function(assert) {
    var gradient = createRadialGradientWithInternalRadius();
    var obj = new fabric.Object({ width: 100, height: 100 });
    assert.equalSVG(gradient.toSVG(obj), SVG_INTERNALRADIUS);
  });

  QUnit.test('toSVG radial with r1 > 0 swapped', function(assert) {
    var gradient = createRadialGradientSwapped();
    var obj = new fabric.Object({ width: 100, height: 100 });
    const gradientColorStops = JSON.stringify(gradient.colorStops);
    assert.equalSVG(gradient.toSVG(obj), SVG_SWAPPED, 'it exports as expected');
    const gradientColorStopsAfterExport = JSON.stringify(gradient.colorStops);
    assert.equalSVG(gradient.toSVG(obj), SVG_SWAPPED, 'it exports as expected a second time');
    assert.equalSVG(gradientColorStops, gradientColorStopsAfterExport, 'colorstops do not change')
  });

  QUnit.test('toSVG linear objectBoundingBox', function(assert) {
    var gradient = createLinearGradient('percentage');
    var obj = new fabric.Object({ width: 100, height: 100 });
    assert.equalSVG(gradient.toSVG(obj), SVG_LINEAR_PERCENTAGE);
  });

  QUnit.test('toSVG radial objectBoundingBox', function(assert) {
    var gradient = createRadialGradient('percentage');
    var obj = new fabric.Object({ width: 100, height: 100 });
    assert.equalSVG(gradient.toSVG(obj), SVG_RADIAL_PERCENTAGE);
  });

})();
