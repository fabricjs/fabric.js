(function() {

  QUnit.module('fabric.Circle');

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Circle);

    var circle = new fabric.Circle();

    assert.ok(circle instanceof fabric.Circle, 'should inherit from fabric.Circle');
    assert.ok(circle instanceof fabric.Object, 'should inherit from fabric.Object');

    assert.deepEqual(circle.constructor.name, 'Circle');
  });

  QUnit.test('constructor with radius', function(assert) {
    assert.ok(fabric.Circle);
    var circle = new fabric.Circle({ radius: 20 });
    assert.equal(circle.width, 40, 'width is set');
    assert.equal(circle.height, 40, 'height is set');
  });

  QUnit.test('getRadiusX, getRadiusY', function(assert) {
    var circle = new fabric.Circle({ radius: 10 });

    assert.ok(typeof circle.getRadiusX === 'function', 'getRadiusX should exist');
    assert.ok(typeof circle.getRadiusY === 'function', 'getRadiusY should exist');

    assert.equal(circle.getRadiusX(), 10);
    assert.equal(circle.getRadiusY(), 10);

    circle.scale(2);

    assert.equal(circle.getRadiusX(), 20);
    assert.equal(circle.getRadiusY(), 20);

    circle.set('scaleX', 3);

    assert.equal(circle.getRadiusX(), 30);
    assert.equal(circle.getRadiusY(), 20);

    circle.set('scaleY', 4);

    assert.equal(circle.getRadiusX(), 30);
    assert.equal(circle.getRadiusY(), 40);
  });

  QUnit.test('setRadius', function(assert) {
    var circle = new fabric.Circle({radius: 10, strokeWidth: 0});

    assert.ok(typeof circle.setRadius === 'function');

    assert.equal(circle.getRadiusX(), 10);
    assert.equal(circle.getRadiusY(), 10);

    assert.equal(circle.width, 20);
    assert.equal(circle.height, 20);

    circle.setRadius(20);

    assert.equal(circle.getRadiusX(), 20);
    assert.equal(circle.getRadiusY(), 20);

    assert.equal(circle.width, 40);
    assert.equal(circle.height, 40);
  });

  QUnit.test('set radius', function(assert) {
    var circle = new fabric.Circle({strokeWidth: 0});

    circle.set('radius', 20);

    assert.equal(circle.getRadiusX(), 20);
    assert.equal(circle.getRadiusY(), 20);

    assert.equal(circle.width, 40);
    assert.equal(circle.height, 40);
  });

  QUnit.test('complexity', function(assert) {
    var circle = new fabric.Circle();
    assert.ok(typeof circle.complexity === 'function');
    assert.equal(circle.complexity(), 1);
  });

  QUnit.test('toObject', function(assert) {
    var circle = new fabric.Circle();
    var defaultProperties = {
      version:                  fabric.version,
      type:                     'Circle',
      originX:                  'left',
      originY:                  'top',
      left:                     0,
      top:                      0,
      width:                    0,
      height:                   0,
      fill:                     'rgb(0,0,0)',
      stroke:                   null,
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
      shadow:                   null,
      visible:                  true,
      backgroundColor:          '',
      fillRule:                 'nonzero',
      paintFirst:               'fill',
      globalCompositeOperation: 'source-over',
      radius:                   0,
      startAngle:               0,
      endAngle:                 360,
      skewX:                    0,
      skewY:                    0,
      strokeUniform:            false
    };
    assert.ok(typeof circle.toObject === 'function');
    assert.deepEqual(circle.toObject(), defaultProperties);

    circle.set('left', 100);
    circle.set('top', 200);
    circle.set('radius', 15);

    assert.deepEqual(circle.toObject(), {
      ...defaultProperties,
      left: 100,
      top: 200,
      width: 30,
      height: 30,
      radius: 15
    });
  });

  QUnit.test('toObject without defaults', function(assert) {
    const circle = new fabric.Circle({
      includeDefaultValues: false,
    });
    assert.deepEqual(circle.toObject(), {
      type: "Circle",
      version: fabric.version,
      left: 0,
      top: 0
    });
  });

  QUnit.test('toSVG with full circle', function(assert) {
    var circle = new fabric.Circle({ width: 100, height: 100, radius: 10 });
    var svg = circle.toSVG();
    var svgClipPath = circle.toClipPathSVG();
    assert.equal(svg, '<g transform=\"matrix(1 0 0 1 10.5 10.5)\"  >\n<circle style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  cx=\"0\" cy=\"0\" r=\"10\" />\n</g>\n');
    assert.equal(svgClipPath, '\t<circle transform=\"matrix(1 0 0 1 10.5 10.5)\" cx=\"0\" cy=\"0\" r=\"10\" />\n', 'circle as clipPath');
  });

  QUnit.test('toSVG with half circle', function(assert) {
    var circle = new fabric.Circle({ width: 100, height: 100, radius: 10, endAngle: fabric.util.radiansToDegrees(Math.PI) });
    var svg = circle.toSVG();
    var svgClipPath = circle.toClipPathSVG();
    assert.equal(svg, '<g transform=\"matrix(1 0 0 1 10.5 10.5)\"  >\n<path d=\"M 10 0 A 10 10 0 0 1 -10 0\" style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"   />\n</g>\n');
    assert.equal(svgClipPath, '\t<path d=\"M 10 0 A 10 10 0 0 1 -10 0\" transform=\"matrix(1 0 0 1 10.5 10.5)\"  />\n', 'half circle as clipPath');
  });

  QUnit.test('fromElement', function(assert) {
    assert.ok(typeof fabric.Circle.fromElement === 'function');

    var namespace        = 'http://www.w3.org/2000/svg';
    var elCircle         = fabric.getDocument().createElementNS(namespace, 'circle'),
        radius           = 10,
        left             = 12,
        top              = 15,
        fill             = 'ff5555',
        opacity          = 0.5,
        strokeWidth      = 2,
        strokeDashArray  = [5, 2],
        strokeLineCap    = 'round',
        strokeLineJoin   = 'bevel',
        strokeMiterLimit = 5;


    elCircle.setAttributeNS(namespace, 'r', radius);
    elCircle.setAttributeNS(namespace, 'cx', left);
    elCircle.setAttributeNS(namespace, 'cy', top);
    elCircle.setAttributeNS(namespace, 'fill', fill);
    elCircle.setAttributeNS(namespace, 'opacity', opacity);
    elCircle.setAttributeNS(namespace, 'stroke-width', strokeWidth);
    elCircle.setAttributeNS(namespace, 'stroke-dasharray', '5, 2');
    elCircle.setAttributeNS(namespace, 'stroke-linecap', strokeLineCap);
    elCircle.setAttributeNS(namespace, 'stroke-linejoin', strokeLineJoin);
    elCircle.setAttributeNS(namespace, 'stroke-miterlimit', strokeMiterLimit);

    fabric.Circle.fromElement(elCircle, function(oCircle) {
      assert.ok(oCircle instanceof fabric.Circle);
      assert.equal(oCircle.get('radius'), radius);
      assert.equal(oCircle.get('left'), left - radius);
      assert.equal(oCircle.get('top'), top - radius);
      assert.equal(oCircle.get('fill'), fill);
      assert.equal(oCircle.get('opacity'), opacity);
      assert.equal(oCircle.get('strokeWidth'), strokeWidth);
      assert.deepEqual(oCircle.get('strokeDashArray'), strokeDashArray);
      assert.equal(oCircle.get('strokeLineCap'), strokeLineCap);
      assert.equal(oCircle.get('strokeLineJoin'), strokeLineJoin);
      assert.equal(oCircle.get('strokeMiterLimit'), strokeMiterLimit);

      var elFaultyCircle = fabric.getDocument().createElementNS(namespace, 'circle');
      elFaultyCircle.setAttributeNS(namespace, 'r', '-10');

      var error;
      try {
        fabric.Circle.fromElement(elFaultyCircle);
      }
      catch (err) {
        error = err;
      }
      assert.ok(error, 'negative attribute should throw');

      elFaultyCircle.removeAttribute('r');

      error = void 0;
      try {
        fabric.Circle.fromElement(elFaultyCircle);
      }
      catch (err) {
        error = err;
      }

      assert.ok(error, 'inexstent attribute should throw');
    });
  });

  QUnit.test('fromObject', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.Circle.fromObject === 'function');

    var left    = 112,
        top     = 234,
        radius  = 13.45,
        fill    = 'ff5555';

    fabric.Circle.fromObject({
      left: left, top: top, radius: radius, fill: fill
    }).then(function(circle) {
      assert.ok(circle instanceof fabric.Circle);

      assert.equal(circle.get('left'), left);
      assert.equal(circle.get('top'), top);
      assert.equal(circle.get('radius'), radius);
      assert.equal(circle.get('fill'), fill);

      var expected = circle.toObject();
      fabric.Circle.fromObject(expected).then(function(actual) {
        assert.deepEqual(actual.toObject(), expected);
        done();
      });
    });
  });

  QUnit.test('cloning and radius, width, height', function(assert) {
    var done = assert.async();
    var circle = new fabric.Circle({ radius: 10, strokeWidth: 0});
    circle.scale(2);

    circle.clone().then(function(clone) {
      assert.equal(clone.width, 20);
      assert.equal(clone.getScaledWidth(), 40);
      assert.equal(clone.height, 20);
      assert.equal(clone.getScaledHeight(), 40);
      assert.equal(clone.radius, 10);
      done();
    });
  });
})();
