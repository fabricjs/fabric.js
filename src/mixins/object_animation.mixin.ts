// @ts-nocheck
import { noop } from 'lodash';
import { ObjectEvents } from '../EventTypeDefs';
import { TDegree } from '../typedefs';
import { animate } from '../util/animate';
import { animateColor } from '../util/animate_color';
import { StackedObject } from './object_ancestry.mixin';

export abstract class AnimatableObject<
  EventSpec extends ObjectEvents = ObjectEvents
> extends StackedObject<EventSpec> {
  /**
   * Animation duration (in ms) for fx* methods
   * @type Number
   * @default
   */
  FX_DURATION: number;

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
   * object.animate('left', { duration: ... });
   *
   */
  animate() {
    if (arguments[0] && typeof arguments[0] === 'object') {
      let propsToAnimate = [],
        prop,
        skipCallbacks,
        out = [];
      for (prop in arguments[0]) {
        propsToAnimate.push(prop);
      }
      for (let i = 0, len = propsToAnimate.length; i < len; i++) {
        prop = propsToAnimate[i];
        skipCallbacks = i !== len - 1;
        out.push(
          this._animate(prop, arguments[0][prop], arguments[1], skipCallbacks)
        );
      }
      return out;
    } else {
      return this._animate.apply(this, arguments);
    }
  }

  /**
   * @private
   * @param {String} property Property to animate
   * @param {String} to Value to animate to
   * @param {Object} [options] Options object
   * @param {Boolean} [skipCallbacks] When true, callbacks like onchange and oncomplete are not invoked
   */
  _animate(property, to, options, skipCallbacks) {
    let propPair;

    to = to.toString();

    options = Object.assign({}, options);

    if (~property.indexOf('.')) {
      propPair = property.split('.');
    }

    const propIsColor =
      this.colorProperties.indexOf(property) > -1 ||
      (propPair && this.colorProperties.indexOf(propPair[1]) > -1);

    const currentValue = propPair
      ? this.get(propPair[0])[propPair[1]]
      : this.get(property);

    if (!('from' in options)) {
      options.from = currentValue;
    }

    if (!propIsColor) {
      if (~to.indexOf('=')) {
        to = currentValue + parseFloat(to.replace('=', ''));
      } else {
        to = parseFloat(to);
      }
    }

    const animationOptions = {
      target: this,
      startValue: options.from,
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
        if (propPair) {
          this[propPair[0]][propPair[1]] = value;
        } else {
          this.set(property, value);
        }
        if (skipCallbacks) {
          return;
        }
        options.onChange &&
          options.onChange(value, valueProgress, timeProgress);
      },
      onComplete: (value, valueProgress, timeProgress) => {
        if (skipCallbacks) {
          return;
        }

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
  _getAngleValueForStraighten() {
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
