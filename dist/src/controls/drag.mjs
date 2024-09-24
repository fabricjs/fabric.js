import { LEFT, TOP, MOVING } from '../constants.mjs';
import { fireEvent } from './fireEvent.mjs';
import { isLocked, commonEventInfo } from './util.mjs';

/**
 * Action handler
 * @private
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if the translation occurred
 */
const dragHandler = (eventData, transform, x, y) => {
  const {
      target,
      offsetX,
      offsetY
    } = transform,
    newLeft = x - offsetX,
    newTop = y - offsetY,
    moveX = !isLocked(target, 'lockMovementX') && target.left !== newLeft,
    moveY = !isLocked(target, 'lockMovementY') && target.top !== newTop;
  moveX && target.set(LEFT, newLeft);
  moveY && target.set(TOP, newTop);
  if (moveX || moveY) {
    fireEvent(MOVING, commonEventInfo(eventData, transform, x, y));
  }
  return moveX || moveY;
};

export { dragHandler };
//# sourceMappingURL=drag.mjs.map
