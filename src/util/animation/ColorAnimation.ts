import { Color } from '../../color';
import { TColorAlphaSource } from '../../color/color.class';
import { noop } from '../../constants';
import { capValue } from '../misc/capValue';
import { AnimationBase } from './AnimationBase';
import { ColorAnimationOptions, TOnAnimationChangeCallback } from './types';

const wrapColorCallback =
  <R>(callback: TOnAnimationChangeCallback<string, R>) =>
  (rgba: TColorAlphaSource, valueRatio: number, durationRatio: number) =>
    callback(new Color(rgba).toRgba(), valueRatio, durationRatio);

export class ColorAnimation extends AnimationBase<TColorAlphaSource> {
  constructor({
    startValue,
    endValue,
    byValue,
    easing = (currentTime, startValue, byValue, duration) => {
      const durationRatio =
        1 - Math.cos((currentTime / duration) * (Math.PI / 2));
      return startValue + byValue * durationRatio;
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
      byValue: byValue
        ? new Color(byValue)
            .setAlpha(Array.isArray(byValue) && byValue[3] ? byValue[3] : 0)
            .getSource()
        : (endColor.map(
            (value, i) => value - startColor[i]
          ) as TColorAlphaSource),
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
    const rgb = [r, g, b].map(Math.round);
    return {
      value: [...rgb, capValue(0, a, 1)] as TColorAlphaSource,
      changeRatio:
        // to correctly calculate the change ratio we must find a changed value
        rgb
          .map((p, i) =>
            this.byValue[i] !== 0
              ? Math.abs((p - this.startValue[i]) / this.byValue[i])
              : 0
          )
          .find((p) => p !== 0) || 0,
    };
  }
}
