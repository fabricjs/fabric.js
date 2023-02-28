(function() {

  function getPoints() {
    return [
      {x: 10, y: 12},
      {x: 20, y: 22}
    ];
  }

  var REFERENCE_OBJECT = {
    version:                  fabric.version,
    type:                     'Polygon',
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

  QUnit.module('fabric.Polygon');

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Polygon);

    var polygon = new fabric.Polygon(getPoints());

    assert.ok(polygon instanceof fabric.Polygon);
    assert.ok(polygon instanceof fabric.Polyline);
    assert.ok(polygon instanceof fabric.Object);

    assert.equal(polygon.constructor.name, 'Polygon');
    assert.deepEqual(polygon.get('points'), [{ x: 10, y: 12 }, { x: 20, y: 22 }]);
  });

  QUnit.test('polygon with exactBoundingBox false', function(assert) {
    var polygon = new fabric.Polygon([{ x: 10, y: 10 }, { x: 20, y: 10 }, { x: 20, y: 100 }], {
      exactBoundingBox: false,
      strokeWidth: 60,
    });
    var dimensions = polygon._getNonTransformedDimensions();
    assert.equal(dimensions.x, 70);
    assert.equal(dimensions.y, 150);
  });

  QUnit.test('polygon with exactBoundingBox true', function(assert) {
    var polygon = new fabric.Polygon([{ x: 10, y: 10 }, { x: 20, y: 10 }, { x: 20, y: 100 }], {
      exactBoundingBox: true,
      strokeWidth: 60,
      stroke: 'blue'
    });

    const limitedMiter = polygon._getNonTransformedDimensions();
    assert.equal(Math.round(limitedMiter.x), 74, 'limited miter x');
    assert.equal(Math.round(limitedMiter.y), 123, 'limited miter y');
    assert.deepEqual(polygon._getTransformedDimensions(), limitedMiter, 'dims should match');

    polygon.set('strokeMiterLimit', 999);
    const miter = polygon._getNonTransformedDimensions();
    assert.equal(Math.round(miter.x), 74, 'miter x');
    assert.equal(Math.round(miter.y), 662, 'miter y');
    assert.deepEqual(polygon._getTransformedDimensions(), miter, 'dims should match');

    polygon.set('strokeLineJoin', 'bevel');
    const bevel = polygon._getNonTransformedDimensions();
    assert.equal(Math.round(limitedMiter.x), 74, 'bevel x');
    assert.equal(Math.round(limitedMiter.y), 123, 'bevel y');
    assert.deepEqual(polygon._getTransformedDimensions(), bevel, 'dims should match');

    polygon.set('strokeLineJoin', 'round');
    const round = polygon._getNonTransformedDimensions();
    assert.equal(Math.round(round.x), 70, 'round x');
    assert.equal(Math.round(round.y), 150, 'round y');
    assert.deepEqual(polygon._getTransformedDimensions(), round, 'dims should match');
  });

  QUnit.todo('polygon with exactBoundingBox true and skew', function (assert) {
    var polygon = new fabric.Polygon([{ x: 10, y: 10 }, { x: 20, y: 10 }, { x: 20, y: 100 }], {
      exactBoundingBox: true,
      strokeWidth: 60,
      stroke: 'blue',
      skewX: 30,
      skewY: 45
    });

    const limitedMiter = polygon._getNonTransformedDimensions();
    assert.equal(Math.round(limitedMiter.x), 185, 'limited miter x');
    assert.equal(Math.round(limitedMiter.y), 194, 'limited miter y');
    assert.deepEqual(polygon._getTransformedDimensions(), limitedMiter, 'dims should match');

    polygon.set('strokeMiterLimit', 999);
    const miter = polygon._getNonTransformedDimensions();
    assert.equal(Math.round(miter.x), 498, 'miter x');
    assert.equal(Math.round(miter.y), 735, 'miter y');
    assert.deepEqual(polygon._getTransformedDimensions(), miter, 'dims should match');

    polygon.set('strokeLineJoin', 'bevel');
    const bevel = polygon._getNonTransformedDimensions();
    assert.equal(Math.round(limitedMiter.x), 185, 'bevel x');
    assert.equal(Math.round(limitedMiter.y), 194, 'bevel y');
    assert.deepEqual(polygon._getTransformedDimensions(), bevel, 'dims should match');

    polygon.set('strokeLineJoin', 'round');
    const round = polygon._getNonTransformedDimensions();
    // WRONG value! was buggy when writing test
    assert.equal(Math.round(round.x), 170, 'round x');
    assert.equal(Math.round(round.y), 185, 'round y');
    assert.deepEqual(polygon._getTransformedDimensions(), round, 'dims should match');
  });

  QUnit.test('complexity', function(assert) {
    var polygon = new fabric.Polygon(getPoints());
    assert.ok(typeof polygon.complexity === 'function');
  });

  QUnit.test('toObject', function(assert) {
    var polygon = new fabric.Polygon(getPoints());
    assert.ok(typeof polygon.toObject === 'function');

    assert.deepEqual({
      ...polygon.toObject(),
      points: getPoints()
    }, REFERENCE_OBJECT);
  });

  QUnit.test('toSVG', function(assert) {
    var polygon = new fabric.Polygon(getPoints(), { fill: 'red', stroke: 'blue' });
    assert.ok(typeof polygon.toSVG === 'function');
    var EXPECTED_SVG = '<g transform=\"matrix(1 0 0 1 15 17)\"  >\n<polygon style=\"stroke: rgb(0,0,255); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-rule: nonzero; opacity: 1;\"  points=\"-5,-5 5,5 \" />\n</g>\n';
    assert.deepEqual(polygon.toSVG(), EXPECTED_SVG);
  });

  QUnit.test('fromObject', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.Polygon.fromObject === 'function');
    fabric.Polygon.fromObject(REFERENCE_OBJECT).then(function(polygon) {
      assert.ok(polygon instanceof fabric.Polygon);
      assert.deepEqual(polygon.toObject(), REFERENCE_OBJECT);
      done();
    });
  });

  QUnit.test('fromElement without points', function(assert) {
    assert.ok(typeof fabric.Polygon.fromElement === 'function');

    var elPolygonWithoutPoints = fabric.getDocument().createElementNS('http://www.w3.org/2000/svg', 'polygon');

    fabric.Polygon.fromElement(elPolygonWithoutPoints, function(polygon) {
      assert.deepEqual(polygon.toObject(), { ...REFERENCE_OBJECT, ...REFERENCE_EMPTY_OBJECT });
    });
  });

  QUnit.test('fromElement with empty points', function(assert) {
    var namespace = 'http://www.w3.org/2000/svg';
    var elPolygonWithEmptyPoints = fabric.getDocument().createElementNS(namespace, 'polygon');
    elPolygonWithEmptyPoints.setAttributeNS(namespace, 'points', '');
    fabric.Polygon.fromElement(elPolygonWithEmptyPoints, function(polygon) {
      assert.deepEqual(polygon.toObject(), { ...REFERENCE_OBJECT, ...REFERENCE_EMPTY_OBJECT });
    });
  });

  QUnit.test('fromElement with points', function(assert) {
    var namespace = 'http://www.w3.org/2000/svg';
    var elPolygon = fabric.getDocument().createElementNS(namespace, 'polygon');
    elPolygon.setAttributeNS(namespace, 'points', '10,12 20,22');
    fabric.Polygon.fromElement(elPolygon, function(polygon) {
      assert.ok(polygon instanceof fabric.Polygon);
      assert.deepEqual(polygon.toObject(), {
        ...REFERENCE_OBJECT,
        points: [{ x: 10, y: 12 }, { x: 20, y: 22 }],
        left: 10,
        top: 12
      });
    });
  });

  QUnit.test('fromElement with points and custom attributes', function(assert) {
    var namespace = 'http://www.w3.org/2000/svg';
    var elPolygonWithAttrs = fabric.getDocument().createElementNS(namespace, 'polygon');
    elPolygonWithAttrs.setAttributeNS(namespace, 'points', '10,10 20,20 30,30 10,10');
    elPolygonWithAttrs.setAttributeNS(namespace, 'fill', 'rgb(255,255,255)');
    elPolygonWithAttrs.setAttributeNS(namespace, 'opacity', '0.34');
    elPolygonWithAttrs.setAttributeNS(namespace, 'stroke-width', '3');
    elPolygonWithAttrs.setAttributeNS(namespace, 'stroke', 'blue');
    elPolygonWithAttrs.setAttributeNS(namespace, 'transform', 'translate(-10,-20) scale(2)');
    elPolygonWithAttrs.setAttributeNS(namespace, 'stroke-dasharray', '5, 2');
    elPolygonWithAttrs.setAttributeNS(namespace, 'stroke-linecap', 'round');
    elPolygonWithAttrs.setAttributeNS(namespace, 'stroke-linejoin', 'bevel');
    elPolygonWithAttrs.setAttributeNS(namespace, 'stroke-miterlimit', '5');
    fabric.Polygon.fromElement(elPolygonWithAttrs, function(polygonWithAttrs) {
      var expectedPoints = [
        { x: 10, y: 10 },
        { x: 20, y: 20 },
        { x: 30, y: 30 },
        { x: 10, y: 10 }
      ];
      assert.deepEqual(polygonWithAttrs.toObject(), {
        ...REFERENCE_OBJECT,
        width:            20,
        height:           20,
        fill:             'rgb(255,255,255)',
        stroke:           'blue',
        strokeWidth:      3,
        strokeDashArray:  [5, 2],
        strokeLineCap:    'round',
        strokeLineJoin:   'bevel',
        strokeMiterLimit: 5,
        opacity:          0.34,
        points:           expectedPoints,
        top:              10,
        left:             10,
      });
    });
  });
  QUnit.test('fromElement with null', function(assert) {
    fabric.Polygon.fromElement(null, function(polygon) {
      assert.equal(polygon, null);
    });
  });
})();
