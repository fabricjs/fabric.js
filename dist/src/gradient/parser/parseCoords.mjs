import { objectSpread2 as _objectSpread2 } from '../../../_virtual/_rollupPluginBabelHelpers.mjs';
import { isPercent } from '../../parser/percent.mjs';
import { parseGradientUnits, parseType } from './misc.mjs';

function convertPercentUnitsToValues(valuesToConvert, _ref) {
  let {
    width,
    height,
    gradientUnits
  } = _ref;
  let finalValue;
  return Object.keys(valuesToConvert).reduce((acc, prop) => {
    const propValue = valuesToConvert[prop];
    if (propValue === 'Infinity') {
      finalValue = 1;
    } else if (propValue === '-Infinity') {
      finalValue = 0;
    } else {
      finalValue = typeof propValue === 'string' ? parseFloat(propValue) : propValue;
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
  }, {});
}
function getValue(el, key) {
  return el.getAttribute(key);
}
function parseLinearCoords(el) {
  return {
    x1: getValue(el, 'x1') || 0,
    y1: getValue(el, 'y1') || 0,
    x2: getValue(el, 'x2') || '100%',
    y2: getValue(el, 'y2') || 0
  };
}
function parseRadialCoords(el) {
  return {
    x1: getValue(el, 'fx') || getValue(el, 'cx') || '50%',
    y1: getValue(el, 'fy') || getValue(el, 'cy') || '50%',
    r1: 0,
    x2: getValue(el, 'cx') || '50%',
    y2: getValue(el, 'cy') || '50%',
    r2: getValue(el, 'r') || '50%'
  };
}
function parseCoords(el, size) {
  return convertPercentUnitsToValues(parseType(el) === 'linear' ? parseLinearCoords(el) : parseRadialCoords(el), _objectSpread2(_objectSpread2({}, size), {}, {
    gradientUnits: parseGradientUnits(el)
  }));
}

export { parseCoords, parseLinearCoords, parseRadialCoords };
//# sourceMappingURL=parseCoords.mjs.map
