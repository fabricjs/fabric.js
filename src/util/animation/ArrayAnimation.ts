import { AnimationBase } from './AnimationBase';
import { ArrayAnimationOptions } from './types';

export class ArrayAnimation extends AnimationBase<number[]> {
  constructor({
    startValue = [0],
    endValue = [100],
    byValue = endValue.map((value, i) => value - startValue[i]),
    ...options
  }: ArrayAnimationOptions) {
    super({
      ...options,
      startValue,
      byValue,
    });
  }
  protected calculate(timeElapsed: number) {
    const values = this.startValue.map((value, i) =>
      this.easing(timeElapsed, value, this.byValue[i], this.duration, i)
    );
    return {
      value: values,
      changeRatio: Math.abs((values[0] - this.startValue[0]) / this.byValue[0]),
    };
  }
}
