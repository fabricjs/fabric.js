import { ValueAnimation } from './ValueAnimation';
import { ArrayAnimation } from './ArrayAnimation';
import { ColorAnimation } from './ColorAnimation';
import {
  ValueAnimationOptions,
  ArrayAnimationOptions,
  ColorAnimationOptions,
} from './types';
import { Color, TColorArg } from '../../color/color.class';

const isColorAnimation = (
  options: ColorAnimationOptions | ArrayAnimationOptions | ValueAnimationOptions
): options is ColorAnimationOptions => {
  return (
    options.startValue instanceof Color || options.endValue instanceof Color
  );
};

const isArrayAnimation = (
  options: ArrayAnimationOptions | ValueAnimationOptions
): options is ArrayAnimationOptions => {
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
export function animate(options: ColorAnimationOptions): ColorAnimation;
export function animate(options: ArrayAnimationOptions): ArrayAnimation;
export function animate(options: ValueAnimationOptions): ValueAnimation;
export function animate<
  T extends ValueAnimationOptions | ArrayAnimationOptions,
  R extends T extends ColorAnimationOptions
    ? ColorAnimation
    : T extends ArrayAnimationOptions
    ? ArrayAnimation
    : ValueAnimation
>(options: T): R {
  const animation = (
    isColorAnimation(options)
      ? new ColorAnimation(options)
      : isArrayAnimation(options)
      ? new ArrayAnimation(options)
      : new ValueAnimation(options)
  ) as R;
  animation.start();
  return animation;
}

/**
 * @deprecated use {@link animate}
 */
export function animateColor({
  startValue,
  endValue,
  ...options
}: ColorAnimationOptions & {
  startValue?: TColorArg;
  endValue?: TColorArg;
}) {
  return animate({
    ...options,
    startValue: new Color(startValue),
    endValue: new Color(endValue),
  });
}
