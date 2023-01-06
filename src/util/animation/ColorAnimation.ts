import { Color } from '../../color/color.class';
import { TRGBAColorSource } from '../../color/color.class';
import { capValue } from '../misc/capValue';
import { AnimationBase } from './AnimationBase';
import { ColorAnimationOptions, TOnAnimationChangeCallback } from './types';

const wrapColorCallback = <R>(
  callback?: TOnAnimationChangeCallback<string, R>
) =>
  callback &&
  ((rgba: TRGBAColorSource, valueRatio: number, durationRatio: number) =>
    callback(new Color(rgba).toRgba(), valueRatio, durationRatio));

export class ColorAnimation extends AnimationBase<TRGBAColorSource> {
  constructor({
    startValue,
    endValue,
    byValue,
    easing = (timeElapsed, startValue, byValue, duration) => {
      const durationRatio =
        1 - Math.cos((timeElapsed / duration) * (Math.PI / 2));
      return startValue + byValue * durationRatio;
    },
    onChange,
    onComplete,
    abort,
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
          ) as TRGBAColorSource),
      easing,
      onChange: wrapColorCallback(onChange),
      onComplete: wrapColorCallback(onComplete),
      abort: wrapColorCallback(abort),
    });
  }
  protected calculate(timeElapsed: number) {
    const [r, g, b, a] = this.startValue.map((value, i) =>
      this.easing(timeElapsed, value, this.byValue[i], this.duration, i)
    ) as TRGBAColorSource;
    const rgb = [r, g, b].map(Math.round);
    return {
      value: [...rgb, capValue(0, a, 1)] as TRGBAColorSource,
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
