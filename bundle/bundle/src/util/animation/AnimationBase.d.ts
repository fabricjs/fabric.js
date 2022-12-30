import { AnimationState, TAnimationBaseOptions, TAnimationCallbacks, TAnimationValues, TEasingFunction } from './types';
export declare abstract class AnimationBase<T extends number | number[] = number | number[]> {
    readonly startValue: T;
    readonly byValue: T;
    readonly endValue: T;
    readonly duration: number;
    readonly delay: number;
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
    durationRatio: number;
    /**
     * Value %, or the ratio of `(currentValue - startValue) / (endValue - startValue)`
     */
    valueRatio: number;
    /**
     * Current value
     */
    value: T;
    /**
     * Animation start time ms
     */
    private startTime;
    /**
     * Constructor
     * Since both `byValue` and `endValue` are accepted in subclass options
     * and are populated with defaults if missing, we defer to `byValue` and
     * ignore `endValue` to avoid conflict
     */
    constructor({ startValue, byValue, duration, delay, easing, onStart, onChange, onComplete, abort, target, }: Partial<TAnimationBaseOptions<T> & TAnimationCallbacks<T>> & Required<Omit<TAnimationValues<T>, 'endValue'>>);
    get state(): AnimationState;
    /**
     * Calculate the current value based on the easing parameters
     * @param timeElapsed in ms
     * @protected
     */
    protected abstract calculate(timeElapsed: number): {
        value: T;
        changeRatio: number;
    };
    start(): void;
    private tick;
    private register;
    private unregister;
    abort(): void;
}
//# sourceMappingURL=AnimationBase.d.ts.map