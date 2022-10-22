import { Color } from '../../color';
import { TColorAlphaSource } from '../../color/color.class';
import { noop } from '../../constants';
import { AnimationBase } from './Animation';
import {
  ColorAnimationOptions,
  TColorEasingRateFunction,
  TOnAnimationChangeCallback,
} from './types';

const wrapColorCallback =
  <R>(callback: TOnAnimationChangeCallback<string, R>) =>
  (rgba: TColorAlphaSource, valueRatio: number, timeRatio: number) =>
    callback(new Color(rgba).toRgba(), valueRatio, timeRatio);

const defaultColorEasingRate: TColorEasingRateFunction = (
  currentTime,
  duration
) => 1 - Math.cos((currentTime / duration) * (Math.PI / 2));

export class ColorAnimation extends AnimationBase<TColorAlphaSource> {
  readonly colorEasing: TColorEasingRateFunction;
  constructor({
    startValue,
    endValue,
    easing = (currentTime, startValue, byValue) => startValue + byValue,
    colorEasing = defaultColorEasingRate,
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
    this.colorEasing = colorEasing;
  }
  protected calculate(currentTime: number) {
    const changeRate = this.colorEasing(currentTime, this.duration);
    const rgba = this.startValue.map((value, i) =>
      this.easing(
        currentTime,
        value,
        changeRate * this.byValue[i],
        this.duration,
        i
      )
    ) as TColorAlphaSource;
    return {
      value: rgba,
      changeRate,
    };
  }
}
