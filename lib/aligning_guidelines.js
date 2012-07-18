/**
 * Should objects by aligned by a bounding box?
 * [Bug] Scaled objects sometimes can not be aligned by edges
 *
 */
function initAligningGuidelines(canvas) {

  var ctx = canvas.getSelectionContext(),
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
    value1 = Math.round(value1);
    value2 = Math.round(value2);
    for (var i = value1 - aligningLineMargin, len = value1 + aligningLineMargin; i <= len; i++) {
      if (i === value2) {
        return true;
      }
    }
    return false;
  }

  var verticalLines = [ ],
      horizontalLines = [ ];

  canvas.on('object:moving', function(e) {

    var activeObject = e.target,
        canvasObjects = canvas.getObjects(),
        activeObjectLeft = activeObject.get('left'),
        activeObjectTop = activeObject.get('top'),
        activeObjectHeight = activeObject.getHeight(),
        activeObjectWidth = activeObject.getWidth(),
        noneInTheRange = true;

    // It should be trivial to DRY this up by encapsulating (repeating) creation of x1, x2, y1, and y2 into functions,
    // but we're not doing it here for perf. reasons -- as this a function that's invoked on every mouse move

    for (var i = canvasObjects.length; i--; ) {

      if (canvasObjects[i] === activeObject) continue;

      var objectLeft = canvasObjects[i].get('left'),
          objectTop = canvasObjects[i].get('top'),
          objectHeight = canvasObjects[i].getHeight(),
          objectWidth = canvasObjects[i].getWidth();

      // snap by the horizontal center line
      if (isInRange(objectLeft, activeObjectLeft)) {
        noneInTheRange = false;
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

      // snap by the left edge
      if (isInRange(objectLeft - objectWidth / 2, activeObjectLeft - activeObjectWidth / 2)) {
        noneInTheRange = false;
        verticalLines.push({
          x: objectLeft - objectWidth / 2,
          y1: (objectTop < activeObjectTop)
            ? (objectTop - objectHeight / 2 - aligningLineOffset)
            : (objectTop + objectHeight / 2 + aligningLineOffset),
          y2: (activeObjectTop > objectTop)
            ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
            : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
        });
        activeObject.set('left', objectLeft - objectWidth / 2 + activeObjectWidth / 2);
      }

      // snap by the right edge
      if (isInRange(objectLeft + objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
        noneInTheRange = false;
        verticalLines.push({
          x: objectLeft + objectWidth / 2,
          y1: (objectTop < activeObjectTop)
            ? (objectTop - objectHeight / 2 - aligningLineOffset)
            : (objectTop + objectHeight / 2 + aligningLineOffset),
          y2: (activeObjectTop > objectTop)
            ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
            : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
        });
        activeObject.set('left', objectLeft + objectWidth / 2 - activeObjectWidth / 2);
      }

      // snap by the vertical center line
      if (isInRange(objectTop, activeObjectTop)) {
        noneInTheRange = false;
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

      // snap by the top edge
      if (isInRange(objectTop - objectHeight / 2, activeObjectTop - activeObjectHeight / 2)) {
        noneInTheRange = false;
        horizontalLines.push({
          y: objectTop - objectHeight / 2,
          x1: (objectLeft < activeObjectLeft)
            ? (objectLeft - objectWidth / 2 - aligningLineOffset)
            : (objectLeft + objectWidth / 2 + aligningLineOffset),
          x2: (activeObjectLeft > objectLeft)
            ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
            : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
        });
        activeObject.set('top', objectTop - objectHeight / 2 + activeObjectHeight / 2);
      }

      // snap by the bottom edge
      if (isInRange(objectTop + objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
        noneInTheRange = false;
        horizontalLines.push({
          y: objectTop + objectHeight / 2,
          x1: (objectLeft < activeObjectLeft)
            ? (objectLeft - objectWidth / 2 - aligningLineOffset)
            : (objectLeft + objectWidth / 2 + aligningLineOffset),
          x2: (activeObjectLeft > objectLeft)
            ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
            : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
        });
        activeObject.set('top', objectTop + objectHeight / 2 - activeObjectHeight / 2);
      }
    }

    if (noneInTheRange) {
      verticalLines.length = horizontalLines.length = 0;
    }
  });

  canvas.on('after:render', function() {
    for (var i = verticalLines.length; i--; ) {
      drawVerticalLine(verticalLines[i]);
    }
    for (var i = horizontalLines.length; i--; ) {
      drawHorizontalLine(horizontalLines[i]);
    }
  });

  canvas.on('mouse:up', function() {
    verticalLines.length = horizontalLines.length = 0;
    canvas.renderAll();
  });
}