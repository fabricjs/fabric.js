/**
 * Augments canvas by assigning to `onObjectMove` and `onAfterRender`.
 * This kind of sucks because other code using those methods will stop functioning.
 * Need to fix it by replacing callbacks with pub/sub kind of subscription model.
 * (or maybe use existing fabric.util.fire/observe (if it won't be too slow))
 */
function initCenteringGuidelines(canvas) {

  var canvasWidth = canvas.getWidth(),
      canvasHeight = canvas.getHeight(),
      canvasWidthCenter = canvasWidth / 2,
      canvasHeightCenter = canvasHeight / 2,
      canvasWidthCenterMap = { },
      canvasHeightCenterMap = { },
      centerLineMargin = 4,
      centerLineColor = 'rgba(255,0,241,0.5)',
      centerLineWidth = 1,
      ctx = canvas.getSelectionContext();

  for (var i = canvasWidthCenter - centerLineMargin, len = canvasWidthCenter + centerLineMargin; i <= len; i++) {
    canvasWidthCenterMap[i] = true;
  }
  for (var i = canvasHeightCenter - centerLineMargin, len = canvasHeightCenter + centerLineMargin; i <= len; i++) {
    canvasHeightCenterMap[i] = true;
  }

  function showVerticalCenterLine() {
    showCenterLine(canvasWidthCenter + 0.5, 0, canvasWidthCenter + 0.5, canvasHeight);
  }

  function showHorizontalCenterLine() {
    showCenterLine(0, canvasHeightCenter + 0.5, canvasWidth, canvasHeightCenter + 0.5);
  }

  function showCenterLine(x1, y1, x2, y2) {
    ctx.save();
    ctx.strokeStyle = centerLineColor;
    ctx.lineWidth = centerLineWidth;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  var afterRenderActions = [ ],
      isInVerticalCenter,
      isInHorizontalCenter;

  canvas.on('object:moving', function(e) {
    var object = e.target,
        objectCenter = object.getCenterPoint(),
        transform = canvas._currentTransform;

    if (!transform) return;

    isInVerticalCenter = objectCenter.x in canvasWidthCenterMap,
    isInHorizontalCenter = objectCenter.y in canvasHeightCenterMap;

    if (isInHorizontalCenter || isInVerticalCenter) {
      object.setPositionByOrigin(new fabric.Point((isInVerticalCenter ? canvasWidthCenter : objectCenter.x), (isInHorizontalCenter ? canvasHeightCenter : objectCenter.y)), transform.originX, transform.originY);
    }
  });

  canvas.on('before:render', function() {
    canvas.clearContext(canvas.contextTop);
  });

  canvas.on('after:render', function() {
    if (isInVerticalCenter) {
      showVerticalCenterLine();
    }
    if (isInHorizontalCenter) {
      showHorizontalCenterLine();
    }
  });

  canvas.on('mouse:up', function() {
    // clear these values, to stop drawing guidelines once mouse is up
    isInVerticalCenter = isInHorizontalCenter = null;
    canvas.renderAll();
  });
}