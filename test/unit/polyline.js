(function() {

  function getPoints() {
    return [
      {x: 10, y: 12},
      {x: 20, y: 22}
    ];
  }

  var REFERENCE_OBJECT = {
    'type':         'polyline',
    'originX':      'center',
    'originY':      'center',
    'left':         0,
    'top':          0,
    'width':        10,
    'height':       10,
    'fill':         'rgb(0,0,0)',
    'overlayFill':  null,
    'stroke':       null,
    'strokeWidth':  1,
    'strokeDashArray': null,
    'scaleX':       1,
    'scaleY':       1,
    'angle':        0,
    'flipX':        false,
    'flipY':        false,
    'opacity':      1,
    'points':       getPoints(),
    'selectable':   true,
    'hasControls':  true,
    'hasBorders':   true,
    'hasRotatingPoint': true,
    'transparentCorners': true,
    'perPixelTargetFind': false,
    'shadow': null,
    'visible': true
  };

  QUnit.module('fabric.Polyline');

  test('constructor', function() {
    ok(fabric.Polyline);

    var polyline = new fabric.Polyline(getPoints());

    ok(polyline instanceof fabric.Polyline);
    ok(polyline instanceof fabric.Object);

    equal(polyline.type, 'polyline');
    deepEqual(polyline.get('points'), [ { x: 5, y: 7 }, { x: 15, y: 17 } ]);
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

    var elPolyline = fabric.document.createElement('polyline');

    elPolyline.setAttribute('points', '10,12 20,22');

    //var polyline = fabric.Polyline.fromElement(elPolyline);

    //ok(polyline instanceof fabric.Polyline);
    //deepEqual(REFERENCE_OBJECT, polyline.toObject());

    var elPolylineWithAttrs = fabric.document.createElement('polyline');
    elPolylineWithAttrs.setAttribute('points', '10,10 20,20 30,30 10,10');
    elPolylineWithAttrs.setAttribute('fill', 'rgb(255,255,255)');
    elPolylineWithAttrs.setAttribute('fill-opacity', '0.34');
    elPolylineWithAttrs.setAttribute('stroke-width', '3');
    elPolylineWithAttrs.setAttribute('stroke', 'blue');
    elPolylineWithAttrs.setAttribute('transform', 'translate(-10,-20) scale(2)');

    var polylineWithAttrs = fabric.Polyline.fromElement(elPolylineWithAttrs);

    //var expectedPoints = [{x: 10, y: 10}, {x: 20, y: 20}, {x: 30, y: 30}, {x: 10, y: 10}];
    /*
    deepEqual(fabric.util.object.extend(REFERENCE_OBJECT, {
      'width': 20,
      'height': 20,
      'fill': 'rgb(255,255,255)',
      'stroke': 'blue',
      'strokeWidth': 3,
      'opacity': 0.34,
      'points': expectedPoints
    }), polylineWithAttrs.toObject());

    deepEqual([ 2, 0, 0, 2, -10, -20 ], polylineWithAttrs.get('transformMatrix'));

    var elPolylineWithoutPoints = fabric.document.createElement('polyline');
    /*
    this.assertRaise('TypeError', function(){
      fabric.Polyline.fromElement(elPolylineWithoutPoints);
    }, 'missing points attribute should result in error');

    equal(fabric.Polyline.fromElement(), null);
    */
  });
})();