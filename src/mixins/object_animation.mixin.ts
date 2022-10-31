import type { FabricObject } from '../shapes/fabricObject.class';
import { animate } from '../util/animate';
import { animateColor } from '../util/animate_color';

export class FabricObjectObjectAnimationMixin {
  /**
   * Animates object's properties
   * @param {String|Object} property Property to animate (if string) or properties to animate (if object)
   * @param {Number|Object} value Value to animate property to (if string was given first) or options object
   * @return {FabricObject} thisArg
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

    const _options = {
      target: this,
      startValue: options.from,
      endValue: to,
      byValue: options.by,
      easing: options.easing,
      duration: options.duration,
      abort:
        options.abort &&
        ((value, valueProgress, timeProgress) => {
          return options.abort(value, valueProgress, timeProgress);
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
        _options.startValue,
        _options.endValue,
        _options.duration,
        _options
      );
    } else {
      return animate(_options);
    }
  }
}
