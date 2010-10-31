function initAligningGuidelines(canvas) {
  
  var ctx = canvas.getContext(),
      canvasHeight = canvas.getHeight(),
      aligningLineOffset = 5,
      aligningLineMargin = 4,
      aligningLineWidth = 1,
      aligningLineColor = 'rgb(0,255,0)';
  
  function drawVerticalLine(coords) {
    drawLine(
      coords.x + 0.5, 
      coords.y1 > coords.y2 ? coords.y2 : coords.y1, 
      coords.x + 0.5, 
      coords.y2 > coords.y1 ? coords.y2 : coords.y1);
  }
  
  function drawHorizontalLine(coords) {
    drawLine(
      coords.x1 > coords.x2 ? coords.x2 : coords.x1, 
      coords.y + 0.5, 
      coords.x2 > coords.x1 ? coords.x2 : coords.x1, 
      coords.y + 0.5);
  }
  
  function drawLine(x1, y1, x2, y2) {
    ctx.save();
    ctx.lineWidth = aligningLineWidth;
    ctx.strokeStyle = aligningLineColor;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }
  
  function isInRange(value1, value2) {
    for (var i = value1 - aligningLineMargin, len = value1 + aligningLineMargin; i <= len; i++) {
      if (i === value2) {
        return true;
      }
    }
    return false;
  }
  
  canvas.onObjectMove = function(activeObject) {
    
    var canvasObjects = canvas.getObjects(),
        activeObjectLeft = activeObject.get('left'),
        activeObjectTop = activeObject.get('top'),
        activeObjectHeight = activeObject.get('height'),
        activeObjectWidth = activeObject.get('width'),
        verticalLines = [ ],
        horizontalLines = [ ];
    
    for (var i = canvasObjects.length; i--; ) {
      
      if (canvasObjects[i] === activeObject) continue;
      
      var objectLeft = canvasObjects[i].get('left'),
          objectTop = canvasObjects[i].get('top'),
          objectHeight = canvasObjects[i].getHeight(),
          objectWidth = canvasObjects[i].getWidth();
      
      if (isInRange(objectLeft, activeObjectLeft)) {
        verticalLines.push({ 
          x: objectLeft, 
          y1: (objectTop < activeObjectTop) 
            ? (objectTop - objectHeight / 2 - aligningLineOffset) 
            : (objectTop + objectHeight / 2 + aligningLineOffset), 
          y2: (activeObjectTop > objectTop) 
            ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset) 
            : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset) 
        });
        activeObject.set('left', objectLeft);
      }
      
      if (isInRange(objectTop, activeObjectTop)) {
        horizontalLines.push({
          y: objectTop, 
          x1: (objectLeft < activeObjectLeft) 
            ? (objectLeft - objectWidth / 2 - aligningLineOffset) 
            : (objectLeft + objectWidth / 2 + aligningLineOffset), 
          x2: (activeObjectLeft > objectLeft) 
            ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset) 
            : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
        });
        activeObject.set('top', objectTop);
      }
    }
    
    canvas.afterRender = function() {
      for (var i = verticalLines.length; i--; ) {
        drawVerticalLine(verticalLines[i]);
      }
      for (var i = horizontalLines.length; i--; ) {
        drawHorizontalLine(horizontalLines[i]);
      }
    };
  };
  
  
}