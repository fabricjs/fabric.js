import {
  ControlCursorCallback,
  TPointerEvent,
  Transform,
  TransformActionHandler,
} from '../EventTypeDefs';
import { resolveOrigin, resolveOriginPoint } from '../util/misc/resolveOrigin';
import { Point } from '../Point';
import { TAxis, TAxisKey } from '../typedefs';
import { findCornerQuadrant, isLocked, NOT_ALLOWED_CURSOR } from './util';
import { wrapWithFireEvent } from './wrapWithFireEvent';
import { wrapWithFixedAnchor } from './wrapWithFixedAnchor';
import { BBox } from '../BBox/BBox';
import { createVector, dotProduct, getUnitVector } from '../util/misc/vectors';

export type SkewTransform = Transform & { skewingSide: -1 | 1 };

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

const skewMap = ['ns', 'nesw', 'ew', 'nwse'];

/**
 * return the correct cursor style for the skew action
 * @param {Event} eventData the javascript event that is causing the scale
 * @param {Control} control the control that is interested in the action
 * @param {FabricObject} fabricObject the fabric object that is interested in the action
 * @return {String} a valid css string for the cursor
 */
export const skewCursorStyleHandler: ControlCursorCallback = (
  eventData,
  control,
  fabricObject
) => {
  if (control.x !== 0 && isLocked(fabricObject, 'lockSkewingY')) {
    return NOT_ALLOWED_CURSOR;
  }
  if (control.y !== 0 && isLocked(fabricObject, 'lockSkewingX')) {
    return NOT_ALLOWED_CURSOR;
  }
  const n = findCornerQuadrant(fabricObject, control) % 4;
  return `${skewMap[n]}-resize`;
};

/**
 * Since skewing is applied before scaling, calculations are done in a scaleless plane
 * @see https://github.com/fabricjs/fabric.js/pull/8380
 */
function skewObject(
  axis: TAxis,
  { target, lastX, lastY, originX, originY }: SkewTransform,
  pointer: Point
) {
  const anchorOrigin = resolveOriginPoint(originX, originY);
  // const offset = dotProduct(pointer.subtract(new Point(lastX, lastY))[axis];
  const transformed = BBox.transformed(target);
  const { tl, tr, bl } = transformed.getCoords();
  const tSides = {
    x: createVector(tl, tr),
    y: createVector(tl, bl),
  };
  const offset = dotProduct(
    pointer.subtract(new Point(lastX, lastY)),
    // .subtract(transformed.pointFromOrigin(anchorOrigin)),
    tSides[axis]
  );
  console.log(offset);
  const shearing = 2 * offset;
  return target.shearSidesBy(
    [tSides.x, tSides.y],
    [
      getUnitVector(tSides.y).scalarMultiply(axis === 'y' ? shearing : 0),
      getUnitVector(tSides.x).scalarMultiply(axis === 'x' ? shearing : 0),
    ],
    { originX, originY, inViewport: true }
  );
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
function skewHandler(
  axis: TAxis,
  eventData: TPointerEvent,
  transform: Transform,
  x: number,
  y: number
) {
  const { target } = transform,
    {
      counterAxis,
      origin: originKey,
      lockSkewing: lockSkewingKey,
      skew: skewKey,
      flip: flipKey,
    } = AXIS_KEYS[axis];
  if (isLocked(target, lockSkewingKey)) {
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
    skewingSide = (-Math.sign(counterOriginFactor) *
      (target[flipKey] ? -1 : 1)) as 1 | -1,
    skewingDirection =
      ((target[skewKey] === 0 &&
        // in case skewing equals 0 we use the pointer offset from target center to determine the direction of skewing
        new Point(x, y).subtract(target.getCenterPoint())[axis] > 0) ||
      // in case target has skewing we use that as the direction
      target[skewKey] > 0
        ? 1
        : -1) * skewingSide,
    // anchor to the opposite side of the skewing direction
    // normalize value from [-1, 1] to origin value [0, 1]
    origin = -skewingDirection * 0.5 + 0.5;

  const finalHandler = wrapWithFireEvent<SkewTransform>(
    'skewing',
    wrapWithFixedAnchor((eventData, transform, x, y) =>
      skewObject(axis, transform, new Point(x, y))
    )
  );

  return finalHandler(
    eventData,
    {
      ...transform,
      // [originKey]: origin,
      // [counterOriginKey]: 'center',
      // originX: 'center',
      // originY: 'center',
      // skewingSide,
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
export const skewHandlerX: TransformActionHandler = (
  eventData,
  transform,
  x,
  y
) => {
  return skewHandler('x', eventData, transform, x, y);
};

/**
 * Wrapped Action handler for skewing on the Y axis, takes care of the
 * skew direction and determines the correct transform origin for the anchor point
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
export const skewHandlerY: TransformActionHandler = (
  eventData,
  transform,
  x,
  y
) => {
  return skewHandler('y', eventData, transform, x, y);
};
