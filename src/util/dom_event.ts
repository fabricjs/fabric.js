//@ts-nocheck
import { Point } from '../Point';

const touchEvents = ['touchstart', 'touchmove', 'touchend'];

function getTouchInfo(event) {
  const touchProp = event.changedTouches;
  if (touchProp && touchProp[0]) {
    return touchProp[0];
  }
  return event;
}

export const getPointer = (event) => {
  if (isTouchEvent(event)) {
    const _evt = getTouchInfo(event);
    // write code for safari < 13
    return new Point(0,0);
  }
  return new Point(event.offsetX, event.offsetY);
};

export const isTouchEvent = (event) =>
  touchEvents.indexOf(event.type) > -1 || event.pointerType === 'touch';

export const stopEvent = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
};
