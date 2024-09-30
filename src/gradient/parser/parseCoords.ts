import { isPercent } from '../../parser/percent';
import type { TSize } from '../../typedefs';
import type { GradientCoords, GradientType, GradientUnits } from '../typedefs';
import { parseGradientUnits, parseType } from './misc';

function convertPercentUnitsToValues<
  T extends GradientType,
  K extends keyof GradientCoords<T>,
>(
  valuesToConvert: Record<K, string | number>,
  { width, height, gradientUnits }: TSize & { gradientUnits: GradientUnits },
) {
  let finalValue;
  return (Object.keys(valuesToConvert) as K[]).reduce(
    (acc, prop) => {
      const propValue = valuesToConvert[prop];
      if (propValue === 'Infinity') {
        finalValue = 1;
      } else if (propValue === '-Infinity') {
        finalValue = 0;
      } else {
        finalValue =
          typeof propValue === 'string' ? parseFloat(propValue) : propValue;
        if (typeof propValue === 'string' && isPercent(propValue)) {
          finalValue *= 0.01;
          if (gradientUnits === 'pixels') {
            // then we need to fix those percentages here in svg parsing
            if (prop === 'x1' || prop === 'x2' || prop === 'r2') {
              finalValue *= width;
            }
            if (prop === 'y1' || prop === 'y2') {
              finalValue *= height;
            }
          }
        }
      }
      acc[prop] = finalValue;
      return acc;
    },
    {} as Record<K, number>,
  );
}

function getValue(el: SVGGradientElement, key: string) {
  return el.getAttribute(key);
}

export function parseLinearCoords(el: SVGGradientElement) {
  return {
    x1: getValue(el, 'x1') || 0,
    y1: getValue(el, 'y1') || 0,
    x2: getValue(el, 'x2') || '100%',
    y2: getValue(el, 'y2') || 0,
  };
}

export function parseRadialCoords(el: SVGGradientElement) {
  return {
    x1: getValue(el, 'fx') || getValue(el, 'cx') || '50%',
    y1: getValue(el, 'fy') || getValue(el, 'cy') || '50%',
    r1: 0,
    x2: getValue(el, 'cx') || '50%',
    y2: getValue(el, 'cy') || '50%',
    r2: getValue(el, 'r') || '50%',
  };
}

export function parseCoords(el: SVGGradientElement, size: TSize) {
  return convertPercentUnitsToValues(
    parseType(el) === 'linear' ? parseLinearCoords(el) : parseRadialCoords(el),
    {
      ...size,
      gradientUnits: parseGradientUnits(el),
    },
  );
}
