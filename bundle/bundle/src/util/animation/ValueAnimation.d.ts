import { AnimationBase } from './AnimationBase';
import { AnimationOptions } from './types';
export declare class ValueAnimation extends AnimationBase<number> {
    constructor({ startValue, endValue, byValue, ...options }: AnimationOptions);
    protected calculate(timeElapsed: number): {
        value: number;
        changeRatio: number;
    };
}
//# sourceMappingURL=ValueAnimation.d.ts.map