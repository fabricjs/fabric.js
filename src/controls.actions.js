(function(global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = { }),
      scaleMap = ['e', 'se', 's', 'sw', 'w', 'nw', 'n', 'ne', 'e'],
      skewMap = ['ns', 'nesw', 'ew', 'nwse'],
      controls = {},
      LEFT = 'left', TOP = 'top', RIGHT = 'right', BOTTOM = 'bottom', CENTER = 'center',
      opposite = {
        top: BOTTOM,
        bottom: TOP,
        left: RIGHT,
        right: LEFT,
      }, radiansToDegrees = fabric.util.radiansToDegrees,
      sign = (Math.sign || function(x) { return ((x > 0) - (x < 0)) || +x; });

  function findCornerQuadrant(fabricObject, corner) {
    var cornerAngle = fabricObject.angle + radiansToDegrees(Math.atan2(corner.y, corner.x)) + 360;
    return Math.round((cornerAngle % 360) / 45);
  }

  function fireEvent(eventName, options) {
    var target = options.transform.target,
        canvas = target.canvas,
        canasOptions = Object.assign({}, options, { target: target });
    canvas && canvas.fire('object:' + eventName, canasOptions);
    target.fire(eventName, options);
  }

  function scaleIsProportional(eventData, fabricObject) {
    var canvas = fabricObject.canvas, uniScaleKey = canvas.uniScaleKey,
        uniformIsToggled = eventData[uniScaleKey];
    return (canvas.uniformScaling && !uniformIsToggled) ||
    (!canvas.uniformScaling && uniformIsToggled);
  }

  function scalingIsForbidden(fabricObject, by, scaleProportionally) {
    var lockX = fabricObject.lockScalingX, lockY = fabricObject.lockScalingY;
    if (lockX && lockY) {
      return true;
    }
    if (!by && (lockX || lockY) && scaleProportionally) {
      return true;
    }
    if (lockX && by === 'x') {
      return true;
    }
    if (lockY && by === 'y') {
      return true;
    }
    return false;
  }

  function scaleCursorStyleHandler(eventData, corner, fabricObject) {
    var notAllowed = 'not-allowed',
        scaleProportionally = scaleIsProportional(eventData, fabricObject),
        by = '';
    if (corner.x !== 0 && corner.y === 0) {
      by = 'x';
    }
    else if (corner.x === 0 && corner.y !== 0) {
      by = 'y';
    }
    if (scalingIsForbidden(fabricObject, by, scaleProportionally)) {
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

  function scaleOrSkewActionName(eventData, corner, fabricObject) {
    var isAlternative = eventData[fabricObject.canvas.altActionKey];
    if (corner.x === 0) {
      // then is scaleY or skewX
      return isAlternative ? 'skewX' : 'scaleY';
    }
    if (corner.y === 0) {
      // then is scaleY or skewX
      return isAlternative ? 'skewY' : 'scaleX';
    }
  }

  function rotationStyleHandler(eventData, corner, fabricObject) {
    if (fabricObject.lockRotation) {
      return 'not-allowed';
    }
    return corner.cursorStyle;
  }

  function commonEventInfo(eventData, transform, x, y) {
    return {
      e: eventData,
      transform: transform,
      pointer: {
        x: x,
        y: y,
      }
    };
  }

  function wrapWithFixedAnchor(actionHandler) {
    return function(eventData, transform, x, y) {
      var target = transform.target, centerPoint = target.getCenterPoint(),
          constraint = target.translateToOriginPoint(centerPoint, transform.originX, transform.originY),
          actionPerformed = actionHandler(eventData, transform, x, y);
      target.setPositionByOrigin(constraint, transform.originX, transform.originY);
      return actionPerformed;
    };
  }

  function getLocalPoint(transform, originX, originY, x, y) {
    var target = transform.target,
        control = target.controls[transform.corner],
        zoom = target.canvas.getZoom(),
        padding = target.padding / zoom,
        localPoint = target.toLocalPoint(new fabric.Point(x, y), originX, originY);
    if (localPoint.x >= padding) {
      localPoint.x -= padding;
    }
    if (localPoint.x <= -padding) {
      localPoint.x += padding;
    }
    if (localPoint.y >= padding) {
      localPoint.y -= padding;
    }
    if (localPoint.y <= padding) {
      localPoint.y += padding;
    }
    localPoint.x -= control.offsetX;
    localPoint.y -= control.offsetY;
    return localPoint;
  }

  function targetHasOneFlip(target) {
    return (target.flipX && !target.flipY) || (!target.flipX && target.flipY);
  }

  function compensateScaleForSkew(target, oppositeSkew, scaleToCompoensate, axis, reference) {
    if (target[oppositeSkew] !== 0) {
      var newDim = target._getTransformedDimensions()[axis];
      var newValue = reference / newDim * target[scaleToCompoensate];
      target.set(scaleToCompoensate, newValue);
    }
  }

  function skewObjectX(eventData, transform, x, y) {
    var target = transform.target,
        // find how big the object would be, if there was no skewX. takes in account scaling
        dimNoSkew = target._getTransformedDimensions(0, target.skewY),
        localPoint = getLocalPoint(transform, transform.originX, transform.originY, x, y),
        // the mouse is in the center of the object, and we want it to stay there.
        // so the object will grow twice as much as the mouse.
        // this makes the skew growth to localPoint * 2 - dimNoSkew.
        totalSkewSize = Math.abs(localPoint.x * 2) - dimNoSkew.x,
        currentSkew = target.skewX, newSkew;
    if (totalSkewSize < 2) {
      // let's make it easy to go back to position 0.
      newSkew = 0;
    }
    else {
      newSkew = radiansToDegrees(
        Math.atan2((totalSkewSize / target.scaleX), (dimNoSkew.y / target.scaleY))
      );
      // now we have to find the sign of the skew.
      // it mostly depend on the origin of transformation.
      if (transform.originX === LEFT && transform.originY === BOTTOM) {
        newSkew = -newSkew;
      }
      if (transform.originX === RIGHT && transform.originY === TOP) {
        newSkew = -newSkew;
      }
      if (targetHasOneFlip(target)) {
        newSkew = -newSkew;
      }
    }
    var hasSkewed = currentSkew !== newSkew;
    if (hasSkewed) {
      var dimBeforeSkewing = target._getTransformedDimensions().y;
      target.set('skewX', newSkew);
      compensateScaleForSkew(target, 'skewY', 'scaleY', 'y', dimBeforeSkewing);
      fireEvent('skewing', commonEventInfo(eventData, transform, x, y));
    }
    return hasSkewed;
  }

  function skewObjectY(eventData, transform, x, y) {
    var target = transform.target,
        // find how big the object would be, if there was no skewX. takes in account scaling
        dimNoSkew = target._getTransformedDimensions(target.skewX, 0),
        localPoint = getLocalPoint(transform, transform.originX, transform.originY, x, y),
        // the mouse is in the center of the object, and we want it to stay there.
        // so the object will grow twice as much as the mouse.
        // this makes the skew growth to localPoint * 2 - dimNoSkew.
        totalSkewSize = Math.abs(localPoint.y * 2) - dimNoSkew.y,
        currentSkew = target.skewY, newSkew;
    if (totalSkewSize < 2) {
      // let's make it easy to go back to position 0.
      newSkew = 0;
    }
    else {
      newSkew = radiansToDegrees(
        Math.atan2((totalSkewSize / target.scaleY), (dimNoSkew.x / target.scaleX))
      );
      // now we have to find the sign of the skew.
      // it mostly depend on the origin of transformation.
      if (transform.originX === LEFT && transform.originY === BOTTOM) {
        newSkew = -newSkew;
      }
      if (transform.originX === RIGHT && transform.originY === TOP) {
        newSkew = -newSkew;
      }
      if (targetHasOneFlip(target)) {
        newSkew = -newSkew;
      }
    }
    var hasSkewed = currentSkew !== newSkew;
    if (hasSkewed) {
      var dimBeforeSkewing = target._getTransformedDimensions().x;
      target.set('skewY', newSkew);
      compensateScaleForSkew(target, 'skewX', 'scaleX', 'x', dimBeforeSkewing);
      fireEvent('skewing', commonEventInfo(eventData, transform, x, y));
    }
    return hasSkewed;
  }

  // writing a skewX only action, try to generalize later
  function skewHandlerX(eventData, transform, x, y) {
    // step1 figure out and change transform origin.
    // if skewX > 0 and originY bottom we anchor on right
    // if skewX > 0 and originY top we anchor on left
    // if skewX < 0 and originY bottom we anchor on left
    // if skewX < 0 and originY top we anchor on right
    // if skewX is 0, we look for mouse position to understand where are we going.
    var target = transform.target, currentSkew = target.skewX, originX, originY = transform.originY;
    if (target.lockSkewingX) {
      return false;
    }
    if (currentSkew === 0) {
      var localPointFromCenter = getLocalPoint(transform, CENTER, CENTER, x, y);
      if (localPointFromCenter.x > 0) {
        // we are pulling right, anchor left;
        originX = LEFT;
      }
      else {
        // we are pulling right, anchor right
        originX = RIGHT;
      }
    }
    else {
      if (currentSkew > 0) {
        originX = originY === TOP ? LEFT : RIGHT;
      }
      if (currentSkew < 0) {
        originX = originY === TOP ? RIGHT : LEFT;
      }
      // is the object flipped on one side only? swap the origin.
      if (targetHasOneFlip(target)) {
        originX = originX === LEFT ? RIGHT : LEFT;
      }
    }

    // once we have the origin, we find the anchor point
    transform.originX = originX;
    var finalHandler = wrapWithFixedAnchor(skewObjectX);
    return finalHandler(eventData, transform, x, y);
  }

  // writing a skewY only action, try to generalize later
  function skewHandlerY(eventData, transform, x, y) {
    // step1 figure out and change transform origin.
    // if skewY > 0 and originX left we anchor on top
    // if skewY > 0 and originX right we anchor on bottom
    // if skewY < 0 and originX left we anchor on bottom
    // if skewY < 0 and originX right we anchor on top
    // if skewY is 0, we look for mouse position to understand where are we going.
    var target = transform.target, currentSkew = target.skewY, originY, originX = transform.originX;
    if (target.lockSkewingY) {
      return false;
    }
    if (currentSkew === 0) {
      var localPointFromCenter = getLocalPoint(transform, CENTER, CENTER, x, y);
      if (localPointFromCenter.y > 0) {
        // we are pulling down, anchor up;
        originY = TOP;
      }
      else {
        // we are pulling up, anchor down
        originY = BOTTOM;
      }
    }
    else {
      if (currentSkew > 0) {
        originY = originX === LEFT ? TOP : BOTTOM;
      }
      if (currentSkew < 0) {
        originY = originX === LEFT ? BOTTOM : TOP;
      }
      // is the object flipped on one side only? swap the origin.
      if (targetHasOneFlip(target)) {
        originY = originY === TOP ? BOTTOM : TOP;
      }
    }

    // once we have the origin, we find the anchor point
    transform.originY = originY;
    var finalHandler = wrapWithFixedAnchor(skewObjectY);
    return finalHandler(eventData, transform, x, y);
  }

  function rotationWithSnapping(eventData, transform, x, y) {
    var t = transform,
        target = t.target,
        pivotPoint = target.translateToOriginPoint(target.getCenterPoint(), t.originX, t.originY);

    if (target.lockRotation) {
      return false;
    }

    var lastAngle = Math.atan2(t.ey - pivotPoint.y, t.ex - pivotPoint.x),
        curAngle = Math.atan2(y - pivotPoint.y, x - pivotPoint.x),
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

    hasRotated = target.angle !== angle;
    target.angle = angle;
    if (hasRotated) {
      fireEvent('rotating', commonEventInfo(eventData, transform, x, y));
    }
    return hasRotated;
  }


  function scaleObject(eventData, transform, x, y, options) {
    options = options || {};
    var target = transform.target,
        lockScalingX = target.lockScalingX, lockScalingY = target.lockScalingY,
        by = options.by, newPoint, scaleX, scaleY, dim,
        scaleProportionally = scaleIsProportional(eventData, target),
        forbidScaling = scalingIsForbidden(target, by, scaleProportionally),
        signX, signY;

    if (forbidScaling) {
      return false;
    }
    newPoint = getLocalPoint(transform, transform.originX, transform.originY, x, y);
    signX = sign(newPoint.x);
    signY = sign(newPoint.y);
    if (!transform.signX) {
      transform.signX = signX;
    }
    if (!transform.signY) {
      transform.signY = signY;
    }

    if (target.lockScalingFlip &&
      (transform.signX !== signX || transform.signY !== signY)
    ) {
      return false;
    }

    dim = target._getTransformedDimensions();
    // missing detection of flip and logic to switch the origin
    if (scaleProportionally && !by) {
      // uniform scaling
      var distance = Math.abs(newPoint.x) + Math.abs(newPoint.y),
          original = transform.original,
          originalDistance = Math.abs(dim.x * original.scaleX / target.scaleX) +
            Math.abs(dim.y * original.scaleY / target.scaleY),
          scale = distance / originalDistance, hasScaled;
      scaleX = original.scaleX * scale;
      scaleY = original.scaleY * scale;
    }
    else {
      scaleX = Math.abs(newPoint.x * target.scaleX / dim.x);
      scaleY = Math.abs(newPoint.y * target.scaleY / dim.y);
    }
    // if we are scaling by center, we need to double the scale
    if (transform.originX === CENTER && transform.originY === CENTER) {
      scaleX *= 2;
      scaleY *= 2;
    }
    if (transform.signX !== signX) {
      transform.originX = opposite[transform.originX];
      scaleX *= -1;
      transform.signX = signX;
    }
    if (transform.signY !== signY) {
      transform.originY = opposite[transform.originY];
      scaleY *= -1;
      transform.signY = signY;
    }
    // minScale is taken are in the setter.
    var oldScaleX = target.scaleX, oldScaleY = target.scaleY;
    if (!by) {
      !lockScalingX && target.set('scaleX', scaleX);
      !lockScalingY && target.set('scaleY', scaleY);
    }
    else {
      // forbidden cases already handled on top here.
      by === 'x' && target.set('scaleX', scaleX);
      by === 'y' && target.set('scaleY', scaleY);
    }
    hasScaled = oldScaleX !== target.scaleX || oldScaleY !== target.scaleY;
    if (hasScaled) {
      fireEvent('scaling', commonEventInfo(eventData, transform, x, y));
    }
    return hasScaled;
  }

  function scaleObjectFromCorner(eventData, transform, x, y) {
    return scaleObject(eventData, transform, x, y);
  }

  function scaleObjectX(eventData, transform, x, y) {
    return scaleObject(eventData, transform, x, y , { by: 'x' });
  }

  function scaleObjectY(eventData, transform, x, y) {
    return scaleObject(eventData, transform, x, y , { by: 'y' });
  }

  function scalingYOrSkewingX(eventData, transform, x, y) {
    // ok some safety needed here.
    if (eventData[transform.target.canvas.altActionKey]) {
      return controls.skewHandlerX(eventData, transform, x, y);
    }
    return controls.scalingY(eventData, transform, x, y);
  }

  function scalingXOrSkewingY(eventData, transform, x, y) {
    // ok some safety needed here.
    if (eventData[transform.target.canvas.altActionKey]) {
      return controls.skewHandlerY(eventData, transform, x, y);
    }
    return controls.scalingX(eventData, transform, x, y);
  }

  // currently unusued, needed for the textbox.
  function changeWidth(eventData, transform, x, y) {
    var target = transform.target, localPoint = getLocalPoint(transform, transform.originX, transform.originY, x, y),
        strokePadding = target.strokeWidth / (target.strokeUniform ? target.scaleX : 1),
        newWidth = Math.abs(localPoint.x / target.scaleX) - strokePadding;
    target.set('width', Math.max(newWidth, 0));
    return true;
  }

  controls.scaleCursorStyleHandler = scaleCursorStyleHandler;
  controls.skewCursorStyleHandler = skewCursorStyleHandler;
  controls.scaleSkewCursorStyleHandler = scaleSkewCursorStyleHandler;
  controls.rotationWithSnapping = wrapWithFixedAnchor(rotationWithSnapping);
  controls.scalingEqually = wrapWithFixedAnchor(scaleObjectFromCorner);
  controls.scalingX = wrapWithFixedAnchor(scaleObjectX);
  controls.scalingY = wrapWithFixedAnchor(scaleObjectY);
  controls.scalingYOrSkewingX = scalingYOrSkewingX;
  controls.scalingXOrSkewingY = scalingXOrSkewingY;
  controls.changeWidth = wrapWithFixedAnchor(changeWidth);
  controls.skewHandlerX = skewHandlerX;
  controls.skewHandlerY = skewHandlerY;
  controls.scaleOrSkewActionName = scaleOrSkewActionName;
  controls.rotationStyleHandler = rotationStyleHandler;
  controls.fireEvent = fireEvent;
  fabric.controlHandlers = controls;

})(typeof exports !== 'undefined' ? exports : this);
