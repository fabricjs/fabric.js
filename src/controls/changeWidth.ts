import type { TransformActionHandler } from '../EventTypeDefs';
import { RESIZING } from '../constants';
import { resolveOrigin } from '../util/misc/resolveOrigin';
import { getLocalPoint, isTransformCentered } from './util';
import { wrapWithFireEvent } from './wrapWithFireEvent';
import { wrapWithFixedAnchor } from './wrapWithFixedAnchor';

/**
 * Action handler to change object's width
 * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
export const changeObjectWidth: TransformActionHandler = (
  eventData,
  transform,
  x,
  y,
) => {
  const localPoint = getLocalPoint(
    transform,
    transform.originX,
    transform.originY,
    x,
    y,
  );
  //  make sure the control changes width ONLY from it's side of target
  const originX = resolveOrigin(transform.originX);
  if (
    originX === 0 ||
    (originX > 0 &&
      localPoint.x < 0) ||
    (originX < 0 &&
      localPoint.x > 0)
  ) {
    const { target } = transform,
      strokePadding =
        target.strokeWidth / (target.strokeUniform ? target.scaleX : 1),
      multiplier = isTransformCentered(transform) ? 2 : 1,
      oldWidth = target.width,
      newWidth =
        Math.abs((localPoint.x * multiplier) / target.scaleX) - strokePadding;
    target.set('width', Math.max(newWidth, 1));
    //  check against actual target width in case `newWidth` was rejected
    return oldWidth !== target.width;
  }
  return false;
};

export const changeObjectDimensionGen = (origin: 'originX' | 'originY', xorY: 'x' | 'y', scale: 'scaleX' | 'scaleY'):TransformActionHandler => (
  eventData,
  transform,
  x,
  y,
) => {
  const localPoint = getLocalPoint(
    transform,
    transform.originX,
    transform.originY,
    x,
    y,
  );
  //  make sure the control changes width ONLY from it's side of target
  const originValue = resolveOrigin(transform[origin]);
  if (
    originValue === 0 ||
    (originValue > 0 &&
      localPoint[xorY] < 0) ||
    (originValue < 0 &&
      localPoint[xorY] > 0)
  ) {
    const { target } = transform,
      strokePadding =
        target.strokeWidth / (target.strokeUniform ? target[scale] : 1),
      multiplier = isTransformCentered(transform) ? 2 : 1,
      oldWidth = target.width,
      newWidth =
        Math.abs((localPoint.x * multiplier) / target[scale]) - strokePadding;
    target.set('width', Math.max(newWidth, 1));
    //  check against actual target width in case `newWidth` was rejected
    return oldWidth !== target.width;
  }
  return false;
};

export const changeWidth = wrapWithFireEvent(
  RESIZING,
  wrapWithFixedAnchor(changeObjectWidth),
);
