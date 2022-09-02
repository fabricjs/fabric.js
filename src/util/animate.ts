//@ts-nocheck
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

function defaultEasing(t, b, c, d) {
  return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
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
export function animate(options) {
  options || (options = {});
  var cancel = false,
      context,
      removeFromRegistry = function () {
        var index = runningAnimations.indexOf(context);
        return index > -1 && runningAnimations.splice(index, 1)[0];
      };

  context = Object.assign({}, options, {
    cancel: function () {
      cancel = true;
      return removeFromRegistry();
    },
    currentValue: 'startValue' in options ? options.startValue : 0,
    completionRate: 0,
    durationRate: 0
  });
  runningAnimations.push(context);

  var runner = function (timestamp) {
    var start = timestamp || +new Date(),
        duration = options.duration || 500,
        finish = start + duration, time,
        onChange = options.onChange || noop,
        abort = options.abort || noop,
        onComplete = options.onComplete || noop,
        easing = options.easing || defaultEasing,
        isMany = 'startValue' in options ? options.startValue.length > 0 : false,
        startValue = 'startValue' in options ? options.startValue : 0,
        endValue = 'endValue' in options ? options.endValue : 100,
        byValue = options.byValue || (isMany ? startValue.map(function(value, i) {
          return endValue[i] - startValue[i];
        }) : endValue - startValue);

    options.onStart && options.onStart();

    (function tick(ticktime) {
      time = ticktime || +new Date();
      var currentTime = time > finish ? duration : (time - start),
          timePerc = currentTime / duration,
          current = isMany ? startValue.map(function(_value, i) {
            return easing(currentTime, startValue[i], byValue[i], duration);
          }) : easing(currentTime, startValue, byValue, duration),
          valuePerc = isMany ? Math.abs((current[0] - startValue[0]) / byValue[0])
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
      }
      else {
        onChange(current, valuePerc, timePerc);
        requestAnimFrame(tick);
      }
    })(start);
  };

  if (options.delay) {
    setTimeout(function () {
      requestAnimFrame(runner);
    }, options.delay);
  }
  else {
    requestAnimFrame(runner);
  }

  return context.cancel;
}

const _requestAnimFrame =
  fabric.window.requestAnimationFrame ||
  function(callback) {
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
export function requestAnimFrame(...args) {
  return _requestAnimFrame.apply(fabric.window, args);
}

export function cancelAnimFrame(...args) {
  return _cancelAnimFrame.apply(fabric.window, args);
}
