import { ArrayAnimation, ValueAnimation } from './Animation';
import { AnimationOptions, ArrayAnimationOptions } from './types';

const isArrayAnimation = (
  options: ArrayAnimationOptions | AnimationOptions
): options is ArrayAnimationOptions => {
  return (
    Array.isArray(options.startValue) ||
    Array.isArray(options.endValue) ||
    Array.isArray(options.byValue)
  );
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
export const animate = (options: AnimationOptions | ArrayAnimationOptions) =>
  (isArrayAnimation(options)
    ? new ArrayAnimation(options)
    : new ValueAnimation(options)
  ).start();
