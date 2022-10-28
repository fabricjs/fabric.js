//@ts-nocheck

import { resolveOrigin } from '../mixins/object_origin.mixin';
import { Point } from '../point.class';
import { TAxis, TAxisKey } from '../typedefs';
import { fireEvent } from '../util/fireEvent';
import { degreesToRadians } from '../util/misc/radiansDegreesConversion';
import { renderCircleControl, renderSquareControl } from './controls.render';

(function (global) {
  var fabric = global.fabric || (global.fabric = {}),
    scaleMap = ['e', 'se', 's', 'sw', 'w', 'nw', 'n', 'ne', 'e'],
    skewMap = ['ns', 'nesw', 'ew', 'nwse'],
    controls = {},
    LEFT = 'left',
    TOP = 'top',
    RIGHT = 'right',
    BOTTOM = 'bottom',
    CENTER = 'center',
    opposite = {
      top: BOTTOM,
      bottom: TOP,
      left: RIGHT,
      right: LEFT,
      center: CENTER,
    },
    radiansToDegrees = fabric.util.radiansToDegrees,
    sign =
      Math.sign ||
      function (x) {
        return (x > 0) - (x < 0) || +x;
      };

  /**
   * Combine control position and object angle to find the control direction compared
   * to the object center.
   * @param {fabric.Object} fabricObject the fabric object for which we are rendering controls
   * @param {fabric.Control} control the control class
   * @return {Number} 0 - 7 a quadrant number
   */
  function findCornerQuadrant(fabricObject, control) {
    //  angle is relative to canvas plane
    var angle = fabricObject.getTotalAngle();
    var cornerAngle =
      angle + radiansToDegrees(Math.atan2(control.y, control.x)) + 360;
    return Math.round((cornerAngle % 360) / 45);
  }

  /**
   * Inspect event and fabricObject properties to understand if the scaling action
   * @param {Event} eventData from the user action
   * @param {fabric.Object} fabricObject the fabric object about to scale
   * @return {Boolean} true if scale is proportional
   */
  function scaleIsProportional(eventData, fabricObject) {
    var canvas = fabricObject.canvas,
      uniScaleKey = canvas.uniScaleKey,
      uniformIsToggled = eventData[uniScaleKey];
    return (
      (canvas.uniformScaling && !uniformIsToggled) ||
      (!canvas.uniformScaling && uniformIsToggled)
    );
  }

  /**
   * Checks if transform is centered
   * @param {Object} transform transform data
   * @return {Boolean} true if transform is centered
   */
  function isTransformCentered(transform) {
    return transform.originX === CENTER && transform.originY === CENTER;
  }

  /**
   * Inspect fabricObject to understand if the current scaling action is allowed
   * @param {fabric.Object} fabricObject the fabric object about to scale
   * @param {String} by 'x' or 'y' or ''
   * @param {Boolean} scaleProportionally true if we are trying to scale proportionally
   * @return {Boolean} true if scaling is not allowed at current conditions
   */
  function scalingIsForbidden(fabricObject, by, scaleProportionally) {
    var lockX = fabricObject.lockScalingX,
      lockY = fabricObject.lockScalingY;
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

  /**
   * return the correct cursor style for the scale action
   * @param {Event} eventData the javascript event that is causing the scale
   * @param {fabric.Control} control the control that is interested in the action
   * @param {fabric.Object} fabricObject the fabric object that is interested in the action
   * @return {String} a valid css string for the cursor
   */
  function scaleCursorStyleHandler(eventData, control, fabricObject) {
    var notAllowed = 'not-allowed',
      scaleProportionally = scaleIsProportional(eventData, fabricObject),
      by = '';
    if (control.x !== 0 && control.y === 0) {
      by = 'x';
    } else if (control.x === 0 && control.y !== 0) {
      by = 'y';
    }
    if (scalingIsForbidden(fabricObject, by, scaleProportionally)) {
      return notAllowed;
    }
    var n = findCornerQuadrant(fabricObject, control);
    return scaleMap[n] + '-resize';
  }

  /**
   * return the correct cursor style for the skew action
   * @param {Event} eventData the javascript event that is causing the scale
   * @param {fabric.Control} control the control that is interested in the action
   * @param {fabric.Object} fabricObject the fabric object that is interested in the action
   * @return {String} a valid css string for the cursor
   */
  function skewCursorStyleHandler(eventData, control, fabricObject) {
    var notAllowed = 'not-allowed';
    if (control.x !== 0 && fabricObject.lockSkewingY) {
      return notAllowed;
    }
    if (control.y !== 0 && fabricObject.lockSkewingX) {
      return notAllowed;
    }
    var n = findCornerQuadrant(fabricObject, control) % 4;
    return skewMap[n] + '-resize';
  }

  /**
   * Combine skew and scale style handlers to cover fabric standard use case
   * @param {Event} eventData the javascript event that is causing the scale
   * @param {fabric.Control} control the control that is interested in the action
   * @param {fabric.Object} fabricObject the fabric object that is interested in the action
   * @return {String} a valid css string for the cursor
   */
  function scaleSkewCursorStyleHandler(eventData, control, fabricObject) {
    if (eventData[fabricObject.canvas.altActionKey]) {
      return controls.skewCursorStyleHandler(eventData, control, fabricObject);
    }
    return controls.scaleCursorStyleHandler(eventData, control, fabricObject);
  }

  /**
   * Inspect event, control and fabricObject to return the correct action name
   * @param {Event} eventData the javascript event that is causing the scale
   * @param {fabric.Control} control the control that is interested in the action
   * @param {fabric.Object} fabricObject the fabric object that is interested in the action
   * @return {String} an action name
   */
  function scaleOrSkewActionName(eventData, control, fabricObject) {
    var isAlternative = eventData[fabricObject.canvas.altActionKey];
    if (control.x === 0) {
      // then is scaleY or skewX
      return isAlternative ? 'skewX' : 'scaleY';
    }
    if (control.y === 0) {
      // then is scaleY or skewX
      return isAlternative ? 'skewY' : 'scaleX';
    }
  }

  /**
   * Find the correct style for the control that is used for rotation.
   * this function is very simple and it just take care of not-allowed or standard cursor
   * @param {Event} eventData the javascript event that is causing the scale
   * @param {fabric.Control} control the control that is interested in the action
   * @param {fabric.Object} fabricObject the fabric object that is interested in the action
   * @return {String} a valid css string for the cursor
   */
  function rotationStyleHandler(eventData, control, fabricObject) {
    if (fabricObject.lockRotation) {
      return 'not-allowed';
    }
    return control.cursorStyle;
  }

  function commonEventInfo(eventData, transform, x, y) {
    return {
      e: eventData,
      transform: transform,
      pointer: {
        x: x,
        y: y,
      },
    };
  }

  /**
   * Wrap an action handler with saving/restoring object position on the transform.
   * this is the code that permits to objects to keep their position while transforming.
   * @param {Function} actionHandler the function to wrap
   * @return {Function} a function with an action handler signature
   */
  function wrapWithFixedAnchor(actionHandler) {
    return function (eventData, transform, x, y) {
      var target = transform.target,
        centerPoint = target.getRelativeCenterPoint(),
        constraint = target.translateToOriginPoint(
          centerPoint,
          transform.originX,
          transform.originY
        ),
        actionPerformed = actionHandler(eventData, transform, x, y);
      target.setPositionByOrigin(
        constraint,
        transform.originX,
        transform.originY
      );
      return actionPerformed;
    };
  }

  /**
   * Wrap an action handler with firing an event if the action is performed
   * @param {Function} actionHandler the function to wrap
   * @return {Function} a function with an action handler signature
   */
  function wrapWithFireEvent(eventName, actionHandler) {
    return function (eventData, transform, x, y) {
      var actionPerformed = actionHandler(eventData, transform, x, y);
      if (actionPerformed) {
        fireEvent(eventName, commonEventInfo(eventData, transform, x, y));
      }
      return actionPerformed;
    };
  }

  /**
   * Transforms a point described by x and y to the offset from the given origin
   * @param {Object} transform
   * @param {String} originX
   * @param {String} originY
   * @param {number} x
   * @param {number} y
   * @return {Fabric.Point} the normalized point
   */
  function getLocalPoint(transform, originX, originY, x, y) {
    var target = transform.target,
      control = target.controls[transform.corner],
      zoom = target.canvas.getZoom(),
      padding = target.padding / zoom,
      localPoint = target.normalizePoint(new Point(x, y), originX, originY);
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

  const AXIS_KEYS: Record<
    TAxis,
    {
      counterAxis: TAxis;
      scale: TAxisKey<'scale'>;
      skew: TAxisKey<'skew'>;
      lockSkewing: TAxisKey<'lockSkewing'>;
      origin: TAxisKey<'origin'>;
      flip: TAxisKey<'flip'>;
    }
  > = {
    x: {
      counterAxis: 'y',
      scale: 'scaleX',
      skew: 'skewX',
      lockSkewing: 'lockSkewingX',
      origin: 'originX',
      flip: 'flipX',
    },
    y: {
      counterAxis: 'x',
      scale: 'scaleY',
      skew: 'skewY',
      lockSkewing: 'lockSkewingY',
      origin: 'originY',
      flip: 'flipY',
    },
  };

  /**
   * Since skewing is applied before scaling, calculations are done in a scaleless plane
   * @see https://github.com/fabricjs/fabric.js/pull/8380
   */
  function skewObject(
    axis: TAxis,
    { target, ex, ey, skewingSide, ...transform },
    pointer: Point
  ) {
    const { skew: skewKey } = AXIS_KEYS[axis],
      offset = pointer
        .subtract(new Point(ex, ey))
        .divide(new Point(target.scaleX, target.scaleY))[axis],
      skewingBefore = target[skewKey],
      skewingStart = transform[skewKey],
      shearingStart = Math.tan(degreesToRadians(skewingStart)),
      // let a, b be the size of target
      // let a' be the value of a after applying skewing
      // then:
      // a' = a + b * skewA => skewA = (a' - a) / b
      // the value b is tricky since skewY is applied before skewX
      b =
        axis === 'y'
          ? target._getTransformedDimensions({
              scaleX: 1,
              scaleY: 1,
              // since skewY is applied before skewX, b (=width) is not affected by skewX
              skewX: 0,
            }).x
          : target._getTransformedDimensions({
              scaleX: 1,
              scaleY: 1,
            }).y;

    const shearing =
      (2 * offset * skewingSide) /
        // we max out fractions to safeguard from asymptotic behavior
        Math.max(b, 1) +
      // add starting state
      shearingStart;

    const skewing = radiansToDegrees(Math.atan(shearing));

    target.set(skewKey, skewing);
    const changed = skewingBefore !== target[skewKey];

    if (changed && axis === 'y') {
      // we don't want skewing to affect scaleX
      // so we factor it by the inverse skewing diff to make it seem unchanged to the viewer
      const { skewX, scaleX } = target,
        dimBefore = target._getTransformedDimensions({ skewY: skewingBefore }),
        dimAfter = target._getTransformedDimensions(),
        compensationFactor = skewX !== 0 ? dimBefore.x / dimAfter.x : 1;
      compensationFactor !== 1 &&
        target.set('scaleX', compensationFactor * scaleX);
    }

    return changed;
  }

  /**
   * Wrapped Action handler for skewing on a given axis, takes care of the
   * skew direction and determines the correct transform origin for the anchor point
   * @param {Event} eventData javascript event that is doing the transform
   * @param {Object} transform javascript object containing a series of information around the current transform
   * @param {number} x current mouse x position, canvas normalized
   * @param {number} y current mouse y position, canvas normalized
   * @return {Boolean} true if some change happened
   */
  function skewHandler(axis: TAxis, eventData, transform, x, y) {
    const { target } = transform,
      {
        counterAxis,
        origin: originKey,
        lockSkewing: lockSkewingKey,
        skew: skewKey,
        flip: flipKey,
      } = AXIS_KEYS[axis];
    if (target[lockSkewingKey]) {
      return false;
    }

    const { origin: counterOriginKey, flip: counterFlipKey } =
        AXIS_KEYS[counterAxis],
      counterOriginFactor =
        resolveOrigin(transform[counterOriginKey]) *
        (target[counterFlipKey] ? -1 : 1),
      // if the counter origin is top/left (= -0.5) then we are skewing x/y values on the bottom/right side of target respectively.
      // if the counter origin is bottom/right (= 0.5) then we are skewing x/y values on the top/left side of target respectively.
      // skewing direction on the top/left side of target is OPPOSITE to the direction of the movement of the pointer,
      // so we factor skewing direction by this value.
      skewingSide =
        -Math.sign(counterOriginFactor) * (target[flipKey] ? -1 : 1),
      skewingDirection =
        ((target[skewKey] === 0 &&
          // in case skewing equals 0 we use the pointer offset from target center to determine the direction of skewing
          getLocalPoint(transform, CENTER, CENTER, x, y)[axis] > 0) ||
        // in case target has skewing we use that as the direction
        target[skewKey] > 0
          ? 1
          : -1) * skewingSide,
      // anchor to the opposite side of the skewing direction
      // normalize value from [-1, 1] to origin value [0, 1]
      origin = -skewingDirection * 0.5 + 0.5;

    const finalHandler = wrapWithFireEvent(
      'skewing',
      wrapWithFixedAnchor((eventData, transform, x, y) =>
        skewObject(axis, transform, new Point(x, y))
      )
    );

    return finalHandler(
      eventData,
      {
        ...transform,
        [originKey]: origin,
        skewingSide,
      },
      x,
      y
    );
  }

  /**
   * Wrapped Action handler for skewing on the X axis, takes care of the
   * skew direction and determines the correct transform origin for the anchor point
   * @param {Event} eventData javascript event that is doing the transform
   * @param {Object} transform javascript object containing a series of information around the current transform
   * @param {number} x current mouse x position, canvas normalized
   * @param {number} y current mouse y position, canvas normalized
   * @return {Boolean} true if some change happened
   */
  function skewHandlerX(eventData, transform, x, y) {
    return skewHandler('x', eventData, transform, x, y);
  }

  /**
   * Wrapped Action handler for skewing on the Y axis, takes care of the
   * skew direction and determines the correct transform origin for the anchor point
   * @param {Event} eventData javascript event that is doing the transform
   * @param {Object} transform javascript object containing a series of information around the current transform
   * @param {number} x current mouse x position, canvas normalized
   * @param {number} y current mouse y position, canvas normalized
   * @return {Boolean} true if some change happened
   */
  function skewHandlerY(eventData, transform, x, y) {
    return skewHandler('y', eventData, transform, x, y);
  }

  /**
   * Action handler for rotation and snapping, without anchor point.
   * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
   * @param {Event} eventData javascript event that is doing the transform
   * @param {Object} transform javascript object containing a series of information around the current transform
   * @param {number} x current mouse x position, canvas normalized
   * @param {number} y current mouse y position, canvas normalized
   * @return {Boolean} true if some change happened
   * @private
   */
  function rotationWithSnapping(eventData, transform, x, y) {
    var t = transform,
      target = t.target,
      pivotPoint = target.translateToOriginPoint(
        target.getRelativeCenterPoint(),
        t.originX,
        t.originY
      );

    if (target.lockRotation) {
      return false;
    }

    var lastAngle = Math.atan2(t.ey - pivotPoint.y, t.ex - pivotPoint.x),
      curAngle = Math.atan2(y - pivotPoint.y, x - pivotPoint.x),
      angle = radiansToDegrees(curAngle - lastAngle + t.theta),
      hasRotated = true;

    if (target.snapAngle > 0) {
      var snapAngle = target.snapAngle,
        snapThreshold = target.snapThreshold || snapAngle,
        rightAngleLocked = Math.ceil(angle / snapAngle) * snapAngle,
        leftAngleLocked = Math.floor(angle / snapAngle) * snapAngle;

      if (Math.abs(angle - leftAngleLocked) < snapThreshold) {
        angle = leftAngleLocked;
      } else if (Math.abs(angle - rightAngleLocked) < snapThreshold) {
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
    return hasRotated;
  }

  /**
   * Basic scaling logic, reused with different constrain for scaling X,Y, freely or equally.
   * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
   * @param {Event} eventData javascript event that is doing the transform
   * @param {Object} transform javascript object containing a series of information around the current transform
   * @param {number} x current mouse x position, canvas normalized
   * @param {number} y current mouse y position, canvas normalized
   * @param {Object} options additional information for scaling
   * @param {String} options.by 'x', 'y', 'equally' or '' to indicate type of scaling
   * @return {Boolean} true if some change happened
   * @private
   */
  function scaleObject(eventData, transform, x, y, options) {
    options = options || {};
    var target = transform.target,
      lockScalingX = target.lockScalingX,
      lockScalingY = target.lockScalingY,
      by = options.by,
      newPoint,
      scaleX,
      scaleY,
      dim,
      scaleProportionally = scaleIsProportional(eventData, target),
      forbidScaling = scalingIsForbidden(target, by, scaleProportionally),
      signX,
      signY,
      gestureScale = transform.gestureScale;

    if (forbidScaling) {
      return false;
    }
    if (gestureScale) {
      scaleX = transform.scaleX * gestureScale;
      scaleY = transform.scaleY * gestureScale;
    } else {
      newPoint = getLocalPoint(
        transform,
        transform.originX,
        transform.originY,
        x,
        y
      );
      // use of sign: We use sign to detect change of direction of an action. sign usually change when
      // we cross the origin point with the mouse. So a scale flip for example. There is an issue when scaling
      // by center and scaling using one middle control ( default: mr, mt, ml, mb), the mouse movement can easily
      // cross many time the origin point and flip the object. so we need a way to filter out the noise.
      // This ternary here should be ok to filter out X scaling when we want Y only and vice versa.
      signX = by !== 'y' ? sign(newPoint.x) : 1;
      signY = by !== 'x' ? sign(newPoint.y) : 1;
      if (!transform.signX) {
        transform.signX = signX;
      }
      if (!transform.signY) {
        transform.signY = signY;
      }

      if (
        target.lockScalingFlip &&
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
          originalDistance =
            Math.abs((dim.x * original.scaleX) / target.scaleX) +
            Math.abs((dim.y * original.scaleY) / target.scaleY),
          scale = distance / originalDistance;
        scaleX = original.scaleX * scale;
        scaleY = original.scaleY * scale;
      } else {
        scaleX = Math.abs((newPoint.x * target.scaleX) / dim.x);
        scaleY = Math.abs((newPoint.y * target.scaleY) / dim.y);
      }
      // if we are scaling by center, we need to double the scale
      if (isTransformCentered(transform)) {
        scaleX *= 2;
        scaleY *= 2;
      }
      if (transform.signX !== signX && by !== 'y') {
        transform.originX = opposite[transform.originX];
        scaleX *= -1;
        transform.signX = signX;
      }
      if (transform.signY !== signY && by !== 'x') {
        transform.originY = opposite[transform.originY];
        scaleY *= -1;
        transform.signY = signY;
      }
    }
    // minScale is taken are in the setter.
    var oldScaleX = target.scaleX,
      oldScaleY = target.scaleY;
    if (!by) {
      !lockScalingX && target.set('scaleX', scaleX);
      !lockScalingY && target.set('scaleY', scaleY);
    } else {
      // forbidden cases already handled on top here.
      by === 'x' && target.set('scaleX', scaleX);
      by === 'y' && target.set('scaleY', scaleY);
    }
    return oldScaleX !== target.scaleX || oldScaleY !== target.scaleY;
  }

  /**
   * Generic scaling logic, to scale from corners either equally or freely.
   * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
   * @param {Event} eventData javascript event that is doing the transform
   * @param {Object} transform javascript object containing a series of information around the current transform
   * @param {number} x current mouse x position, canvas normalized
   * @param {number} y current mouse y position, canvas normalized
   * @return {Boolean} true if some change happened
   */
  function scaleObjectFromCorner(eventData, transform, x, y) {
    return scaleObject(eventData, transform, x, y);
  }

  /**
   * Scaling logic for the X axis.
   * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
   * @param {Event} eventData javascript event that is doing the transform
   * @param {Object} transform javascript object containing a series of information around the current transform
   * @param {number} x current mouse x position, canvas normalized
   * @param {number} y current mouse y position, canvas normalized
   * @return {Boolean} true if some change happened
   */
  function scaleObjectX(eventData, transform, x, y) {
    return scaleObject(eventData, transform, x, y, { by: 'x' });
  }

  /**
   * Scaling logic for the Y axis.
   * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
   * @param {Event} eventData javascript event that is doing the transform
   * @param {Object} transform javascript object containing a series of information around the current transform
   * @param {number} x current mouse x position, canvas normalized
   * @param {number} y current mouse y position, canvas normalized
   * @return {Boolean} true if some change happened
   */
  function scaleObjectY(eventData, transform, x, y) {
    return scaleObject(eventData, transform, x, y, { by: 'y' });
  }

  /**
   * Composed action handler to either scale Y or skew X
   * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
   * @param {Event} eventData javascript event that is doing the transform
   * @param {Object} transform javascript object containing a series of information around the current transform
   * @param {number} x current mouse x position, canvas normalized
   * @param {number} y current mouse y position, canvas normalized
   * @return {Boolean} true if some change happened
   */
  function scalingYOrSkewingX(eventData, transform, x, y) {
    // ok some safety needed here.
    if (eventData[transform.target.canvas.altActionKey]) {
      return controls.skewHandlerX(eventData, transform, x, y);
    }
    return controls.scalingY(eventData, transform, x, y);
  }

  /**
   * Composed action handler to either scale X or skew Y
   * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
   * @param {Event} eventData javascript event that is doing the transform
   * @param {Object} transform javascript object containing a series of information around the current transform
   * @param {number} x current mouse x position, canvas normalized
   * @param {number} y current mouse y position, canvas normalized
   * @return {Boolean} true if some change happened
   */
  function scalingXOrSkewingY(eventData, transform, x, y) {
    // ok some safety needed here.
    if (eventData[transform.target.canvas.altActionKey]) {
      return controls.skewHandlerY(eventData, transform, x, y);
    }
    return controls.scalingX(eventData, transform, x, y);
  }

  /**
   * Action handler to change textbox width
   * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
   * @param {Event} eventData javascript event that is doing the transform
   * @param {Object} transform javascript object containing a series of information around the current transform
   * @param {number} x current mouse x position, canvas normalized
   * @param {number} y current mouse y position, canvas normalized
   * @return {Boolean} true if some change happened
   */
  function changeWidth(eventData, transform, x, y) {
    var localPoint = getLocalPoint(
      transform,
      transform.originX,
      transform.originY,
      x,
      y
    );
    //  make sure the control changes width ONLY from it's side of target
    if (
      transform.originX === 'center' ||
      (transform.originX === 'right' && localPoint.x < 0) ||
      (transform.originX === 'left' && localPoint.x > 0)
    ) {
      var target = transform.target,
        strokePadding =
          target.strokeWidth / (target.strokeUniform ? target.scaleX : 1),
        multiplier = isTransformCentered(transform) ? 2 : 1,
        oldWidth = target.width,
        newWidth = Math.ceil(
          Math.abs((localPoint.x * multiplier) / target.scaleX) - strokePadding
        );
      target.set('width', Math.max(newWidth, 0));
      //  check against actual target width in case `newWidth` was rejected
      return oldWidth !== target.width;
    }
    return false;
  }

  /**
   * Action handler
   * @private
   * @param {Event} eventData javascript event that is doing the transform
   * @param {Object} transform javascript object containing a series of information around the current transform
   * @param {number} x current mouse x position, canvas normalized
   * @param {number} y current mouse y position, canvas normalized
   * @return {Boolean} true if the translation occurred
   */
  function dragHandler(eventData, transform, x, y) {
    var target = transform.target,
      newLeft = x - transform.offsetX,
      newTop = y - transform.offsetY,
      moveX = !target.get('lockMovementX') && target.left !== newLeft,
      moveY = !target.get('lockMovementY') && target.top !== newTop;
    moveX && target.set('left', newLeft);
    moveY && target.set('top', newTop);
    if (moveX || moveY) {
      fireEvent('moving', commonEventInfo(eventData, transform, x, y));
    }
    return moveX || moveY;
  }

  controls.scaleCursorStyleHandler = scaleCursorStyleHandler;
  controls.skewCursorStyleHandler = skewCursorStyleHandler;
  controls.scaleSkewCursorStyleHandler = scaleSkewCursorStyleHandler;
  controls.rotationWithSnapping = wrapWithFireEvent(
    'rotating',
    wrapWithFixedAnchor(rotationWithSnapping)
  );
  controls.scalingEqually = wrapWithFireEvent(
    'scaling',
    wrapWithFixedAnchor(scaleObjectFromCorner)
  );
  controls.scalingX = wrapWithFireEvent(
    'scaling',
    wrapWithFixedAnchor(scaleObjectX)
  );
  controls.scalingY = wrapWithFireEvent(
    'scaling',
    wrapWithFixedAnchor(scaleObjectY)
  );
  controls.scalingYOrSkewingX = scalingYOrSkewingX;
  controls.scalingXOrSkewingY = scalingXOrSkewingY;
  controls.changeWidth = wrapWithFireEvent(
    'resizing',
    wrapWithFixedAnchor(changeWidth)
  );
  controls.skewHandlerX = skewHandlerX;
  controls.skewHandlerY = skewHandlerY;
  controls.dragHandler = dragHandler;
  controls.scaleOrSkewActionName = scaleOrSkewActionName;
  controls.rotationStyleHandler = rotationStyleHandler;
  controls.fireEvent = fireEvent;
  controls.wrapWithFixedAnchor = wrapWithFixedAnchor;
  controls.wrapWithFireEvent = wrapWithFireEvent;
  controls.getLocalPoint = getLocalPoint;
  controls.renderCircleControl = renderCircleControl;
  controls.renderSquareControl = renderSquareControl;
  fabric.controlsUtils = controls;
})(typeof exports !== 'undefined' ? exports : window);
