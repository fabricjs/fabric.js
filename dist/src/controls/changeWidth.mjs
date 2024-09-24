import { RESIZING, CENTER, RIGHT, LEFT } from '../constants.mjs';
import { resolveOrigin } from '../util/misc/resolveOrigin.mjs';
import { getLocalPoint, isTransformCentered } from './util.mjs';
import { wrapWithFireEvent } from './wrapWithFireEvent.mjs';
import { wrapWithFixedAnchor } from './wrapWithFixedAnchor.mjs';

/**
 * Action handler to change object's width
 * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
const changeObjectWidth = (eventData, transform, x, y) => {
  const localPoint = getLocalPoint(transform, transform.originX, transform.originY, x, y);
  //  make sure the control changes width ONLY from it's side of target
  if (resolveOrigin(transform.originX) === resolveOrigin(CENTER) || resolveOrigin(transform.originX) === resolveOrigin(RIGHT) && localPoint.x < 0 || resolveOrigin(transform.originX) === resolveOrigin(LEFT) && localPoint.x > 0) {
    const {
        target
      } = transform,
      strokePadding = target.strokeWidth / (target.strokeUniform ? target.scaleX : 1),
      multiplier = isTransformCentered(transform) ? 2 : 1,
      oldWidth = target.width,
      newWidth = Math.ceil(Math.abs(localPoint.x * multiplier / target.scaleX) - strokePadding);
    target.set('width', Math.max(newWidth, 0));
    //  check against actual target width in case `newWidth` was rejected
    return oldWidth !== target.width;
  }
  return false;
};
const changeWidth = wrapWithFireEvent(RESIZING, wrapWithFixedAnchor(changeObjectWidth));

export { changeObjectWidth, changeWidth };
//# sourceMappingURL=changeWidth.mjs.map
