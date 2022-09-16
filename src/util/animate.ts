import { fabric } from '../../HEADER';
import { runningAnimations } from './animation_registry';
import { noop } from '../constants';
import { WithReturnType } from "../typedefs";
import { defaultEasing, EasingFunction } from "./anim_ease";
import {mergeWithDefaults} from "./lang_object";

/**
 * Callback called every frame
 * @param t current "time"/ms elapsed. multivalue
 * @param valueRatio ratio of current value to animation max value. [0, 1]
 * @param timeRatio ratio of current ms to animation duration. [0, 1]
 */
export type OnChangeCallback = (t: number | number[], valueRatio: number, timeRatio: number) => void;

/**
 * Called to determine if animation should abort
 * @returns truthy if animation should abort
 */
export type AbortCallback = WithReturnType<OnChangeCallback, boolean>;

/**
 * Function used for canceling an animation
 */
export type CancelFunction = VoidFunction;

/**
 * Animation of a value or list of values
 */
export interface AnimationOptions {
  /**
   * Called when the animation starts
   */
  onStart?: VoidFunction;

  /**
   * Called at each frame of the animation
   */
  onChange: OnChangeCallback;

  /**
   * Called after the last frame of the animation
   */
  onComplete: OnChangeCallback;

  /**
   * Easing function
   * @default [defaultEasing]
   */
  easing: EasingFunction;

  /**
   * Function called at each frame.
   * If it returns true, abort
   */
  abort: AbortCallback;

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
   * Same as valueRatio from @see OnChangeCallback
   */
  completionRate: number;
  /**
   * Same as completionRatio from @see OnChangeCallback
   */
  durationRate: number;
}

/**
 * Animation context
 */
export interface AnimationContext extends AnimationOptions, AnimationCurrentState {
  /**
   * Current function used to cancel the animation
   */
  cancel: CancelFunction;
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
 * @returns {CancelFunction} cancel function
 */
export function animate(options: Partial<AnimationOptions> = {}): CancelFunction {
  let cancel = false;

  const {
    startValue = 0,
    duration = 500,
    easing = defaultEasing,
    onChange = noop,
    abort = noop,
    onComplete = noop,
    endValue = 0,
    delay = 0,
  } = options;

  const context: Partial<AnimationContext> = {
    ...options,
    cancel: noop, // placeholder
    currentValue: startValue,
    completionRate: 0,
    durationRate: 0,
  };

  const removeFromRegistry = () => {
    const index = runningAnimations.indexOf(context);
    return index > -1 && runningAnimations.splice(index, 1)[0];
  };

  context.cancel = function () {
    cancel = true;
    return removeFromRegistry();
  };
  runningAnimations.push(context);

  const runner = function (timestamp: number) {
    const start = timestamp || +new Date(),
          finish = start + duration,
          isMany = Array.isArray(startValue),
          byValue = options.byValue || (
            isMany ?
            startValue.map((value, i) => (endValue as number[])[i] - value)
            : (endValue as number) - startValue
          );

    options.onStart && options.onStart();

    (function tick(ticktime) {
      const time = ticktime || +new Date();
      const currentTime = time > finish ? duration : (time - start),
          timePerc = currentTime / duration,
          current = isMany ?
            startValue.map(
              (_value, i) => easing(currentTime, _value, (byValue as number[])[i], duration)
            ) : easing(currentTime, startValue, byValue as number, duration),
          valuePerc = isMany ? Math.abs(((current as number[])[0] - startValue[0]) / (byValue as number[])[0])
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
        context.currentValue = isMany ? (endValue as number[]).slice() : endValue;
        context.completionRate = 1;
        context.durationRate = 1;
        //  execute callbacks
        onChange(isMany ? (endValue as number[]).slice() : endValue, 1, 1);
        onComplete(endValue as number, 1, 1);
        removeFromRegistry();
        return;
      }
      else {
        onChange(current, valuePerc, timePerc);
        requestAnimFrame(tick);
      }
    })(start);
  };

  if (delay > 0 ) {
    setTimeout(() => requestAnimFrame(runner), delay);
  } else {
    requestAnimFrame(runner);
  }

  return context.cancel;
}

const _requestAnimFrame: AnimationFrameProvider["requestAnimationFrame"] =
  fabric.window.requestAnimationFrame ||
  function(callback: FrameRequestCallback) {
    return fabric.window.setTimeout(callback, 1000 / 60);
  };

const _cancelAnimFrame: AnimationFrameProvider["cancelAnimationFrame"] =
  fabric.window.cancelAnimationFrame || fabric.window.clearTimeout;

/**
 * requestAnimationFrame polyfill based on http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * In order to get a precise start time, `requestAnimFrame` should be called as an entry into the method
 * @memberOf fabric.util
 * @param {Function} callback Callback to invoke
 */
export function requestAnimFrame(callback: FrameRequestCallback): number {
  return _requestAnimFrame.bind(fabric.window)(callback);
}

export function cancelAnimFrame(handle: number): void {
  return _cancelAnimFrame.bind(fabric.window)(handle);
}
