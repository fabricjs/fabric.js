import type { TColorArg } from '../../color/typedefs';

export type AnimationState = 'pending' | 'running' | 'completed' | 'aborted';

/**
 * Callback called every frame
 * @param {number | number[]} value current value of the animation.
 * @param {number} valueProgress ∈ [0, 1], the current animation progress reflected on value, normalized.
 * 0 is the starting value and 1 is the ending value.
 * @param {number} durationProgress ∈ [0, 1], the current animation duration normalized to 1.
 */
export type TOnAnimationChangeCallback<T, R = void> = (
  value: T,
  valueProgress: number,
  durationProgress: number,
) => R;

/**
 * Called on each step to determine if animation should abort
 * @returns truthy if animation should abort
 */
export type TAbortCallback<T> = TOnAnimationChangeCallback<T, boolean>;

/**
 * An easing function used to calculate the current value
 * @see {@link AnimationBase#calculate}
 *
 * @param timeElapsed ms elapsed since start
 * @param startValue
 * @param byValue
 * @param duration in ms
 * @returns next value
 */
export type TEasingFunction<T = unknown> = T extends number[]
  ? (
      timeElapsed: number,
      startValue: number,
      byValue: number,
      duration: number,
      index: number,
    ) => number
  : (
      timeElapsed: number,
      startValue: number,
      byValue: number,
      duration: number,
    ) => number;

export type TAnimationBaseOptions<T> = {
  /**
   * Duration of the animation in ms
   * @default 500
   */
  duration: number;

  /**
   * Delay to start the animation in ms
   * @default 0
   */
  delay: number;

  /**
   * Easing function
   * @default {defaultEasing}
   */
  easing: TEasingFunction<T>;

  /**
   * The object this animation is being performed on
   */
  target: unknown;
};

export type TAnimationCallbacks<T> = {
  /**
   * Called when the animation starts
   */
  onStart: VoidFunction;

  /**
   * Called at each frame of the animation
   */
  onChange: TOnAnimationChangeCallback<T>;

  /**
   * Called after the last frame of the animation
   */
  onComplete: TOnAnimationChangeCallback<T>;

  /**
   * Function called at each frame.
   * If it returns true, abort
   */
  abort: TAbortCallback<T>;
};

export type TBaseAnimationOptions<T, TCallback = T, TEasing = T> = Partial<
  TAnimationBaseOptions<TEasing> & TAnimationCallbacks<TCallback>
> & {
  startValue: T;
  byValue: T;
};

export type TAnimationOptions<T, TCallback = T, TEasing = T> = Partial<
  TAnimationBaseOptions<TEasing> &
    TAnimationCallbacks<TCallback> & {
      /**
       * Starting value(s)
       * @default 0
       */
      startValue: T;

      /**
       * Ending value(s)
       * @default 100
       */
      endValue: T;
    }
>;

export type ValueAnimationOptions = TAnimationOptions<number>;

export type ArrayAnimationOptions = TAnimationOptions<number[]>;

export type ColorAnimationOptions = TAnimationOptions<
  TColorArg,
  string,
  number[]
>;

export type AnimationOptions<T extends number | number[] | TColorArg> =
  T extends TColorArg
    ? ColorAnimationOptions
    : T extends number[]
      ? ArrayAnimationOptions
      : ValueAnimationOptions;
