import type { TransformActionHandler } from '../EventTypeDefs';
import { RESIZING } from '../constants';
import { resolveOrigin } from '../util/misc/resolveOrigin';
import { getLocalPoint, isTransformCentered } from './util';
import { wrapWithFireEvent } from './wrapWithFireEvent';
import { wrapWithFixedAnchor } from './wrapWithFixedAnchor';

export const changeObjectDimensionGen =
  (
    dimension: 'width' | 'height',
    origin: 'originX' | 'originY',
    xorY: 'x' | 'y',
    scale: 'scaleX' | 'scaleY',
  ): TransformActionHandler =>
  (eventData, transform, x, y) => {
    const localPoint = getLocalPoint(
      transform,
      transform.originX,
      transform.originY,
      x,
      y,
    );
    const localPointValue = localPoint[xorY];
    //  make sure the control changes width ONLY from it's side of target
    const originValue = resolveOrigin(transform[origin]);
    if (
      originValue === 0 ||
      (originValue > 0 && localPointValue < 0) ||
      (originValue < 0 && localPointValue > 0)
    ) {
      const { target } = transform,
        strokePadding =
          target.strokeWidth / (target.strokeUniform ? target[scale] : 1),
        multiplier = isTransformCentered(transform) ? 2 : 1,
        oldWidth = target[dimension],
        newWidth =
          Math.abs((localPointValue * multiplier) / target[scale]) -
          strokePadding;
      target.set(dimension, Math.max(newWidth, 1));
      //  check against actual target width in case `newWidth` was rejected
      return oldWidth !== target[dimension];
    }
    return false;
  };

/**
 * Action handler to change object's width
 * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
 * You want to use this only if you are building a new control handler and you want
 * to reuse some logic. use "changeWidth" if you are looking to just use a control for width
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
export const changeObjectWidth: TransformActionHandler =
  changeObjectDimensionGen('width', 'originX', 'x', 'scaleX');

/**
 * Action handler to change object's height
 * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
 * You want to use this only if you are building a new control handler and you want
 * to reuse some logic. use "changeHeight" if you are looking to just use a control for height
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
export const changeObjectHeight: TransformActionHandler =
  changeObjectDimensionGen('height', 'originY', 'y', 'scaleY');

/**
 * Control handler for changing width
 */
export const changeWidth = wrapWithFireEvent(
  RESIZING,
  wrapWithFixedAnchor(changeObjectWidth),
);

/**
 * Control handler for changing height
 */
export const changeHeight = wrapWithFireEvent(
  RESIZING,
  wrapWithFixedAnchor(changeObjectHeight),
);
