import { Point } from '../Point.mjs';
import { getScrollLeftTop } from './dom_misc.mjs';

const touchEvents = ['touchstart', 'touchmove', 'touchend'];
function getTouchInfo(event) {
  const touchProp = event.changedTouches;
  if (touchProp && touchProp[0]) {
    return touchProp[0];
  }
  return event;
}
const getPointer = event => {
  const element = event.target,
    scroll = getScrollLeftTop(element),
    _evt = getTouchInfo(event);
  return new Point(_evt.clientX + scroll.left, _evt.clientY + scroll.top);
};
const isTouchEvent = event => touchEvents.includes(event.type) || event.pointerType === 'touch';
const stopEvent = e => {
  e.preventDefault();
  e.stopPropagation();
};

export { getPointer, isTouchEvent, stopEvent };
//# sourceMappingURL=dom_event.mjs.map
