//@ts-nocheck
import { Color } from "../color";
import { animate } from './animate';

// Calculate an in-between color. Returns a "rgba()" string.
// Credit: Edwin Martin <edwin@bitstorm.org>
//         http://www.bitstorm.org/jquery/color-animation/jquery.animate-colors.js
// const calculateColor = (begin: number[], end: number[], pos) => {
//   const [r, g, b, _a] = begin.map((beg, index) => beg + pos * (end[index] - beg));
//   const a = begin && end ? parseFloat(_a) : 1;
//   return `rgba(${parseInt(r, 10)},${parseInt(g, 10)},${parseInt(b, 10)},${a})`;
// }

// color animation is broken. This function pass the tests for some reasons
// but begin and end aren't array anymore since we improved animate function
// to handler arrays internally.
function calculateColor(begin, end, pos) {
  let color = 'rgba('
      + parseInt((begin[0] + pos * (end[0] - begin[0])), 10) + ','
      + parseInt((begin[1] + pos * (end[1] - begin[1])), 10) + ','
      + parseInt((begin[2] + pos * (end[2] - begin[2])), 10);

  color += ',' + (begin && end ? parseFloat(begin[3] + pos * (end[3] - begin[3])) : 1);
  color += ')';
  return color;
}

const defaultColorEasing = (currentTime, duration) => 1 - Math.cos(currentTime / duration * (Math.PI / 2));

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
export function animateColor(
  fromColor,
  toColor,
  duration = 500,
  {
    colorEasing = defaultColorEasing,
    onComplete,
    onChange,
    ...restOfOptions
  } = {}
) {
  const startColor = new Color(fromColor).getSource(),
        endColor = new Color(toColor).getSource(),
  return animate({
    ...restOfOptions,
    duration,
    startValue: startColor,
    endValue: endColor,
    byValue: endColor,
    easing: (currentTime, startValue, byValue, duration) =>
      calculateColor(startValue, byValue, colorEasing(currentTime, duration)),
    // has to take in account for color restoring;
    onComplete: (current, valuePerc, timePerc) => onComplete?.(
      calculateColor(endColor, endColor, 0),
      valuePerc,
      timePerc
    ),
    onChange: (current, valuePerc, timePerc) => {
      if (onChange) {
        if (Array.isArray(current)) {
          return onChange(
            calculateColor(current, current, 0),
            valuePerc,
            timePerc
          );
        }
        onChange(current, valuePerc, timePerc);
      }
    }
  });
}

