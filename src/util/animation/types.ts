export type TAnimationArgument = number | number[];

/**
 * Callback called every frame
 * @param t current "time"/ms elapsed. multivalue
 * @param valueRatio ratio of current value to animation max value. [0, 1]
 * @param timeRatio ratio of current ms to animation duration. [0, 1]
 */
export type TOnAnimationChangeCallback<
  T extends TAnimationArgument,
  R = void
> = (t: T, valueRatio: number, timeRatio: number) => R;

/**
 * Called to determine if animation should abort
 * @returns truthy if animation should abort
 */
export type TAbortCallback<T extends TAnimationArgument> =
  TOnAnimationChangeCallback<T, boolean>;

/**
 * Function used for canceling an animation
 */
export type TCancelFunction = VoidFunction;

/**
 * Animation of a value or list of values
 */
export interface AnimationBounds<T extends TAnimationArgument> {
  /**
   * Starting value(s)
   */
  startValue: T;

  /**
   * Ending value(s)
   * @default 100
   */
  endValue: T;

  /**
   * Value(s) to increment/decrement the value(s) by
   * @default [endValue - startValue]
   */
  byValue: T;
}

/**
 * An easing function
 * @param currentTime ms elapsed
 * @param startValue
 * @param byValue increment/change/"completion rate"/magnitude
 * @param duration in ms
 * @returns next value
 */
export type TEasingFunction = (
  currentTime: number,
  startValue: number,
  byValue: number,
  duration: number
) => number;

export interface AnimationOptions<
  T extends TAnimationArgument = TAnimationArgument
> extends AnimationBounds<T> {
  /**
   * The object this animation is being performed on
   */
  target?: unknown;

  /**
   * Called when the animation starts
   */
  onStart?: VoidFunction;

  /**
   * Called at each frame of the animation
   */
  onChange: TOnAnimationChangeCallback<T>;

  /**
   * Called after the last frame of the animation
   */
  onComplete: TOnAnimationChangeCallback<T>;

  /**
   * Easing function
   * @default [defaultEasing]
   */
  easing: TEasingFunction;

  /**
   * Function called at each frame.
   * If it returns true, abort
   */
  abort: TAbortCallback<T>;

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
}

export interface AnimationCurrentState<State> {
  /**
   * Current values
   */
  currentValue: State;
  /**
   * Same as valueRatio from @see TOnAnimationChangeCallback
   */
  completionRate: number;
  /**
   * Same as completionRatio from @see TOnAnimationChangeCallback
   */
  durationRate: number;
}

/**
 * Animation context
 */
export interface AnimationContext<T extends TAnimationArgument>
  extends Partial<AnimationOptions<T>>,
    AnimationCurrentState<T> {
  /**
   * Current function used to cancel the animation
   */
  cancel: TCancelFunction;
}

export const isMulti = function isMulti<
  Single extends Partial<AnimationBounds<number>>,
  Multi extends Partial<AnimationBounds<number[]>>
>(x: Single | Multi): x is Multi {
  return Array.isArray(x.startValue);
};
