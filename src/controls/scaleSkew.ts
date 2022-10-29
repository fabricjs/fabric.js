import type { FabricObject } from '../shapes/object.class';
import {
  ControlCallback,
  ControlCursorCallback,
  TAxisKey,
  TPointerEvent,
  TransformAction,
} from '../typedefs';
import { scaleCursorStyleHandler, scalingX, scalingY } from './scale';
import { skewCursorStyleHandler, skewHandlerX, skewHandlerY } from './skew';

function isAltAction(eventData: TPointerEvent, target: FabricObject) {
  return eventData[target.canvas?.altActionKey];
}

/**
 * Inspect event, control and fabricObject to return the correct action name
 * @param {Event} eventData the javascript event that is causing the scale
 * @param {fabric.Control} control the control that is interested in the action
 * @param {fabric.Object} fabricObject the fabric object that is interested in the action
 * @return {String} an action name
 */
export const scaleOrSkewActionName: ControlCallback<
  TAxisKey<'skew' | 'scale'> | undefined
> = (eventData, control, fabricObject) => {
  const isAlternative = isAltAction(eventData, fabricObject);
  if (control.x === 0) {
    // then is scaleY or skewX
    return isAlternative ? 'skewX' : 'scaleY';
  }
  if (control.y === 0) {
    // then is scaleY or skewX
    return isAlternative ? 'skewY' : 'scaleX';
  }
};

/**
 * Combine skew and scale style handlers to cover fabric standard use case
 * @param {Event} eventData the javascript event that is causing the scale
 * @param {fabric.Control} control the control that is interested in the action
 * @param {fabric.Object} fabricObject the fabric object that is interested in the action
 * @return {String} a valid css string for the cursor
 */
export const scaleSkewCursorStyleHandler: ControlCursorCallback = (
  eventData,
  control,
  fabricObject
) => {
  if (isAltAction(eventData, fabricObject)) {
    return skewCursorStyleHandler(eventData, control, fabricObject);
  }
  return scaleCursorStyleHandler(eventData, control, fabricObject);
};
/**
 * Composed action handler to either scale X or skew Y
 * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
export const scalingXOrSkewingY: TransformAction = (
  eventData,
  transform,
  x,
  y
) => {
  if (isAltAction(eventData, transform.target)) {
    return skewHandlerY(eventData, transform, x, y);
  }
  return scalingX(eventData, transform, x, y);
};

/**
 * Composed action handler to either scale Y or skew X
 * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
export const scalingYOrSkewingX: TransformAction = (
  eventData,
  transform,
  x,
  y
) => {
  if (isAltAction(eventData, transform.target)) {
    return skewHandlerX(eventData, transform, x, y);
  }
  return scalingY(eventData, transform, x, y);
};
