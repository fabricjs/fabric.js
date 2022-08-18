import { Color } from "../color";
import { clamp } from "../util";
import { ifNaN } from "../util/internals";

function getColorStop(el, multiplier) {
  let color, opacity;
  // convert percents to absolute values
  const offsetValue = el.getAttribute('offset') || 0;
  const offset = clamp(parseFloat(offsetValue) / (/%$/.test(offsetValue) ? 100 : 1), 0, 1);

  const style = el.getAttribute('style');
  if (style) {
    const keyValuePairs = style.split(/\s*;\s*/);

    if (keyValuePairs[keyValuePairs.length - 1] === '') {
      keyValuePairs.pop();
    }

    for (let i = keyValuePairs.length; i--;) {

      const split = keyValuePairs[i].split(/\s*:\s*/), key = split[0].trim(), value = split[1].trim();

      if (key === 'stop-color') {
        color = value;
      }
      else if (key === 'stop-opacity') {
        opacity = value;
      }
    }
  }

  return {
    offset: offset,
    color: new Color(color || el.getAttribute('stop-color') || 'rgb(0,0,0)').toRgb(),
    opacity: ifNaN(parseFloat(opacity || el.getAttribute('stop-opacity')), 1) * color.getAlpha() * multiplier
  };
}

export function parseColorStops(el, opacityAttr) {
  const colorStops = [], colorStopEls = el.getElementsByTagName('stop'), multiplier = clamp(ifNaN(parseFloat(opacityAttr) / (/%$/.test(opacityAttr) ? 100 : 1), 1), 0, 1);
  for (let i = colorStopEls.length; i--;) {
    colorStops.push(getColorStop(colorStopEls[i], multiplier));
  }
}
