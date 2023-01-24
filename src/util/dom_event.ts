//@ts-nocheck
import { Point } from '../Point';
import { getScrollLeftTop } from './dom_misc';

const touchEvents = ['touchstart', 'touchmove', 'touchend'];

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
