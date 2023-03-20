import {
  ControlCursorCallback,
  TPointerEvent,
  Transform,
  TransformActionHandler,
} from '../EventTypeDefs';
import { resolveOrigin, resolveOriginPoint } from '../util/misc/resolveOrigin';
import { Point } from '../Point';
import { TAxis, TAxisKey, TOriginX, TOriginY } from '../typedefs';
import { findCornerQuadrant, isLocked, NOT_ALLOWED_CURSOR } from './util';
import { wrapWithFireEvent } from './wrapWithFireEvent';
import { BBox } from '../BBox/BBox';
import { createVector, dotProduct, getUnitVector } from '../util/misc/vectors';
import type { FabricObject } from '../shapes/Object/FabricObject';

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

function getSkewingDirection(
  axis: TAxis,
  target: FabricObject,
  transform: { originX: TOriginX; originY: TOriginY },
  pointer: Point
) {
  const {
    counterAxis,
    origin: originKey,
    skew: skewKey,
    flip: flipKey,
  } = AXIS_KEYS[axis];
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
        pointer.subtract(target.getCenterPoint())[axis] > 0) ||
      // in case target has skewing we use that as the direction
      target[skewKey] > 0
        ? 1
        : -1) * skewingSide,
    // anchor to the opposite side of the skewing direction
    skewingOrigin = -skewingDirection * 0.5;

  const origin = resolveOriginPoint(transform.originX, transform.originY);
  origin[axis] = skewingOrigin;
  return {
    origin,
    skewingSide,
  };
}

function skewObject(
  axis: TAxis,
  eventData: TPointerEvent,
  { target, lastX, lastY, originX, originY }: Transform,
  x: number,
  y: number
) {
  const { lockSkewing: lockSkewingKey } = AXIS_KEYS[axis];
  if (isLocked(target, lockSkewingKey)) {
    return false;
  }
  const pointer = new Point(x, y);
  const { origin: skewingOrigin, skewingSide } = getSkewingDirection(
    axis,
    target,
    { originX, originY },
    pointer
  );
  const transformed = BBox.transformed(target);
  const { tl, tr, bl } = transformed.getCoords();
  const tSides = {
    x: createVector(tl, tr),
    y: createVector(tl, bl),
  };
  const offset = dotProduct(
    pointer.subtract(new Point(lastX, lastY)),
    tSides[axis]
  );
  const shearing = 2 * offset * skewingSide;
  const didChange = target.shearSidesBy(
    [tSides.x, tSides.y],
    [
      getUnitVector(tSides.y).scalarMultiply(axis === 'y' ? shearing : 0),
      getUnitVector(tSides.x).scalarMultiply(axis === 'x' ? shearing : 0),
    ],
    {
      originX: skewingOrigin.x + 0.5,
      originY: skewingOrigin.y + 0.5,
      inViewport: true,
    }
  );
  // we anchor to the origin of the transformed bbox
  const position = transformed.pointFromOrigin(skewingOrigin);
  const origin = target.bbox.pointToOrigin(position).scalarAdd(0.5);
  return (
    target.translateTo(position.x, position.y, {
      originX: origin.x,
      originY: origin.y,
      inViewport: true,
    }) || didChange
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
export const skewHandlerX: TransformActionHandler = wrapWithFireEvent(
  'skewing',
  skewObject.bind(null, 'x')
);

/**
 * Wrapped Action handler for skewing on the Y axis, takes care of the
 * skew direction and determines the correct transform origin for the anchor point
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
export const skewHandlerY: TransformActionHandler = wrapWithFireEvent(
  'skewing',
  skewObject.bind(null, 'y')
);
