import type {
  ControlCursorCallback,
  TPointerEvent,
  Transform,
  TransformActionHandler,
} from '../EventTypeDefs';
import { resolveOrigin } from '../util/misc/resolveOrigin';
import { Point } from '../Point';
import type { TAxis, TAxisKey } from '../typedefs';
import {
  degreesToRadians,
  radiansToDegrees,
} from '../util/misc/radiansDegreesConversion';
import {
  findCornerQuadrant,
  getLocalPoint,
  isLocked,
  NOT_ALLOWED_CURSOR,
} from './util';
import { wrapWithFireEvent } from './wrapWithFireEvent';
import { wrapWithFixedAnchor } from './wrapWithFixedAnchor';
import {
  CENTER,
  SCALE_X,
  SCALE_Y,
  SKEWING,
  SKEW_X,
  SKEW_Y,
} from '../constants';

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
    scale: SCALE_X,
    skew: SKEW_X,
    lockSkewing: 'lockSkewingX',
    origin: 'originX',
    flip: 'flipX',
  },
  y: {
    counterAxis: 'x',
    scale: SCALE_Y,
    skew: SKEW_Y,
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
  fabricObject,
  coord,
) => {
  if (control.x !== 0 && isLocked(fabricObject, 'lockSkewingY')) {
    return NOT_ALLOWED_CURSOR;
  }
  if (control.y !== 0 && isLocked(fabricObject, 'lockSkewingX')) {
    return NOT_ALLOWED_CURSOR;
  }
  const n = findCornerQuadrant(fabricObject, control, coord) % 4;
  return `${skewMap[n]}-resize`;
};

/**
 * Since skewing is applied before scaling, calculations are done in a scaleless plane
 * @see https://github.com/fabricjs/fabric.js/pull/8380
 */
function skewObject(
  axis: TAxis,
  { target, ex, ey, skewingSide, ...transform }: SkewTransform,
  pointer: Point,
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
      target.set(SCALE_X, compensationFactor * scaleX);
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
function skewHandler(
  axis: TAxis,
  eventData: TPointerEvent,
  transform: Transform,
  x: number,
  y: number,
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
        getLocalPoint(transform, CENTER, CENTER, x, y)[axis] > 0) ||
      // in case target has skewing we use that as the direction
      target[skewKey] > 0
        ? 1
        : -1) * skewingSide,
    // anchor to the opposite side of the skewing direction
    // normalize value from [-1, 1] to origin value [0, 1]
    origin = -skewingDirection * 0.5 + 0.5;

  const finalHandler = wrapWithFireEvent<SkewTransform>(
    SKEWING,
    wrapWithFixedAnchor((eventData, transform, x, y) =>
      skewObject(axis, transform, new Point(x, y)),
    ),
  );

  return finalHandler(
    eventData,
    {
      ...transform,
      [originKey]: origin,
      skewingSide,
    },
    x,
    y,
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
  y,
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
  y,
) => {
  return skewHandler('y', eventData, transform, x, y);
};
