(function(global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = { }),
      scaleMap = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'],
      skewMap = ['ew', 'nwse', 'ns', 'nesw'],
      controls = {},
      radiansToDegrees = fabric.util.radiansToDegrees;

  function findCornerQuadrant(fabricObject, corner) {
    var cornerAngle = fabricObject.angle + radiansToDegrees(Math.atan2(corner.y, corner.x) + 360);
    return Math.round((cornerAngle % 360) / 45);
  }

  function scaleCursorStyleHandler(eventData, corner, fabricObject) {
    var uniScaleKey = fabricObject.canvas.uniScaleKey, notAllowed = 'not-allowed';
    if (fabricObject.lockScalingX && fabricObject.lockScalingY) {
      return notAllowed;
    }
    if (corner.x !== 0 && fabricObject.lockScalingX && !eventData[uniScaleKey]) {
      return notAllowed;
    }
    if (corner.y !== 0 && fabricObject.lockScalingY && !eventData[uniScaleKey]) {
      return notAllowed;
    }
    var n = findCornerQuadrant(fabricObject, corner);
    return scaleMap[n] + '-resize';
  }

  function skewCursorStyleHandler(eventData, corner, fabricObject) {
    var notAllowed = 'not-allowed';
    if (corner.x !== 0 && fabricObject.lockSkewingY) {
      return notAllowed;
    }
    if (corner.y !== 0 && fabricObject.lockSkewingX) {
      return notAllowed;
    }
    var n = findCornerQuadrant(fabricObject, corner) % 4;
    return skewMap[n] + '-resize';
  }

  function scaleSkewCursorStyleHandler(eventData, corner, fabricObject) {
    if (eventData[fabricObject.canvas.altActionKey]) {
      return controls.skewCursorStyleHandler(eventData, corner, fabricObject);
    }
    return controls.scaleCursorStyleHandler(eventData, corner, fabricObject);
  }

  function rotationStyleHandler(eventData, corner, fabricObject) {
    if (fabricObject.lockRotation) {
      return 'not-allowed';
    }
    return corner.cursorStyle;
  }

  function rotationWithSnapping(eventData, transform, x, y) {
    var t = transform,
        target = t.target, constraintPosition,
        constraintPosition = target.translateToOriginPoint(target.getCenterPoint(), t.originX, t.originY);

    if (target.lockRotation) {
      return false;
    }

    var lastAngle = Math.atan2(t.ey - constraintPosition.y, t.ex - constraintPosition.x),
        curAngle = Math.atan2(y - constraintPosition.y, x - constraintPosition.x),
        angle = radiansToDegrees(curAngle - lastAngle + t.theta),
        hasRotated = true;

    if (target.snapAngle > 0) {
      var snapAngle  = target.snapAngle,
          snapThreshold  = target.snapThreshold || snapAngle,
          rightAngleLocked = Math.ceil(angle / snapAngle) * snapAngle,
          leftAngleLocked = Math.floor(angle / snapAngle) * snapAngle;

      if (Math.abs(angle - leftAngleLocked) < snapThreshold) {
        angle = leftAngleLocked;
      }
      else if (Math.abs(angle - rightAngleLocked) < snapThreshold) {
        angle = rightAngleLocked;
      }
    }

    // normalize angle to positive value
    if (angle < 0) {
      angle = 360 + angle;
    }
    angle %= 360;

    if (target.angle === angle) {
      hasRotated = false;
    }
    else {
      // rotation only happen here
      target.angle = angle;
      // Make sure the constraints apply
      target.setPositionByOrigin(constraintPosition, t.originX, t.originY);
    }
    return hasRotated;
  }

  controls.scaleCursorStyleHandler = scaleCursorStyleHandler;
  controls.skewCursorStyleHandler = skewCursorStyleHandler;
  controls.scaleSkewCursorStyleHandler = scaleSkewCursorStyleHandler;
  controls.rotationWithSnapping = rotationWithSnapping;
  controls.rotationStyleHandler = rotationStyleHandler;
  fabric.controlHandlers = controls;

})(typeof exports !== 'undefined' ? exports : this);
