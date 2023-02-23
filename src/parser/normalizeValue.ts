//@ts-nocheck
import { multiplyTransformMatrices } from '../util/misc/matrix';
import { parseUnit } from '../util/misc/svgParsing';
import { parseTransformAttribute } from './parseTransformAttribute';

export function normalizeValue(attr, value, parentAttributes, fontSize) {
  const isArray = Array.isArray(value);
  let parsed;

  if ((attr === 'fill' || attr === 'stroke') && value === 'none') {
    value = '';
  } else if (attr === 'strokeUniform') {
    return value === 'non-scaling-stroke';
  } else if (attr === 'strokeDashArray') {
    if (value === 'none') {
      value = null;
    } else {
      value = value.replace(/,/g, ' ').split(/\s+/).map(parseFloat);
    }
  } else if (attr === 'transformMatrix') {
    if (parentAttributes && parentAttributes.transformMatrix) {
      value = multiplyTransformMatrices(
        parentAttributes.transformMatrix,
        parseTransformAttribute(value)
      );
    } else {
      value = parseTransformAttribute(value);
    }
  } else if (attr === 'visible') {
    value = value !== 'none' && value !== 'hidden';
    // display=none on parent element always takes precedence over child element
    if (parentAttributes && parentAttributes.visible === false) {
      value = false;
    }
  } else if (attr === 'opacity') {
    value = parseFloat(value);
    if (parentAttributes && typeof parentAttributes.opacity !== 'undefined') {
      value *= parentAttributes.opacity;
    }
  } else if (attr === 'textAnchor' /* text-anchor */) {
    value = value === 'start' ? 'left' : value === 'end' ? 'right' : 'center';
  } else if (attr === 'charSpacing') {
    // parseUnit returns px and we convert it to em
    parsed = (parseUnit(value, fontSize) / fontSize) * 1000;
  } else if (attr === 'paintFirst') {
    const fillIndex = value.indexOf('fill');
    const strokeIndex = value.indexOf('stroke');
    value = 'fill';
    if (fillIndex > -1 && strokeIndex > -1 && strokeIndex < fillIndex) {
      value = 'stroke';
    } else if (fillIndex === -1 && strokeIndex > -1) {
      value = 'stroke';
    }
  } else if (attr === 'href' || attr === 'xlink:href' || attr === 'font') {
    return value;
  } else if (attr === 'imageSmoothing') {
    return value === 'optimizeQuality';
  } else {
    parsed = isArray ? value.map(parseUnit) : parseUnit(value, fontSize);
  }

  return !isArray && isNaN(parsed) ? value : parsed;
}
