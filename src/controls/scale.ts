import {
  ControlCursorCallback,
  TPointerEvent,
  Transform,
  TransformActionHandler,
} from '../EventTypeDefs';
import type { FabricObject } from '../shapes/Object/FabricObject';
import { TAxis } from '../typedefs';
import type { Canvas } from '../canvas/Canvas';
import {
  findCornerQuadrant,
  isLocked,
  isTransformCentered,
  NOT_ALLOWED_CURSOR,
} from './util';
import { wrapWithFireEvent } from './wrapWithFireEvent';
import { wrapWithFixedAnchor } from './wrapWithFixedAnchor';
import { Point } from '../Point';
import { resolveOriginPoint } from '../util/misc/resolveOrigin';
import { dotProduct } from '../util/misc/vectors';

type ScaleTransform = Transform & {
  gestureScale?: number;
};

/**
 * Inspect event and fabricObject properties to understand if the scaling action
 * @param {Event} eventData from the user action
 * @param {FabricObject} fabricObject the fabric object about to scale
 * @return {Boolean} true if scale is proportional
 */
export function scaleIsProportional(
  eventData: TPointerEvent,
  fabricObject: FabricObject
): boolean {
  const canvas = fabricObject.canvas as Canvas,
    uniformIsToggled = eventData[canvas.uniScaleKey!];
  return (
    (canvas.uniformScaling && !uniformIsToggled) ||
    (!canvas.uniformScaling && uniformIsToggled)
  );
}

/**
 * Inspect fabricObject to understand if the current scaling action is allowed
 * @param {FabricObject} fabricObject the fabric object about to scale
 * @param {String} by 'x' or 'y' or ''
 * @param {Boolean} scaleProportionally true if we are trying to scale proportionally
 * @return {Boolean} true if scaling is not allowed at current conditions
 */
