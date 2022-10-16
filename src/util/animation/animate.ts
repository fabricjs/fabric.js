import { noop } from '../../constants';
import { requestAnimFrame } from './AnimationFrame';
import { runningAnimations } from './animation_registry';
import { defaultEasing } from './easing';
import {
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
export function animate(
  options: Partial<AnimationOptions<number> | AnimationOptions<number[]>> = {}
): TCancelFunction {
  const cancelled = { status: false };
  const { context, remove: removeFromRegistry } = runningAnimations.register(
    options,
    () => {
      cancelled.status = true;
    }
  );
  if (isMulti(context)) {
    return animateArray(context, cancelled, removeFromRegistry);
  } else {
    return animateSingle(context, cancelled, removeFromRegistry);
  }
}

function animateSingle(
  context: AnimationContext<number>,
  cancelled: { status: boolean },
  removeFromRegistry: VoidFunction
) {
  const {
    startValue = 0,
    duration = 500,
    easing = defaultEasing,
    onChange = noop,
    abort = noop,
    onComplete = noop,
    endValue = 100,
    delay = 0,
  } = context;

  const runner = function (timestamp: number) {
    const start = timestamp || +new Date(),
      finish = start + duration,
      byValue = context.byValue || endValue - startValue;

    context.onStart && context.onStart();

    (function tick(ticktime: number) {
      const time = ticktime || +new Date();
      const currentTime = time > finish ? duration : time - start,
        timePerc = currentTime / duration,
        current = easing(currentTime, startValue, byValue, duration),
        valuePerc = Math.abs((current - startValue) / byValue);
      //  update context
      context.currentValue = current;
      context.completionRate = valuePerc;
      context.durationRate = timePerc;

      if (cancelled.status) {
        return;
      }
      if (abort(current, valuePerc, timePerc)) {
        removeFromRegistry();
        return;
      }
      if (time > finish) {
        //  update context
        context.currentValue = endValue;
        context.completionRate = 1;
        context.durationRate = 1;
        //  execute callbacks
        onChange(endValue, 1, 1);
        onComplete(endValue, 1, 1);
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

function animateArray(
  context: AnimationContext<number[]>,
  cancelled: { status: boolean },
  removeFromRegistry: VoidFunction
) {
  const {
    startValue = [0],
    duration = 500,
    easing = defaultEasing,
    onChange = noop,
    abort = noop,
    onComplete = noop,
    endValue = [100],
    delay = 0,
  } = context;

  const runner = function (timestamp: number) {
    const start = timestamp || +new Date(),
      finish = start + duration,
      byValue =
        context.byValue || startValue.map((value, i) => endValue[i] - value);

    context.onStart && context.onStart();

    (function tick(ticktime: number) {
      const time = ticktime || +new Date();
      const currentTime = time > finish ? duration : time - start,
        timePerc = currentTime / duration,
        current = startValue.map((_value, i) =>
          easing(currentTime, _value, byValue[i], duration)
        ),
        valuePerc = Math.abs((current[0] - startValue[0]) / byValue[0]);
      //  update context
      context.currentValue = current.slice();
      context.completionRate = valuePerc;
      context.durationRate = timePerc;

      if (cancelled.status) {
        return;
      }
      if (abort(current, valuePerc, timePerc)) {
        removeFromRegistry();
        return;
      }
      if (time > finish) {
        //  update context
        context.currentValue = endValue.slice();
        context.completionRate = 1;
        context.durationRate = 1;
        //  execute callbacks
        onChange(endValue.slice(), 1, 1);
        onComplete(endValue, 1, 1);
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
