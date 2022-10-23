import { Color } from '../../color';
import { TColorAlphaSource } from '../../color/color.class';
import { noop } from '../../constants';
import { AnimationBase } from './AnimationBase';
import { ColorAnimationOptions, TOnAnimationChangeCallback } from './types';

const wrapColorCallback =
  <R>(callback: TOnAnimationChangeCallback<string, R>) =>
  (rgba: TColorAlphaSource, valueRate: number, durationRate: number) =>
    callback(new Color(rgba).toRgba(), valueRate, durationRate);

export class ColorAnimation extends AnimationBase<TColorAlphaSource> {
  constructor({
    startValue,
    endValue,
    easing = (currentTime, startValue, byValue, duration) => {
      const durationRate =
        1 - Math.cos((currentTime / duration) * (Math.PI / 2));
      return startValue + byValue * durationRate;
    },
    onChange = noop,
    onComplete = noop,
    abort = noop,
    ...options
  }: ColorAnimationOptions) {
    const startColor = new Color(startValue).getSource();
    const endColor = new Color(endValue).getSource();
    super({
      ...options,
      startValue: startColor,
      endValue: endColor,
      byValue: endColor.map(
        (value, i) => value - startColor[i]
      ) as TColorAlphaSource,
      easing,
      onChange: wrapColorCallback(onChange),
      onComplete: wrapColorCallback(onComplete),
      abort: wrapColorCallback(abort),
    });
  }
  protected calculate(currentTime: number) {
    const [r, g, b, a] = this.startValue.map((value, i) =>
      this.easing(currentTime, value, this.byValue[i], this.duration, i)
    ) as TColorAlphaSource;
    return {
      value: [r, g, b, a] as TColorAlphaSource,
      changeRate:
        // to correctly calculate the change rate we must find a changed value
        [r, g, b]
          .map((p, i) =>
            this.byValue[i] !== 0
              ? Math.abs((p - this.startValue[i]) / this.byValue[i])
              : 0
          )
          .find((p) => p !== 0) || 0,
    };
  }
}
