//@ts-nocheck

import { animate, animateColor } from "../util";

export function ObjectAnimationMixinGenerator<T extends new (...args: unknown[]) => unknown>(Klass: T) {
  return class ObjectAnimationMixin extends Klass {
    /**
     * Animates object's properties
     * @param {String|Object} property Property to animate (if string) or properties to animate (if object)
     * @param {Number|Object} value Value to animate property to (if string was given first) or options object
     * @return {FabricObject} thisArg
     * @tutorial {@link http://fabricjs.com/fabric-intro-part-2#animation}
     * @return {fabric.AnimationContext | fabric.AnimationContext[]} animation context (or an array if passed multiple properties)
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
        var propsToAnimate = [], prop, skipCallbacks, out = [];
        for (prop in arguments[0]) {
          propsToAnimate.push(prop);
        }
        for (var i = 0, len = propsToAnimate.length; i < len; i++) {
          prop = propsToAnimate[i];
          skipCallbacks = i !== len - 1;
          out.push(this._animate(prop, arguments[0][prop], arguments[1], skipCallbacks));
        }
        return out;
      }
      else {
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
      var _this = this, propPair;

      to = to.toString();

      options = Object.assign({}, options);

      if (~property.indexOf('.')) {
        propPair = property.split('.');
      }

      var propIsColor =
        _this.colorProperties.indexOf(property) > -1 ||
        (propPair && _this.colorProperties.indexOf(propPair[1]) > -1);

      var currentValue = propPair
        ? this.get(propPair[0])[propPair[1]]
        : this.get(property);

      if (!('from' in options)) {
        options.from = currentValue;
      }

      if (!propIsColor) {
        if (~to.indexOf('=')) {
          to = currentValue + parseFloat(to.replace('=', ''));
        }
        else {
          to = parseFloat(to);
        }
      }

      var _options = {
        target: this,
        startValue: options.from,
        endValue: to,
        byValue: options.by,
        easing: options.easing,
        duration: options.duration,
        abort: options.abort && function (value, valueProgress, timeProgress) {
          return options.abort.call(_this, value, valueProgress, timeProgress);
        },
        onChange: function (value, valueProgress, timeProgress) {
          if (propPair) {
            _this[propPair[0]][propPair[1]] = value;
          }
          else {
            _this.set(property, value);
          }
          if (skipCallbacks) {
            return;
          }
          options.onChange && options.onChange(value, valueProgress, timeProgress);
        },
        onComplete: function (value, valueProgress, timeProgress) {
          if (skipCallbacks) {
            return;
          }

          _this.setCoords();
          options.onComplete && options.onComplete(value, valueProgress, timeProgress);
        }
      };

      if (propIsColor) {
        return animateColor(_options.startValue, _options.endValue, _options.duration, _options);
      }
      else {
        return animate(_options);
      }
    }
  }
}



