import type { TransformActionHandler } from '../EventTypeDefs';
import { CENTER, LEFT, RESIZING, RIGHT, BOTTOM, TOP } from '../constants';
import { resolveOrigin } from '../util/misc/resolveOrigin';
import { getLocalPoint, isTransformCentered } from './util';
import { wrapWithFireEvent } from './wrapWithFireEvent';
import { wrapWithFixedAnchor } from './wrapWithFixedAnchor';

const changeObjectSize =
  (
    originName: 'originX' | 'originY',
    localCoord: 'x' | 'y',
    scaleProp: 'scaleX' | 'scaleY',
    prop: 'width' | 'height',
  ): TransformActionHandler =>
  (eventData, transform, x, y): boolean => {
    const localPoint = getLocalPoint(
      transform,
      transform.originX,
      transform.originY,
      x,
      y,
    );
    const coord = localPoint[localCoord];
    const origin = resolveOrigin(transform[originName]);
    //  make sure the control changes width ONLY from it's side of target
    if (
      origin === resolveOrigin(CENTER) ||
      (origin === resolveOrigin(prop === 'width' ? RIGHT : BOTTOM) &&
        coord < 0) ||
      (origin === resolveOrigin(prop === 'width' ? LEFT : TOP) && coord > 0)
    ) {
      const { target } = transform,
        strokePadding =
          target.strokeWidth / (target.strokeUniform ? target[scaleProp] : 1),
        multiplier = isTransformCentered(transform) ? 2 : 1,
        oldSize = target[prop],
        newSize =
          Math.abs((coord * multiplier) / target[scaleProp]) - strokePadding;
      target.set(prop, Math.max(newSize, 1));
      //  check against actual target width in case `newWidth` was rejected
      return oldSize !== target[prop];
    }
    return false;
  };

/**
 * Action handler to change object's width
 * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
export const changeObjectWidth = changeObjectSize(
  'originX',
  'x',
  'scaleX',
  'width',
);

/**
 * Action handler to change object's height
 * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
export const changeObjectHeight = changeObjectSize(
  'originY',
  'y',
  'scaleY',
  'height',
);

export const changeWidth = wrapWithFireEvent(
  RESIZING,
  wrapWithFixedAnchor(changeObjectWidth),
);

export const changeHeight = wrapWithFireEvent(
  RESIZING,
  wrapWithFixedAnchor(changeObjectHeight),
);
