import { TRGBAColorSource } from '../../color/color.class';
import { AnimationBase } from './AnimationBase';
import { ColorAnimationOptions } from './types';
export declare class ColorAnimation extends AnimationBase<TRGBAColorSource> {
    constructor({ startValue, endValue, byValue, easing, onChange, onComplete, abort, ...options }: ColorAnimationOptions);
    protected calculate(timeElapsed: number): {
        value: TRGBAColorSource;
        changeRatio: number;
    };
}
//# sourceMappingURL=ColorAnimation.d.ts.map