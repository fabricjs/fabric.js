// @ts-nocheck
import { noop } from '../constants';
import { ObjectEvents } from '../EventTypeDefs';
import { TDegree } from '../typedefs';
import { animate } from '../util/animate';
import { animateColor } from '../util/animate_color';
import { StackedObject } from './object_ancestry.mixin';

/**
 * TODO remove transient
 */
type TAnimationOptions = Record<string, any>;

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
   * @return {AnimationContext | AnimationContext[]} animation context (or an array if passed multiple properties)
   *
   * As object — multiple properties
   *
   * object.animate({ left: ..., top: ... });
   * object.animate({ left: ..., top: ... }, { duration: ... });
   *
   * As string — one property
   *
   * object.animate('left', ...);
   * object.animate('left', ..., { duration: ... });
   *
   */
  animate<T>(key: string, toValue: T, options?: TAnimationOptions): void;
  animate<T>(animatable: Record<string, T>, options?: TAnimationOptions): void;
  animate<T, S extends string | Record<string, T>>(
    arg0: S,
    arg1: S extends string ? T : TAnimationOptions,
    arg2?: S extends string ? TAnimationOptions : never
  ) {
    const animatable = (
      typeof arg0 === 'string' ? { [arg0]: arg1 } : arg0
    ) as Record<string, T>;
    const keys = Object.keys(animatable);
    const options = (
      typeof arg0 === 'string' ? arg2 : arg1
    ) as TAnimationOptions;
    keys.map((key, index) =>
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
  _animate<T>(key: string, to: T, options: TAnimationOptions = {}) {
    const path = key.split('.');
    const propIsColor = this.colorProperties.includes(path[path.length - 1]);
    const currentValue = path.reduce((deep: any, key) => deep[key], this);

    to = to.toString();
    if (!propIsColor) {
      if (~to.indexOf('=')) {
        to = currentValue + parseFloat(to.replace('=', ''));
      } else {
        to = parseFloat(to);
      }
    }

    const animationOptions = {
      target: this,
      startValue: options.from ?? currentValue,
      endValue: to,
      byValue: options.by,
      easing: options.easing,
      duration: options.duration,
      abort:
        options.abort &&
        ((value, valueProgress, timeProgress) => {
          return options.abort.call(this, value, valueProgress, timeProgress);
        }),
      onChange: (value, valueProgress, timeProgress) => {
        path.reduce((deep: any, key, index) => {
          if (index === path.length - 1) {
            deep[key] = value;
          }
          return deep[key];
        }, this);
        options.onChange &&
          options.onChange(value, valueProgress, timeProgress);
      },
      onComplete: (value, valueProgress, timeProgress) => {
        this.setCoords();
        options.onComplete &&
          options.onComplete(value, valueProgress, timeProgress);
      },
    };

    if (propIsColor) {
      return animateColor(
        animationOptions.startValue,
        animationOptions.endValue,
        animationOptions.duration,
        animationOptions
      );
    } else {
      return animate(animationOptions);
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
