(function() {

  function getPoints() {
    return [
      {x: 10, y: 12},
      {x: 20, y: 22}
    ];
  }

  var REFERENCE_OBJECT = {
    version:                  fabric.version,
    type:                     'Polyline',
    originX:                  'left',
    originY:                  'top',
    left:                     9.5,
    top:                      11.5,
    width:                    10,
    height:                   10,
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
    points:                   getPoints(),
    shadow:                   null,
    visible:                  true,
    backgroundColor:          '',
    fillRule:                 'nonzero',
    paintFirst:               'fill',
    globalCompositeOperation: 'source-over',
    skewX:                    0,
    skewY:                    0,
    strokeUniform:              false
  };

  var REFERENCE_EMPTY_OBJECT = {
    points: [],
    width: 0,
    height: 0,
    top: 0,
    left: 0
  };

  QUnit.module('fabric.Polyline');

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Polyline);

    var polyline = new fabric.Polyline(getPoints());

    assert.ok(polyline instanceof fabric.Polyline);
    assert.ok(polyline instanceof fabric.Object);

    assert.equal(polyline.constructor.name, 'Polyline');
    assert.deepEqual(polyline.get('points'), [{ x: 10, y: 12 }, { x: 20, y: 22 }]);
  });

  QUnit.test('complexity', function(assert) {
    var polyline = new fabric.Polyline(getPoints());
    assert.ok(typeof polyline.complexity === 'function');
  });

  QUnit.test('toObject', function(assert) {
    var polyline = new fabric.Polyline(getPoints());
    assert.ok(typeof polyline.toObject === 'function');

    assert.deepEqual({
      ...polyline.toObject(),
      points: getPoints()
    }, REFERENCE_OBJECT);
  });

  QUnit.test('toSVG', function(assert) {
    var polyline = new fabric.Polygon(getPoints(), { fill: 'red', stroke: 'blue' });
    assert.ok(typeof polyline.toSVG === 'function');
    var EXPECTED_SVG = '<g transform=\"matrix(1 0 0 1 15 17)\"  >\n<polygon style=\"stroke: rgb(0,0,255); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-rule: nonzero; opacity: 1;\"  points=\"-5,-5 5,5 \" />\n</g>\n';
    assert.deepEqual(polyline.toSVG(), EXPECTED_SVG);
  });

  QUnit.test('fromObject', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.Polyline.fromObject === 'function');
    fabric.Polyline.fromObject(REFERENCE_OBJECT).then(function(polyline) {
      assert.ok(polyline instanceof fabric.Polyline);
      assert.deepEqual(polyline.toObject(), REFERENCE_OBJECT);
      done();
    });
  });

  QUnit.test('fromElement without points', function(assert) {
    assert.ok(typeof fabric.Polyline.fromElement === 'function');
    var elPolylineWithoutPoints = fabric.getDocument().createElementNS('http://www.w3.org/2000/svg', 'polyline');
    fabric.Polyline.fromElement(elPolylineWithoutPoints, function(polyline) {
      assert.deepEqual(polyline.toObject(), { ...REFERENCE_OBJECT, ...REFERENCE_EMPTY_OBJECT });
    });
  });

  QUnit.test('fromElement with empty points', function(assert) {
    var namespace = 'http://www.w3.org/2000/svg';
    var elPolylineWithEmptyPoints = fabric.getDocument().createElementNS(namespace, 'polyline');
    elPolylineWithEmptyPoints.setAttributeNS(namespace, 'points', '');
    fabric.Polyline.fromElement(elPolylineWithEmptyPoints, function(polyline) {
      assert.deepEqual(polyline.toObject(), { ...REFERENCE_OBJECT, ...REFERENCE_EMPTY_OBJECT });
    });
  });

  QUnit.test('fromElement', function(assert) {
    var namespace = 'http://www.w3.org/2000/svg';
    var elPolyline = fabric.getDocument().createElementNS(namespace, 'polyline');
    elPolyline.setAttributeNS(namespace, 'points', '10,12 20,22');
    elPolyline.setAttributeNS(namespace, 'stroke-width', 1);
    fabric.Polyline.fromElement(elPolyline, function(polyline) {
      assert.ok(polyline instanceof fabric.Polyline);
      assert.deepEqual(polyline.toObject(), {
        ...REFERENCE_OBJECT,
        left: 10,
        top: 12
      });
    });
  });

  QUnit.test('fromElement with custom attr', function(assert) {
    var namespace = 'http://www.w3.org/2000/svg';
    var elPolylineWithAttrs = fabric.getDocument().createElementNS(namespace, 'polyline');
    elPolylineWithAttrs.setAttributeNS(namespace, 'points', '10,10 20,20 30,30 10,10');
    elPolylineWithAttrs.setAttributeNS(namespace, 'fill', 'rgb(255,255,255)');
    elPolylineWithAttrs.setAttributeNS(namespace, 'opacity', '0.34');
    elPolylineWithAttrs.setAttributeNS(namespace, 'stroke-width', '3');
    elPolylineWithAttrs.setAttributeNS(namespace, 'stroke', 'blue');
    elPolylineWithAttrs.setAttributeNS(namespace, 'transform', 'translate(-10,-20) scale(2)');
    elPolylineWithAttrs.setAttributeNS(namespace, 'stroke-dasharray', '5, 2');
    elPolylineWithAttrs.setAttributeNS(namespace, 'stroke-linecap', 'round');
    elPolylineWithAttrs.setAttributeNS(namespace, 'stroke-linejoin', 'bevel');
    elPolylineWithAttrs.setAttributeNS(namespace, 'stroke-miterlimit', '5');

    fabric.Polyline.fromElement(elPolylineWithAttrs, function(polylineWithAttrs) {
      var expectedPoints = [{x: 10, y: 10}, {x: 20, y: 20}, {x: 30, y: 30}, {x: 10, y: 10}];
      assert.deepEqual(polylineWithAttrs.toObject(), {
        ...REFERENCE_OBJECT,
        width: 20,
        height: 20,
        fill: 'rgb(255,255,255)',
        stroke: 'blue',
        strokeWidth: 3,
        strokeDashArray: [5, 2],
        strokeLineCap: 'round',
        strokeLineJoin: 'bevel',
        strokeMiterLimit: 5,
        opacity: 0.34,
        points: expectedPoints,
        left: 10,
        top: 10,
      });
    });
  });

  QUnit.test('fromElement with nothing', function(assert) {
    fabric.Polyline.fromElement(null, function(polyline) {
      assert.equal(polyline, null);
    });
  });
})();
