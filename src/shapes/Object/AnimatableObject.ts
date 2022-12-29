import { TColorArg } from '../../color/color.class';
import { noop } from '../../constants';
import { ObjectEvents } from '../../EventTypeDefs';
import { TDegree } from '../../typedefs';
import {
  animate,
  animateColor,
  AnimationOptions,
  ColorAnimationOptions,
} from '../../util/animation';
import type { ColorAnimation } from '../../util/animation/ColorAnimation';
import type { ValueAnimation } from '../../util/animation/ValueAnimation';
import { StackedObject } from './StackedObject';

type TAnimationOptions<T extends number | TColorArg> = T extends number
  ? AnimationOptions
  : ColorAnimationOptions;

export abstract class AnimatableObject<
  EventSpec extends ObjectEvents = ObjectEvents
> extends StackedObject<EventSpec> {
  /**
   * Animation duration (in ms) for fx* methods
   * @type Number
   * @default
   */
  FX_DURATION: number;

  /**
   * List of properties to consider for animating colors.
   * @type String[]
   */
  colorProperties: string[];

  abstract rotate(deg: TDegree): void;

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
   *
   * As string — one property
   * Supports +=N and -=N for animating N units in a given direction
   *
   * object.animate('left', ...);
   * object.animate('left', ..., { duration: ... });
   *
   * Example of +=/-=
   * object.animate('right', '-=50');
   * object.animate('top', '+=50', { duration: ... });
   */
  animate<T extends number | TColorArg>(
    key: string,
    toValue: T,
    options?: Partial<TAnimationOptions<T>>
  ): (ColorAnimation | ValueAnimation)[];
  animate<T extends number | TColorArg>(
    animatable: Record<string, T>,
    options?: Partial<TAnimationOptions<T>>
  ): (ColorAnimation | ValueAnimation)[];
  animate<T extends number | TColorArg, S extends string | Record<string, T>>(
    arg0: S,
    arg1: S extends string ? T : Partial<TAnimationOptions<T>>,
    arg2?: S extends string ? Partial<TAnimationOptions<T>> : never
  ): (ColorAnimation | ValueAnimation)[] {
    const animatable = (
      typeof arg0 === 'string' ? { [arg0]: arg1 } : arg0
    ) as Record<string, T>;
    const keys = Object.keys(animatable);
    const options = (typeof arg0 === 'string' ? arg2 : arg1) as Partial<
      TAnimationOptions<T>
    >;
    return keys.map((key, index) =>
      this._animate(
        key,
        animatable[key],
        index === keys.length - 1
          ? options
          : { ...options, onChange: undefined, onComplete: undefined }
      )
    );
  }

  /**
   * @private
   * @param {String} key Property to animate
   * @param {String} to Value to animate to
   * @param {Object} [options] Options object
   */
  _animate<T extends number | TColorArg>(
    key: string,
    to: T,
    options: Partial<TAnimationOptions<T>> = {}
  ) {
    const path = key.split('.');
    const propIsColor = this.colorProperties.includes(path[path.length - 1]);
    const currentValue = path.reduce((deep: any, key) => deep[key], this);

    if (!propIsColor && typeof to === 'string') {
      // check for things like +=50
      // which should animate so that the thing moves by 50 units in the positive direction
      to = to.includes('=')
        ? currentValue + parseFloat(to.replace('=', ''))
        : parseFloat(to);
    }

    const animationOptions = {
      target: this,
      startValue:
        options.startValue ??
        // backward compat
        (options as any).from ??
        currentValue,
      endValue: to,
      // `byValue` takes precedence over `endValue`
      byValue:
        options.byValue ??
        // backward compat
        (options as any).by,
      easing: options.easing,
      duration: options.duration,
      abort: options.abort?.bind(this),
      onChange: (
        value: string | number,
        valueRatio: number,
        durationRatio: number
      ) => {
        path.reduce((deep: Record<string, any>, key, index) => {
          if (index === path.length - 1) {
            deep[key] = value;
          }
          return deep[key];
        }, this);
        options.onChange &&
          // @ts-expect-error generic callback arg0 is wrong
          options.onChange(value, valueRatio, durationRatio);
      },
      onComplete: (
        value: string | number,
        valueRatio: number,
        durationRatio: number
      ) => {
        this.setCoords();
        options.onComplete &&
          // @ts-expect-error generic callback arg0 is wrong
          options.onComplete(value, valueRatio, durationRatio);
      },
    } as TAnimationOptions<T>;

    if (propIsColor) {
      return animateColor(animationOptions as ColorAnimationOptions);
    } else {
      return animate(animationOptions as AnimationOptions);
    }
  }

  /**
   * @private
   * @return {Number} angle value
   */
  protected _getAngleValueForStraighten() {
    const angle = this.angle % 360;
    if (angle > 0) {
      return Math.round((angle - 1) / 90) * 90;
    }
    return Math.round(angle / 90) * 90;
  }

  /**
   * Straightens an object (rotating it from current angle to one of 0, 90, 180, 270, etc. depending on which is closer)
   */
  straighten() {
    this.rotate(this._getAngleValueForStraighten());
  }

  /**
   * Same as {@link straighten} but with animation
   * @param {Object} callbacks Object with callback functions
   * @param {Function} [callbacks.onComplete] Invoked on completion
   * @param {Function} [callbacks.onChange] Invoked on every step of animation
   */
  fxStraighten(
    callbacks: {
      onChange?(value: TDegree): any;
      onComplete?(): any;
    } = {}
  ) {
    const onComplete = callbacks.onComplete || noop,
      onChange = callbacks.onChange || noop;

    return animate({
      target: this,
      startValue: this.angle,
      endValue: this._getAngleValueForStraighten(),
      duration: this.FX_DURATION,
      onChange: (value: TDegree) => {
        this.rotate(value);
        onChange(value);
      },
      onComplete: () => {
        this.setCoords();
        onComplete();
      },
    });
  }
}
