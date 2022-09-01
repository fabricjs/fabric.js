//@ts-nocheck
import { fabric } from '../../HEADER';
import { Color } from "../color";

// Calculate an in-between color. Returns a "rgba()" string.
// Credit: Edwin Martin <edwin@bitstorm.org>
//         http://www.bitstorm.org/jquery/color-animation/jquery.animate-colors.js
const calculateColor = (begin, end, pos) => {
  const [r, g, b, _a] = begin.map((beg, index) => beg + pos * (end[index] - beg));
  const a = begin && end ? parseFloat(_a) : 1;
  return `rgba(${parseInt(r, 10)},${parseInt(g, 10)},${parseInt(b, 10)},${a})`;
}

  /**
   * Changes the color from one to another within certain period of time, invoking callbacks as value is being changed.
   * @memberOf fabric.util
   * @param {String} fromColor The starting color in hex or rgb(a) format.
   * @param {String} toColor The starting color in hex or rgb(a) format.
   * @param {Number} [duration] Duration of change (in ms).
   * @param {Object} [options] Animation options
   * @param {Function} [options.onChange] Callback; invoked on every value change
   * @param {Function} [options.onComplete] Callback; invoked when value change is completed
   * @param {Function} [options.colorEasing] Easing function. Note that this function only take two arguments (currentTime, duration). Thus the regular animation easing functions cannot be used.
   * @param {Function} [options.abort] Additional function with logic. If returns true, onComplete is called.
   * @returns {Function} abort function
   */
export function animateColor(fromColor, toColor, duration, options = {}) {
  const startColor = new Color(fromColor).getSource(),
        endColor = new Color(toColor).getSource(),
        originalOnComplete = options.onComplete,
        originalOnChange = options.onChange;

  return fabric.util.animate(Object.assign(options, {
    duration: duration || 500,
    startValue: startColor,
    endValue: endColor,
    byValue: endColor,
    easing: function (currentTime, startValue, byValue, duration) {
      const posValue = options.colorEasing
        ? options.colorEasing(currentTime, duration)
        : 1 - Math.cos(currentTime / duration * (Math.PI / 2));
      return calculateColor(startValue, byValue, posValue);
    },
    // has to take in account for color restoring;
    onComplete: function(current, valuePerc, timePerc) {
      if (originalOnComplete) {
        return originalOnComplete(
          calculateColor(endColor, endColor, 0),
          valuePerc,
          timePerc
        );
      }
    },
    onChange: function(current, valuePerc, timePerc) {
      if (originalOnChange) {
        if (Array.isArray(current)) {
          return originalOnChange(
            calculateColor(current, current, 0),
            valuePerc,
            timePerc
          );
        }
        originalOnChange(current, valuePerc, timePerc);
      }
    }
  }));
}

