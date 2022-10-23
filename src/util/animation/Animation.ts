import { AnimationBase } from './AnimationBase';
import { AnimationOptions } from './types';

export class Animation extends AnimationBase<number> {
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
  protected calculate(currentTime: number) {
    const value = this.easing(
      currentTime,
      this.startValue,
      this.byValue,
      this.duration
    );
    return {
      value,
      changeRate: Math.abs((value - this.startValue) / this.byValue),
    };
  }
}
