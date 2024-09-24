import { objectWithoutProperties as _objectWithoutProperties, objectSpread2 as _objectSpread2 } from '../../../_virtual/_rollupPluginBabelHelpers.mjs';
import { AnimationBase } from './AnimationBase.mjs';

const _excluded = ["startValue", "endValue"];
class ValueAnimation extends AnimationBase {
  constructor(_ref) {
    let {
        startValue = 0,
        endValue = 100
      } = _ref,
      otherOptions = _objectWithoutProperties(_ref, _excluded);
    super(_objectSpread2(_objectSpread2({}, otherOptions), {}, {
      startValue,
      byValue: endValue - startValue
    }));
  }
  calculate(timeElapsed) {
    const value = this.easing(timeElapsed, this.startValue, this.byValue, this.duration);
    return {
      value,
      valueProgress: Math.abs((value - this.startValue) / this.byValue)
    };
  }
}

export { ValueAnimation };
//# sourceMappingURL=ValueAnimation.mjs.map
