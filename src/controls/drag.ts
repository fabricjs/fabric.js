import { TransformActionHandler } from '../EventTypeDefs';
import { fireEvent } from '../util/fireEvent';
import { commonEventInfo, isLocked } from './util';

/**
 * Action handler
 * @private
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if the translation occurred
 */
export const dragHandler: TransformActionHandler = (
  eventData,
  transform,
  x,
  y
) => {
  const { target, offsetX, offsetY } = transform,
    newLeft = x - offsetX,
    newTop = y - offsetY,
    moveX = !isLocked(target, 'lockMovementX') && target.left !== newLeft,
    moveY = !isLocked(target, 'lockMovementY') && target.top !== newTop;
  moveX && target.set('left', newLeft);
  moveY && target.set('top', newTop);
  if (moveX || moveY) {
    fireEvent('moving', commonEventInfo(eventData, transform, x, y));
  }
  return moveX || moveY;
};
