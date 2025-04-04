import { Color } from '../../color/Color';
import type { TRGBAColorSource } from '../../color/typedefs';
import { halfPI } from '../../constants';
import { capValue } from '../misc/capValue';
import { AnimationBase } from './AnimationBase';
import type {
  ColorAnimationOptions,
  TEasingFunction,
  TOnAnimationChangeCallback,
} from './types';

const defaultColorEasing: TEasingFunction = (
  timeElapsed,
  startValue,
  byValue,
  duration,
) => {
  const durationProgress = 1 - Math.cos((timeElapsed / duration) * halfPI);
  return startValue + byValue * durationProgress;
};

const wrapColorCallback = <R>(
  callback?: TOnAnimationChangeCallback<string, R>,
) =>
  callback &&
  ((rgba: TRGBAColorSource, valueProgress: number, durationProgress: number) =>
    callback(new Color(rgba).toRgba(), valueProgress, durationProgress));

export class ColorAnimation extends AnimationBase<TRGBAColorSource> {
  constructor({
    startValue,
    endValue,
    easing = defaultColorEasing,
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
      byValue: endColor.map(
        (value, i) => value - startColor[i],
      ) as TRGBAColorSource,
      easing,
      onChange: wrapColorCallback(onChange),
      onComplete: wrapColorCallback(onComplete),
      abort: wrapColorCallback(abort),
    });
  }
  protected calculate(timeElapsed: number) {
    const [r, g, b, a] = this.startValue.map((value, i) =>
      this.easing(timeElapsed, value, this.byValue[i], this.duration, i),
    ) as TRGBAColorSource;
    const value = [
      ...[r, g, b].map(Math.round),
      capValue(0, a, 1),
    ] as TRGBAColorSource;
    return {
      value,
      valueProgress:
        // to correctly calculate the change ratio we must find a changed value
        value
          .map((p, i) =>
            this.byValue[i] !== 0
              ? Math.abs((p - this.startValue[i]) / this.byValue[i])
              : 0,
          )
          .find((p) => p !== 0) || 0,
    };
  }
}
