import { AnimationBase } from './AnimationBase';
import { AnimationOptions } from './types';

export class ValueAnimation extends AnimationBase<number> {
  constructor({
    startValue = 0,
    endValue = 100,
    byValue = endValue - startValue,
    ...options
  }: AnimationOptions) {
    super({
      ...options,
      startValue,
      byValue,
    });
  }

  protected calculate(timeElapsed: number) {
    const value = this.easing(
      timeElapsed,
      this.startValue,
      this.byValue,
      this.duration
    );
    return {
      value,
      changeRatio: Math.abs((value - this.startValue) / this.byValue),
    };
  }
}
