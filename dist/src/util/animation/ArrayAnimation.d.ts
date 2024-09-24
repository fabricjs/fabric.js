import { AnimationBase } from './AnimationBase';
import type { ArrayAnimationOptions } from './types';
export declare class ArrayAnimation extends AnimationBase<number[]> {
    constructor({ startValue, endValue, ...options }: ArrayAnimationOptions);
    protected calculate(timeElapsed: number): {
        value: number[];
        valueProgress: number;
    };
}
//# sourceMappingURL=ArrayAnimation.d.ts.map