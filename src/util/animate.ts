import { fabric } from '../../HEADER';
import { noop } from '../constants';
import { TObject } from '../__types__';
import { runningAnimations } from './animation_registry';
import { defaultEasing, TEasingFunction } from './anim_ease';

/**
 * Callback called every frame
 * @param t current "time"/ms elapsed. multivalue
 * @param valueRatio ratio of current value to animation max value. [0, 1]
 * @param timeRatio ratio of current ms to animation duration. [0, 1]
 */
export type TOnAnimationChangeCallback<
  Return = void,
  State = number | number[]
> = (t: State, valueRatio: number, timeRatio: number) => Return;

/**
 * Called to determine if animation should abort
 * @returns truthy if animation should abort
 */
export type TAbortCallback = TOnAnimationChangeCallback<boolean>;

/**
 * Function used for canceling an animation
 */
export type TCancelFunction = VoidFunction;

/**
 * Animation of a value or list of values
 */
export interface AnimationOptions {
  /**
   * The object this animation is being performed on
   */
  target?: TObject | unknown;

  /**
   * Called when the animation starts
   */
  onStart?: VoidFunction;

  /**
   * Called at each frame of the animation
   */
  onChange: TOnAnimationChangeCallback;

  /**
   * Called after the last frame of the animation
   */
  onComplete: TOnAnimationChangeCallback;

  /**
   * Easing function
   * @default [defaultEasing]
   */
  easing: TEasingFunction;

  /**
   * Function called at each frame.
   * If it returns true, abort
   */
  abort: TAbortCallback;

  /**
   * Starting value(s)
   */
  startValue: number | number[];

  /**
   * Ending value(s)
   * @default 100
   */
  endValue: number | number[];

  /**
   * Value(s) to increment/decrement the value(s) by
   * @default [endValue - startValue]
   */
  byValue: number | number[];

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

export interface AnimationCurrentState {
  /**
   * Current values
   */
  currentValue: number | number[];
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
export interface AnimationContext
  extends Partial<AnimationOptions>,
    AnimationCurrentState {
  /**
   * Current function used to cancel the animation
   */
  cancel: TCancelFunction;
}

/**
 * Changes value from one to another within certain period of time, invoking callbacks as value is being changed.
 * @memberOf fabric.util
 * @param {AnimationOptions} [options] Animation options
 *  When using lists, think of something like this:
 * @example
 * fabric.util.animate({
 *   startValue: [1, 2, 3],
 *   endValue: [2, 4, 6],
 *   onChange: function([x, y, zoom]) {
 *     canvas.zoomToPoint(new Point(x, y), zoom);
 *     canvas.requestRenderAll();
 *   }
 * });
 *
 * @example
 * fabric.util.animate({
 *   startValue: 1,
 *   endValue: 0,
 *   onChange: function(v) {
 *     obj.set('opacity', v);
 *     canvas.requestRenderAll();
 *   }
 * });
 *
 * @returns {TCancelFunction} cancel function
 */
export function animate(
  options: Partial<AnimationOptions> = {}
): TCancelFunction {
  let cancel = false;

  const {
    startValue = 0,
    duration = 500,
    easing = defaultEasing,
    onChange = noop,
    abort = noop,
    onComplete = noop,
    endValue = 100,
    delay = 0,
  } = options;

  const context: AnimationContext = {
    ...options,
    cancel: function () {
      cancel = true;
      return removeFromRegistry();
    },
    currentValue: startValue,
    completionRate: 0,
    durationRate: 0,
  };

  const removeFromRegistry = () => {
    const index = runningAnimations.indexOf(context);
    return index > -1 && runningAnimations.splice(index, 1)[0];
  };

  runningAnimations.push(context);

  const runner = function (timestamp: number) {
    const start = timestamp || +new Date(),
      finish = start + duration,
      isMany = Array.isArray(startValue),
      byValue =
        options.byValue ||
        (isMany
          ? startValue.map((value, i) => (endValue as number[])[i] - value)
          : (endValue as number) - startValue);

    options.onStart && options.onStart();

    (function tick(ticktime: number) {
      const time = ticktime || +new Date();
      const currentTime = time > finish ? duration : time - start,
        timePerc = currentTime / duration,
        current = isMany
          ? startValue.map((_value, i) =>
              easing(currentTime, _value, (byValue as number[])[i], duration)
            )
          : easing(currentTime, startValue, byValue as number, duration),
        valuePerc = isMany
          ? Math.abs(
              ((current as number[])[0] - startValue[0]) /
                (byValue as number[])[0]
            )
          : Math.abs(((current as number) - startValue) / (byValue as number));
      //  update context
      context.currentValue = isMany ? (current as number[]).slice() : current;
      context.completionRate = valuePerc;
      context.durationRate = timePerc;

      if (cancel) {
        return;
      }
      if (abort(current, valuePerc, timePerc)) {
        removeFromRegistry();
        return;
      }
      if (time > finish) {
        //  update context
        context.currentValue = isMany
          ? (endValue as number[]).slice()
          : endValue;
        context.completionRate = 1;
        context.durationRate = 1;
        //  execute callbacks
        onChange(isMany ? (endValue as number[]).slice() : endValue, 1, 1);
        onComplete(endValue as number, 1, 1);
        removeFromRegistry();
        return;
      } else {
        onChange(current, valuePerc, timePerc);
        requestAnimFrame(tick);
      }
    })(start);
  };

  if (delay > 0) {
    setTimeout(() => requestAnimFrame(runner), delay);
  } else {
    requestAnimFrame(runner);
  }

  return context.cancel;
}

const _requestAnimFrame: AnimationFrameProvider['requestAnimationFrame'] =
  fabric.window.requestAnimationFrame ||
  function (callback: FrameRequestCallback) {
    return fabric.window.setTimeout(callback, 1000 / 60);
  };

const _cancelAnimFrame: AnimationFrameProvider['cancelAnimationFrame'] =
  fabric.window.cancelAnimationFrame || fabric.window.clearTimeout;

/**
 * requestAnimationFrame polyfill based on http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * In order to get a precise start time, `requestAnimFrame` should be called as an entry into the method
 * @memberOf fabric.util
 * @param {Function} callback Callback to invoke
 */
export function requestAnimFrame(callback: FrameRequestCallback): number {
  return _requestAnimFrame.call(fabric.window, callback);
}

export function cancelAnimFrame(handle: number): void {
  return _cancelAnimFrame.call(fabric.window, handle);
}
