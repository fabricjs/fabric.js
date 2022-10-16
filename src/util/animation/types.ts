/**
 * Callback called every frame
 * @param current current value of the state. potentially multivalue
 * @param valueRatio ratio of current value to animation max value. [0, 1]
 * @param timeRatio ratio of current ms to animation duration. [0, 1]
 */
export type TOnAnimationChangeCallback<State, R = void> = (
  current: State,
  valueRatio: number,
  timeRatio: number
) => R;

/**
 * Called to determine if animation should abort
 * @returns truthy if animation should abort
 */
export type TAbortCallback<T> = TOnAnimationChangeCallback<T, boolean>;

/**
 * Function used for canceling an animation
 */
export type TCancelFunction = VoidFunction;

/**
 * Animation of a value or list of values
 */
export interface AnimationBounds<State> {
  /**
   * Starting value(s)
   */
  startValue: State;

  /**
   * Ending value(s)
   * @default 100
   */
  endValue: State;

  /**
   * Value(s) to increment/decrement the value(s) by
   * @default [endValue - startValue]
   */
  byValue: State;
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

export interface AnimationOptions<State> extends AnimationBounds<State> {
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
  onChange: TOnAnimationChangeCallback<State>;

  /**
   * Called after the last frame of the animation
   */
  onComplete: TOnAnimationChangeCallback<State>;

  /**
   * Easing function
   * @default [defaultEasing]
   */
  easing: TEasingFunction;

  /**
   * Function called at each frame.
   * If it returns true, abort
   */
  abort: TAbortCallback<State>;

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
export interface AnimationContext<State>
  extends Partial<AnimationOptions<State>>,
    AnimationCurrentState<State> {
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
