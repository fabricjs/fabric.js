(function() {

  var REFERENCE_PATH_OBJECT = {
    'type':                     'path',
    'originX':                  'left',
    'originY':                  'top',
    'left':                     100,
    'top':                      100,
    'width':                    200,
    'height':                   200,
    'fill':                     'red',
    'stroke':                   'blue',
    'strokeWidth':              1,
    'strokeDashArray':          null,
    'strokeLineCap':            'butt',
    'strokeLineJoin':           'miter',
    'strokeMiterLimit':         10,
    'scaleX':                   1,
    'scaleY':                   1,
    'angle':                    0,
    'flipX':                    false,
    'flipY':                    false,
    'opacity':                  1,
    'path':                     [['M', 100, 100], ['L', 300, 100], ['L', 200, 300], ['z']],
    'pathOffset':               { x: 200, y: 200 },
    'shadow':                   null,
    'visible':                  true,
    'backgroundColor':          '',
    'clipTo':                   null,
    'fillRule':                 'nonzero',
    'globalCompositeOperation': 'source-over',
    'skewX':                    0,
    'skewY':                    0,
    'transformMatrix':          null
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

  function getPathObject(path, callback) {
    fabric.Path.fromElement(getPathElement(path), callback);
  }

  function makePathObject(callback) {
    getPathObject('M 100 100 L 300 100 L 200 300 z', callback);
  }

  QUnit.module('fabric.Path');

  asyncTest('constructor', function() {
    ok(fabric.Path);

    makePathObject(function(path) {
      ok(path instanceof fabric.Path);
      ok(path instanceof fabric.Object);

      equal(path.get('type'), 'path');

      var error;
      try {
        new fabric.Path();
      }
      catch (err) {
        error = err;
      }

      ok(typeof error === 'undefined', 'should not throw error on empty path');
      start();
    });
  });

  asyncTest('initialize', function() {
    var path = new fabric.Path('M 100 100 L 200 100 L 170 200 z', { top: 0 });

    equal(path.left, 100);
    equal(path.top, 0);
    start();
  });

  asyncTest('toString', function() {
    makePathObject(function(path) {
      ok(typeof path.toString == 'function');
      equal(path.toString(), '#<fabric.Path (4): { "top": 100, "left": 100 }>');
      start();
    });
  });

  asyncTest('toObject', function() {
    makePathObject(function(path) {
      ok(typeof path.toObject == 'function');
      deepEqual(path.toObject(), REFERENCE_PATH_OBJECT);
      start();
    });
  });

  asyncTest('toObject', function() {
    makePathObject(function(path) {
      path.top = fabric.Object.prototype.top;
      path.left = fabric.Object.prototype.left;
      path.includeDefaultValues = false;
      var obj = path.toObject();
      equal(obj.top, fabric.Object.prototype.top, 'top is available also when equal to prototype');
      equal(obj.left, fabric.Object.prototype.left, 'left is available also when equal to prototype');
      start();
    });
  });

  asyncTest('toSVG', function() {
    makePathObject(function(path) {
      ok(typeof path.toSVG == 'function');
      deepEqual(path.toSVG(), '<path d="M 100 100 L 300 100 L 200 300 z" style="stroke: rgb(0,0,255); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,0,0); fill-rule: nonzero; opacity: 1;" transform="translate(200.5 200.5) translate(-200, -200) " stroke-linecap="round" />\n');
      start();
    });
  });

  asyncTest('path array not shared when cloned', function() {
    makePathObject(function(originalPath) {
      originalPath.clone(function(clonedPath) {

        clonedPath.path[0][1] = 200;
        equal(originalPath.path[0][1], 100);

        start();
      });
    });
  });

  asyncTest('toDatalessObject', function() {
    makePathObject(function(path) {
      ok(typeof path.toDatalessObject == 'function');
      deepEqual(path.toDatalessObject(), REFERENCE_PATH_OBJECT);

      var src = 'http://example.com/';
      path.sourcePath = src;
      deepEqual(path.toDatalessObject(), fabric.util.object.extend(fabric.util.object.clone(REFERENCE_PATH_OBJECT), {
        path: src
      }));
      start();
    });
  });

  asyncTest('complexity', function() {
    makePathObject(function(path) {
      ok(typeof path.complexity == 'function');
      start();
    });
  });

  asyncTest('fromObject', function() {
    ok(typeof fabric.Path.fromObject == 'function');
    fabric.Path.fromObject(REFERENCE_PATH_OBJECT, function(path) {
      ok(path instanceof fabric.Path);
      deepEqual(path.toObject(), REFERENCE_PATH_OBJECT);
      start();
    });
  });

  asyncTest('fromElement', function() {
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

    fabric.Path.fromElement(elPath, function(path) {
      ok(path instanceof fabric.Path);

      deepEqual(path.toObject(), fabric.util.object.extend(REFERENCE_PATH_OBJECT, {
        strokeDashArray:  [5, 2],
        strokeLineCap:    'round',
        strokeLineJoin:   'bevil',
        strokeMiterLimit: 5,
        transformMatrix:  [2, 0, 0, 2, 0, 0]
      }));

      var ANGLE_DEG = 90;
      var ANGLE = ANGLE_DEG * Math.PI / 180;

      elPath.setAttribute('transform', 'rotate(' + ANGLE_DEG + ')');
      fabric.Path.fromElement(elPath, function(path) {

        deepEqual(
          path.get('transformMatrix'),
          [Math.cos(ANGLE), Math.sin(ANGLE), -Math.sin(ANGLE), Math.cos(ANGLE), 0, 0]
        );
        start();
      });
    });
  });

  asyncTest('numbers with leading decimal point', function() {
    ok(typeof fabric.Path.fromElement == 'function');
    var elPath = fabric.document.createElement('path');

    elPath.setAttribute('d', 'M 100 100 L 300 100 L 200 300 z');
    elPath.setAttribute('transform', 'scale(.2)');

    fabric.Path.fromElement(elPath, function(path) {
      ok(path instanceof fabric.Path);

      deepEqual(path.toObject().transformMatrix, [0.2, 0, 0, 0.2, 0, 0]);

      start();
    });
  });

  asyncTest('multiple sequences in path commands', function() {
    var el = getPathElement('M100 100 l 200 200 300 300 400 -50 z');
    fabric.Path.fromElement(el, function(obj) {

      deepEqual(obj.path[0], ['M', 100, 100]);
      deepEqual(obj.path[1], ['l', 200, 200]);
      deepEqual(obj.path[2], ['l', 300, 300]);
      deepEqual(obj.path[3], ['l', 400, -50]);

      el = getPathElement('c 0,-53.25604 43.17254,-96.42858 96.42857,-96.42857 53.25603,0 96.42857,43.17254 96.42857,96.42857');
      fabric.Path.fromElement(el, function(obj) {

        deepEqual(obj.path[0], ['c', 0, -53.25604, 43.17254, -96.42858, 96.42857, -96.42857]);
        deepEqual(obj.path[1], ['c', 53.25603, 0, 96.42857, 43.17254, 96.42857, 96.42857]);
        start();
      });
    });
  });

  asyncTest('multiple M/m coordinates converted to L/l', function() {
    var el = getPathElement('M100 100 200 200 150 50 m 300 300 400 -50 50 100');
    fabric.Path.fromElement(el, function(obj) {

      deepEqual(obj.path[0], ['M', 100, 100]);
      deepEqual(obj.path[1], ['L', 200, 200]);
      deepEqual(obj.path[2], ['L', 150, 50]);
      deepEqual(obj.path[3], ['m', 300, 300]);
      deepEqual(obj.path[4], ['l', 400, -50]);
      deepEqual(obj.path[5], ['l', 50, 100]);
      start();
    });
  });

  asyncTest('multiple M/m commands preserved as M/m commands', function() {
    var el = getPathElement('M100 100 M 200 200 M150 50 m 300 300 m 400 -50 m 50 100');
    fabric.Path.fromElement(el, function(obj) {

      deepEqual(obj.path[0], ['M', 100, 100]);
      deepEqual(obj.path[1], ['M', 200, 200]);
      deepEqual(obj.path[2], ['M', 150, 50]);
      deepEqual(obj.path[3], ['m', 300, 300]);
      deepEqual(obj.path[4], ['m', 400, -50]);
      deepEqual(obj.path[5], ['m', 50, 100]);
      start();
    });
  });

  asyncTest('compressed path commands', function() {
    var el = getPathElement('M56.224 84.12c-.047.132-.138.221-.322.215.046-.131.137-.221.322-.215z');
    fabric.Path.fromElement(el, function(obj) {

      deepEqual(obj.path[0], ['M', 56.224, 84.12]);
      deepEqual(obj.path[1], ['c', -0.047, 0.132, -0.138, 0.221, -0.322, 0.215]);
      deepEqual(obj.path[2], ['c', 0.046, -0.131, 0.137, -0.221, 0.322, -0.215]);
      deepEqual(obj.path[3], ['z']);
      start();
    });
  });

  asyncTest('compressed path commands with e^x', function() {
    var el = getPathElement('M56.224e2 84.12E-2c-.047.132-.138.221-.322.215.046-.131.137-.221.322-.215m-.050 -20.100z');
    fabric.Path.fromElement(el, function(obj) {

      deepEqual(obj.path[0], ['M', 5622.4, 0.8412]);
      deepEqual(obj.path[1], ['c', -0.047, 0.132, -0.138, 0.221, -0.322, 0.215]);
      deepEqual(obj.path[2], ['c', 0.046, -0.131, 0.137, -0.221, 0.322, -0.215]);
      deepEqual(obj.path[3], ['m', -0.05, -20.100]);
      deepEqual(obj.path[4], ['z']);
      start();
    });
  });
})();
