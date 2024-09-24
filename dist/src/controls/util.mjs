import { resolveOrigin } from '../util/misc/resolveOrigin.mjs';
import { Point } from '../Point.mjs';
import { radiansToDegrees, degreesToRadians } from '../util/misc/radiansDegreesConversion.mjs';
import { CENTER } from '../constants.mjs';

const NOT_ALLOWED_CURSOR = 'not-allowed';

/**
 * @param {Boolean} alreadySelected true if target is already selected
 * @param {String} corner a string representing the corner ml, mr, tl ...
 * @param {Event} e Event object
 * @param {FabricObject} [target] inserted back to help overriding. Unused
 */
const getActionFromCorner = (alreadySelected, corner, e, target) => {
  if (!corner || !alreadySelected) {
    return 'drag';
  }
  const control = target.controls[corner];
  return control.getActionName(e, control, target);
};

/**
 * Checks if transform is centered
 * @param {Object} transform transform data
 * @return {Boolean} true if transform is centered
 */
function isTransformCentered(transform) {
  return resolveOrigin(transform.originX) === resolveOrigin(CENTER) && resolveOrigin(transform.originY) === resolveOrigin(CENTER);
}
function invertOrigin(origin) {
  return -resolveOrigin(origin) + 0.5;
}
const isLocked = (target, lockingKey) => target[lockingKey];
const commonEventInfo = (eventData, transform, x, y) => {
  return {
    e: eventData,
    transform,
    pointer: new Point(x, y)
  };
};

/**
 * Combine control position and object angle to find the control direction compared
 * to the object center.
 * @param {FabricObject} fabricObject the fabric object for which we are rendering controls
 * @param {Control} control the control class
 * @return {Number} 0 - 7 a quadrant number
 */
function findCornerQuadrant(fabricObject, control) {
  //  angle is relative to canvas plane
  const angle = fabricObject.getTotalAngle(),
    cornerAngle = angle + radiansToDegrees(Math.atan2(control.y, control.x)) + 360;
  return Math.round(cornerAngle % 360 / 45);
}

/**
 * @returns the normalized point (rotated relative to center) in local coordinates
 */
function normalizePoint(target, point, originX, originY) {
  const center = target.getRelativeCenterPoint(),
    p = typeof originX !== 'undefined' && typeof originY !== 'undefined' ? target.translateToGivenOrigin(center, CENTER, CENTER, originX, originY) : new Point(target.left, target.top),
    p2 = target.angle ? point.rotate(-degreesToRadians(target.angle), center) : point;
  return p2.subtract(p);
}

/**
 * Transforms a point to the offset from the given origin
 * @param {Object} transform
 * @param {String} originX
 * @param {String} originY
 * @param {number} x
 * @param {number} y
 * @return {Fabric.Point} the normalized point
 */
function getLocalPoint(_ref, originX, originY, x, y) {
  var _target$canvas;
  let {
    target,
    corner
  } = _ref;
  const control = target.controls[corner],
    zoom = ((_target$canvas = target.canvas) === null || _target$canvas === void 0 ? void 0 : _target$canvas.getZoom()) || 1,
    padding = target.padding / zoom,
    localPoint = normalizePoint(target, new Point(x, y), originX, originY);
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

export { NOT_ALLOWED_CURSOR, commonEventInfo, findCornerQuadrant, getActionFromCorner, getLocalPoint, invertOrigin, isLocked, isTransformCentered };
//# sourceMappingURL=util.mjs.map
