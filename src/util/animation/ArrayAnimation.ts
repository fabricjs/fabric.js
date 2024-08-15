import { AnimationBase } from './AnimationBase';
import type { ArrayAnimationOptions } from './types';

export class ArrayAnimation extends AnimationBase<number[]> {
  constructor({
    startValue = [0],
    endValue = [100],
    ...options
  }: ArrayAnimationOptions) {
    super({
      ...options,
      startValue,
      byValue: endValue.map((value, i) => value - startValue[i]),
    });
  }
  protected calculate(timeElapsed: number) {
    const values = this.startValue.map((value, i) =>
      this.easing(timeElapsed, value, this.byValue[i], this.duration, i),
    );
    return {
      value: values,
      valueProgress: Math.abs(
        (values[0] - this.startValue[0]) / this.byValue[0],
      ),
    };
  }
}
