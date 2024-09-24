import { ValueAnimation } from './ValueAnimation.mjs';
import { ArrayAnimation } from './ArrayAnimation.mjs';
import { ColorAnimation } from './ColorAnimation.mjs';

const isArrayAnimation = options => {
  return Array.isArray(options.startValue) || Array.isArray(options.endValue);
};

/**
 * Changes value(s) from startValue to endValue within a certain period of time,
 * invoking callbacks as the value(s) change.
 *
 * @example
 * animate({
 *   startValue: 1,
 *   endValue: 0,
 *   onChange: (v) => {
 *     obj.set('opacity', v);
 *     // since we are running in a requested frame we should call `renderAll` and not `requestRenderAll`
 *     canvas.renderAll();
 *   }
 * });
 *
 * @example Using lists:
 * animate({
 *   startValue: [1, 2, 3],
 *   endValue: [2, 4, 6],
 *   onChange: ([x, y, zoom]) => {
 *     canvas.zoomToPoint(new Point(x, y), zoom);
 *     canvas.renderAll();
 *   }
 * });
 *
 */

function animate(options) {
  const animation = isArrayAnimation(options) ? new ArrayAnimation(options) : new ValueAnimation(options);
  animation.start();
  return animation;
}
function animateColor(options) {
  const animation = new ColorAnimation(options);
  animation.start();
  return animation;
}

export { animate, animateColor };
//# sourceMappingURL=animate.mjs.map
