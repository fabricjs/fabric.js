//@ts-nocheck
import { Point } from '../point.class';
import { getScrollLeftTop } from './dom_misc';

const touchEvents = ['touchstart', 'touchmove', 'touchend'];

/**
 * Adds an event listener to an element
 * @deprecated
 * @param {HTMLElement} element
 * @param {String} eventName
 * @param {Function} handler
 */
export const addListener = (element, eventName, handler, options) =>
  element && element.addEventListener(eventName, handler, options);

/**
 * Removes an event listener from an element
 * @deprecated
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
    scroll = getScrollLeftTop(element),
    _evt = getTouchInfo(event);
  return new Point(_evt.clientX + scroll.left, _evt.clientY + scroll.top);
};

export const isTouchEvent = (event) =>
  touchEvents.indexOf(event.type) > -1 || event.pointerType === 'touch';

export const stopEvent = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
};
