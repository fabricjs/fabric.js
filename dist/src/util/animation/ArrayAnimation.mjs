import { objectWithoutProperties as _objectWithoutProperties, objectSpread2 as _objectSpread2 } from '../../../_virtual/_rollupPluginBabelHelpers.mjs';
import { AnimationBase } from './AnimationBase.mjs';

const _excluded = ["startValue", "endValue"];
class ArrayAnimation extends AnimationBase {
  constructor(_ref) {
    let {
        startValue = [0],
        endValue = [100]
      } = _ref,
      options = _objectWithoutProperties(_ref, _excluded);
    super(_objectSpread2(_objectSpread2({}, options), {}, {
      startValue,
      byValue: endValue.map((value, i) => value - startValue[i])
    }));
  }
  calculate(timeElapsed) {
    const values = this.startValue.map((value, i) => this.easing(timeElapsed, value, this.byValue[i], this.duration, i));
    return {
      value: values,
      valueProgress: Math.abs((values[0] - this.startValue[0]) / this.byValue[0])
    };
  }
}

export { ArrayAnimation };
//# sourceMappingURL=ArrayAnimation.mjs.map
