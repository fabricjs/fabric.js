function init() {
  
  function getPoints() {
    return [
      {x: 10, y: 12},
      {x: 20, y: 22}
    ];
  }
  
  var REFERENCE_OBJECT = {
    'type':         'polygon', 
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
      this.assert(Canvas.Polygon);
      
      var polygon = new Canvas.Polygon(getPoints());
      
      this.assertInstanceOf(Canvas.Polygon, polygon);
      this.assertInstanceOf(Canvas.Object, polygon);
      
      this.assertIdentical('polygon', polygon.type);
      this.assertObjectIdentical(getPoints(), polygon.get('points'));
    },
    testComplexity: function() {
      var polygon = new Canvas.Polygon(getPoints());
      this.assertRespondsTo('complexity', polygon);
    },
    testToObject: function() {
      var polygon = new Canvas.Polygon(getPoints());
      this.assertRespondsTo('toObject', polygon);
      
      this.assertObjectIdentical(REFERENCE_OBJECT, polygon.toObject());
    },
    testCanvasPolygonFromObject: function() {
      this.assertRespondsTo('fromObject', Canvas.Polygon);
      var polygon = Canvas.Polygon.fromObject(REFERENCE_OBJECT);
      this.assertInstanceOf(Canvas.Polygon, polygon);
      this.assertObjectIdentical(REFERENCE_OBJECT, polygon.toObject());
    },
    testCanvasPolygonFromElement: function() {
      this.assertRespondsTo('fromElement', Canvas.Polygon);
      
      var elPolygon = document.createElement('polygon');
      
      elPolygon.setAttribute('points', '10,12 20,22');
      
      var polygon = Canvas.Polygon.fromElement(elPolygon);
      
      this.assertInstanceOf(Canvas.Polygon, polygon);
      this.assertObjectIdentical(REFERENCE_OBJECT, polygon.toObject());
      
      var elPolygonWithAttrs = document.createElement('polygon');
      elPolygonWithAttrs.setAttribute('points', '10,10 20,20 30,30 10,10');
      elPolygonWithAttrs.setAttribute('fill', 'rgb(255,255,255)');
      elPolygonWithAttrs.setAttribute('fill-opacity', '0.34');
      elPolygonWithAttrs.setAttribute('stroke-width', '3');
      elPolygonWithAttrs.setAttribute('stroke', 'blue');
      elPolygonWithAttrs.setAttribute('transform', 'translate(-10,-20) scale(2)');
      
      var polygonWithAttrs = Canvas.Polygon.fromElement(elPolygonWithAttrs);
      var expectedPoints = [{x: 10, y: 10}, {x: 20, y: 20}, {x: 30, y: 30}, {x: 10, y: 10}];
      
      this.assertObjectIdentical(Object.extend(REFERENCE_OBJECT, {
        'width': 20, 
        'height': 20, 
        'fill': 'rgb(255,255,255)', 
        'stroke': 'blue', 
        'strokeWidth': 3, 
        'opacity': 0.34,
        'points': expectedPoints
      }), polygonWithAttrs.toObject());
      
      this.assertEnumEqual([ 2, 0, 0, 2, -10, -20 ], polygonWithAttrs.get('transformMatrix'));
      
      var elPolygonWithoutPoints = document.createElement('polygon');
      
      this.assertRaise('TypeError', function(){
        Canvas.Polygon.fromElement(elPolygonWithoutPoints);
      }, 'missing points attribute should result in error');
      
      this.assertNull(Canvas.Polygon.fromElement());
    }
  });
}