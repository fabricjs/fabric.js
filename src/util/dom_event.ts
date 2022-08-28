//@ts-nocheck
import { Point } from '../point.class';

const touchEvents = ['touchstart', 'touchmove', 'touchend'];

/**
 * Adds an event listener to an element
 * @function
 * @deprecated
 * @memberOf fabric.util
 * @param {HTMLElement} element
 * @param {String} eventName
 * @param {Function} handler
 */
export const addListener = (element, eventName, handler, options) =>
  element && element.addEventListener(eventName, handler, options);

/**
 * Removes an event listener from an element
 * @function
 * @deprecated
 * @memberOf fabric.util
 * @param {HTMLElement} element
 * @param {String} eventName
 * @param {Function} handler
 */
 export const removeListener = (element, eventName, handler, options) =>
  element && element.removeEventListener(eventName, handler, options);

function getTouchInfo(event) {
  const touchProp = event.changedTouches;
  if (touchProp && touchProp[0]) {
    return touchProp[0];
  }
  return event;
}

export const getPointer = (event) => {
  const element = event.target,
        scroll = fabric.util.getScrollLeftTop(element),
        _evt = getTouchInfo(event);
  return new Point(_evt.clientX + scroll.left, _evt.clientY + scroll.top);
};

export const isTouchEvent = (event) =>
  touchEvents.indexOf(event.type) > -1 || event.pointerType === 'touch';
