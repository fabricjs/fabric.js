(function() {

  QUnit.module('fabric.Circle');

  test('constructor', function(){
    ok(fabric.Circle);

    var circle = new fabric.Circle();

    ok(circle instanceof fabric.Circle, 'should inherit from fabric.Circle');
    ok(circle instanceof fabric.Object, 'should inherit from fabric.Object');

    deepEqual(circle.type, 'circle');
  });

  test('getRadiusX, getRadiusY', function() {
    var circle = new fabric.Circle({ radius: 10 });

    ok(typeof circle.getRadiusX == 'function', 'getRadiusX should exist');
    ok(typeof circle.getRadiusY == 'function', 'getRadiusY should exist');

    equal(circle.getRadiusX(), 10);
    equal(circle.getRadiusY(), 10);

    circle.scale(2);

    equal(circle.getRadiusX(), 20);
    equal(circle.getRadiusY(), 20);

    circle.set('scaleX', 3);

    equal(circle.getRadiusX(), 30);
    equal(circle.getRadiusY(), 20);

    circle.set('scaleY', 4);

    equal(circle.getRadiusX(), 30);
    equal(circle.getRadiusY(), 40);
  });

  test('setRadius', function() {
    var circle = new fabric.Circle({ radius: 10 });

    ok(typeof circle.setRadius == 'function');
    circle.setRadius(20);

    equal(20, circle.getRadiusX());
    equal(20, circle.getRadiusY());

    equal(40, circle.getWidth());
    equal(40, circle.getHeight());
  });

  test('complexity', function() {
    var circle = new fabric.Circle();
    ok(typeof circle.complexity == 'function');
    equal(circle.complexity(), 1);
  });

  test('toObject', function() {
    var circle = new fabric.Circle();
    var defaultProperties = {
      'type': 'circle',
      'originX': 'center',
      'originY': 'center',
      'left': 0,
      'top': 0,
      'width': 0,
      'height': 0,
      'fill': 'rgb(0,0,0)',
      'overlayFill': null,
      'stroke': null,
      'strokeWidth': 1,
      'strokeDashArray': null,
      'scaleX': 1,
      'scaleY': 1,
      'angle': 0,
      'flipX': false,
      'flipY': false,
      'opacity': 1,
      'selectable': true,
      'hasControls': true,
      'hasBorders': true,
      'hasRotatingPoint': true,
      'transparentCorners': true,
      'perPixelTargetFind': false,
      'shadow': null,
      'visible': true,
      'radius': 0
    };
    ok(typeof circle.toObject == 'function');
    deepEqual(circle.toObject(), defaultProperties);

    circle.set('left', 100).set('top', 200).set('radius', 15);

    var augmentedProperties = fabric.util.object.extend(fabric.util.object.clone(defaultProperties), {
      left: 100,
      top: 200,
      radius: 15
    });

    deepEqual(circle.toObject(), augmentedProperties);
  });

  test('fromElement', function() {
    ok(typeof fabric.Circle.fromElement == 'function');

    var elCircle      = fabric.document.createElement('circle'),
        radius        = 10,
        left          = 12,
        top           = 15,
        fill          = 'ff5555',
        fillOpacity   = 0.5,
        strokeWidth   = 2;


    elCircle.setAttribute('r', radius);
    elCircle.setAttribute('cx', left);
    elCircle.setAttribute('cy', top);
    elCircle.setAttribute('fill', fill);
    elCircle.setAttribute('fill-opacity', fillOpacity);
    elCircle.setAttribute('stroke-width', strokeWidth);

    var oCircle = fabric.Circle.fromElement(elCircle);
    ok(oCircle instanceof fabric.Circle);

    equal(oCircle.get('radius'), radius);
    equal(oCircle.get('left'), left);
    equal(oCircle.get('top'), top);
    equal(oCircle.get('fill'), fill);
    equal(oCircle.get('opacity'), fillOpacity);
    equal(oCircle.get('strokeWidth'), strokeWidth);

    elFaultyCircle = fabric.document.createElement('circle');
    elFaultyCircle.setAttribute('r', '-10');

    var error;
    try {
      fabric.Circle.fromElement(elFaultyCircle);
    }
    catch(err) {
      error = err;
    }
    ok(error, 'negative attribute should throw');

    elFaultyCircle.removeAttribute('r');

    error = void 0;
    try {
      fabric.Circle.fromElement(elFaultyCircle);
    }
    catch(err) {
      error = err;
    }

    ok(error, 'inexstent attribute should throw');
  });

  test('fromObject', function() {
    ok(typeof fabric.Circle.fromObject == 'function');

    var left    = 112,
        top     = 234,
        radius  = 13.45,
        fill    = 'ff5555';

    var circle = fabric.Circle.fromObject({
      left: left, top: top, radius: radius, fill: fill
    });

    ok(circle instanceof fabric.Circle);

    equal(circle.get('left'), left);
    equal(circle.get('top'), top);
    equal(circle.get('radius'), radius);
    equal(circle.get('fill'), fill);

    var expected = circle.toObject();
    var actual = fabric.Circle.fromObject(expected).toObject();

    deepEqual(expected, actual);
  });

  test('cloning and radius, width, height', function() {
    var circle = new fabric.Circle({ radius: 10 });
    circle.scale(2);

    var clone = circle.clone();

    equal(40, clone.getWidth());
    equal(40, clone.getHeight());

    equal(10, clone.radius);
  });
})();