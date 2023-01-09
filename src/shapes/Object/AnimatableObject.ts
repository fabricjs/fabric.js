import { TColorArg } from '../../color/color.class';
import { ObjectEvents } from '../../EventTypeDefs';
import { animate, animateColor } from '../../util/animation/animate';
import type {
  ValueAnimationOptions,
  ColorAnimationOptions,
  AnimationOptions,
  ArrayAnimationOptions,
} from '../../util/animation/types';
import { ArrayAnimation } from '../../util/animation/ArrayAnimation';
import type { ColorAnimation } from '../../util/animation/ColorAnimation';
import type { ValueAnimation } from '../../util/animation/ValueAnimation';
import { StackedObject } from './StackedObject';

export abstract class AnimatableObject<
  EventSpec extends ObjectEvents = ObjectEvents
> extends StackedObject<EventSpec> {
  /**
   * List of properties to consider for animating colors.
   * @type String[]
   */
  colorProperties: string[];

  /**
   * Animates object's properties
   * @param {String|Object} property Property to animate (if string) or properties to animate (if object)
   * @param {Number|Object} value Value to animate property to (if string was given first) or options object
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-2#animation}
   * @return {(ColorAnimation | ValueAnimation)[]} animation context (or an array if passed multiple properties)
   *
   * As object — multiple properties
   *
   * object.animate({ left: ..., top: ... });
   * object.animate({ left: ..., top: ... }, { duration: ... });
   */
  animate<T extends number | number[] | TColorArg>(
    animatable: Record<string, T>,
    options?: Partial<AnimationOptions<T>>
  ): Record<string, ColorAnimation | ValueAnimation | ArrayAnimation> {
    return Object.entries(animatable).reduce((acc, [key, endValue]) => {
      acc[key] = this._animate(key, endValue, options);
      return acc;
    }, {} as Record<string, ColorAnimation | ValueAnimation | ArrayAnimation>);
  }

  /**
   * @private
   * @param {String} key Property to animate
   * @param {String} to Value to animate to
   * @param {Object} [options] Options object
   */
  _animate<T extends number | number[] | TColorArg>(
    key: string,
    endValue: T,
    options: Partial<AnimationOptions<T>> = {}
  ) {
    const path = key.split('.');
    const propIsColor = this.colorProperties.includes(path[path.length - 1]);
    const { easing, duration, abort, startValue, onChange, onComplete } =
      options;
    const animationOptions = {
      target: this,
      // path.reduce... is the current value in case start value isn't provided
      startValue:
        startValue ?? path.reduce((deep: any, key) => deep[key], this),
      endValue,
      easing,
      duration,
      abort: abort?.bind(this),
      onChange: (
        value: number | number[] | string,
        valueProgress: number,
        durationProgress: number
      ) => {
        path.reduce((deep: Record<string, any>, key, index) => {
          if (index === path.length - 1) {
            deep[key] = value;
          }
          return deep[key];
        }, this);
        onChange &&
          // @ts-expect-error generic callback arg0 is wrong
          onChange(value, valueProgress, durationProgress);
      },
      onComplete: (
        value: number | number[] | string,
        valueProgress: number,
        durationProgress: number
      ) => {
        this.setCoords();
        onComplete &&
          // @ts-expect-error generic callback arg0 is wrong
          onComplete(value, valueProgress, durationProgress);
      },
    } as AnimationOptions<T>;

    if (propIsColor) {
      return animateColor(animationOptions as ColorAnimationOptions);
    } else {
      return animate(
        animationOptions as ValueAnimationOptions | ArrayAnimationOptions
      );
    }
  }
}
