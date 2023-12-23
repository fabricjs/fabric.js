import {
  ControlCursorCallback,
  TPointerEvent,
  Transform,
  TransformActionHandler,
} from '../EventTypeDefs';
import { Point } from '../Point';
import { TAxis, TAxisKey } from '../typedefs';
import { findCornerQuadrant, isLocked, NOT_ALLOWED_CURSOR } from './util';
import { calcAngleBetweenVectors, createVector } from '../util/misc/vectors';
import { sendPointToPlane } from '../util/misc/planeChange';
import { radiansToDegrees } from '../util/misc/radiansDegreesConversion';

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

export function skewObject(
  axis: TAxis,
  eventData: TPointerEvent,
  { target, lastX, lastY, originX, originY }: Transform,
  x: number,
  y: number
) {
  const pivotPoint = sendPointToPlane(
    target.getXY(originX, originY),
    target.getViewportTransform()
  );
  const rotation = calcAngleBetweenVectors(
    createVector(pivotPoint, new Point(lastX, lastY)),
    createVector(pivotPoint, new Point(x, y))
  );
  const { x: rotateX = 0, y: rotateY = 0 } = {
    [AXIS_KEYS[axis].counterAxis]: radiansToDegrees(rotation),
  };
  return target.rotate3D(rotateX, rotateY, 0, {
    originX,
    originY,
    inViewport: true,
  });
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
export const skewHandlerX: TransformActionHandler = skewObject.bind(null, 'x');

/**
 * Wrapped Action handler for skewing on the Y axis, takes care of the
 * skew direction and determines the correct transform origin for the anchor point
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
export const skewHandlerY: TransformActionHandler = skewObject.bind(null, 'y');
