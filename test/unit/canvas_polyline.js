function init() {
  
  function getPoints() {
    return [
      {x: 10, y: 12},
      {x: 20, y: 22}
    ];
  }
  
  var REFERENCE_OBJECT = {
    'type':         'polyline', 
    'left':         0, 
    'top':          0, 
    'width':        10, 
    'height':       10, 
    'fill':         'rgb(0,0,0)', 
    'overlayFill':  null,
    'stroke':       null, 
    'strokeWidth':  1, 
    'scaleX':       1, 
    'scaleY':       1, 
    'angle':        0, 
    'flipX':        false, 
    'flipY':        false, 
    'opacity':      1, 
    'points':       getPoints()
  };
  
  new Test.Unit.Runner({
    testConstructor: function() {
      this.assert(Canvas.Polyline);
      
      var polyline = new Canvas.Polyline(getPoints());
      
      this.assertInstanceOf(Canvas.Polyline, polyline);
      this.assertInstanceOf(Canvas.Object, polyline);
      
      this.assertIdentical('polyline', polyline.type);
      this.assertObjectIdentical(getPoints(), polyline.get('points'));
    },
    testComplexity: function() {
      var polyline = new Canvas.Polyline(getPoints());
      this.assertRespondsTo('complexity', polyline);
    },
    testToObject: function() {
      var polyline = new Canvas.Polyline(getPoints());
      this.assertRespondsTo('toObject', polyline);
      
      this.assertObjectIdentical(REFERENCE_OBJECT, polyline.toObject());
    },
    testCanvasPolylineFromObject: function() {
      this.assertRespondsTo('fromObject', Canvas.Polyline);
      var polyline = Canvas.Polyline.fromObject(REFERENCE_OBJECT);
      this.assertInstanceOf(Canvas.Polyline, polyline);
      this.assertObjectIdentical(REFERENCE_OBJECT, polyline.toObject());
    },
    testCanvasPolylineFromElement: function() {
      this.assertRespondsTo('fromElement', Canvas.Polyline);
      
      var elPolyline = document.createElement('polyline');
      
      elPolyline.setAttribute('points', '10,12 20,22');
      
      var polyline = Canvas.Polyline.fromElement(elPolyline);
      
      this.assertInstanceOf(Canvas.Polyline, polyline);
      this.assertObjectIdentical(REFERENCE_OBJECT, polyline.toObject());
      
      var elPolylineWithAttrs = document.createElement('polyline');
      elPolylineWithAttrs.setAttribute('points', '10,10 20,20 30,30 10,10');
      elPolylineWithAttrs.setAttribute('fill', 'rgb(255,255,255)');
      elPolylineWithAttrs.setAttribute('fill-opacity', '0.34');
      elPolylineWithAttrs.setAttribute('stroke-width', '3');
      elPolylineWithAttrs.setAttribute('stroke', 'blue');
      elPolylineWithAttrs.setAttribute('transform', 'translate(-10,-20) scale(2)');
      
      var polylineWithAttrs = Canvas.Polyline.fromElement(elPolylineWithAttrs);
      var expectedPoints = [{x: 10, y: 10}, {x: 20, y: 20}, {x: 30, y: 30}, {x: 10, y: 10}];
      
      this.assertObjectIdentical(Object.extend(REFERENCE_OBJECT, {
        'width': 20, 
        'height': 20, 
        'fill': 'rgb(255,255,255)', 
        'stroke': 'blue', 
        'strokeWidth': 3, 
        'opacity': 0.34,
        'points': expectedPoints
      }), polylineWithAttrs.toObject());
      
      this.assertEnumEqual([ 2, 0, 0, 2, -10, -20 ], polylineWithAttrs.get('transformMatrix'));
      
      var elPolylineWithoutPoints = document.createElement('polyline');
      
      this.assertRaise('TypeError', function(){
        Canvas.Polyline.fromElement(elPolylineWithoutPoints);
      }, 'missing points attribute should result in error');
      
      this.assertNull(Canvas.Polyline.fromElement());
    }
  });
}