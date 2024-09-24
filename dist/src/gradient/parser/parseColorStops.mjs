import { Color } from '../../color/Color.mjs';
import { parsePercent } from '../../parser/percent.mjs';
import { ifNaN } from '../../util/internals/ifNaN.mjs';

const RE_KEY_VALUE_PAIRS = /\s*;\s*/;
const RE_KEY_VALUE = /\s*:\s*/;
function parseColorStop(el, multiplier) {
  let colorValue, opacity;
  const style = el.getAttribute('style');
  if (style) {
    const keyValuePairs = style.split(RE_KEY_VALUE_PAIRS);
    if (keyValuePairs[keyValuePairs.length - 1] === '') {
      keyValuePairs.pop();
    }
    for (let i = keyValuePairs.length; i--;) {
      const [key, value] = keyValuePairs[i].split(RE_KEY_VALUE).map(s => s.trim());
      if (key === 'stop-color') {
        colorValue = value;
      } else if (key === 'stop-opacity') {
        opacity = value;
      }
    }
  }
  const color = new Color(colorValue || el.getAttribute('stop-color') || 'rgb(0,0,0)');
  return {
    offset: parsePercent(el.getAttribute('offset'), 0),
    color: color.toRgb(),
    opacity: ifNaN(parseFloat(opacity || el.getAttribute('stop-opacity') || ''), 1) * color.getAlpha() * multiplier
  };
}
function parseColorStops(el, opacityAttr) {
  const colorStops = [],
    colorStopEls = el.getElementsByTagName('stop'),
    multiplier = parsePercent(opacityAttr, 1);
  for (let i = colorStopEls.length; i--;) {
    colorStops.push(parseColorStop(colorStopEls[i], multiplier));
  }
  return colorStops;
}

export { parseColorStops };
//# sourceMappingURL=parseColorStops.mjs.map
