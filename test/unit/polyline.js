(function() {

  function getPoints() {
    return [
      {x: 10, y: 12},
      {x: 20, y: 22}
    ];
  }

  var REFERENCE_OBJECT = {
    'type':                     'polyline',
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
    'strokeLineJoin':           'miter',
    'strokeMiterLimit':         10,
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

  QUnit.module('fabric.Polyline');

  test('constructor', function() {
    ok(fabric.Polyline);

    var polyline = new fabric.Polyline(getPoints());

    ok(polyline instanceof fabric.Polyline);
    ok(polyline instanceof fabric.Object);

    equal(polyline.type, 'polyline');
    deepEqual(polyline.get('points'), [ { x: 10, y: 12 }, { x: 20, y: 22 } ]);
  });

  test('complexity', function() {
    var polyline = new fabric.Polyline(getPoints());
    ok(typeof polyline.complexity == 'function');
  });

  test('toObject', function() {
    var polyline = new fabric.Polyline(getPoints());
    ok(typeof polyline.toObject == 'function');
    var objectWithOriginalPoints = fabric.util.object.extend(polyline.toObject(), {
      points: getPoints()
    });

    deepEqual(objectWithOriginalPoints, REFERENCE_OBJECT);
  });

  test('fromObject', function() {
    ok(typeof fabric.Polyline.fromObject == 'function');
    var polyline = fabric.Polyline.fromObject(REFERENCE_OBJECT);
    ok(polyline instanceof fabric.Polyline);
    deepEqual(polyline.toObject(), REFERENCE_OBJECT);
  });

  test('fromElement', function() {
    ok(typeof fabric.Polyline.fromElement == 'function');

    var elPolylineWithoutPoints = fabric.document.createElement('polyline');
    var empty_object = fabric.util.object.extend({}, REFERENCE_OBJECT);
    empty_object = fabric.util.object.extend(empty_object, REFERENCE_EMPTY_OBJECT);

    deepEqual(fabric.Polyline.fromElement(elPolylineWithoutPoints).toObject(), empty_object);

    var elPolylineWithEmptyPoints = fabric.document.createElement('polyline');
    elPolylineWithEmptyPoints.setAttribute('points', '');

    deepEqual(fabric.Polyline.fromElement(elPolylineWithEmptyPoints).toObject(), empty_object);

    var elPolyline = fabric.document.createElement('polyline');

    elPolyline.setAttribute('points', '10,12 20,22');

    var polyline = fabric.Polyline.fromElement(elPolyline);
    ok(polyline instanceof fabric.Polyline);

    deepEqual(polyline.toObject(), REFERENCE_OBJECT);

    var elPolylineWithAttrs = fabric.document.createElement('polyline');
    elPolylineWithAttrs.setAttribute('points', '10,10 20,20 30,30 10,10');
    elPolylineWithAttrs.setAttribute('fill', 'rgb(255,255,255)');
    elPolylineWithAttrs.setAttribute('opacity', '0.34');
    elPolylineWithAttrs.setAttribute('stroke-width', '3');
    elPolylineWithAttrs.setAttribute('stroke', 'blue');
    elPolylineWithAttrs.setAttribute('transform', 'translate(-10,-20) scale(2)');
    elPolylineWithAttrs.setAttribute('stroke-dasharray', '5, 2');
    elPolylineWithAttrs.setAttribute('stroke-linecap', 'round');
    elPolylineWithAttrs.setAttribute('stroke-linejoin', 'bevil');
    elPolylineWithAttrs.setAttribute('stroke-miterlimit', '5');

    var polylineWithAttrs = fabric.Polyline.fromElement(elPolylineWithAttrs);

    var expectedPoints = [{x: 10, y: 10}, {x: 20, y: 20}, {x: 30, y: 30}, {x: 10, y: 10}];

    deepEqual(polylineWithAttrs.toObject(), fabric.util.object.extend(REFERENCE_OBJECT, {
      'width': 20,
      'height': 20,
      'fill': 'rgb(255,255,255)',
      'stroke': 'blue',
      'strokeWidth': 3,
      'strokeDashArray': [5, 2],
      'strokeLineCap': 'round',
      'strokeLineJoin': 'bevil',
      'strokeMiterLimit': 5,
      'opacity': 0.34,
      'points': expectedPoints,
      'left': 10,
      'top': 10,
      'transformMatrix' : [ 2, 0, 0, 2, -10, -20 ]
    }));

    deepEqual(polylineWithAttrs.get('transformMatrix'), [ 2, 0, 0, 2, -10, -20 ]);

    equal(fabric.Polyline.fromElement(), null);    
  });
})();
