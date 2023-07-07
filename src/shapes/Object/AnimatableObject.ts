import type { TColorArg } from '../../color/typedefs';
import type { ObjectEvents } from '../../EventTypeDefs';
import type {
  AnimationOptionsRegistry,
  AnimationRegistry,
} from '../../util/animation/animate';
import { animate, animateColor } from '../../util/animation/animate';
import { StackedObject } from './StackedObject';

export type AnimationTypeFromValue<T extends number | number[] | TColorArg> =
  T extends TColorArg ? 'color' : T extends number[] ? 'array' : 'value';

export abstract class AnimatableObject<
  EventSpec extends ObjectEvents = ObjectEvents
> extends StackedObject<EventSpec> {
  /**
   * List of properties to consider for animating colors.
   * @type String[]
   */
  declare colorProperties: string[];

  /**
   * Animates object's properties
   * @param {Record<string, number | number[] | TColorArg>} animatable map of keys and end values
   * @param {Partial<AnimationOptionsRegistry[Anim]>} options
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-2#animation}
   * @return {Record<string, AnimationRegistry[Anim]>} map of animation contexts
   *
   * As object — multiple properties
   *
   * object.animate({ left: ..., top: ... });
   * object.animate({ left: ..., top: ... }, { duration: ... });
   */
  animate<
    T extends number | number[] | TColorArg,
    Anim extends AnimationTypeFromValue<T>
  >(
    animatable: Record<string, T>,
    options?: Partial<AnimationOptionsRegistry[Anim]>
  ): Record<string, AnimationRegistry[Anim]> {
    return Object.entries(animatable).reduce((acc, [key, endValue]) => {
      acc[key] = this._animate(key, endValue, options);
      return acc;
    }, {} as Record<string, AnimationRegistry[Anim]>);
  }

  /**
   * @private
   * @param {String} key Property to animate
   * @param {String} to Value to animate to
   * @param {Object} [options] Options object
   */
  _animate<
    T extends number | number[] | TColorArg,
    Anim extends AnimationTypeFromValue<T>
  >(
    key: string,
    endValue: T,
    options: Partial<AnimationOptionsRegistry[Anim]> = {}
  ): AnimationRegistry[Anim] {
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
    } as AnimationOptionsRegistry[Anim];

    return (
      propIsColor
        ? animateColor(animationOptions as AnimationOptionsRegistry['color'])
        : animate(
            animationOptions as
              | AnimationOptionsRegistry['array']
              | AnimationOptionsRegistry['value']
          )
    ) as AnimationRegistry[Anim];
  }
}
