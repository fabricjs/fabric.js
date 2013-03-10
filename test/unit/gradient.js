(function() {

  QUnit.module('fabric.Gradient');

  function createGradient() {
    return new fabric.Gradient({
      coords: {
        x1: 0,
        y1: 10,
        x2: 100,
        y2: 200,
      },
      colorStops: {
        '0': 'red',
        '1': 'green'
      }
    });
  }

  test('constructor', function() {
    ok(fabric.Gradient);

    var gradient = createGradient();
    ok(gradient instanceof fabric.Gradient, 'should inherit from fabric.Gradient');
  });

  test('properties', function() {
    var gradient = createGradient();

    equal(gradient.coords.x1, 0);
    equal(gradient.coords.y1, 10);
    equal(gradient.coords.x2, 100);
    equal(gradient.coords.y2, 200);

    equal(gradient.colorStops['0'], 'red');
    equal(gradient.colorStops['1'], 'green');
  });

  test('toObject', function() {
    var gradient = createGradient();

    ok(typeof gradient.toObject == 'function');

    var object = gradient.toObject();

    equal(object.coords.x1, gradient.coords.x1);
    equal(object.coords.x2, gradient.coords.x2);
    equal(object.coords.y1, gradient.coords.y1);
    equal(object.coords.y2, gradient.coords.y2);

    equal(object.colorStops, gradient.colorStops);
  });

  test('toLive', function() {
    var gradient = createGradient();

    ok(typeof gradient.toLive == 'function');
  });

  test('fromElement', function() {
    ok(typeof fabric.Gradient.fromElement == 'function');

    var element = fabric.document.createElement('linearGradient');
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

    equal(gradient.coords.x1, 0);
    equal(gradient.coords.y1, 0);

    //equal(gradient.coords.x2, 100);
    //equal(gradient.coords.y2, 100);

    equal(gradient.colorStops[0].offset, 1);
    equal(gradient.colorStops[1].offset, 0);

    equal(gradient.colorStops[0].color, 'rgb(0,0,0)');
    equal(gradient.colorStops[1].color, 'rgb(255,255,255)');
  });

  test('forObject', function() {
    ok(typeof fabric.Gradient.forObject == 'function');

    var object = new fabric.Object({ width: 50, height: 50 });

    var gradient = fabric.Gradient.forObject(object, {
      coords: {
        x1: 10,
        y1: 10,
        x2: 20,
        y2: 20,
      },
      colorStops: {
        '0': 'red',
        '0.5': 'green',
        '1': 'blue'
      }
    });

    ok(gradient instanceof fabric.Gradient);

    // TODO: need to double check these values

    equal(gradient.coords.x1, 10);
    equal(gradient.coords.y1, 10);

    equal(gradient.coords.x2, 20);
    equal(gradient.coords.y2, 20);
  });

})();