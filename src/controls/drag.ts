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
  const { target, lastX, lastY } = transform;
  if (
    target.translate(
      !isLocked(target, 'lockMovementX') ? x - lastX : 0,
      !isLocked(target, 'lockMovementY') ? y - lastY : 0
    )
  ) {
    fireEvent('moving', commonEventInfo(eventData, transform, x, y));
    return true;
  }
  return false;
};
