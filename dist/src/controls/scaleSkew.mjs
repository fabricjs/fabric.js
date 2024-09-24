import { SKEW_X, SCALE_Y, SKEW_Y, SCALE_X } from '../constants.mjs';
import { scaleCursorStyleHandler, scalingX, scalingY } from './scale.mjs';
import { skewCursorStyleHandler, skewHandlerY, skewHandlerX } from './skew.mjs';

function isAltAction(eventData, target) {
  return eventData[target.canvas.altActionKey];
}

/**
 * Inspect event, control and fabricObject to return the correct action name
 * @param {Event} eventData the javascript event that is causing the scale
 * @param {Control} control the control that is interested in the action
 * @param {FabricObject} fabricObject the fabric object that is interested in the action
 * @return {String} an action name
 */
const scaleOrSkewActionName = (eventData, control, fabricObject) => {
  const isAlternative = isAltAction(eventData, fabricObject);
  if (control.x === 0) {
    // then is scaleY or skewX
    return isAlternative ? SKEW_X : SCALE_Y;
  }
  if (control.y === 0) {
    // then is scaleY or skewX
    return isAlternative ? SKEW_Y : SCALE_X;
  }
  return '';
};

/**
 * Combine skew and scale style handlers to cover fabric standard use case
 * @param {Event} eventData the javascript event that is causing the scale
 * @param {Control} control the control that is interested in the action
 * @param {FabricObject} fabricObject the fabric object that is interested in the action
 * @return {String} a valid css string for the cursor
 */
const scaleSkewCursorStyleHandler = (eventData, control, fabricObject) => {
  return isAltAction(eventData, fabricObject) ? skewCursorStyleHandler(eventData, control, fabricObject) : scaleCursorStyleHandler(eventData, control, fabricObject);
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
const scalingXOrSkewingY = (eventData, transform, x, y) => {
  return isAltAction(eventData, transform.target) ? skewHandlerY(eventData, transform, x, y) : scalingX(eventData, transform, x, y);
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
const scalingYOrSkewingX = (eventData, transform, x, y) => {
  return isAltAction(eventData, transform.target) ? skewHandlerX(eventData, transform, x, y) : scalingY(eventData, transform, x, y);
};

export { scaleOrSkewActionName, scaleSkewCursorStyleHandler, scalingXOrSkewingY, scalingYOrSkewingX };
//# sourceMappingURL=scaleSkew.mjs.map
