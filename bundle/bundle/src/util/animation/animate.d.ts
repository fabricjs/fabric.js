import { ValueAnimation } from './ValueAnimation';
import { ArrayAnimation } from './ArrayAnimation';
import { ColorAnimation } from './ColorAnimation';
import { AnimationOptions, ArrayAnimationOptions, ColorAnimationOptions } from './types';
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
export declare const animate: <T extends AnimationOptions | ArrayAnimationOptions, R extends T extends ArrayAnimationOptions ? ArrayAnimation : ValueAnimation>(options: T) => R;
export declare const animateColor: (options: ColorAnimationOptions) => ColorAnimation;
//# sourceMappingURL=animate.d.ts.map