import { Color } from '../../color/Color';
import { parsePercent } from '../../parser/percent';
import { ifNaN } from '../../util/internals/ifNaN';
import type { ColorStop } from '../typedefs';

const RE_KEY_VALUE_PAIRS = /\s*;\s*/;
const RE_KEY_VALUE = /\s*:\s*/;

function parseColorStop(el: SVGStopElement, opacityMultiplier: number) {
  let colorValue, opacityValue;
  const style = el.getAttribute('style');
  if (style) {
    const keyValuePairs = style.split(RE_KEY_VALUE_PAIRS);

    if (keyValuePairs[keyValuePairs.length - 1] === '') {
      keyValuePairs.pop();
    }

    for (let i = keyValuePairs.length; i--; ) {
      const [key, value] = keyValuePairs[i]
        .split(RE_KEY_VALUE)
        .map((s) => s.trim());
      if (key === 'stop-color') {
        colorValue = value;
      } else if (key === 'stop-opacity') {
        opacityValue = value;
      }
    }
  }

  colorValue = colorValue || el.getAttribute('stop-color') || 'rgb(0,0,0)';
  opacityValue = ifNaN(
    parseFloat(opacityValue || el.getAttribute('stop-opacity') || ''),
    1,
  );

  const color = new Color(colorValue);

  color.setAlpha(color.getAlpha() * opacityValue * opacityMultiplier);

  return {
    offset: parsePercent(el.getAttribute('offset'), 0),
    color: color.toRgba(),
  };
}

export function parseColorStops(
  el: SVGGradientElement,
  opacityAttr: string | null,
) {
  const colorStops: ColorStop[] = [],
    colorStopEls = el.getElementsByTagName('stop'),
    multiplier = parsePercent(opacityAttr, 1);
  for (let i = colorStopEls.length; i--; ) {
    colorStops.push(parseColorStop(colorStopEls[i], multiplier));
  }
  return colorStops;
}