export function scalingIsForbidden(
  fabricObject: FabricObject,
  by: TAxis | undefined,
  scaleProportionally: boolean
) {
  const lockX = isLocked(fabricObject, 'lockScalingX'),
    lockY = isLocked(fabricObject, 'lockScalingY');
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

const scaleMap = ['e', 'se', 's', 'sw', 'w', 'nw', 'n', 'ne', 'e'];

/**
 * return the correct cursor style for the scale action
 * @param {Event} eventData the javascript event that is causing the scale
 * @param {Control} control the control that is interested in the action
 * @param {FabricObject} fabricObject the fabric object that is interested in the action
 * @return {String} a valid css string for the cursor
 */
export const scaleCursorStyleHandler: ControlCursorCallback = (
  eventData,
  control,
  fabricObject
) => {
  const scaleProportionally = scaleIsProportional(eventData, fabricObject),
    by =
      control.x !== 0 && control.y === 0
        ? 'x'
        : control.x === 0 && control.y !== 0
        ? 'y'
        : undefined;
  if (scalingIsForbidden(fabricObject, by, scaleProportionally)) {
    return NOT_ALLOWED_CURSOR;
  }
  const n = findCornerQuadrant(fabricObject, control);
  return `${scaleMap[n]}-resize`;
};

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
function scaleObject(
  eventData: TPointerEvent,
  { target, gestureScale, originX, originY, lastX, lastY }: ScaleTransform,
  x: number,
  y: number,
  { by }: { by?: TAxis } = {}
) {
  const scaleProportionally = scaleIsProportional(eventData, target);
  const sideVectorX = new Point(1, 0);
  const sideVectorY = new Point(0, 1);
  let scaleX = 1,
    scaleY = 1;

  if (scalingIsForbidden(target, by, scaleProportionally)) {
    return false;
  }

  if (gestureScale) {
    scaleX = scaleY = gestureScale;
  } else {
    const anchorOrigin = resolveOriginPoint(originX, originY);
    const offsetFromAnchorOrigin = target.bbox
      .pointToOrigin(new Point(x, y))
      .subtract(anchorOrigin);
    const prevOffsetFromAnchorOrigin = target.bbox
      .pointToOrigin(new Point(lastX, lastY))
      .subtract(anchorOrigin);
    // account for scaling origin
    const transformCenterFactor = isTransformCentered({ originX, originY })
      ? 2
      : 1;

    if (scaleProportionally && !by) {
      // proportional scaling
      const scale =
        (Math.abs(offsetFromAnchorOrigin.x) +
          Math.abs(offsetFromAnchorOrigin.y)) /
        (Math.abs(prevOffsetFromAnchorOrigin.x) +
          Math.abs(prevOffsetFromAnchorOrigin.y));

      scaleX =
        scale *
        (Math.sign(offsetFromAnchorOrigin.x) || 1) *
        transformCenterFactor;
      scaleY =
        scale *
        (Math.sign(offsetFromAnchorOrigin.y) || 1) *
        transformCenterFactor;
    } else {
      scaleX =
        dotProduct(offsetFromAnchorOrigin, sideVectorX) *
        (offsetFromAnchorOrigin.x !== 0 &&
        Math.sign(offsetFromAnchorOrigin.x) !==
          Math.sign(prevOffsetFromAnchorOrigin.x)
          ? -1
          : 1) *
        transformCenterFactor;
      scaleY =
        dotProduct(offsetFromAnchorOrigin, sideVectorY) *
        (offsetFromAnchorOrigin.y !== 0 &&
        Math.sign(offsetFromAnchorOrigin.y) !==
          Math.sign(prevOffsetFromAnchorOrigin.y)
          ? -1
          : 1) *
        transformCenterFactor;
    }
  }
  return target.scaleBy(
    // minScale is taken care of in the setter.
    // calcBaseChangeMatrix(
    //   [sideVectorX, sideVectorY],
    //   [
    //     !isLocked(target, 'lockScalingX') &&
    //     (!isLocked(target, 'lockScalingFlip') ||
    //       Math.sign(sideVectorXAfter.x) !== Math.sign(sideVectorX.x)) &&
    //     (!by || by === 'x')
    //       ? sideVectorXAfter
    //       : sideVectorX,
    //     !isLocked(target, 'lockScalingY') &&
    //     (!isLocked(target, 'lockScalingFlip') ||
    //       Math.sign(sideVectorXAfter.y) !== Math.sign(sideVectorX.y)) &&
    //     (!by || by === 'y')
    //       ? sideVectorYAfter
    //       : sideVectorY,
    //   ]
    !isLocked(target, 'lockScalingX') &&
      (!isLocked(target, 'lockScalingFlip') || scaleX > 0) &&
      (!by || by === 'x')
      ? scaleX
      : 1,
    !isLocked(target, 'lockScalingY') &&
      (!isLocked(target, 'lockScalingFlip') || scaleY > 0) &&
      (!by || by === 'y')
      ? scaleY
      : 1,
    {
      originX,
      originY,
      inViewport: true,
    }
  );

  // minScale is taken care of in the setter.
  // return target.scaleBy(
  //   !isLocked(target, 'lockScalingX') &&
  //     (!isLocked(target, 'lockScalingFlip') || scaleX > 0)
  //     ? Math.abs(scaleX) === Infinity
  //       ? Math.sign(delta.x)
  //       : scaleX
  //     : 1,
  //   !isLocked(target, 'lockScalingY') &&
  //     (!isLocked(target, 'lockScalingFlip') || scaleY > 0)
  //     ? Math.abs(scaleY) === Infinity
  //       ? Math.sign(delta.y)
  //       : scaleY
  //     : 1,
  //   {
  //     originX,
  //     originY,
  //     inViewport: true,
  //   }
  // );
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
export const scaleObjectFromCorner: TransformActionHandler<ScaleTransform> = (
  eventData,
  transform,
  x,
  y
) => {
  return scaleObject(eventData, transform, x, y);
};

/**
 * Scaling logic for the X axis.
 * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
const scaleObjectX: TransformActionHandler<ScaleTransform> = (
  eventData,
  transform,
  x,
  y
) => {
  return scaleObject(eventData, transform, x, y, { by: 'x' });
};

/**
 * Scaling logic for the Y axis.
 * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
const scaleObjectY: TransformActionHandler<ScaleTransform> = (
  eventData,
  transform,
  x,
  y
) => {
  return scaleObject(eventData, transform, x, y, { by: 'y' });
};

export const scalingEqually = wrapWithFireEvent(
  'scaling',
  wrapWithFixedAnchor(scaleObjectFromCorner)
);

export const scalingX = wrapWithFireEvent(
  'scaling',
  wrapWithFixedAnchor(scaleObjectX)
);

export const scalingY = wrapWithFireEvent(
  'scaling',
  wrapWithFixedAnchor(scaleObjectY)
);
