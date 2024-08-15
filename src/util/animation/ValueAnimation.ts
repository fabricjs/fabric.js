import { AnimationBase } from './AnimationBase';
import type { ValueAnimationOptions } from './types';

export class ValueAnimation extends AnimationBase<number> {
  constructor({
    startValue = 0,
    endValue = 100,
    ...otherOptions
  }: ValueAnimationOptions) {
    super({
      ...otherOptions,
      startValue,
      byValue: endValue - startValue,
    });
  }

  protected calculate(timeElapsed: number) {
    const value = this.easing(
      timeElapsed,
      this.startValue,
      this.byValue,
      this.duration,
    );
    return {
      value,
      valueProgress: Math.abs((value - this.startValue) / this.byValue),
    };
  }
}
