(function() {

  var REFERENCE_PATH_OBJECT = {
    version:                  fabric.version,
    type:                     'path',
    originX:                  'left',
    originY:                  'top',
    left:                     100,
    top:                      100,
    width:                    200,
    height:                   200,
    fill:                     'red',
    stroke:                   'blue',
    strokeWidth:              1,
    strokeDashArray:          null,
    strokeLineCap:            'butt',
    strokeDashOffset:         0,
    strokeLineJoin:           'miter',
    strokeMiterLimit:         4,
    scaleX:                   1,
    scaleY:                   1,
    angle:                    0,
    flipX:                    false,
    flipY:                    false,
    opacity:                  1,
    path:                     [['M', 100, 100], ['L', 300, 100], ['L', 200, 300], ['z']],
    shadow:                   null,
    visible:                  true,
    backgroundColor:          '',
    fillRule:                 'nonzero',
    paintFirst:               'fill',
    globalCompositeOperation: 'source-over',
    skewX:                    0,
    skewY:                    0,
    strokeUniform:            false
  };

  function getPathElement(path) {
    var namespace = 'http://www.w3.org/2000/svg';
    var el = fabric.document.createElementNS(namespace, 'path');
    el.setAttributeNS(namespace, 'd', path);
    el.setAttributeNS(namespace, 'fill', 'red');
    el.setAttributeNS(namespace, 'stroke', 'blue');
    el.setAttributeNS(namespace, 'stroke-width', 1);
    el.setAttributeNS(namespace, 'stroke-linecap', 'butt');
    el.setAttributeNS(namespace, 'stroke-linejoin', 'miter');
    el.setAttributeNS(namespace, 'stroke-miterlimit', 4);
    return el;
  }

  function getPathObject(path, callback) {
    fabric.Path.fromElement(getPathElement(path), callback);
  }

  function makePathObject(callback) {
    getPathObject('M 100 100 L 300 100 L 200 300 z', callback);
  }

  function updatePath(pathObject, value, preservePosition) {
    const { left, top } = pathObject;
    pathObject._setPath(value);
    preservePosition && pathObject.set({ left, top });
  }

  QUnit.module('fabric.Path', {
    beforeEach: function() {
      fabric.Object.__uid = 0;
    }
  });

  QUnit.test('constructor', function(assert) {
    var done = assert.async();
    assert.ok(fabric.Path);

    makePathObject(function(path) {
      assert.ok(path instanceof fabric.Path);
      assert.ok(path instanceof fabric.Object);

      assert.equal(path.get('type'), 'path');

      var error;
      try {
        new fabric.Path();
      }
      catch (err) {
        error = err;
      }

      assert.ok(typeof error === 'undefined', 'should not throw error on empty path');
      done();
    });
  });

  QUnit.test('initialize', function(assert) {
    var done = assert.async();
    var path = new fabric.Path('M 100 100 L 200 100 L 170 200 z', { top: 0, strokeWidth: 0 });

    assert.equal(path.left, 100);
    assert.equal(path.top, 0);
    done();
  });

  QUnit.test('initialize with strokeWidth', function(assert) {
    var done = assert.async();
    var path = new fabric.Path('M 100 100 L 200 100 L 170 200 z', { strokeWidth: 50 });

    assert.equal(path.left, 75);
    assert.equal(path.top, 75);
    done();
  });

  QUnit.test('initialize with strokeWidth with originX and originY', function(assert) {
    var done = assert.async();
    var path = new fabric.Path(
      'M 100 100 L 200 100 L 170 200 z',
      { strokeWidth: 0, originX: 'center', originY: 'center' }
    );

    assert.equal(path.left, 150);
    assert.equal(path.top, 150);
    done();
  });

  QUnit.test('set path after initialization', function (assert) {
    var done = assert.async();
    var path = new fabric.Path('M 100 100 L 200 100 L 170 200 z', REFERENCE_PATH_OBJECT);
    updatePath(path, REFERENCE_PATH_OBJECT.path, true);
    assert.deepEqual(path.toObject(), REFERENCE_PATH_OBJECT);
    updatePath(path, REFERENCE_PATH_OBJECT.path, false);
    var left = path.left;
    var top = path.top;
    path.center();
    assert.equal(left, path.left);
    assert.equal(top, path.top);
    var opts = fabric.util.object.clone(REFERENCE_PATH_OBJECT);
    delete opts.path;
    path.set(opts);
    updatePath(path, 'M 100 100 L 300 100 L 200 300 z', true);
    makePathObject(function (cleanPath) {
      assert.deepEqual(path.toObject(), cleanPath.toObject());
      done();
    });
  });

  QUnit.test('toString', function(assert) {
    var done = assert.async();
    makePathObject(function(path) {
      assert.ok(typeof path.toString === 'function');
      assert.equal(path.toString(), '#<fabric.Path (4): { "top": 100, "left": 100 }>');
      done();
    });
  });

  QUnit.test('toObject', function(assert) {
    var done = assert.async();
    makePathObject(function(path) {
      assert.ok(typeof path.toObject === 'function');
      assert.deepEqual(path.toObject(), REFERENCE_PATH_OBJECT);
      done();
    });
  });

  QUnit.test('toObject', function(assert) {
    var done = assert.async();
    makePathObject(function(path) {
      path.top = fabric.Object.prototype.top;
      path.left = fabric.Object.prototype.left;
      path.includeDefaultValues = false;
      var obj = path.toObject();
      assert.equal(obj.top, fabric.Object.prototype.top, 'top is available also when equal to prototype');
      assert.equal(obj.left, fabric.Object.prototype.left, 'left is available also when equal to prototype');
      done();
    });
  });

  QUnit.test('toSVG', function(assert) {
    var done = assert.async();
    makePathObject(function(path) {
      assert.ok(typeof path.toSVG === 'function');
      assert.deepEqual(path.toSVG(), '<g transform=\"matrix(1 0 0 1 200.5 200.5)\"  >\n<path style=\"stroke: rgb(0,0,255); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-rule: nonzero; opacity: 1;\"  transform=\" translate(-200, -200)\" d=\"M 100 100 L 300 100 L 200 300 z\" stroke-linecap=\"round\" />\n</g>\n');
      done();
    });
  });

  QUnit.test('toSVG with a clipPath path', function(assert) {
    var done = assert.async();
    makePathObject(function(path) {
      makePathObject(function(path2) {
        path.clipPath = path2;
        assert.deepEqual(path.toSVG(), '<g transform=\"matrix(1 0 0 1 200.5 200.5)\" clip-path=\"url(#CLIPPATH_0)\"  >\n<clipPath id=\"CLIPPATH_0\" >\n\t<path transform=\"matrix(1 0 0 1 200.5 200.5) translate(-200, -200)\" d=\"M 100 100 L 300 100 L 200 300 z\" stroke-linecap=\"round\" />\n</clipPath>\n<path style=\"stroke: rgb(0,0,255); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-rule: nonzero; opacity: 1;\"  transform=\" translate(-200, -200)\" d=\"M 100 100 L 300 100 L 200 300 z\" stroke-linecap=\"round\" />\n</g>\n', 'path clipPath toSVG should match');
        done();
      });
    });
  });


  QUnit.test('toSVG with a clipPath path absolutePositioned', function(assert) {
    var done = assert.async();
    makePathObject(function(path) {
      makePathObject(function(path2) {
        path.clipPath = path2;
        path.clipPath.absolutePositioned = true;
        assert.deepEqual(path.toSVG(), '<g clip-path=\"url(#CLIPPATH_0)\"  >\n<g transform=\"matrix(1 0 0 1 200.5 200.5)\"  >\n<clipPath id=\"CLIPPATH_0\" >\n\t<path transform=\"matrix(1 0 0 1 200.5 200.5) translate(-200, -200)\" d=\"M 100 100 L 300 100 L 200 300 z\" stroke-linecap=\"round\" />\n</clipPath>\n<path style=\"stroke: rgb(0,0,255); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-rule: nonzero; opacity: 1;\"  transform=\" translate(-200, -200)\" d=\"M 100 100 L 300 100 L 200 300 z\" stroke-linecap=\"round\" />\n</g>\n</g>\n', 'path clipPath toSVG absolute should match');
        done();
      });
    });
  });

  QUnit.test('path array not shared when cloned', function(assert) {
    var done = assert.async();
    makePathObject(function(originalPath) {
      originalPath.clone(function(clonedPath) {
        clonedPath.path[0][1] = 200;
        assert.equal(originalPath.path[0][1], 100);
        done();
      });
    });
  });

  QUnit.test('toDatalessObject', function(assert) {
    var done = assert.async();
    makePathObject(function(path) {
      assert.ok(typeof path.toDatalessObject === 'function');
      assert.deepEqual(path.toDatalessObject(), REFERENCE_PATH_OBJECT, 'if not sourcePath the object is same');
      done();
    });
  });

  QUnit.test('toDatalessObject with sourcePath', function(assert) {
    var done = assert.async();
    makePathObject(function(path) {
      var src = 'http://example.com/';
      path.sourcePath = src;
      var clonedRef = fabric.util.object.clone(REFERENCE_PATH_OBJECT);
      clonedRef.sourcePath = src;
      delete clonedRef.path;
      assert.deepEqual(path.toDatalessObject(), clonedRef, 'if sourcePath the object looses path');
      done();
    });
  });

  QUnit.test('complexity', function(assert) {
    var done = assert.async();
    makePathObject(function(path) {
      assert.ok(typeof path.complexity === 'function');
      done();
    });
  });

  QUnit.test('fromObject', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.Path.fromObject === 'function');
    fabric.Path.fromObject(REFERENCE_PATH_OBJECT, function(path) {
      assert.ok(path instanceof fabric.Path);
      assert.deepEqual(path.toObject(), REFERENCE_PATH_OBJECT);
      done();
    });
  });

  QUnit.test('fromObject with sourcePath', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.Path.fromObject === 'function');
    fabric.Path.fromObject(REFERENCE_PATH_OBJECT, function(path) {
      assert.ok(path instanceof fabric.Path);
      assert.deepEqual(path.toObject(), REFERENCE_PATH_OBJECT);
      done();
    });
  });

  QUnit.test('fromElement', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.Path.fromElement === 'function');
    var namespace = 'http://www.w3.org/2000/svg';
    var elPath = fabric.document.createElementNS(namespace, 'path');

    elPath.setAttributeNS(namespace, 'd', 'M 100 100 L 300 100 L 200 300 z');
    elPath.setAttributeNS(namespace, 'fill', 'red');
    elPath.setAttributeNS(namespace, 'opacity', '1');
    elPath.setAttributeNS(namespace, 'stroke', 'blue');
    elPath.setAttributeNS(namespace, 'stroke-width', '1');
    elPath.setAttributeNS(namespace, 'stroke-dasharray', '5, 2');
    elPath.setAttributeNS(namespace, 'stroke-linecap', 'round');
    elPath.setAttributeNS(namespace, 'stroke-linejoin', 'bevel');
    elPath.setAttributeNS(namespace, 'stroke-miterlimit', '5');

    // TODO (kangax): to support multiple transformation keywords, we need to do proper matrix multiplication
    //elPath.setAttribute('transform', 'scale(2) translate(10, -20)');
    elPath.setAttributeNS(namespace, 'transform', 'scale(2)');

    fabric.Path.fromElement(elPath, function(path) {
      assert.ok(path instanceof fabric.Path);

      assert.deepEqual(path.toObject(), fabric.util.object.extend(REFERENCE_PATH_OBJECT, {
        strokeDashArray:  [5, 2],
        strokeLineCap:    'round',
        strokeLineJoin:   'bevel',
        strokeMiterLimit: 5
      }));

      var ANGLE_DEG = 90;
      elPath.setAttributeNS(namespace, 'transform', 'rotate(' + ANGLE_DEG + ')');
      fabric.Path.fromElement(elPath, function(path) {
        assert.deepEqual(
          path.get('transformMatrix'),
          [0, 1, -1, 0, 0, 0]
        );
        done();
      });
    });
  });

  QUnit.test('numbers with leading decimal point', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.Path.fromElement === 'function');
    var namespace = 'http://www.w3.org/2000/svg';
    var elPath = fabric.document.createElementNS(namespace, 'path');

    elPath.setAttributeNS(namespace, 'd', 'M 100 100 L 300 100 L 200 300 z');
    elPath.setAttributeNS(namespace, 'transform', 'scale(.2)');

    fabric.Path.fromElement(elPath, function(path) {
      assert.ok(path instanceof fabric.Path);
      assert.deepEqual(path.transformMatrix, [0.2, 0, 0, 0.2, 0, 0], 'transform has been parsed');
      done();
    });
  });

  QUnit.test('multiple sequences in path commands', function(assert) {
    var done = assert.async();
    var el = getPathElement('M100 100 l 200 200 300 300 400 -50 z');
    fabric.Path.fromElement(el, function(obj) {

      assert.deepEqual(obj.path[0], ['M', 100, 100]);
      assert.deepEqual(obj.path[1], ['L', 300, 300]);
      assert.deepEqual(obj.path[2], ['L', 600, 600]);
      assert.deepEqual(obj.path[3], ['L', 1000, 550]);

      el = getPathElement('c 0,-53.25604 43.17254,-96.42858 96.42857,-96.42857 53.25603,0 96.42857,43.17254 96.42857,96.42857');
      fabric.Path.fromElement(el, function(obj) {
        assert.deepEqual(obj.path[0], ['C', 0, -53.25604, 43.17254, -96.42858, 96.42857, -96.42857]);
        assert.deepEqual(obj.path[1], ['C', 149.6846, -96.42857, 192.85714, -53.256029999999996, 192.85714, 0]);
        done();
      });
    });
  });

  QUnit.test('multiple M/m coordinates converted all L', function(assert) {
    var done = assert.async();
    var el = getPathElement('M100 100 200 200 150 50 m 300 300 400 -50 50 100');
    fabric.Path.fromElement(el, function(obj) {

      assert.deepEqual(obj.path[0], ['M', 100, 100]);
      assert.deepEqual(obj.path[1], ['L', 200, 200]);
      assert.deepEqual(obj.path[2], ['L', 150, 50]);
      assert.deepEqual(obj.path[3], ['M', 450, 350]);
      assert.deepEqual(obj.path[4], ['L', 850, 300]);
      assert.deepEqual(obj.path[5], ['L', 900, 400]);
      done();
    });
  });

  QUnit.test('multiple M/m commands converted all as M commands', function(assert) {
    var done = assert.async();
    var el = getPathElement('M100 100 M 200 200 M150 50 m 300 300 m 400 -50 m 50 100');
    fabric.Path.fromElement(el, function(obj) {

      assert.deepEqual(obj.path[0], ['M', 100, 100]);
      assert.deepEqual(obj.path[1], ['M', 200, 200]);
      assert.deepEqual(obj.path[2], ['M', 150, 50]);
      assert.deepEqual(obj.path[3], ['M', 450, 350]);
      assert.deepEqual(obj.path[4], ['M', 850, 300]);
      assert.deepEqual(obj.path[5], ['M', 900, 400]);
      done();
    });
  });

  QUnit.test('compressed path commands', function(assert) {
    var done = assert.async();
    var el = getPathElement('M56.224 84.12C-.047.132-.138.221-.322.215.046-.131.137-.221.322-.215z');
    fabric.Path.fromElement(el, function(obj) {

      assert.deepEqual(obj.path[0], ['M', 56.224, 84.12]);
      assert.deepEqual(obj.path[1], ['C', -0.047, 0.132, -0.138, 0.221, -0.322, 0.215]);
      assert.deepEqual(obj.path[2], ['C', 0.046, -0.131, 0.137, -0.221, 0.322, -0.215]);
      assert.deepEqual(obj.path[3], ['z']);
      done();
    });
  });

  QUnit.test('compressed path commands with e^x', function(assert) {
    var done = assert.async();
    var el = getPathElement('M56.224e2 84.12E-2C-.047.132-.138.221-.322.215.046-.131.137-.221.322-.215m-.050 -20.100z');
    fabric.Path.fromElement(el, function(obj) {

      assert.deepEqual(obj.path[0], ['M', 5622.4, 0.8412]);
      assert.deepEqual(obj.path[1], ['C', -0.047, 0.132, -0.138, 0.221, -0.322, 0.215]);
      assert.deepEqual(obj.path[2], ['C', 0.046, -0.131, 0.137, -0.221, 0.322, -0.215]);
      assert.deepEqual(obj.path[3], ['M', 0.272, -20.315]);
      assert.deepEqual(obj.path[4], ['z']);
      done();
    });
  });

  QUnit.test('path toDatalessObject with clipPath', function(assert) {
    var svgWithClipPath = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" fill="#DEDEDE"  viewBox="0 0 75 75" ><defs><clipPath id="a"><path d="M 16.769531 0 L 58 0 L 58 74.996094 L 16.769531 74.996094 Z M 16.769531 0"/></clipPath></defs><g clip-path="url(#a)"><path d="M 57.1875 1.625 C 56.972656 1.625 56.789062 1.550781 56.640625 1.402344 C 56.488281 1.25 56.414062 1.070312 56.414062 0.855469 C 56.414062 0.644531 56.488281 0.460938 56.640625 0.3125 C 56.792969 0.160156 56.972656 0.0859375 57.1875 0.0859375 C 57.402344 0.0859375 57.582031 0.164062 57.734375 0.3125 C 57.886719 0.464844 57.960938 0.644531 57.960938 0.859375 C 57.960938 1.070312 57.882812 1.253906 57.734375 1.402344 C 57.582031 1.550781 57.398438 1.625 57.1875 1.625 Z M 57.960938 9 C 57.960938 8.785156 57.886719 8.605469 57.734375 8.453125 C 57.582031 8.304688 57.402344 8.230469 57.1875 8.226562 C 56.972656 8.226562 56.792969 8.300781 56.640625 8.453125 C 56.488281 8.601562 56.414062 8.785156 56.414062 8.996094 C 56.414062 9.210938 56.488281 9.390625 56.640625 9.542969 C 56.789062 9.691406 56.972656 9.765625 57.1875 9.765625 C 57.398438 9.765625 57.582031 9.691406 57.734375 9.542969 C 57.882812 9.394531 57.960938 9.210938 57.960938 9 Z M 57.960938 17.136719 C 57.960938 16.925781 57.882812 16.746094 57.734375 16.59375 C 57.582031 16.445312 57.398438 16.367188 57.1875 16.367188 C 56.972656 16.367188 56.789062 16.445312 56.640625 16.59375 C 56.488281 16.746094 56.414062 16.925781 56.414062 17.136719 C 56.414062 17.351562 56.488281 17.53125 56.640625 17.683594 C 56.789062 17.832031 56.972656 17.910156 57.1875 17.910156 C 57.398438 17.910156 57.582031 17.832031 57.734375 17.683594 C 57.882812 17.53125 57.960938 17.351562 57.960938 17.136719 Z M 57.960938 25.285156 C 57.960938 25.070312 57.882812 24.890625 57.734375 24.738281 C 57.582031 24.589844 57.398438 24.515625 57.1875 24.515625 C 56.972656 24.515625 56.789062 24.589844 56.640625 24.738281 C 56.488281 24.890625 56.414062 25.070312 56.414062 25.285156 C 56.414062 25.496094 56.488281 25.675781 56.640625 25.828125 C 56.789062 25.976562 56.972656 26.054688 57.1875 26.054688 C 57.398438 26.054688 57.582031 25.976562 57.734375 25.828125 C 57.882812 25.675781 57.960938 25.496094 57.960938 25.285156 Z M 57.960938 33.425781 C 57.960938 33.210938 57.882812 33.03125 57.734375 32.878906 C 57.582031 32.730469 57.398438 32.65625 57.1875 32.65625 C 56.972656 32.65625 56.789062 32.730469 56.640625 32.878906 C 56.488281 33.03125 56.414062 33.210938 56.414062 33.425781 C 56.414062 33.636719 56.488281 33.816406 56.640625 33.96875 C 56.789062 34.117188 56.972656 34.195312 57.1875 34.195312 C 57.402344 34.195312 57.582031 34.117188 57.734375 33.96875 C 57.886719 33.816406 57.960938 33.632812 57.960938 33.421875 Z" /></g></svg>');
    var done = assert.async();
    var canvas = new fabric.StaticCanvas();
    var canvas2 = new fabric.StaticCanvas();
    fabric.loadSVGFromURL(svgWithClipPath, function(objects, d) {
      var group = fabric.util.groupSVGElements(objects, d, svgWithClipPath);
      canvas.add(group);
      var jsonData = canvas.toDatalessJSON();
      canvas2.loadFromJSON(jsonData, function() {
        assert.ok(canvas2._objects[0] instanceof fabric.Path, 'is enlived properly');
        assert.ok(canvas2._objects[0].clipPath instanceof fabric.Path, 'clipPath is enlived properly');
        done();
      });
    });
  });
})();
