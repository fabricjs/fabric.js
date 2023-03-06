//@ts-nocheck
import { Point } from '../Point';
import { getElementOffset } from './dom_misc';
const touchEvents = ['touchstart', 'touchmove', 'touchend'];

function getTouchInfo(event) {
  const touchProp = event.changedTouches;
  if (touchProp && touchProp[0]) {
    return touchProp[0];
  }
  return event;
}

export const getPointer = (event) => {
  let _evt = event;
  if (isTouchEvent(event)) {
    _evt = getTouchInfo(event);
  }
  const { left, top } = getElementOffset(event.target);
  return new Point(_evt.clientX, _evt.clientY).subtract(new Point(left, top));
};

export const isTouchEvent = (event) =>
  touchEvents.indexOf(event.type) > -1 || event.pointerType === 'touch';

export const stopEvent = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
};
