import { AnimationBase } from './AnimationBase';
import { ArrayAnimationOptions } from './types';
export declare class ArrayAnimation extends AnimationBase<number[]> {
    constructor({ startValue, endValue, byValue, ...options }: ArrayAnimationOptions);
    protected calculate(timeElapsed: number): {
        value: number[];
        changeRatio: number;
    };
}
//# sourceMappingURL=ArrayAnimation.d.ts.map