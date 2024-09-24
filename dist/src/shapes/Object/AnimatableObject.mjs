import { defineProperty as _defineProperty, objectSpread2 as _objectSpread2 } from '../../../_virtual/_rollupPluginBabelHelpers.mjs';
import { FILL, STROKE } from '../../constants.mjs';
import { animateColor, animate } from '../../util/animation/animate.mjs';
import { StackedObject } from './StackedObject.mjs';

class AnimatableObject extends StackedObject {
  /**
   * Animates object's properties
   * @param {Record<string, number | number[] | TColorArg>} animatable map of keys and end values
   * @param {Partial<AnimationOptions<T>>} options
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-2#animation}
   * @return {Record<string, TAnimation<T>>} map of animation contexts
   *
   * As object — multiple properties
   *
   * object.animate({ left: ..., top: ... });
   * object.animate({ left: ..., top: ... }, { duration: ... });
   */
  animate(animatable, options) {
    return Object.entries(animatable).reduce((acc, _ref) => {
      let [key, endValue] = _ref;
      acc[key] = this._animate(key, endValue, options);
      return acc;
    }, {});
  }

  /**
   * @private
   * @param {String} key Property to animate
   * @param {String} to Value to animate to
   * @param {Object} [options] Options object
   */
  _animate(key, endValue) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const path = key.split('.');
    const propIsColor = this.constructor.colorProperties.includes(path[path.length - 1]);
    const {
      abort,
      startValue,
      onChange,
      onComplete
    } = options;
    const animationOptions = _objectSpread2(_objectSpread2({}, options), {}, {
      target: this,
      // path.reduce... is the current value in case start value isn't provided
      startValue: startValue !== null && startValue !== void 0 ? startValue : path.reduce((deep, key) => deep[key], this),
      endValue,
      abort: abort === null || abort === void 0 ? void 0 : abort.bind(this),
      onChange: (value, valueProgress, durationProgress) => {
        path.reduce((deep, key, index) => {
          if (index === path.length - 1) {
            deep[key] = value;
          }
          return deep[key];
        }, this);
        onChange &&
        // @ts-expect-error generic callback arg0 is wrong
        onChange(value, valueProgress, durationProgress);
      },
      onComplete: (value, valueProgress, durationProgress) => {
        this.setCoords();
        onComplete &&
        // @ts-expect-error generic callback arg0 is wrong
        onComplete(value, valueProgress, durationProgress);
      }
    });
    return propIsColor ? animateColor(animationOptions) : animate(animationOptions);
  }
}
/**
 * List of properties to consider for animating colors.
 * @type String[]
 */
_defineProperty(AnimatableObject, "colorProperties", [FILL, STROKE, 'backgroundColor']);

export { AnimatableObject };
//# sourceMappingURL=AnimatableObject.mjs.map
