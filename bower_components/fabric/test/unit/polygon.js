(function() {

  function getPoints() {
    return [
      {x: 10, y: 12},
      {x: 20, y: 22}
    ];
  }

  var REFERENCE_OBJECT = {
    'type':               'polygon',
    'originX':            'left',
    'originY':            'top',
    'left':               0,
    'top':                0,
    'width':              10,
    'height':             10,
    'fill':               'rgb(0,0,0)',
    'stroke':             null,
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
    'points':             getPoints(),
    'shadow':             null,
    'visible':            true,
    'backgroundColor':    '',
    'clipTo':             null
  };

  QUnit.module('fabric.Polygon');

  test('constructor', function() {
    ok(fabric.Polygon);

    var polygon = new fabric.Polygon(getPoints());

    ok(polygon instanceof fabric.Polygon);
    ok(polygon instanceof fabric.Object);

    equal(polygon.type, 'polygon');
    deepEqual(polygon.get('points'), [ { x: -5, y: -5 }, { x: 5, y: 5 } ]);
  });

  test('complexity', function() {
    var polygon = new fabric.Polygon(getPoints());
    ok(typeof polygon.complexity == 'function');
  });

  test('toObject', function() {
    var polygon = new fabric.Polygon(getPoints());
    ok(typeof polygon.toObject == 'function');

    var objectWithOriginalPoints = fabric.util.object.extend(polygon.toObject(), {
      points: getPoints()
    });

    deepEqual(objectWithOriginalPoints, REFERENCE_OBJECT);
  });

  test('fromObject', function() {
    ok(typeof fabric.Polygon.fromObject == 'function');
    var polygon = fabric.Polygon.fromObject(REFERENCE_OBJECT);
    ok(polygon instanceof fabric.Polygon);
    deepEqual(polygon.toObject(), REFERENCE_OBJECT);
  });

  test('fromElement', function() {
    ok(typeof fabric.Polygon.fromElement == 'function');

    var elPolygon = fabric.document.createElement('polygon');

    elPolygon.setAttribute('points', '10,12 20,22');

    var polygon = fabric.Polygon.fromElement(elPolygon);

    ok(polygon instanceof fabric.Polygon);

    var expected = fabric.util.object.extend(
      fabric.util.object.clone(REFERENCE_OBJECT), {
        points: [ { x: 10, y: 12 }, { x: 20, y: 22 } ]
      });

    deepEqual(polygon.toObject(), expected);

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

    var polygonWithAttrs = fabric.Polygon.fromElement(elPolygonWithAttrs);
    var expectedPoints = [
      { x: 10, y: 10 },
      { x: 20, y: 20 },
      { x: 30, y: 30 },
      { x: 10, y: 10 }
    ];

    deepEqual(polygonWithAttrs.toObject(), fabric.util.object.extend(REFERENCE_OBJECT, {
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
      'points':           expectedPoints
    }));

    deepEqual(polygonWithAttrs.get('transformMatrix'), [ 2, 0, 0, 2, -10, -20 ]);

    var elPolygonWithoutPoints = fabric.document.createElement('polygon');

    var error;
    try {
      fabric.Polygon.fromElement(elPolygonWithoutPoints);
    }
    catch(err) {
      error = err;
    }
    ok(error, 'missing points attribute should result in error');

    equal(fabric.Polygon.fromElement(), null);
  });
})();
