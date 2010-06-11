function init() {
  
  var REFERENCE_RECT = {
    'type': 'rect', 
    'left': 0, 
    'top': 0, 
    'width': 100, 
    'height': 100, 
    'fill': 'rgb(0,0,0)',
    'overlayFill': null,
    'stroke': null, 
    'strokeWidth': 1, 
    'scaleX': 1, 
    'scaleY': 1, 
    'angle': 0, 
    'flipX': false, 
    'flipY': false, 
    'opacity': 1
  };
  
  new Test.Unit.Runner({
    testConstructor: function() {
      
      this.assert(Canvas.Rect);
      
      var rect = new Canvas.Rect();
      
      this.assertInstanceOf(Canvas.Rect, rect);
      this.assertInstanceOf(Canvas.Object, rect);
      
      this.assertIdentical('rect', rect.get('type'));
    },
    testComplexity: function() {
      var rect = new Canvas.Rect();
      this.assertRespondsTo('complexity', rect);
    },
    testToObject: function() {
      var rect = new Canvas.Rect();
      this.assertRespondsTo('toObject', rect);
      
      var object = rect.toObject();
      this.assertObjectIdentical(REFERENCE_RECT, object);
    },
    testCanvasRectFromObject: function() {
      this.assertRespondsTo('fromObject', Canvas.Rect);
      var rect = Canvas.Rect.fromObject(REFERENCE_RECT);
      this.assertInstanceOf(Canvas.Rect, rect);
      this.assertObjectIdentical(REFERENCE_RECT, rect.toObject());
    },
    testCanvasRectFromElement: function() {
      this.assertRespondsTo('fromElement', Canvas.Rect);
      
      var elRect = document.createElement('rect');
      var rect = Canvas.Rect.fromElement(elRect);
      
      this.assertInstanceOf(Canvas.Rect, rect);
      this.assertObjectIdentical(REFERENCE_RECT, rect.toObject());
      
      var elRectWithAttrs = document.createElement('rect');
      elRectWithAttrs.setAttribute('x', 10);
      elRectWithAttrs.setAttribute('y', 20);
      elRectWithAttrs.setAttribute('width', 222);
      elRectWithAttrs.setAttribute('height', 333);
      elRectWithAttrs.setAttribute('rx', 11);
      elRectWithAttrs.setAttribute('ry', 12);
      elRectWithAttrs.setAttribute('fill', 'rgb(255,255,255)');
      elRectWithAttrs.setAttribute('fill-opacity', 0.45);
      elRectWithAttrs.setAttribute('stroke', 'blue');
      elRectWithAttrs.setAttribute('stroke-width', 3);
      //elRectWithAttrs.setAttribute('transform', 'translate(-10,-20) scale(2) rotate(45) translate(5,10)');
      
      var rectWithAttrs = Canvas.Rect.fromElement(elRectWithAttrs);
      this.assertInstanceOf(Canvas.Rect, rectWithAttrs);
      
      var expectedObject = Object.extend(REFERENCE_RECT, {
        left: 121,
        top: 186.5,
        width: 222,
        height: 333,
        fill: 'rgb(255,255,255)',
        opacity: 0.45,
        stroke: 'blue',
        strokeWidth: 3
      });
      this.assertObjectIdentical(expectedObject, rectWithAttrs.toObject());
      
      this.assertNull(Canvas.Rect.fromElement());
    }
  });
}