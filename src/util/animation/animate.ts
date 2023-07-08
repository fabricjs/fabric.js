import type { ArrayAnimationOptions } from './ArrayAnimation';
import { ArrayAnimation } from './ArrayAnimation';
import type { ColorAnimationOptions } from './ColorAnimation';
import { ColorAnimation } from './ColorAnimation';
import type { PathAnimationOptions } from './PathAnimation';
import { PathAnimation } from './PathAnimation';
import type { ValueAnimationOptions } from './ValueAnimation';
import { ValueAnimation } from './ValueAnimation';

export type AnimationOptionsRegistry = {
  value: ValueAnimationOptions;
  array: ArrayAnimationOptions;
  color: ColorAnimationOptions;
  path: PathAnimationOptions;
};

export type AnimationRegistry = {
  value: ValueAnimation;
  array: ArrayAnimation;
  color: ColorAnimation;
  path: PathAnimation;
};

export type AnimationTypeFromOptions<
  T extends AnimationOptionsRegistry[keyof AnimationOptionsRegistry]
> = T extends ColorAnimationOptions
  ? 'color'
  : T extends PathAnimationOptions
  ? 'path'
  : T extends ArrayAnimationOptions
  ? 'array'
  : 'value';

export type AnimateTypes = 'path' | 'array' | 'value';

/**
 * Animates through a given path
 *
 * @example
 * animate({
 *   path,
 *   startValue: 0,
 *   endValue: '50%',
 *   onChange: ({ x, y }) => {
 *     obj.setXY(new Point(x, y), 'center', 'center');
 *     obj.setCoords();
 *     // since we are running in a requested frame we should call `renderAll` and not `requestRenderAll`
 *     canvas.renderAll();
 *   }
 * });
 */
export function animate(options: PathAnimationOptions): PathAnimation;
/**
 * Changes values from startValue to endValue within a certain period of time,
 * invoking callbacks as the values change.
 *
 * @example
 * animate({
 *   startValue: [1, 2, 3],
 *   endValue: [2, 4, 6],
 *   onChange: ([x, y, zoom]) => {
 *     canvas.zoomToPoint(new Point(x, y), zoom);
 *     // since we are running in a requested frame we should call `renderAll` and not `requestRenderAll`
 *     canvas.renderAll();
 *   }
 * });
 */
export function animate(options: ArrayAnimationOptions): ArrayAnimation;
/**
 * Changes a value from startValue to endValue within a certain period of time,
 * invoking callbacks as the value change.
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
 */
export function animate(options: ValueAnimationOptions): ValueAnimation;
export function animate<T extends AnimateTypes>(
  options: AnimationOptionsRegistry[T]
): AnimationRegistry[T];
export function animate<T extends AnimateTypes, R extends AnimationRegistry[T]>(
  options: AnimationOptionsRegistry[T]
): R {
  const animation = (
    (options as PathAnimationOptions).path
      ? new PathAnimation(options as PathAnimationOptions)
      : Array.isArray(options.startValue) || Array.isArray(options.endValue)
      ? new ArrayAnimation(options as ArrayAnimationOptions)
      : new ValueAnimation(options as ValueAnimationOptions)
  ) as R;
  animation.start();
  return animation;
}

export function animateColor(options: ColorAnimationOptions) {
  const animation = new ColorAnimation(options);
  animation.start();
  return animation;
}
