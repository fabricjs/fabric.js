import { fabric } from '../../HEADER';
import { noop } from '../constants';
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
export type TAbortCallback<State = number | number[]> =
  TOnAnimationChangeCallback<boolean, State>;

/**
 * Function used for canceling an animation
 */
export type TCancelFunction = VoidFunction;

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
 * Animation of a value or list of values
 */
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
  onChange: TOnAnimationChangeCallback<void, State>;

  /**
   * Called after the last frame of the animation
   */
  onComplete: TOnAnimationChangeCallback<void, State>;

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
  options: Partial<AnimationOptions<number> | AnimationOptions<number[]>> = {}
): TCancelFunction {
  let cancel = false;

  const isMulti = function isMulti<
    Single extends Partial<AnimationBounds<number>>,
    Multi extends Partial<AnimationBounds<number[]>>
  >(x: Single | Multi): x is Multi {
    return Array.isArray(x.startValue);
  };

  const isMany = isMulti(options);

  const { duration = 500, easing = defaultEasing, delay = 0 } = options;

  // let startValue: number | number[], endValue: number | number[];

  let bounds:
    | (AnimationBounds<number> &
        Pick<AnimationOptions<number>, 'abort' | 'onChange' | 'onComplete'>)
    | (AnimationBounds<number[]> &
        Pick<AnimationOptions<number[]>, 'abort' | 'onChange' | 'onComplete'>);

  let context: AnimationContext<number> | AnimationContext<number[]>;
  if (isMany) {
    let byValue = options.byValue;
    const startValue = options.startValue ?? [0],
      endValue = options.endValue ?? [100];

    if (!byValue) {
      byValue = new Array<number>(startValue.length);
      // using map here means that we need to use a closure, but TS isn't smart enough to realize
      // that bounds is still a AnimationBounds<number[]> inside the closure
      for (let i = 0; i < startValue.length; i++) {
        byValue[i] = endValue[i] - startValue[i];
      }
    }

    bounds = {
      startValue,
      endValue,
      byValue,
      onChange: options.onChange ?? noop,
      onComplete: options.onComplete ?? noop,
      abort: options.abort ?? noop,
    };

    context = {
      ...options,
      cancel: function () {
        cancel = true;
        return removeFromRegistry();
      },
      completionRate: 0,
      durationRate: 0,
      currentValue: bounds.startValue,
    };
  } else {
    const startValue = options.startValue ?? 0,
      endValue = options.endValue ?? 100,
      byValue = options.byValue || endValue - startValue;
    bounds = {
      startValue,
      endValue,
      byValue,
      onChange: options.onChange ?? noop,
      onComplete: options.onComplete ?? noop,
      abort: options.abort ?? noop,
    };
    context = {
      ...options,
      cancel: function () {
        cancel = true;
        return removeFromRegistry();
      },
      completionRate: 0,
      durationRate: 0,
      currentValue: bounds.startValue,
    };
  }

  const removeFromRegistry = () => {
    const index = runningAnimations.indexOf(context);
    return index > -1 && runningAnimations.splice(index, 1)[0];
  };

  runningAnimations.push(context);

  const runner = function (timestamp: number) {
    const start = timestamp || +new Date(),
      finish = start + duration;

    options.onStart && options.onStart();

    (function tick(ticktime: number) {
      const time = ticktime || +new Date();
      const currentTime = time > finish ? duration : time - start,
        timePerc = currentTime / duration;
      let current: number | number[], valuePerc: number;

      //  update context
      context.durationRate = timePerc;
      if (isMulti(bounds)) {
        current = new Array<number>(bounds.startValue.length);
        for (let i = 0; i < current.length; i++) {
          current[i] = easing(
            currentTime,
            bounds.startValue[i],
            bounds.byValue[i],
            duration
          );
        }
        context.currentValue = current.slice();
        valuePerc = Math.abs(
          (current[0] - bounds.startValue[0]) / bounds.byValue[0]
        );
        if (cancel) {
          return;
        }
        if (bounds.abort(current, valuePerc, timePerc)) {
          removeFromRegistry();
          return;
        }
        if (time > finish) {
          context.currentValue = bounds.endValue.slice();
          bounds.onChange(bounds.endValue.slice(), 1, 1);
          bounds.onComplete(bounds.endValue, 1, 1);
          context.completionRate = 1;
          context.durationRate = 1;
          //  execute callbacks
          removeFromRegistry();
        } else {
          bounds.onChange(current, valuePerc, timePerc);
          requestAnimFrame(tick);
        }
      } else {
        current = easing(
          currentTime,
          bounds.startValue,
          bounds.byValue,
          duration
        );
        context.currentValue = current;
        valuePerc = Math.abs(
          ((current as number) - bounds.startValue) / bounds.byValue
        );
        context.completionRate = valuePerc;
        if (cancel) {
          return;
        }
        if (bounds.abort(current, valuePerc, timePerc)) {
          removeFromRegistry();
          return;
        }
        if (time > finish) {
          context.currentValue = bounds.endValue;
          bounds.onChange(bounds.endValue, 1, 1);
          bounds.onComplete(bounds.endValue, 1, 1);
          context.completionRate = 1;
          context.durationRate = 1;
          //  execute callbacks
          removeFromRegistry();
        } else {
          bounds.onChange(current, valuePerc, timePerc);
          requestAnimFrame(tick);
        }
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
