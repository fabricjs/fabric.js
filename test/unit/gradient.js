(function() {

  QUnit.module('fabric.Gradient');

  function createLinearGradient() {
    return new fabric.Gradient({
      type: 'linear',
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

  function createRadialGradient() {
    return new fabric.Gradient({
      type: 'radial',
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

    var element = fabric.document.createElement('linearGradient');
    var stop1 = fabric.document.createElement('stop');
    var stop2 = fabric.document.createElement('stop');

    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', 'white');

    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', 'black');
    stop2.setAttribute('stop-opacity', '0');

    element.appendChild(stop1);
    element.appendChild(stop2);

    var object = new fabric.Object({ width: 100, height: 100 });
    var gradient = fabric.Gradient.fromElement(element, object);

    assert.ok(gradient instanceof fabric.Gradient);

    assert.equal(gradient.coords.x1, 0);
    assert.equal(gradient.coords.y1, 0);
    assert.equal(gradient.coords.x2, 100);
    assert.equal(gradient.coords.y2, 0);

    assert.equal(gradient.colorStops[0].offset, 1);
    assert.equal(gradient.colorStops[1].offset, 0);

    assert.equal(gradient.colorStops[0].color, 'rgb(0,0,0)');
    assert.equal(gradient.colorStops[1].color, 'rgb(255,255,255)');

    assert.equal(gradient.colorStops[0].opacity, 0);
  });

  QUnit.test('fromElement linearGradient with floats percentage - objectBoundingBox', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var element = fabric.document.createElement('linearGradient');
    element.setAttribute('gradientUnits', 'objectBoundingBox');
    element.setAttribute('x1', '10%');
    element.setAttribute('y1', '0.2%');
    element.setAttribute('x2', '200');
    element.setAttribute('y2', '20%');
    var stop1 = fabric.document.createElement('stop');
    var stop2 = fabric.document.createElement('stop');

    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', 'white');

    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', 'black');
    stop2.setAttribute('stop-opacity', '0');

    element.appendChild(stop1);
    element.appendChild(stop2);

    var object = new fabric.Object({ width: 200, height: 200 });
    var gradient = fabric.Gradient.fromElement(element, object);

    assert.ok(gradient instanceof fabric.Gradient);

    assert.equal(gradient.coords.x1, 20);
    assert.equal(gradient.coords.y1, 0.4);
    assert.equal(gradient.coords.x2, 40000);
    assert.equal(gradient.coords.y2, 40);
  });

  QUnit.test('fromElement linearGradient with floats percentage - userSpaceOnUse', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var element = fabric.document.createElement('linearGradient');
    element.setAttribute('gradientUnits', 'userSpaceOnUse');
    element.setAttribute('x1', '10%');
    element.setAttribute('y1', '0.2%');
    element.setAttribute('x2', '200');
    element.setAttribute('y2', '20%');
    var stop1 = fabric.document.createElement('stop');
    var stop2 = fabric.document.createElement('stop');

    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', 'white');

    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', 'black');
    stop2.setAttribute('stop-opacity', '0');

    element.appendChild(stop1);
    element.appendChild(stop2);

    var object = new fabric.Object({ width: 200, height: 200 });
    var gradient = fabric.Gradient.fromElement(element, object);

    assert.ok(gradient instanceof fabric.Gradient);

    assert.equal(gradient.coords.x1, 0.1);
    assert.equal(gradient.coords.y1, 0.002);
    assert.equal(gradient.coords.x2, 200);
    assert.equal(gradient.coords.y2, 0.2);
  });

  QUnit.test('fromElement linearGradient with Infinity', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var element = fabric.document.createElement('linearGradient');
    var stop1 = fabric.document.createElement('stop');
    var stop2 = fabric.document.createElement('stop');

    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', 'white');

    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', 'black');
    stop2.setAttribute('stop-opacity', '0');

    element.setAttribute('x1', '-Infinity');
    element.setAttribute('x2', 'Infinity');
    element.setAttribute('y1', 'Infinity');
    element.setAttribute('y2', '-Infinity');
    element.appendChild(stop1);
    element.appendChild(stop2);

    var object = new fabric.Object({ width: 100, height: 100, top: 0, left: 0 });
    var gradient = fabric.Gradient.fromElement(element, object);

    assert.ok(gradient instanceof fabric.Gradient);

    assert.equal(gradient.coords.x1, 0);
    assert.equal(gradient.coords.y1, 100);
    assert.equal(gradient.coords.x2, 100);
    assert.equal(gradient.coords.y2, 0);

    assert.equal(gradient.colorStops[0].offset, 1);
    assert.equal(gradient.colorStops[1].offset, 0);

    assert.equal(gradient.colorStops[0].color, 'rgb(0,0,0)');
    assert.equal(gradient.colorStops[1].color, 'rgb(255,255,255)');

    assert.equal(gradient.colorStops[0].opacity, 0);
  });

  QUnit.test('fromElement without stop', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var element = fabric.document.createElement('linearGradient');
    var stop1 = fabric.document.createElement('stop');
    var stop2 = fabric.document.createElement('stop');

    stop1.setAttribute('stop-color', 'white');

    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', 'black');
    stop2.setAttribute('stop-opacity', '0');

    element.appendChild(stop1);
    element.appendChild(stop2);

    var object = new fabric.Object({ width: 100, height: 100 });
    var gradient = fabric.Gradient.fromElement(element, object);

    assert.ok(gradient instanceof fabric.Gradient);

    assert.equal(gradient.colorStops[0].offset, 1);
    assert.equal(gradient.colorStops[1].offset, 0);
  });

  QUnit.test('fromElement with x1,x2,y1,2 linear', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var element = fabric.document.createElement('linearGradient');

    element.setAttribute('x1', '30%');
    element.setAttribute('x2', '20%');
    element.setAttribute('y1', '0.1');
    element.setAttribute('y2', 'Infinity');

    var object = new fabric.Object({ width: 200, height: 200 });
    var gradient = fabric.Gradient.fromElement(element, object);
    assert.equal(gradient.coords.x1, 60);
    assert.equal(gradient.coords.y1, 20);
    assert.equal(gradient.coords.x2, 40);
    assert.equal(gradient.coords.y2, 200);
    object = new fabric.Object({ width: 200, height: 200, top: 50, left: 10 });
    gradient = fabric.Gradient.fromElement(element, object);
    assert.equal(gradient.coords.x1, 70);
    assert.equal(gradient.coords.y1, 70);
    assert.equal(gradient.coords.x2, 50);
    assert.equal(gradient.coords.y2, 250);
  });

  QUnit.test('fromElement with x1,x2,y1,2 radial', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var element = fabric.document.createElement('radialGradient');

    element.setAttribute('fx', '30%');
    element.setAttribute('fy', '20%');
    element.setAttribute('cx', '0.1');
    element.setAttribute('cy', '1');
    element.setAttribute('r', '100%');

    var object = new fabric.Object({ width: 200, height: 200 });
    var gradient = fabric.Gradient.fromElement(element, object);
    assert.equal(gradient.coords.x1, 60, 'should change with width height');
    assert.equal(gradient.coords.y1, 40, 'should change with width height');
    assert.equal(gradient.coords.x2, 20, 'should change with width height');
    assert.equal(gradient.coords.y2, 200, 'should change with width height');
    assert.equal(gradient.coords.r1, 0, 'should change with width height');
    assert.equal(gradient.coords.r2, 200, 'should change with width height');

    object = new fabric.Object({ width: 200, height: 200, top: 10, left: 10 });
    gradient = fabric.Gradient.fromElement(element, object);
    assert.equal(gradient.coords.x1, 70, 'should change with top left');
    assert.equal(gradient.coords.y1, 50, 'should change with top left');
    assert.equal(gradient.coords.x2, 30, 'should change with top left');
    assert.equal(gradient.coords.y2, 210, 'should change with top left');
    assert.equal(gradient.coords.r1, 10, 'should change with top left');
    assert.equal(gradient.coords.r2, 210, 'should change with top left');
  });

  QUnit.test('fromElement with x1,x2,y1,2 radial userSpaceOnUse', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var element = fabric.document.createElement('radialGradient');

    element.setAttribute('fx', '30');
    element.setAttribute('fy', '20');
    element.setAttribute('cx', '15');
    element.setAttribute('cy', '18');
    element.setAttribute('r', '100');
    element.setAttribute('gradientUnits', 'userSpaceOnUse');

    var object = new fabric.Object({ width: 200, height: 200 });
    var gradient = fabric.Gradient.fromElement(element, object);
    assert.equal(gradient.coords.x1, 30, 'should not change with width height');
    assert.equal(gradient.coords.y1, 20, 'should not change with width height');
    assert.equal(gradient.coords.x2, 15, 'should not change with width height');
    assert.equal(gradient.coords.y2, 18, 'should not change with width height');
    assert.equal(gradient.coords.r1, 0, 'should not change with width height');
    assert.equal(gradient.coords.r2, 100, 'should not change with width height');

    object = new fabric.Object({ width: 200, height: 200, top: 50, left: 60 });
    gradient = fabric.Gradient.fromElement(element, object);
    assert.equal(gradient.coords.x1, 30, 'should not change with top left');
    assert.equal(gradient.coords.y1, 20, 'should not change with top left');
    assert.equal(gradient.coords.x2, 15, 'should not change with top left');
    assert.equal(gradient.coords.y2, 18, 'should not change with top left');
    assert.equal(gradient.coords.r1, 0, 'should not change with top left');
    assert.equal(gradient.coords.r2, 100, 'should not change with top left');
  });

  QUnit.test('fromElement with x1,x2,y1,2 linear userSpaceOnUse', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var element = fabric.document.createElement('linearGradient');

    element.setAttribute('x1', '30');
    element.setAttribute('y1', '20');
    element.setAttribute('x2', '15');
    element.setAttribute('y2', '18');
    element.setAttribute('gradientUnits', 'userSpaceOnUse');

    var object = new fabric.Object({ width: 200, height: 200 });
    var gradient = fabric.Gradient.fromElement(element, object);
    assert.equal(gradient.coords.x1, 30, 'should not change with width height');
    assert.equal(gradient.coords.y1, 20, 'should not change with width height');
    assert.equal(gradient.coords.x2, 15, 'should not change with width height');
    assert.equal(gradient.coords.y2, 18, 'should not change with width height');

    object = new fabric.Object({ width: 200, height: 200, top: 40, left: 40 });
    gradient = fabric.Gradient.fromElement(element, object);
    assert.equal(gradient.coords.x1, 30, 'should not change with top left');
    assert.equal(gradient.coords.y1, 20, 'should not change with top left');
    assert.equal(gradient.coords.x2, 15, 'should not change with top left');
    assert.equal(gradient.coords.y2, 18, 'should not change with top left');
  });

  QUnit.test('fromElement radialGradient', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var element = fabric.document.createElement('radialGradient');
    var stop1 = fabric.document.createElement('stop');
    var stop2 = fabric.document.createElement('stop');

    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', 'white');

    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', 'black');

    element.appendChild(stop1);
    element.appendChild(stop2);

    var object = new fabric.Object({ width: 100, height: 100 });
    var gradient = fabric.Gradient.fromElement(element, object);

    assert.ok(gradient instanceof fabric.Gradient);

    assert.equal(gradient.coords.x1, 50);
    assert.equal(gradient.coords.y1, 50);
    assert.equal(gradient.coords.x2, 50);
    assert.equal(gradient.coords.y2, 50);

    assert.equal(gradient.colorStops[0].offset, 1);
    assert.equal(gradient.colorStops[1].offset, 0);

    assert.equal(gradient.colorStops[0].color, 'rgb(0,0,0)');
    assert.equal(gradient.colorStops[1].color, 'rgb(255,255,255)');
  });

  QUnit.test('fromElement radialGradient with transform', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var element = fabric.document.createElement('radialGradient');
    var stop1 = fabric.document.createElement('stop');
    var stop2 = fabric.document.createElement('stop');

    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', 'white');

    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', 'black');

    element.appendChild(stop1);
    element.appendChild(stop2);
    element.setAttribute('gradientTransform', 'matrix(3.321 -0.6998 0.4077 1.9347 -440.9168 -408.0598)');
    var object = new fabric.Object({ width: 100, height: 100 });
    var gradient = fabric.Gradient.fromElement(element, object);

    assert.ok(gradient instanceof fabric.Gradient);

    assert.equal(gradient.coords.x1, 50);
    assert.equal(gradient.coords.y1, 50);
    assert.equal(gradient.coords.x2, 50);
    assert.equal(gradient.coords.y2, 50);

    assert.equal(gradient.colorStops[0].offset, 1);
    assert.equal(gradient.colorStops[1].offset, 0);

    assert.equal(gradient.colorStops[0].color, 'rgb(0,0,0)');
    assert.equal(gradient.colorStops[1].color, 'rgb(255,255,255)');
    assert.deepEqual(gradient.gradientTransform, [3.321, -0.6998, 0.4077, 1.9347, -440.9168, -408.0598]);
  });

  QUnit.test('fromElement linearGradient colorStop attributes/styles', function(assert) {
    assert.ok(typeof fabric.Gradient.fromElement === 'function');

    var element = fabric.document.createElement('linearGradient');
    var stop1 = fabric.document.createElement('stop');
    var stop2 = fabric.document.createElement('stop');
    var stop3 = fabric.document.createElement('stop');
    var stop4 = fabric.document.createElement('stop');

    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '');
    stop1.setAttribute('stop-opacity', '');

    stop2.setAttribute('offset', '0.5');
    stop2.setAttribute('style', 'stop-color: black; stop-opacity:;');
    stop2.setAttribute('stop-color', 'white');

    stop3.setAttribute('offset', '75%');
    stop3.setAttribute('style', 'stop-color:; stop-opacity:;');
    stop3.setAttribute('stop-opacity', '0.9');
    stop3.setAttribute('stop-color', 'blue');

    stop4.setAttribute('offset', '100%');
    stop4.setAttribute('style', 'stop-color: red; stop-opacity: 0.5;');
    stop4.setAttribute('stop-opacity', '0.9');

    element.appendChild(stop1);
    element.appendChild(stop2);
    element.appendChild(stop3);
    element.appendChild(stop4);

    var object = new fabric.Object({ width: 100, height: 100 });
    var gradient = fabric.Gradient.fromElement(element, object);

    assert.ok(gradient instanceof fabric.Gradient);

    assert.equal(gradient.coords.x1, 0);
    assert.equal(gradient.coords.y1, 0);
    assert.equal(gradient.coords.x2, 100);
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

    var element = fabric.document.createElement('radialGradient');
    var stop1 = fabric.document.createElement('stop');
    var stop2 = fabric.document.createElement('stop');
    var stop3 = fabric.document.createElement('stop');
    var stop4 = fabric.document.createElement('stop');

    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '');
    stop1.setAttribute('stop-opacity', '');

    stop2.setAttribute('offset', '0.5');
    stop2.setAttribute('style', 'stop-color: black; stop-opacity:;');
    stop2.setAttribute('stop-color', 'white');

    stop3.setAttribute('offset', '75%');
    stop3.setAttribute('style', 'stop-color:; stop-opacity:;');
    stop3.setAttribute('stop-opacity', '0.9');
    stop3.setAttribute('stop-color', 'blue');

    stop4.setAttribute('offset', '100%');
    stop4.setAttribute('style', 'stop-color: red; stop-opacity: 0.5;');
    stop4.setAttribute('stop-opacity', '0.9');

    element.appendChild(stop1);
    element.appendChild(stop2);
    element.appendChild(stop3);
    element.appendChild(stop4);

    var object = new fabric.Object({ width: 100, height: 100 });
    var gradient = fabric.Gradient.fromElement(element, object);

    assert.ok(gradient instanceof fabric.Gradient);

    assert.equal(gradient.coords.x1, 50);
    assert.equal(gradient.coords.y1, 50);
    assert.equal(gradient.coords.x2, 50);
    assert.equal(gradient.coords.y2, 50);

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

  QUnit.test('toSVG radial with r1 > 0', function(assert) {
    fabric.Object.__uid = 0;
    var gradient = createRadialGradientSwapped();
    var obj = new fabric.Object({ width: 100, height: 100 });
    assert.equal(gradient.toSVG(obj), SVG_SWAPPED);
  });

})();
