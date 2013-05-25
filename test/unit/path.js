(function() {

  var REFERENCE_PATH_OBJECT = {
    'type':               'path',
    'originX':            'center',
    'originY':            'center',
    'left':               200,
    'top':                200,
    'width':              200,
    'height':             200,
    'fill':               'red',
    'overlayFill':        null,
    'stroke':             'blue',
    'strokeWidth':        1,
    'strokeDashArray':    null,
    'strokeLineCap':      'butt',
    'strokeLineJoin':     'miter',
    'strokeMiterLimit':   10,
    'scaleX':             1,
    'scaleY':             1,
    'angle':              0,
    'flipX':              false,
    'flipY':              false,
    'opacity':            1,
    'path':               [['M', 100, 100], ['L', 300, 100], ['L', 200, 300], ['z']],
    'selectable':         true,
    'hasControls':        true,
    'hasBorders':         true,
    'hasRotatingPoint':   true,
    'transparentCorners': true,
    'perPixelTargetFind': false,
    'shadow':             null,
    'visible':            true
  };

  function getPathElement(path) {
    var el = fabric.document.createElement('path');
    el.setAttribute('d', path);
    el.setAttribute('fill', 'red');
    el.setAttribute('stroke', 'blue');
    el.setAttribute('stroke-width', 1);
    el.setAttribute('stroke-linecap', 'butt');
    el.setAttribute('stroke-linejoin', 'miter');
    el.setAttribute('stroke-miterlimit', 10);
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
    equal(path.toString(), '#<fabric.Path (4): { "top": 200, "left": 200 }>');
  });

  test('toObject', function() {
    var path = makePathObject();
    ok(typeof path.toObject == 'function');
    deepEqual(path.toObject(), REFERENCE_PATH_OBJECT);
  });

  test('toDatalessObject', function() {
    var path = makePathObject();
    ok(typeof path.toDatalessObject == 'function');
    deepEqual(path.toDatalessObject(), REFERENCE_PATH_OBJECT);

    var src = 'http://example.com/';
    path.setSourcePath(src);
    deepEqual(path.toDatalessObject(), fabric.util.object.extend(fabric.util.object.clone(REFERENCE_PATH_OBJECT), {
        path: src
    }));
  });

  test('complexity', function() {
    var path = makePathObject();
    ok(typeof path.complexity == 'function');
  });

  test('fromObject', function() {
    ok(typeof fabric.Path.fromObject == 'function');
    var path = fabric.Path.fromObject(REFERENCE_PATH_OBJECT);
    ok(path instanceof fabric.Path);
    deepEqual(path.toObject(), REFERENCE_PATH_OBJECT);
  });

  test('fromElement', function() {
    ok(typeof fabric.Path.fromElement == 'function');
    var elPath = fabric.document.createElement('path');

    elPath.setAttribute('d', 'M 100 100 L 300 100 L 200 300 z');
    elPath.setAttribute('fill', 'red');
    elPath.setAttribute('opacity', '1');
    elPath.setAttribute('stroke', 'blue');
    elPath.setAttribute('stroke-width', '1');
    elPath.setAttribute('stroke-dasharray', '5, 2');
    elPath.setAttribute('stroke-linecap', 'round');
    elPath.setAttribute('stroke-linejoin', 'bevil');
    elPath.setAttribute('stroke-miterlimit', '5');

    // TODO (kangax): to support multiple transformation keywords, we need to do proper matrix multiplication
    //elPath.setAttribute('transform', 'scale(2) translate(10, -20)');
    elPath.setAttribute('transform', 'scale(2)');

    var path = fabric.Path.fromElement(elPath);
    ok(path instanceof fabric.Path);

    deepEqual(path.toObject(), fabric.util.object.extend(REFERENCE_PATH_OBJECT, {
      strokeDashArray:  [5, 2],
      strokeLineCap:    'round',
      strokeLineJoin:   'bevil',
      strokeMiterLimit: 5,
      transformMatrix:  [2, 0, 0, 2, 0, 0]
    }));

    var ANGLE = 90;

    elPath.setAttribute('transform', 'rotate(' + ANGLE + ')');
    path = fabric.Path.fromElement(elPath);

    deepEqual(
      path.get('transformMatrix'),
      [ Math.cos(ANGLE), Math.sin(ANGLE), -Math.sin(ANGLE), Math.cos(ANGLE), 0, 0 ]
    );
  });

  test('multiple sequences in path commands', function() {
    var el = getPathElement('M100 100 l 200 200 300 300 400 -50 z');
    var obj = fabric.Path.fromElement(el);

    deepEqual(obj.path[0], ['M', 100, 100]);
    deepEqual(obj.path[1], ['l', 200, 200]);
    deepEqual(obj.path[2], ['l', 300, 300]);
    deepEqual(obj.path[3], ['l', 400, -50]);

    el = getPathElement('c 0,-53.25604 43.17254,-96.42858 96.42857,-96.42857 53.25603,0 96.42857,43.17254 96.42857,96.42857');
    obj = fabric.Path.fromElement(el);

    deepEqual(obj.path[0], ['c', 0, -53.25604, 43.17254, -96.42858, 96.42857, -96.42857]);
    deepEqual(obj.path[1], ['c', 53.25603, 0, 96.42857, 43.17254, 96.42857, 96.42857]);
  });

  test('compressed path commands', function() {

    var el = getPathElement('M56.224 84.12c-.047.132-.138.221-.322.215.046-.131.137-.221.322-.215z');
    var obj = fabric.Path.fromElement(el);

    deepEqual(obj.path[0], ['M', 56.224, 84.12]);
    deepEqual(obj.path[1], ['c', -0.047, 0.132, -0.138, 0.221, -0.322, 0.215]);
    deepEqual(obj.path[2], ['c', 0.046, -0.131, 0.137, -0.221, 0.322, -0.215]);
    deepEqual(obj.path[3], ['z']);
  });
})();
