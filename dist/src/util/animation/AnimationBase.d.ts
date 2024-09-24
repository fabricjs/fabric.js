import type { AnimationState, TBaseAnimationOptions, TEasingFunction } from './types';
export declare abstract class AnimationBase<T extends number | number[] = number | number[]> {
    readonly startValue: T;
    readonly endValue: T;
    readonly duration: number;
    readonly delay: number;
    protected readonly byValue: T;
    protected readonly easing: TEasingFunction<T>;
    private readonly _onStart;
    private readonly _onChange;
    private readonly _onComplete;
    private readonly _abort;
    /**
     * Used to register the animation to a target object
     * so that it can be cancelled within the object context
     */
    readonly target?: unknown;
    private _state;
    /**
     * Time %, or the ratio of `timeElapsed / duration`
     * @see tick
     */
    durationProgress: number;
    /**
     * Value %, or the ratio of `(currentValue - startValue) / (endValue - startValue)`
     */
    valueProgress: number;
    /**
     * Current value
     */
    value: T;
    /**
     * Animation start time ms
     */
    private startTime;
    constructor({ startValue, byValue, duration, delay, easing, onStart, onChange, onComplete, abort, target, }: TBaseAnimationOptions<T>);
    get state(): AnimationState;
    isDone(): boolean;
    /**
     * Calculate the current value based on the easing parameters
     * @param timeElapsed in ms
     * @protected
     */
    protected abstract calculate(timeElapsed: number): {
        value: T;
        valueProgress: number;
    };
    start(): void;
    private tick;
    private register;
    private unregister;
    abort(): void;
}
//# sourceMappingURL=AnimationBase.d.ts.map