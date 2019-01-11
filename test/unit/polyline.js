(function() {

  function getPoints() {
    return [
      {x: 10, y: 12},
      {x: 20, y: 22}
    ];
  }

  var REFERENCE_OBJECT = {
    'version':                  fabric.version,
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

  QUnit.module('fabric.Polyline');

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Polyline);

    var polyline = new fabric.Polyline(getPoints());

    assert.ok(polyline instanceof fabric.Polyline);
    assert.ok(polyline instanceof fabric.Object);

    assert.equal(polyline.type, 'polyline');
    assert.deepEqual(polyline.get('points'), [{ x: 10, y: 12 }, { x: 20, y: 22 }]);
  });

  QUnit.test('complexity', function(assert) {
    var polyline = new fabric.Polyline(getPoints());
    assert.ok(typeof polyline.complexity === 'function');
  });

  QUnit.test('toObject', function(assert) {
    var polyline = new fabric.Polyline(getPoints());
    assert.ok(typeof polyline.toObject === 'function');
    var objectWithOriginalPoints = fabric.util.object.extend(polyline.toObject(), {
      points: getPoints()
    });

    assert.deepEqual(objectWithOriginalPoints, REFERENCE_OBJECT);
  });

  QUnit.test('toSVG', function(assert) {
    var polyline = new fabric.Polygon(getPoints(), { fill: 'red', stroke: 'blue' });
    assert.ok(typeof polyline.toSVG === 'function');
    var EXPECTED_SVG = '<g transform=\"matrix(1 0 0 1 15.5 17.5)\"  >\n<polygon style=\"stroke: rgb(0,0,255); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-rule: nonzero; opacity: 1;\"  points=\"-5,-5 5,5 \" />\n</g>\n';
    assert.deepEqual(polyline.toSVG(), EXPECTED_SVG);
  });

  QUnit.test('fromObject', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.Polyline.fromObject === 'function');
    fabric.Polyline.fromObject(REFERENCE_OBJECT, function(polyline) {
      assert.ok(polyline instanceof fabric.Polyline);
      assert.deepEqual(polyline.toObject(), REFERENCE_OBJECT);
      done();
    });
  });

  QUnit.test('fromElement without points', function(assert) {
    assert.ok(typeof fabric.Polyline.fromElement === 'function');
    var elPolylineWithoutPoints = fabric.document.createElement('polyline');
    var empty_object = fabric.util.object.extend({}, REFERENCE_OBJECT);
    empty_object = fabric.util.object.extend(empty_object, REFERENCE_EMPTY_OBJECT);
    fabric.Polyline.fromElement(elPolylineWithoutPoints, function(polyline) {
      assert.deepEqual(polyline.toObject(), empty_object);
    });
  });

  QUnit.test('fromElement with empty points', function(assert) {
    var elPolylineWithEmptyPoints = fabric.document.createElement('polyline');
    elPolylineWithEmptyPoints.setAttribute('points', '');
    fabric.Polyline.fromElement(elPolylineWithEmptyPoints, function(polyline) {
      var empty_object = fabric.util.object.extend({}, REFERENCE_OBJECT);
      empty_object = fabric.util.object.extend(empty_object, REFERENCE_EMPTY_OBJECT);
      assert.deepEqual(polyline.toObject(), empty_object);
    });
  });

  QUnit.test('fromElement', function(assert) {
    var elPolyline = fabric.document.createElement('polyline');
    elPolyline.setAttribute('points', '10,12 20,22');
    fabric.Polyline.fromElement(elPolyline, function(polyline) {
      assert.ok(polyline instanceof fabric.Polyline);
      assert.deepEqual(polyline.toObject(), REFERENCE_OBJECT);
    });
  });

  QUnit.test('fromElement with custom attr', function(assert) {
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

    fabric.Polyline.fromElement(elPolylineWithAttrs, function(polylineWithAttrs) {
      var expectedPoints = [{x: 10, y: 10}, {x: 20, y: 20}, {x: 30, y: 30}, {x: 10, y: 10}];
      assert.deepEqual(polylineWithAttrs.toObject(), fabric.util.object.extend(REFERENCE_OBJECT, {
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
        'transformMatrix': [2, 0, 0, 2, -10, -20]
      }));
      assert.deepEqual(polylineWithAttrs.get('transformMatrix'), [2, 0, 0, 2, -10, -20]);
    });
  });

  QUnit.test('fromElement with nothing', function(assert) {
    fabric.Polyline.fromElement(null, function(polyline) {
      assert.equal(polyline, null);
    });
  });
})();
