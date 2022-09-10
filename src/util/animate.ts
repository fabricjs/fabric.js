import { fabric } from '../../HEADER';
import { runningAnimations } from './animation_registry';
import { noop } from '../constants';

/**
 *
 * @typedef {Object} AnimationOptions
 * Animation of a value or list of values.
 * @property {Function} [onChange] Callback; invoked on every value change
 * @property {Function} [onComplete] Callback; invoked when value change is completed
 * @property {number | number[]} [startValue=0] Starting value
 * @property {number | number[]} [endValue=100] Ending value
 * @property {number | number[]} [byValue=100] Value to modify the property by
 * @property {Function} [easing] Easing function
 * @property {number} [duration=500] Duration of change (in ms)
 * @property {Function} [abort] Additional function with logic. If returns true, animation aborts.
 * @property {number} [delay] Delay of animation start (in ms)
 *
 * @typedef {() => void} CancelFunction
 *
 * @typedef {Object} AnimationCurrentState
 * @property {number | number[]} currentValue value in range [`startValue`, `endValue`]
 * @property {number} completionRate value in range [0, 1]
 * @property {number} durationRate value in range [0, 1]
 *
 * @typedef {(AnimationOptions & AnimationCurrentState & { cancel: CancelFunction }} AnimationContext
 */
export type EasingFunction = (t: number, b: number, c: number, d: number) => number;
export type AbortFunction = (current: number | number[], valuePercent: number, timePercent: number) => boolean;

export type OnChangeCallback = (x: number | number[], y: number, z: number) => void;

export interface AnimationOptions {
  onStart: VoidFunction;
  onChange: OnChangeCallback;
  onComplete: OnChangeCallback;
  startValue: number | number[];
  endValue: number | number[];
  byValue: number | number[];
  easing: EasingFunction;
  duration: number;
  abort: AbortFunction;
  delay: number;
}

export interface AnimationCurrentState {
  currentValue: number | number[];
  completionRate: number;
  durationRate: number;
}

export interface AnimationContext extends AnimationOptions, AnimationCurrentState {
  cancel: VoidFunction;
}

/**
 * Default easing
 * @param t current time
 * @param b
 * @param c
 * @param d duration
 */
const defaultEasing: EasingFunction = (t, b, c, d) => -c * Math.cos(t / d * (Math.PI / 2)) + c + b;

export const DefaultAnimationOptions: AnimationOptions = {
  onStart: noop,
  onChange: noop,
  onComplete: noop,
  startValue: 0,
  endValue: 100,
  byValue: 100,
  easing: defaultEasing,
  duration: 500,
  abort: noop,
  delay: 0
};

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
export function animate(options: AnimationOptions = DefaultAnimationOptions) {
  let cancel = false;

  const {
    startValue,
    duration,
    easing,
    onChange,
    abort,
    onComplete,
    endValue,
    delay,
  } = options;

  const context: AnimationContext = {
    ...options,
    cancel: noop,
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

const _requestAnimFrame =
  fabric.window.requestAnimationFrame ||
  function(callback: FrameRequestCallback) {
    return fabric.window.setTimeout(callback, 1000 / 60);
  };

const _cancelAnimFrame =
  fabric.window.cancelAnimationFrame || fabric.window.clearTimeout;

/**
 * requestAnimationFrame polyfill based on http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * In order to get a precise start time, `requestAnimFrame` should be called as an entry into the method
 * @memberOf fabric.util
 * @param {Function} callback Callback to invoke
 * @param {DOMElement} element optional Element to associate with animation
 */
export function requestAnimFrame(callback: FrameRequestCallback) {
  return _requestAnimFrame.apply(fabric.window, [callback]);
}

export function cancelAnimFrame(handle: number) {
  return _cancelAnimFrame.apply(fabric.window, [handle]);
}
