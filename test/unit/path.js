(function() {

  var REFERENCE_PATH_OBJECT = {
    'type': 'path',
    'originX': 'center',
    'originY': 'center',
    'left': 200,
    'top': 200,
    'width': 200,
    'height': 200,
    'fill': 'red',
    'overlayFill': null,
    'stroke': 'blue',
    'strokeWidth': 1,
    'strokeDashArray': null,
    'scaleX': 1,
    'scaleY': 1,
    'angle': 0,
    'flipX': false,
    'flipY': false,
    'opacity': 1,
    'path': [['M', 100, 100], ['L', 300, 100], ['L', 200, 300], ['z']],
    'selectable': true,
    'hasControls': true,
    'hasBorders': true,
    'hasRotatingPoint': true,
    'transparentCorners': true,
    'perPixelTargetFind': false,
    'shadow': null,
    'visible': true
  };

  function getPathElement(path) {
    var el = fabric.document.createElement('path');
    el.setAttribute('d', path);
    el.setAttribute('fill', 'red');
    el.setAttribute('stroke', 'blue');
    el.setAttribute('troke-width', 3);
    return el;
  }

  function getPathObject(path) {
    return fabric.Path.fromElement(getPathElement(path));
  }

  function makePathObject() {
    return getPathObject("M 100 100 L 300 100 L 200 300 z");
  }

  QUnit.module('fabric.Path');

  test('constructor', function() {
    ok(fabric.Path);
    var path = makePathObject();

    ok(path instanceof fabric.Path);
    ok(path instanceof fabric.Object);

    equal(path.get('type'), 'path');

    var error;
    try {
      new fabric.Path();
    }
    catch(err) {
      error = err;
    }

    ok(error, 'should throw error');
  });

  test('toString', function() {
    var path = makePathObject();
    ok(typeof path.toString == 'function');
    equal('#<fabric.Path (4): { "top": 200, "left": 200 }>', path.toString());
  });

  test('toObject', function() {
    var path = makePathObject();
    ok(typeof path.toObject == 'function');
    deepEqual(REFERENCE_PATH_OBJECT, path.toObject());
  });

  test('toDatalessObject', function() {
    var path = makePathObject();
    ok(typeof path.toDatalessObject == 'function');
    deepEqual(REFERENCE_PATH_OBJECT, path.toDatalessObject());

    var src = 'http://example.com/';
    path.setSourcePath(src);
    deepEqual(fabric.util.object.extend(fabric.util.object.clone(REFERENCE_PATH_OBJECT), {
      path: src
    }), path.toDatalessObject());
  });

  test('complexity', function() {
    var path = makePathObject();
    ok(typeof path.complexity == 'function');
  });

  test('fromObject', function() {
    ok(typeof fabric.Path.fromObject == 'function');
    var path = fabric.Path.fromObject(REFERENCE_PATH_OBJECT);
    ok(path instanceof fabric.Path);
    deepEqual(REFERENCE_PATH_OBJECT, path.toObject());
  });

  test('fromElement', function() {
    ok(typeof fabric.Path.fromElement == 'function');
    var elPath = fabric.document.createElement('path');

    elPath.setAttribute('d', 'M 100 100 L 300 100 L 200 300 z');
    elPath.setAttribute('fill', 'red');
    elPath.setAttribute('fill-opacity', '1');
    elPath.setAttribute('stroke', 'blue');
    elPath.setAttribute('stroke-width', '1');

    // TODO (kangax): to support multiple transformation keywords, we need to do proper matrix multiplication
    // elPath.setAttribute('transform', 'scale(2) translate(10, -20)');
    elPath.setAttribute('transform', 'scale(2)');

    var path = fabric.Path.fromElement(elPath);
    ok(path instanceof fabric.Path);

    deepEqual(fabric.util.object.extend(REFERENCE_PATH_OBJECT, {
      transformMatrix: [2, 0, 0, 2, 0, 0]
    }), path.toObject());

    var ANGLE = 90;

    elPath.setAttribute('transform', 'rotate(' + ANGLE + ')');
    path = fabric.Path.fromElement(elPath);

    deepEqual(
      [ Math.cos(ANGLE), Math.sin(ANGLE), -Math.sin(ANGLE), Math.cos(ANGLE), 0, 0 ],
      path.get('transformMatrix')
    );
  });

  test('multiple sequences in path commands', function() {
    var el = getPathElement('M100 100 l 200 200 300 300 400 -50 z');
    var obj = fabric.Path.fromElement(el);

    deepEqual(['M', 100, 100], obj.path[0]);
    deepEqual(['l', 200, 200], obj.path[1]);
    deepEqual(['l', 300, 300], obj.path[2]);
    deepEqual(['l', 400, -50], obj.path[3]);

    el = getPathElement('c 0,-53.25604 43.17254,-96.42858 96.42857,-96.42857 53.25603,0 96.42857,43.17254 96.42857,96.42857');
    obj = fabric.Path.fromElement(el);

    deepEqual(['c', 0, -53.25604, 43.17254, -96.42858, 96.42857, -96.42857], obj.path[0]);
    deepEqual(['c', 53.25603, 0, 96.42857, 43.17254, 96.42857, 96.42857], obj.path[1]);
  });
})();