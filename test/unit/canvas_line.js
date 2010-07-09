(function(){
  
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
  
  module('fabric.Line');
  
  test('constructor', function() {
    ok(fabric.Line);
    var line = new fabric.Line([10, 11, 20, 21]);
    
    ok(line instanceof fabric.Line);
    ok(line instanceof fabric.Object);
    
    equals(line.type, 'line');
    
    equals(line.get('x1'), 10);
    equals(line.get('y1'), 11);
    equals(line.get('x2'), 20);
    equals(line.get('y2'), 21);
    
    var lineWithoutPoints = new fabric.Line();
    
    equals(lineWithoutPoints.get('x1'), 0);
    equals(lineWithoutPoints.get('y1'), 0);
    equals(lineWithoutPoints.get('x2'), 0);
    equals(lineWithoutPoints.get('y2'), 0);
  });
  
  test('complexity', function() {
    var line = new fabric.Line();
    ok(typeof line.complexity == 'function');
  });
  
  test('toObject', function() {
    var line = new fabric.Line([11, 12, 13, 14]);
    ok(typeof line.toObject == 'function');
    same(LINE_OBJECT, line.toObject());
  });
  
  test('fromObject', function() {
    ok(typeof fabric.Line.fromObject == 'function');
    var line = fabric.Line.fromObject(LINE_OBJECT);
    ok(line instanceof fabric.Line);
    same(LINE_OBJECT, line.toObject());
  });
  
  test('fromElement', function() {
    ok(typeof fabric.Line.fromElement == 'function');
    
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
    
    var oLine = fabric.Line.fromElement(lineEl);
    ok(oLine instanceof fabric.Line);
    
    equals(oLine.get('x1'), x1);
    equals(oLine.get('y1'), y1);
    equals(oLine.get('x2'), x2);
    equals(oLine.get('y2'), y2);
    equals(oLine.get('stroke'), stroke);
    equals(oLine.get('strokeWidth'), strokeWidth);
    
    var lineElWithMissingAttributes = document.createElement('line');
    lineElWithMissingAttributes.setAttribute('x1', 10);
    lineElWithMissingAttributes.setAttribute('y1', 20);
    
    oLine = fabric.Line.fromElement(lineElWithMissingAttributes);
    
    equals(oLine.get('x2'), 0, 'missing attributes count as 0 values');
    equals(oLine.get('y2'), 0, 'missing attributes count as 0 values');
  });
})();