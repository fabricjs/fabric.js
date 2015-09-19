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

  test('constructor linearGradient', function() {
    ok(fabric.Gradient);

    var gradient = createLinearGradient();
    ok(gradient instanceof fabric.Gradient, 'should inherit from fabric.Gradient');
  });

  test('constructor radialGradient', function() {
    ok(fabric.Gradient);

    var gradient = createRadialGradient();
    ok(gradient instanceof fabric.Gradient, 'should inherit from fabric.Gradient');
  });

  test('properties linearGradient', function() {
    var gradient = createLinearGradient();

    equal(gradient.coords.x1, 0);
    equal(gradient.coords.y1, 10);
    equal(gradient.coords.x2, 100);
    equal(gradient.coords.y2, 200);

    equal(gradient.type, 'linear');

    equal(gradient.colorStops[0].offset, 0);
    equal(gradient.colorStops[0].color, 'red');
    equal(gradient.colorStops[0].opacity, 0);

    equal(gradient.colorStops[1].offset, 1);
    equal(gradient.colorStops[1].color, 'green');
    ok(!('opacity' in gradient.colorStops[1]));
  });

  test('properties radialGradient', function() {
    var gradient = createRadialGradient();

    equal(gradient.coords.x1, 0);
    equal(gradient.coords.y1, 10);
    equal(gradient.coords.x2, 100);
    equal(gradient.coords.y2, 200);
    equal(gradient.coords.r1, 0);
    equal(gradient.coords.r2, 50);

    equal(gradient.type, 'radial');

    equal(gradient.colorStops[0].offset, 0);
    equal(gradient.colorStops[0].color, 'red');
    ok(!('opacity' in gradient.colorStops[0]));

    equal(gradient.colorStops[1].offset, 1);
    equal(gradient.colorStops[1].color, 'green');
    equal(gradient.colorStops[1].opacity, 0);
  });

  test('toObject linearGradient', function() {
    var gradient = createLinearGradient();
    gradient.gradientTransform = [1, 0, 0, 1, 50, 50];
    ok(typeof gradient.toObject == 'function');

    var object = gradient.toObject();

    equal(object.coords.x1, gradient.coords.x1);
    equal(object.coords.x2, gradient.coords.x2);
    equal(object.coords.y1, gradient.coords.y1);
    equal(object.coords.y2, gradient.coords.y2);

    equal(object.type, gradient.type);
    deepEqual(object.gradientTransform, gradient.gradientTransform);
    equal(object.colorStops, gradient.colorStops);
  });

  test('toObject radialGradient', function() {
    var gradient = createRadialGradient();

    ok(typeof gradient.toObject == 'function');

    var object = gradient.toObject();

    equal(object.coords.x1, gradient.coords.x1);
    equal(object.coords.x2, gradient.coords.x2);
    equal(object.coords.y1, gradient.coords.y1);
    equal(object.coords.y2, gradient.coords.y2);
    equal(object.coords.r1, gradient.coords.r1);
    equal(object.coords.r2, gradient.coords.r2);

    equal(object.type, gradient.type);

    equal(object.colorStops, gradient.colorStops);
  });

  test('toLive linearGradient', function() {
    var gradient = createLinearGradient();

    ok(typeof gradient.toLive == 'function');
  });

  test('toLive radialGradient', function() {
    var gradient = createRadialGradient();

    ok(typeof gradient.toLive == 'function');
  });

  test('fromElement linearGradient', function() {
    ok(typeof fabric.Gradient.fromElement == 'function');

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

    ok(gradient instanceof fabric.Gradient);

    // TODO: need to double check these values

    equal(gradient.coords.x1, 50);
    equal(gradient.coords.y1, 50);

    //equal(gradient.coords.x2, 100);
    //equal(gradient.coords.y2, 100);

    equal(gradient.colorStops[0].offset, 1);
    equal(gradient.colorStops[1].offset, 0);

    equal(gradient.colorStops[0].color, 'rgb(0,0,0)');
    equal(gradient.colorStops[1].color, 'rgb(255,255,255)');

    equal(gradient.colorStops[0].opacity, 0);
  });

  test('fromElement without stop', function() {
    ok(typeof fabric.Gradient.fromElement == 'function');

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

    ok(gradient instanceof fabric.Gradient);

    equal(gradient.colorStops[0].offset, 1);
    equal(gradient.colorStops[1].offset, 0);
  });

  test('fromElement radialGradient', function() {
    ok(typeof fabric.Gradient.fromElement == 'function');

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

    ok(gradient instanceof fabric.Gradient);

    // TODO: need to double check these values

    equal(gradient.coords.x1, 50);
    equal(gradient.coords.y1, 50);

    //equal(gradient.coords.x2, 100);
    //equal(gradient.coords.y2, 100);

    equal(gradient.colorStops[0].offset, 1);
    equal(gradient.colorStops[1].offset, 0);

    equal(gradient.colorStops[0].color, 'rgb(0,0,0)');
    equal(gradient.colorStops[1].color, 'rgb(255,255,255)');
  });

  test('fromElement radialGradient with transform', function() {
    ok(typeof fabric.Gradient.fromElement == 'function');

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

    ok(gradient instanceof fabric.Gradient);

    // TODO: need to double check these values

    equal(gradient.coords.x1, 50);
    equal(gradient.coords.y1, 50);

    //equal(gradient.coords.x2, 100);
    //equal(gradient.coords.y2, 100);

    equal(gradient.colorStops[0].offset, 1);
    equal(gradient.colorStops[1].offset, 0);

    equal(gradient.colorStops[0].color, 'rgb(0,0,0)');
    equal(gradient.colorStops[1].color, 'rgb(255,255,255)');
    deepEqual(gradient.gradientTransform, [ 3.321, -0.6998, 0.4077, 1.9347, -440.9168, -408.0598 ]);
  });

  test('fromElement linearGradient colorStop attributes/styles', function() {
    ok(typeof fabric.Gradient.fromElement == 'function');

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

    ok(gradient instanceof fabric.Gradient);

    // TODO: need to double check these values

    equal(gradient.coords.x1, 50);
    equal(gradient.coords.y1, 50);

    //equal(gradient.coords.x2, 100);
    //equal(gradient.coords.y2, 100);

    equal(gradient.colorStops[0].offset, 1);
    equal(gradient.colorStops[1].offset, 0.75);
    equal(gradient.colorStops[2].offset, 0.5);
    equal(gradient.colorStops[3].offset, 0);

    equal(gradient.colorStops[0].color, 'rgb(255,0,0)');
    equal(gradient.colorStops[1].color, 'rgb(0,0,255)');
    equal(gradient.colorStops[2].color, 'rgb(0,0,0)');
    equal(gradient.colorStops[3].color, 'rgb(0,0,0)');

    equal(gradient.colorStops[0].opacity, 0.5);
    equal(gradient.colorStops[1].opacity, 0.9);
    equal(gradient.colorStops[2].opacity, 1);
    equal(gradient.colorStops[3].opacity, 1);
  });

  test('fromElement radialGradient colorStop attributes/styles', function() {
    ok(typeof fabric.Gradient.fromElement == 'function');

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

    ok(gradient instanceof fabric.Gradient);

    // TODO: need to double check these values

    equal(gradient.coords.x1, 50);
    equal(gradient.coords.y1, 50);

    //equal(gradient.coords.x2, 100);
    //equal(gradient.coords.y2, 100);

    equal(gradient.colorStops[0].offset, 1);
    equal(gradient.colorStops[1].offset, 0.75);
    equal(gradient.colorStops[2].offset, 0.5);
    equal(gradient.colorStops[3].offset, 0);

    equal(gradient.colorStops[0].color, 'rgb(255,0,0)');
    equal(gradient.colorStops[1].color, 'rgb(0,0,255)');
    equal(gradient.colorStops[2].color, 'rgb(0,0,0)');
    equal(gradient.colorStops[3].color, 'rgb(0,0,0)');

    equal(gradient.colorStops[0].opacity, 0.5);
    equal(gradient.colorStops[1].opacity, 0.9);
    equal(gradient.colorStops[2].opacity, 1);
    equal(gradient.colorStops[3].opacity, 1);
  });

  test('forObject linearCradient', function() {
    ok(typeof fabric.Gradient.forObject == 'function');

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

    ok(gradient instanceof fabric.Gradient);

    equal(gradient.type, 'linear');

    // TODO: need to double check these values

    equal(gradient.coords.x1, 10);
    equal(gradient.coords.y1, 10);

    equal(gradient.coords.x2, 20);
    equal(gradient.coords.y2, 20);

    equal(gradient.colorStops[0].offset, 0);
    equal(gradient.colorStops[1].offset, 0.5);
    equal(gradient.colorStops[2].offset, 1);

    equal(gradient.colorStops[0].color, 'red');
    equal(gradient.colorStops[1].color, 'green');
    equal(gradient.colorStops[2].color, 'blue');

    equal(gradient.colorStops[0].opacity, 1);
    equal(gradient.colorStops[1].opacity, 0);
    equal(gradient.colorStops[2].opacity, 0.5);
  });

  test('forObject radialGradient', function() {
    ok(typeof fabric.Gradient.forObject == 'function');

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

    ok(gradient instanceof fabric.Gradient);

    equal(gradient.type, 'radial');

    // TODO: need to double check these values

    equal(gradient.coords.x1, 10);
    equal(gradient.coords.y1, 10);

    equal(gradient.coords.x2, 20);
    equal(gradient.coords.y2, 20);

    equal(gradient.coords.r1, 0);
    equal(gradient.coords.r2, 10);

    equal(gradient.colorStops[0].offset, 0);
    equal(gradient.colorStops[1].offset, 0.5);
    equal(gradient.colorStops[2].offset, 1);

    equal(gradient.colorStops[0].color, 'red');
    equal(gradient.colorStops[1].color, 'green');
    equal(gradient.colorStops[2].color, 'blue');

    equal(gradient.colorStops[0].opacity, 1);
    equal(gradient.colorStops[1].opacity, 0);
    equal(gradient.colorStops[2].opacity, 0.5);
  });

  test('toSVG', function() {
    var gradient = createLinearGradient();

    ok(typeof gradient.toSVG == 'function');

    // TODO: test toSVG
  });

})();
