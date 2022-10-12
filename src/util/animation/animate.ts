import { noop } from '../../constants';
import { runningAnimations } from './animation_registry';
import { defaultEasing } from './easing';
import { requestAnimFrame } from './AnimationFrame';
import {
  AnimationBounds,
  AnimationContext,
  AnimationOptions,
  isMulti,
  TCancelFunction,
} from './types';

/**
 * Changes value from one to another within certain period of time, invoking callbacks as value is being changed.
 *
 * @param {AnimationOptions} [options] Animation options
 * @returns {TCancelFunction} cancel function
 *
 * @example
 * animate({
 *   startValue: 1,
 *   endValue: 0,
 *   onChange: (v) => {
 *     obj.set('opacity', v);
 *     canvas.renderAll();
 *   }
 * });
 *
 * @example When using lists, think of something like this:
 * animate({
 *   startValue: [1, 2, 3],
 *   endValue: [2, 4, 6],
 *   onChange: ([x, y, zoom]) => {
 *     canvas.zoomToPoint(new Point(x, y), zoom);
 *     canvas.renderAll();
 *   }
 * });
 *
 */
export function animate<
  T extends number | number[],
  S extends AnimationOptions<T>
>(options: Partial<S> = {}): TCancelFunction {
  let cancel = false;

  const { duration = 500, easing = defaultEasing, delay = 0 } = options;

  // let startValue: number | number[], endValue: number | number[];

  let bounds:
    | (AnimationBounds<number> &
        Pick<AnimationOptions<number>, 'abort' | 'onChange' | 'onComplete'>)
    | (AnimationBounds<number[]> &
        Pick<AnimationOptions<number[]>, 'abort' | 'onChange' | 'onComplete'>);

  let context: AnimationContext<number> | AnimationContext<number[]>;
  if (isMulti(options)) {
    const startValue = options.startValue ?? [0],
      endValue = options.endValue ?? [100],
      byValue =
        options.byValue ?? startValue.map((value, i) => endValue[i] - value);

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
