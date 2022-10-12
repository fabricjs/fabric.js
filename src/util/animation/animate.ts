import { noop } from '../../constants';
import { runningAnimations } from './animation_registry';
import { defaultEasing } from './Easing';
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
export function animate<T>(options: Partial<AnimationOptions<T>> = {}) {
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

  const context = {
    ...options,
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

  const runner = function (timestamp) {
    const start = timestamp || +new Date(),
      finish = start + duration,
      isMany = Array.isArray(startValue),
      byValue =
        options.byValue ||
        (isMany
          ? startValue.map((value, i) => endValue[i] - value)
          : endValue - startValue);

    options.onStart && options.onStart();

    (function tick(ticktime) {
      const time = ticktime || +new Date();
      const currentTime = time > finish ? duration : time - start,
        timePerc = currentTime / duration,
        current = isMany
          ? startValue.map((_value, i) =>
              easing(currentTime, _value, byValue[i], duration)
            )
          : easing(currentTime, startValue, byValue, duration),
        valuePerc = isMany
          ? Math.abs((current[0] - startValue[0]) / byValue[0])
          : Math.abs((current - startValue) / byValue);
      //  update context
      context.currentValue = isMany ? current.slice() : current;
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
        context.currentValue = isMany ? endValue.slice() : endValue;
        context.completionRate = 1;
        context.durationRate = 1;
        //  execute callbacks
        onChange(isMany ? endValue.slice() : endValue, 1, 1);
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
