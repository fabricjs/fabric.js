function init(){
  
  var LINE_OBJECT = {
    'type': 'line', 
    'left': 12, 
    'top': 13, 
    'width': 2, 
    'height': 2, 
    'fill': 'rgb(0,0,0)',
    'overlayFill': null,
    'stroke': null, 
    'strokeWidth': 1, 
    'scaleX': 1, 
    'scaleY': 1, 
    'angle': 0, 
    'flipX': false, 
    'flipY': false, 
    'opacity': 1, 
    'x1': 11, 
    'y1': 12, 
    'x2': 13, 
    'y2': 14
  };
  
  new Test.Unit.Runner({
    testConstructor: function() {
      
      this.assert(Canvas.Line);
      var line = new Canvas.Line([10, 11, 20, 21]);
      
      this.assertInstanceOf(Canvas.Line, line);
      this.assertInstanceOf(Canvas.Object, line);
      
      this.assertIdentical('line', line.type);
      
      this.assertIdentical(10, line.get('x1'));
      this.assertIdentical(11, line.get('y1'));
      this.assertIdentical(20, line.get('x2'));
      this.assertIdentical(21, line.get('y2'));
      
      var lineWithoutPoints = new Canvas.Line();
      
      this.assertIdentical(0, lineWithoutPoints.get('x1'));
      this.assertIdentical(0, lineWithoutPoints.get('y1'));
      this.assertIdentical(0, lineWithoutPoints.get('x2'));
      this.assertIdentical(0, lineWithoutPoints.get('y2'));
    },
    testComplexity: function() {
      var line = new Canvas.Line();
      this.assertRespondsTo('complexity', line);
    },
    testToObject: function() {
      var line = new Canvas.Line([11, 12, 13, 14]);
      this.assertRespondsTo('toObject', line);
      this.assertHashEqual(LINE_OBJECT, line.toObject());
    },
    testCanvasLineFromObject: function() {
      this.assertRespondsTo('fromObject', Canvas.Line);
      var line = Canvas.Line.fromObject(LINE_OBJECT);
      this.assertInstanceOf(Canvas.Line, line);
      this.assertHashEqual(LINE_OBJECT, line.toObject());
    },
    testCanvasLineFromElement: function() {
      
      this.assertRespondsTo('fromElement', Canvas.Line);
      
      var lineEl        = document.createElement('line'),
          x1            = 11,
          y1            = 23,
          x2            = 34,
          y2            = 7,
          stroke        = 'ff5555',
          strokeWidth   = 2;
          
      lineEl.setAttribute('x1', x1);
      lineEl.setAttribute('x2', x2);
      lineEl.setAttribute('y1', y1);
      lineEl.setAttribute('y2', y2);
      lineEl.setAttribute('stroke', stroke);
      lineEl.setAttribute('stroke-width', strokeWidth);
      
      var oLine = Canvas.Line.fromElement(lineEl);
      this.assertInstanceOf(Canvas.Line, oLine);
      
      this.assertIdentical(x1, oLine.get('x1'));
      this.assertIdentical(y1, oLine.get('y1'));
      this.assertIdentical(x2, oLine.get('x2'));
      this.assertIdentical(y2, oLine.get('y2'));
      this.assertIdentical(stroke, oLine.get('stroke'));
      this.assertIdentical(strokeWidth, oLine.get('strokeWidth'));
      
      var lineElWithMissingAttributes = document.createElement('line');
      lineElWithMissingAttributes.setAttribute('x1', 10);
      lineElWithMissingAttributes.setAttribute('y1', 20);
      
      oLine = Canvas.Line.fromElement(lineElWithMissingAttributes);
      
      this.assertIdentical(0, oLine.get('x2'), 'missing attributes count as 0 values');
      this.assertIdentical(0, oLine.get('y2'), 'missing attributes count as 0 values');
    }
  });
}