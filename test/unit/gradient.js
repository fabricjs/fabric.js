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

    assert.equal(object.coords.x1, gradient.coords.x1);
    assert.equal(object.coords.x2, gradient.coords.x2);
    assert.equal(object.coords.y1, gradient.coords.y1);
    assert.equal(object.coords.y2, gradient.coords.y2);
    assert.equal(object.gradientUnits, gradient.gradientUnits);
    assert.equal(object.type, gradient.type);
    assert.deepEqual(object.gradientTransform, gradient.gradientTransform);
    assert.equal(object.colorStops, gradient.colorStops);
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

    assert.equal(object.coords.x1, gradient.coords.x1);
    assert.equal(object.coords.x2, gradient.coords.x2);
    assert.equal(object.coords.y1, gradient.coords.y1);
    assert.equal(object.coords.y2, gradient.coords.y2);
    assert.equal(object.coords.r1, gradient.coords.r1);
    assert.equal(object.coords.r2, gradient.coords.r2);

    assert.equal(object.type, gradient.type);

    assert.equal(object.colorStops, gradient.colorStops);
  });

  QUnit.test('toLive linearGradient', function(assert) {
    var canvas = new fabric.StaticCanvas(null, {enableRetinaScaling: false});
    var gradient = createLinearGradient();
    assert.ok(typeof gradient.toLive === 'function');
    var gradientCtx = gradient.toLive(canvas.contextContainer);
    assert.equal(gradientCtx.toString(), '[object CanvasGradient]', 'is a gradient for canvas radial');
  });

  QUnit.test('toLive radialGradient', function(assert) {
    var canvas = new fabric.StaticCanvas(null, {enableRetinaScaling: false });
    var gradient = createRadialGradient();
    assert.ok(typeof gradient.toLive === 'function');
    var gradientCtx = gradient.toLive(canvas.contextContainer);
    assert.equal(gradientCtx.toString(), '[object CanvasGradient]', 'is a gradient for canvas radial');
  });

  QUnit.test('fromElement linearGradient', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var namespace = 'http://www.w3.org/2000/svg';
    var element = fabric.document.createElementNS(namespace, 'linearGradient');
    var stop1 = fabric.document.createElement('stop');
    var stop2 = fabric.document.createElement('stop');

    stop1.setAttributeNS(namespace, 'offset', '0%');
    stop1.setAttributeNS(namespace, 'stop-color', 'white');

    stop2.setAttributeNS(namespace, 'offset', '100%');
    stop2.setAttributeNS(namespace, 'stop-color', 'black');
    stop2.setAttributeNS(namespace, 'stop-opacity', '0');

    element.appendChild(stop1);
    element.appendChild(stop2);

    var object = new fabric.Object({ width: 100, height: 100 });
    var gradient = fabric.Gradient.fromElement(element, object, '');

    assert.ok(gradient instanceof fabric.Gradient);
    assert.equal(gradient.type, 'linear');
    assert.equal(gradient.coords.x1, 0);
    assert.equal(gradient.coords.y1, 0);
    assert.equal(gradient.coords.x2, 1);
    assert.equal(gradient.coords.y2, 0);
    assert.equal(gradient.gradientUnits, 'percentage');

    assert.equal(gradient.colorStops[0].offset, 1);
    assert.equal(gradient.colorStops[1].offset, 0);

    assert.equal(gradient.colorStops[0].color, 'rgb(0,0,0)');
    assert.equal(gradient.colorStops[1].color, 'rgb(255,255,255)');

    assert.equal(gradient.colorStops[0].opacity, 0);
  });

  QUnit.test('fromElement linearGradient with floats percentage - objectBoundingBox', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var namespace = 'http://www.w3.org/2000/svg';
    var element = fabric.document.createElementNS(namespace, 'linearGradient');
    element.setAttributeNS(namespace, 'gradientUnits', 'objectBoundingBox');
    element.setAttributeNS(namespace, 'x1', '10%');
    element.setAttributeNS(namespace, 'y1', '0.2%');
    element.setAttributeNS(namespace, 'x2', '200');
    element.setAttributeNS(namespace, 'y2', '20%');
    var stop1 = fabric.document.createElement('stop');
    var stop2 = fabric.document.createElement('stop');

    stop1.setAttributeNS(namespace, 'offset', '0%');
    stop1.setAttributeNS(namespace, 'stop-color', 'white');

    stop2.setAttributeNS(namespace, 'offset', '100%');
    stop2.setAttributeNS(namespace, 'stop-color', 'black');
    stop2.setAttributeNS(namespace, 'stop-opacity', '0');

    element.appendChild(stop1);
    element.appendChild(stop2);

    var object = new fabric.Object({ width: 200, height: 200 });
    var gradient = fabric.Gradient.fromElement(element, object, '');

    assert.ok(gradient instanceof fabric.Gradient);

    assert.equal(gradient.coords.x1, 0.1);
    assert.equal(gradient.coords.y1, 0.002);
    assert.equal(gradient.coords.x2, 200);
    assert.equal(gradient.coords.y2, 0.2);
    assert.equal(gradient.gradientUnits, 'percentage');
  });

  QUnit.test('fromElement linearGradient with floats percentage - userSpaceOnUse', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var namespace = 'http://www.w3.org/2000/svg';
    var element = fabric.document.createElementNS(namespace, 'linearGradient');
    element.setAttributeNS(namespace, 'gradientUnits', 'userSpaceOnUse');
    element.setAttributeNS(namespace, 'x1', '10%');
    element.setAttributeNS(namespace, 'y1', '0.2%');
    element.setAttributeNS(namespace, 'x2', '200');
    element.setAttributeNS(namespace, 'y2', '20%');
    var stop1 = fabric.document.createElement('stop');
    var stop2 = fabric.document.createElement('stop');

    stop1.setAttributeNS(namespace, 'offset', '0%');
    stop1.setAttributeNS(namespace, 'stop-color', 'white');

    stop2.setAttributeNS(namespace, 'offset', '100%');
    stop2.setAttributeNS(namespace, 'stop-color', 'black');
    stop2.setAttributeNS(namespace, 'stop-opacity', '0');

    element.appendChild(stop1);
    element.appendChild(stop2);

    var object = new fabric.Object({left: 10, top: 15, width: 200, height: 200 });
    var gradient = fabric.Gradient.fromElement(element, object, '', {
      viewBoxWidth: 400,
      viewBoxHeight: 300,
    });

    assert.ok(gradient instanceof fabric.Gradient);
    assert.equal(gradient.gradientUnits, 'pixels');
    assert.equal(gradient.offsetX, -10);
    assert.equal(gradient.offsetY, -15);
    assert.equal(gradient.coords.x1, 40);
    assert.equal(gradient.coords.y1, 0.6);
    assert.equal(gradient.coords.x2, 200);
    assert.equal(gradient.coords.y2, 60);
  });

  QUnit.test('fromElement linearGradient with Infinity', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var namespace = 'http://www.w3.org/2000/svg';
    var element = fabric.document.createElementNS(namespace, 'linearGradient');
    var stop1 = fabric.document.createElementNS(namespace, 'stop');
    var stop2 = fabric.document.createElementNS(namespace, 'stop');

    stop1.setAttributeNS(namespace, 'offset', '0%');
    stop1.setAttributeNS(namespace, 'stop-color', 'white');

    stop2.setAttributeNS(namespace, 'offset', '100%');
    stop2.setAttributeNS(namespace, 'stop-color', 'black');
    stop2.setAttributeNS(namespace, 'stop-opacity', '0');

    element.setAttributeNS(namespace, 'x1', '-Infinity');
    element.setAttributeNS(namespace, 'x2', 'Infinity');
    element.setAttributeNS(namespace, 'y1', 'Infinity');
    element.setAttributeNS(namespace, 'y2', '-Infinity');
    element.appendChild(stop1);
    element.appendChild(stop2);

    var object = new fabric.Object({ width: 100, height: 300, top: 20, left: 30 });
    var gradient = fabric.Gradient.fromElement(element, object, '');

    assert.ok(gradient instanceof fabric.Gradient);

    assert.equal(gradient.coords.x1, 0);
    assert.equal(gradient.coords.y1, 1);
    assert.equal(gradient.coords.x2, 1);
    assert.equal(gradient.coords.y2, 0);

    assert.equal(gradient.colorStops[0].offset, 1);
    assert.equal(gradient.colorStops[1].offset, 0);

    assert.equal(gradient.colorStops[0].color, 'rgb(0,0,0)');
    assert.equal(gradient.colorStops[1].color, 'rgb(255,255,255)');

    assert.equal(gradient.colorStops[0].opacity, 0);
  });

  QUnit.test('fromElement without stop', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var namespace = 'http://www.w3.org/2000/svg';
    var element = fabric.document.createElementNS(namespace, 'linearGradient');
    var stop1 = fabric.document.createElementNS(namespace, 'stop');
    var stop2 = fabric.document.createElementNS(namespace, 'stop');

    stop1.setAttributeNS(namespace, 'stop-color', 'white');

    stop2.setAttributeNS(namespace, 'offset', '100%');
    stop2.setAttributeNS(namespace, 'stop-color', 'black');
    stop2.setAttributeNS(namespace, 'stop-opacity', '0');

    element.appendChild(stop1);
    element.appendChild(stop2);

    var object = new fabric.Object({ width: 100, height: 100 });
    var gradient = fabric.Gradient.fromElement(element, object, '');

    assert.ok(gradient instanceof fabric.Gradient);

    assert.equal(gradient.colorStops[0].offset, 1);
    assert.equal(gradient.colorStops[1].offset, 0);
  });

  QUnit.test('fromElement with x1,x2,y1,2 linear', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var namespace = 'http://www.w3.org/2000/svg';
    var element = fabric.document.createElementNS(namespace, 'linearGradient');

    element.setAttributeNS(namespace, 'x1', '30%');
    element.setAttributeNS(namespace, 'x2', '20%');
    element.setAttributeNS(namespace, 'y1', '0.1');
    element.setAttributeNS(namespace, 'y2', 'Infinity');

    var object = new fabric.Object({ width: 200, height: 200 });
    var gradient = fabric.Gradient.fromElement(element, object, '');
    assert.equal(gradient.coords.x1, 0.3);
    assert.equal(gradient.coords.y1, 0.1);
    assert.equal(gradient.coords.x2, 0.2);
    assert.equal(gradient.coords.y2, 1);
    object = new fabric.Object({ width: 200, height: 200, top: 50, left: 10 });
    gradient = fabric.Gradient.fromElement(element, object, '');
    assert.equal(gradient.coords.x1, 0.3, 'top and left do not change the output');
    assert.equal(gradient.coords.y1, 0.1, 'top and left do not change the output');
    assert.equal(gradient.coords.x2, 0.2, 'top and left do not change the output');
    assert.equal(gradient.coords.y2, 1, 'top and left do not change the output');
  });

  QUnit.test('fromElement with x1,x2,y1,2 radial', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var namespace = 'http://www.w3.org/2000/svg';
    var element = fabric.document.createElementNS(namespace, 'radialGradient');

    element.setAttributeNS(namespace, 'fx', '30%');
    element.setAttributeNS(namespace, 'fy', '20%');
    element.setAttributeNS(namespace, 'cx', '0.1');
    element.setAttributeNS(namespace, 'cy', '1');
    element.setAttributeNS(namespace, 'r', '100%');

    var object = new fabric.Object({ width: 200, height: 200 });
    var gradient = fabric.Gradient.fromElement(element, object, '');
    assert.equal(gradient.coords.x1, 0.3, 'should not change with width height');
    assert.equal(gradient.coords.y1, 0.2, 'should not change with width height');
    assert.equal(gradient.coords.x2, 0.1, 'should not change with width height');
    assert.equal(gradient.coords.y2, 1, 'should not change with width height');
    assert.equal(gradient.coords.r1, 0, 'should not change with width height');
    assert.equal(gradient.coords.r2, 1, 'should not change with width height');

    object = new fabric.Object({ width: 200, height: 200, top: 10, left: 10 });
    gradient = fabric.Gradient.fromElement(element, object, '');
    assert.equal(gradient.coords.x1, 0.3, 'should not change with top left');
    assert.equal(gradient.coords.y1, 0.2, 'should not change with top left');
    assert.equal(gradient.coords.x2, 0.1, 'should not change with top left');
    assert.equal(gradient.coords.y2, 1, 'should not change with top left');
    assert.equal(gradient.coords.r1, 0, 'should not change with top left');
    assert.equal(gradient.coords.r2, 1, 'should not change with top left');
  });

  QUnit.test('fromElement with x1,x2,y1,2 radial userSpaceOnUse', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var namespace = 'http://www.w3.org/2000/svg';
    var element = fabric.document.createElementNS(namespace, 'radialGradient');

    element.setAttributeNS(namespace, 'fx', '30');
    element.setAttributeNS(namespace, 'fy', '20');
    element.setAttributeNS(namespace, 'cx', '15');
    element.setAttributeNS(namespace, 'cy', '18');
    element.setAttributeNS(namespace, 'r', '100');
    element.setAttributeNS(namespace, 'gradientUnits', 'userSpaceOnUse');

    var object = new fabric.Object({ width: 200, height: 200 });
    var gradient = fabric.Gradient.fromElement(element, object, '');
    assert.equal(gradient.coords.x1, 30, 'should not change with width height');
    assert.equal(gradient.coords.y1, 20, 'should not change with width height');
    assert.equal(gradient.coords.x2, 15, 'should not change with width height');
    assert.equal(gradient.coords.y2, 18, 'should not change with width height');
    assert.equal(gradient.coords.r1, 0, 'should not change with width height');
    assert.equal(gradient.coords.r2, 100, 'should not change with width height');

    object = new fabric.Object({ width: 200, height: 200, top: 50, left: 60 });
    gradient = fabric.Gradient.fromElement(element, object, '');
    assert.equal(gradient.coords.x1, 30, 'should not change with top left');
    assert.equal(gradient.coords.y1, 20, 'should not change with top left');
    assert.equal(gradient.coords.x2, 15, 'should not change with top left');
    assert.equal(gradient.coords.y2, 18, 'should not change with top left');
    assert.equal(gradient.coords.r1, 0, 'should not change with top left');
    assert.equal(gradient.coords.r2, 100, 'should not change with top left');
  });

  QUnit.test('fromElement with x1,x2,y1,2 linear userSpaceOnUse', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var namespace = 'http://www.w3.org/2000/svg';
    var element = fabric.document.createElementNS(namespace,  'linearGradient');

    element.setAttributeNS(namespace, 'x1', '30');
    element.setAttributeNS(namespace, 'y1', '20');
    element.setAttributeNS(namespace, 'x2', '15');
    element.setAttributeNS(namespace, 'y2', '18');
    element.setAttributeNS(namespace, 'gradientUnits', 'userSpaceOnUse');

    var object = new fabric.Object({ width: 200, height: 200 });
    var gradient = fabric.Gradient.fromElement(element, object, '');
    assert.equal(gradient.coords.x1, 30, 'should not change with width height');
    assert.equal(gradient.coords.y1, 20, 'should not change with width height');
    assert.equal(gradient.coords.x2, 15, 'should not change with width height');
    assert.equal(gradient.coords.y2, 18, 'should not change with width height');

    object = new fabric.Object({ width: 200, height: 200, top: 40, left: 40 });
    gradient = fabric.Gradient.fromElement(element, object, '');
    assert.equal(gradient.coords.x1, 30, 'should not change with top left');
    assert.equal(gradient.coords.y1, 20, 'should not change with top left');
    assert.equal(gradient.coords.x2, 15, 'should not change with top left');
    assert.equal(gradient.coords.y2, 18, 'should not change with top left');
  });

  QUnit.test('fromElement radialGradient defaults', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var namespace = 'http://www.w3.org/2000/svg';
    var element = fabric.document.createElementNS(namespace, 'radialGradient');
    var stop1 = fabric.document.createElementNS(namespace, 'stop');
    var stop2 = fabric.document.createElementNS(namespace, 'stop');

    stop1.setAttributeNS(namespace, 'offset', '0%');
    stop1.setAttributeNS(namespace, 'stop-color', 'white');

    stop2.setAttributeNS(namespace, 'offset', '100%');
    stop2.setAttributeNS(namespace, 'stop-color', 'black');

    element.appendChild(stop1);
    element.appendChild(stop2);

    var object = new fabric.Object({ width: 100, height: 100 });
    var gradient = fabric.Gradient.fromElement(element, object, '', {});

    assert.ok(gradient instanceof fabric.Gradient);

    assert.equal(gradient.coords.x1, 0.5);
    assert.equal(gradient.coords.y1, 0.5);
    assert.equal(gradient.coords.x2, 0.5);
    assert.equal(gradient.coords.y2, 0.5);
    assert.equal(gradient.coords.r1, 0);
    assert.equal(gradient.coords.r2, 0.5);

    assert.equal(gradient.colorStops[0].offset, 1);
    assert.equal(gradient.colorStops[1].offset, 0);

    assert.equal(gradient.colorStops[0].color, 'rgb(0,0,0)');
    assert.equal(gradient.colorStops[1].color, 'rgb(255,255,255)');
  });

  QUnit.test('fromElement radialGradient with transform', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var namespace = 'http://www.w3.org/2000/svg';
    var element = fabric.document.createElementNS(namespace, 'radialGradient');
    var stop1 = fabric.document.createElementNS(namespace, 'stop');
    var stop2 = fabric.document.createElementNS(namespace, 'stop');

    stop1.setAttributeNS(namespace, 'offset', '0%');
    stop1.setAttributeNS(namespace, 'stop-color', 'white');

    stop2.setAttributeNS(namespace, 'offset', '100%');
    stop2.setAttributeNS(namespace, 'stop-color', 'black');

    element.appendChild(stop1);
    element.appendChild(stop2);
    element.setAttributeNS(namespace, 'gradientTransform', 'matrix(3.321 -0.6998 0.4077 1.9347 -440.9168 -408.0598)');
    var object = new fabric.Object({ width: 100, height: 100 });
    var gradient = fabric.Gradient.fromElement(element, object, '', {});
    assert.deepEqual(gradient.gradientTransform, [3.321, -0.6998, 0.4077, 1.9347, -440.9168, -408.0598]);
  });

  QUnit.test('fromElement linearGradient colorStop attributes/styles', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var namespace = 'http://www.w3.org/2000/svg';
    var element = fabric.document.createElementNS(namespace, 'linearGradient');
    var stop1 = fabric.document.createElementNS(namespace, 'stop');
    var stop2 = fabric.document.createElementNS(namespace, 'stop');
    var stop3 = fabric.document.createElementNS(namespace, 'stop');
    var stop4 = fabric.document.createElementNS(namespace, 'stop');

    stop1.setAttributeNS(namespace, 'offset', '0%');
    stop1.setAttributeNS(namespace, 'stop-color', '');
    stop1.setAttributeNS(namespace, 'stop-opacity', '');

    stop2.setAttributeNS(namespace, 'offset', '0.5');
    stop2.setAttributeNS(namespace, 'style', 'stop-color: black; stop-opacity:;');
    stop2.setAttributeNS(namespace, 'stop-color', 'white');

    stop3.setAttributeNS(namespace, 'offset', '75%');
    stop3.setAttributeNS(namespace, 'style', 'stop-color:; stop-opacity:;');
    stop3.setAttributeNS(namespace, 'stop-opacity', '0.9');
    stop3.setAttributeNS(namespace, 'stop-color', 'blue');

    stop4.setAttributeNS(namespace, 'offset', '100%');
    stop4.setAttributeNS(namespace, 'style', 'stop-color: red; stop-opacity: 0.5;');
    stop4.setAttributeNS(namespace, 'stop-opacity', '0.9');

    element.appendChild(stop1);
    element.appendChild(stop2);
    element.appendChild(stop3);
    element.appendChild(stop4);

    var object = new fabric.Object({ width: 100, height: 100 });
    var gradient = fabric.Gradient.fromElement(element, object, '');

    assert.ok(gradient instanceof fabric.Gradient);

    assert.equal(gradient.coords.x1, 0);
    assert.equal(gradient.coords.y1, 0);
    assert.equal(gradient.coords.x2, 1);
    assert.equal(gradient.coords.y2, 0);

    assert.equal(gradient.colorStops[0].offset, 1);
    assert.equal(gradient.colorStops[1].offset, 0.75);
    assert.equal(gradient.colorStops[2].offset, 0.5);
    assert.equal(gradient.colorStops[3].offset, 0);

    assert.equal(gradient.colorStops[0].color, 'rgb(255,0,0)');
    assert.equal(gradient.colorStops[1].color, 'rgb(0,0,255)');
    assert.equal(gradient.colorStops[2].color, 'rgb(0,0,0)');
    assert.equal(gradient.colorStops[3].color, 'rgb(0,0,0)');

    assert.equal(gradient.colorStops[0].opacity, 0.5);
    assert.equal(gradient.colorStops[1].opacity, 0.9);
    assert.equal(gradient.colorStops[2].opacity, 1);
    assert.equal(gradient.colorStops[3].opacity, 1);
  });

  QUnit.test('fromElement radialGradient colorStop attributes/styles', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var namespace = 'http://www.w3.org/2000/svg';
    var element = fabric.document.createElementNS(namespace, 'radialGradient');
    var stop1 = fabric.document.createElementNS(namespace, 'stop');
    var stop2 = fabric.document.createElementNS(namespace, 'stop');
    var stop3 = fabric.document.createElementNS(namespace, 'stop');
    var stop4 = fabric.document.createElementNS(namespace, 'stop');

    stop1.setAttributeNS(namespace, 'offset', '0%');
    stop1.setAttributeNS(namespace, 'stop-color', '');
    stop1.setAttributeNS(namespace, 'stop-opacity', '');

    stop2.setAttributeNS(namespace, 'offset', '0.5');
    stop2.setAttributeNS(namespace, 'style', 'stop-color: black; stop-opacity:;');
    stop2.setAttributeNS(namespace, 'stop-color', 'white');

    stop3.setAttributeNS(namespace, 'offset', '75%');
    stop3.setAttributeNS(namespace, 'style', 'stop-color:; stop-opacity:;');
    stop3.setAttributeNS(namespace, 'stop-opacity', '0.9');
    stop3.setAttributeNS(namespace, 'stop-color', 'blue');

    stop4.setAttributeNS(namespace, 'offset', '100%');
    stop4.setAttributeNS(namespace, 'style', 'stop-color: red; stop-opacity: 0.5;');
    stop4.setAttributeNS(namespace, 'stop-opacity', '0.9');

    element.appendChild(stop1);
    element.appendChild(stop2);
    element.appendChild(stop3);
    element.appendChild(stop4);

    var object = new fabric.Object({ width: 100, height: 100 });
    var gradient = fabric.Gradient.fromElement(element, object, '');

    assert.ok(gradient instanceof fabric.Gradient);

    assert.equal(gradient.colorStops[0].offset, 1);
    assert.equal(gradient.colorStops[1].offset, 0.75);
    assert.equal(gradient.colorStops[2].offset, 0.5);
    assert.equal(gradient.colorStops[3].offset, 0);

    assert.equal(gradient.colorStops[0].color, 'rgb(255,0,0)');
    assert.equal(gradient.colorStops[1].color, 'rgb(0,0,255)');
    assert.equal(gradient.colorStops[2].color, 'rgb(0,0,0)');
    assert.equal(gradient.colorStops[3].color, 'rgb(0,0,0)');

    assert.equal(gradient.colorStops[0].opacity, 0.5);
    assert.equal(gradient.colorStops[1].opacity, 0.9);
    assert.equal(gradient.colorStops[2].opacity, 1);
    assert.equal(gradient.colorStops[3].opacity, 1);
  });

  QUnit.test('forObject linearGradient', function(assert) {
    assert.ok(typeof fabric.Gradient.forObject === 'function');

    var object = new fabric.Object({ width: 50, height: 50 });

    var gradient = fabric.Gradient.forObject(object, {
      coords: {
        x1: 10,
        y1: 10,
        x2: 20,
        y2: 20,
      },
      colorStops: [
        { offset: 0, color: 'red', opacity: 1 },
        { offset: 0.5, color: 'green', opacity: 0},
        { offset: 1, color: 'blue', opacity: 0.5 }
      ]
    });

    assert.ok(gradient instanceof fabric.Gradient);

    assert.equal(gradient.type, 'linear');

    // TODO: need to double check these values

    assert.equal(gradient.coords.x1, 10);
    assert.equal(gradient.coords.y1, 10);

    assert.equal(gradient.coords.x2, 20);
    assert.equal(gradient.coords.y2, 20);

    assert.equal(gradient.colorStops[0].offset, 0);
    assert.equal(gradient.colorStops[1].offset, 0.5);
    assert.equal(gradient.colorStops[2].offset, 1);

    assert.equal(gradient.colorStops[0].color, 'red');
    assert.equal(gradient.colorStops[1].color, 'green');
    assert.equal(gradient.colorStops[2].color, 'blue');

    assert.equal(gradient.colorStops[0].opacity, 1);
    assert.equal(gradient.colorStops[1].opacity, 0);
    assert.equal(gradient.colorStops[2].opacity, 0.5);
  });

  QUnit.test('forObject radialGradient', function(assert) {
    assert.ok(typeof fabric.Gradient.forObject === 'function');

    var object = new fabric.Object({ width: 50, height: 50 });

    var gradient = fabric.Gradient.forObject(object, {
      type: 'radial',
      coords: {
        x1: 10,
        y1: 10,
        x2: 20,
        y2: 20,
        r1: 0,
        r2: 10
      },
      colorStops: [
        { offset: 0, color: 'red', opacity: 1 },
        { offset: 0.5, color: 'green', opacity: 0},
        { offset: 1, color: 'blue', opacity: 0.5 }
      ]
    });

    assert.ok(gradient instanceof fabric.Gradient);

    assert.equal(gradient.type, 'radial');

    // TODO: need to double check these values

    assert.equal(gradient.coords.x1, 10);
    assert.equal(gradient.coords.y1, 10);

    assert.equal(gradient.coords.x2, 20);
    assert.equal(gradient.coords.y2, 20);

    assert.equal(gradient.coords.r1, 0);
    assert.equal(gradient.coords.r2, 10);

    assert.equal(gradient.colorStops[0].offset, 0);
    assert.equal(gradient.colorStops[1].offset, 0.5);
    assert.equal(gradient.colorStops[2].offset, 1);

    assert.equal(gradient.colorStops[0].color, 'red');
    assert.equal(gradient.colorStops[1].color, 'green');
    assert.equal(gradient.colorStops[2].color, 'blue');

    assert.equal(gradient.colorStops[0].opacity, 1);
    assert.equal(gradient.colorStops[1].opacity, 0);
    assert.equal(gradient.colorStops[2].opacity, 0.5);
  });

  QUnit.test('toSVG', function(assert) {
    var gradient = createLinearGradient();
    assert.ok(typeof gradient.toSVG === 'function');
  });

  QUnit.test('toSVG linear', function(assert) {
    fabric.Object.__uid = 0;
    var gradient = createLinearGradient();
    var obj = new fabric.Object({ width: 100, height: 100 });
    assert.equal(gradient.toSVG(obj), SVG_LINEAR);
  });

  QUnit.test('toSVG radial', function(assert) {
    fabric.Object.__uid = 0;
    var gradient = createRadialGradient();
    var obj = new fabric.Object({ width: 100, height: 100 });
    assert.equal(gradient.toSVG(obj), SVG_RADIAL);
  });

  QUnit.test('toSVG radial with r1 > 0', function(assert) {
    fabric.Object.__uid = 0;
    var gradient = createRadialGradientWithInternalRadius();
    var obj = new fabric.Object({ width: 100, height: 100 });
    assert.equal(gradient.toSVG(obj), SVG_INTERNALRADIUS);
  });

  QUnit.test('toSVG radial with r1 > 0 swapped', function(assert) {
    fabric.Object.__uid = 0;
    var gradient = createRadialGradientSwapped();
    var obj = new fabric.Object({ width: 100, height: 100 });
    assert.equal(gradient.toSVG(obj), SVG_SWAPPED);
  });

  QUnit.test('toSVG linear objectBoundingBox', function(assert) {
    fabric.Object.__uid = 0;
    var gradient = createLinearGradient('percentage');
    var obj = new fabric.Object({ width: 100, height: 100 });
    assert.equal(gradient.toSVG(obj), SVG_LINEAR_PERCENTAGE);
  });

  QUnit.test('toSVG radial objectBoundingBox', function(assert) {
    fabric.Object.__uid = 0;
    var gradient = createRadialGradient('percentage');
    var obj = new fabric.Object({ width: 100, height: 100 });
    assert.equal(gradient.toSVG(obj), SVG_RADIAL_PERCENTAGE);
  });

})();
