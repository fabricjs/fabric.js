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
    'left':                     9.5,
    'top':                      11.5,
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
    var EXPECTED_SVG = '<g transform=\"matrix(1 0 0 1 15 17)\"  >\n<polygon style=\"stroke: rgb(0,0,255); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-rule: nonzero; opacity: 1;\"  points=\"-5,-5 5,5 \" />\n</g>\n';
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

    var elPolygonWithoutPoints = fabric.document.createElementNS('http://www.w3.org/2000/svg', 'polygon');

    fabric.Polygon.fromElement(elPolygonWithoutPoints, function(polygon) {
      assert.deepEqual(polygon.toObject(), empty_object);
    });
  });

  QUnit.test('fromElement with empty points', function(assert) {
    var namespace = 'http://www.w3.org/2000/svg';
    var elPolygonWithEmptyPoints = fabric.document.createElementNS(namespace, 'polygon');
    elPolygonWithEmptyPoints.setAttributeNS(namespace, 'points', '');
    var empty_object = fabric.util.object.extend({}, REFERENCE_OBJECT);
    empty_object = fabric.util.object.extend(empty_object, REFERENCE_EMPTY_OBJECT);
    fabric.Polygon.fromElement(elPolygonWithEmptyPoints, function(polygon) {
      assert.deepEqual(polygon.toObject(), empty_object);
    });
  });

  QUnit.test('fromElement with points', function(assert) {
    var namespace = 'http://www.w3.org/2000/svg';
    var elPolygon = fabric.document.createElementNS(namespace, 'polygon');
    elPolygon.setAttributeNS(namespace, 'points', '10,12 20,22');
    fabric.Polygon.fromElement(elPolygon, function(polygon) {
      assert.ok(polygon instanceof fabric.Polygon);
      var expected = fabric.util.object.extend(
        fabric.util.object.clone(REFERENCE_OBJECT), {
          points: [{ x: 10, y: 12 }, { x: 20, y: 22 }],
          left: 10,
          top: 12
        });
      assert.deepEqual(polygon.toObject(), expected);
    });
  });

  QUnit.test('fromElement with points and custom attributes', function(assert) {
    var namespace = 'http://www.w3.org/2000/svg';
    var elPolygonWithAttrs = fabric.document.createElementNS(namespace, 'polygon');
    elPolygonWithAttrs.setAttributeNS(namespace, 'points', '10,10 20,20 30,30 10,10');
    elPolygonWithAttrs.setAttributeNS(namespace, 'fill', 'rgb(255,255,255)');
    elPolygonWithAttrs.setAttributeNS(namespace, 'opacity', '0.34');
    elPolygonWithAttrs.setAttributeNS(namespace, 'stroke-width', '3');
    elPolygonWithAttrs.setAttributeNS(namespace, 'stroke', 'blue');
    elPolygonWithAttrs.setAttributeNS(namespace, 'transform', 'translate(-10,-20) scale(2)');
    elPolygonWithAttrs.setAttributeNS(namespace, 'stroke-dasharray', '5, 2');
    elPolygonWithAttrs.setAttributeNS(namespace, 'stroke-linecap', 'round');
    elPolygonWithAttrs.setAttributeNS(namespace, 'stroke-linejoin', 'bevil');
    elPolygonWithAttrs.setAttributeNS(namespace, 'stroke-miterlimit', '5');
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
