import { objectWithoutProperties as _objectWithoutProperties, objectSpread2 as _objectSpread2 } from '../../../_virtual/_rollupPluginBabelHelpers.mjs';
import { Color } from '../../color/Color.mjs';
import { halfPI } from '../../constants.mjs';
import { capValue } from '../misc/capValue.mjs';
import { AnimationBase } from './AnimationBase.mjs';

const _excluded = ["startValue", "endValue", "easing", "onChange", "onComplete", "abort"];
const defaultColorEasing = (timeElapsed, startValue, byValue, duration) => {
  const durationProgress = 1 - Math.cos(timeElapsed / duration * halfPI);
  return startValue + byValue * durationProgress;
};
const wrapColorCallback = callback => callback && ((rgba, valueProgress, durationProgress) => callback(new Color(rgba).toRgba(), valueProgress, durationProgress));
class ColorAnimation extends AnimationBase {
  constructor(_ref) {
    let {
        startValue,
        endValue,
        easing = defaultColorEasing,
        onChange,
        onComplete,
        abort
      } = _ref,
      options = _objectWithoutProperties(_ref, _excluded);
    const startColor = new Color(startValue).getSource();
    const endColor = new Color(endValue).getSource();
    super(_objectSpread2(_objectSpread2({}, options), {}, {
      startValue: startColor,
      byValue: endColor.map((value, i) => value - startColor[i]),
      easing,
      onChange: wrapColorCallback(onChange),
      onComplete: wrapColorCallback(onComplete),
      abort: wrapColorCallback(abort)
    }));
  }
  calculate(timeElapsed) {
    const [r, g, b, a] = this.startValue.map((value, i) => this.easing(timeElapsed, value, this.byValue[i], this.duration, i));
    const value = [...[r, g, b].map(Math.round), capValue(0, a, 1)];
    return {
      value,
      valueProgress:
      // to correctly calculate the change ratio we must find a changed value
      value.map((p, i) => this.byValue[i] !== 0 ? Math.abs((p - this.startValue[i]) / this.byValue[i]) : 0).find(p => p !== 0) || 0
    };
  }
}

export { ColorAnimation };
//# sourceMappingURL=ColorAnimation.mjs.map
