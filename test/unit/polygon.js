(function() {

  function getPoints() {
    return [
      {x: 10, y: 12},
      {x: 20, y: 22}
    ];
  }

  var REFERENCE_OBJECT = {
    'version':                  fabric.version,
    'type':                     'polygon',
    'originX':                  'left',
    'originY':                  'top',
    'left':                     10,
    'top':                      12,
    'width':                    10,
    'height':                   10,
    'fill':                     'rgb(0,0,0)',
    'stroke':                   null,
    'strokeWidth':              1,
    'strokeDashArray':          null,
    'strokeLineCap':            'butt',
    'strokeDashOffset':         0,
    'strokeLineJoin':           'miter',
    'strokeMiterLimit':         4,
    'scaleX':                   1,
    'scaleY':                   1,
    'angle':                    0,
    'flipX':                    false,
    'flipY':                    false,
    'opacity':                  1,
    'points':                   getPoints(),
    'shadow':                   null,
    'visible':                  true,
    'backgroundColor':          '',
    'clipTo':                   null,
    'fillRule':                 'nonzero',
    'paintFirst':               'fill',
    'globalCompositeOperation': 'source-over',
    'skewX':                    0,
    'skewY':                    0,
    'transformMatrix':          null
  };

  var REFERENCE_EMPTY_OBJECT = {
    'points': [],
    'width': 0,
    'height': 0,
    'top': 0,
    'left': 0
  };

  QUnit.module('fabric.Polygon');

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Polygon);

    var polygon = new fabric.Polygon(getPoints());

    assert.ok(polygon instanceof fabric.Polygon);
    assert.ok(polygon instanceof fabric.Object);

    assert.equal(polygon.type, 'polygon');
    assert.deepEqual(polygon.get('points'), [{ x: 10, y: 12 }, { x: 20, y: 22 }]);
  });

  QUnit.test('complexity', function(assert) {
    var polygon = new fabric.Polygon(getPoints());
    assert.ok(typeof polygon.complexity === 'function');
  });

  QUnit.test('toObject', function(assert) {
    var polygon = new fabric.Polygon(getPoints());
    assert.ok(typeof polygon.toObject === 'function');

    var objectWithOriginalPoints = fabric.util.object.extend(polygon.toObject(), {
      points: getPoints()
    });

    assert.deepEqual(objectWithOriginalPoints, REFERENCE_OBJECT);
  });

  QUnit.test('toSVG', function(assert) {
    var polygon = new fabric.Polygon(getPoints(), { fill: 'red', stroke: 'blue' });
    assert.ok(typeof polygon.toSVG === 'function');
    var EXPECTED_SVG = '<g transform=\"matrix(1 0 0 1 15.5 17.5)\"  >\n<polygon style=\"stroke: rgb(0,0,255); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-rule: nonzero; opacity: 1;\"  points=\"-5,-5 5,5 \" />\n</g>\n';
    assert.deepEqual(polygon.toSVG(), EXPECTED_SVG);
  });

  QUnit.test('fromObject', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.Polygon.fromObject === 'function');
    fabric.Polygon.fromObject(REFERENCE_OBJECT, function(polygon) {
      assert.ok(polygon instanceof fabric.Polygon);
      assert.deepEqual(polygon.toObject(), REFERENCE_OBJECT);
      done();
    });
  });

  QUnit.test('fromElement without points', function(assert) {
    assert.ok(typeof fabric.Polygon.fromElement === 'function');

    var empty_object = fabric.util.object.extend({}, REFERENCE_OBJECT);
    empty_object = fabric.util.object.extend(empty_object, REFERENCE_EMPTY_OBJECT);

    var elPolygonWithoutPoints = fabric.document.createElement('polygon');

    fabric.Polygon.fromElement(elPolygonWithoutPoints, function(polygon) {
      assert.deepEqual(polygon.toObject(), empty_object);
    });
  });

  QUnit.test('fromElement with empty points', function(assert) {
    var elPolygonWithEmptyPoints = fabric.document.createElement('polygon');
    elPolygonWithEmptyPoints.setAttribute('points', '');
    var empty_object = fabric.util.object.extend({}, REFERENCE_OBJECT);
    empty_object = fabric.util.object.extend(empty_object, REFERENCE_EMPTY_OBJECT);
    fabric.Polygon.fromElement(elPolygonWithEmptyPoints, function(polygon) {
      assert.deepEqual(polygon.toObject(), empty_object);
    });
  });

  QUnit.test('fromElement with empty points', function(assert) {
    var elPolygon = fabric.document.createElement('polygon');
    elPolygon.setAttribute('points', '10,12 20,22');
    fabric.Polygon.fromElement(elPolygon, function(polygon) {
      assert.ok(polygon instanceof fabric.Polygon);
      var expected = fabric.util.object.extend(
        fabric.util.object.clone(REFERENCE_OBJECT), {
          points: [{ x: 10, y: 12 }, { x: 20, y: 22 }]
        });
      assert.deepEqual(polygon.toObject(), expected);
    });
  });

  QUnit.test('fromElement with empty points', function(assert) {
    var elPolygonWithAttrs = fabric.document.createElement('polygon');
    elPolygonWithAttrs.setAttribute('points', '10,10 20,20 30,30 10,10');
    elPolygonWithAttrs.setAttribute('fill', 'rgb(255,255,255)');
    elPolygonWithAttrs.setAttribute('opacity', '0.34');
    elPolygonWithAttrs.setAttribute('stroke-width', '3');
    elPolygonWithAttrs.setAttribute('stroke', 'blue');
    elPolygonWithAttrs.setAttribute('transform', 'translate(-10,-20) scale(2)');
    elPolygonWithAttrs.setAttribute('stroke-dasharray', '5, 2');
    elPolygonWithAttrs.setAttribute('stroke-linecap', 'round');
    elPolygonWithAttrs.setAttribute('stroke-linejoin', 'bevil');
    elPolygonWithAttrs.setAttribute('stroke-miterlimit', '5');
    fabric.Polygon.fromElement(elPolygonWithAttrs, function(polygonWithAttrs) {
      var expectedPoints = [
        { x: 10, y: 10 },
        { x: 20, y: 20 },
        { x: 30, y: 30 },
        { x: 10, y: 10 }
      ];
      assert.deepEqual(polygonWithAttrs.toObject(), fabric.util.object.extend(REFERENCE_OBJECT, {
        'width':            20,
        'height':           20,
        'fill':             'rgb(255,255,255)',
        'stroke':           'blue',
        'strokeWidth':      3,
        'strokeDashArray':  [5, 2],
        'strokeLineCap':    'round',
        'strokeLineJoin':   'bevil',
        'strokeMiterLimit': 5,
        'opacity':          0.34,
        'points':           expectedPoints,
        'top':              10,
        'left':             10,
        'transformMatrix':  [2, 0, 0, 2, -10, -20]
      }));
      assert.deepEqual(polygonWithAttrs.get('transformMatrix'), [2, 0, 0, 2, -10, -20]);
    });
  });
  QUnit.test('fromElement with null', function(assert) {
    fabric.Polygon.fromElement(null, function(polygon) {
      assert.equal(polygon, null);
    });
  });
})();
