import { Color, TRGBAColorSource } from '../../color/color.class';
import { halfPI } from '../../constants';
import { capValue } from '../misc/capValue';
import { AnimationBase } from './AnimationBase';
import type { ColorAnimationOptions, TEasingFunction } from './types';

const defaultColorEasing: TEasingFunction = (
  timeElapsed,
  startValue,
  byValue,
  duration
) => {
  const durationProgress = 1 - Math.cos((timeElapsed / duration) * halfPI);
  return startValue + byValue * durationProgress;
};

export class ColorAnimation extends AnimationBase<Color> {
  constructor({
    startValue = new Color(),
    endValue = new Color(),
    easing = defaultColorEasing,
    ...options
  }: ColorAnimationOptions) {
    const startColor = startValue.getSource();
    super({
      startValue,
      easing,
      byValue: new Color(
        endValue
          .getSource()
          .map((value, i) => value - startColor[i]) as TRGBAColorSource
      ),
      ...options,
    });
  }
  protected calculate(timeElapsed: number) {
    const startValue = this.startValue.getSource();
    const byValue = this.byValue.getSource();
    const [r, g, b, a] = startValue.map((value, i) =>
      this.easing(timeElapsed, value, byValue[i], this.duration, i)
    ) as TRGBAColorSource;
    const rgb = [r, g, b].map(Math.round);
    return {
      value: new Color([...rgb, capValue(0, a, 1)] as TRGBAColorSource),
      changeRatio:
        // to correctly calculate the change ratio we must find a changed value
        rgb
          .map((p, i) =>
            byValue[i] !== 0 ? Math.abs((p - startValue[i]) / byValue[i]) : 0
          )
          .find((p) => p !== 0) || 0,
    };
  }
}
