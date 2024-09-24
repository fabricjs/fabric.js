import { multiplyTransformMatrices } from '../util/misc/matrix.mjs';
import { parseUnit } from '../util/misc/svgParsing.mjs';
import { parseTransformAttribute } from './parseTransformAttribute.mjs';
import { FILL, STROKE, NONE, LEFT, RIGHT, CENTER } from '../constants.mjs';

function normalizeValue(attr, value, parentAttributes, fontSize) {
  const isArray = Array.isArray(value);
  let parsed;
  let ouputValue = value;
  if ((attr === FILL || attr === STROKE) && value === NONE) {
    ouputValue = '';
  } else if (attr === 'strokeUniform') {
    return value === 'non-scaling-stroke';
  } else if (attr === 'strokeDashArray') {
    if (value === NONE) {
      ouputValue = null;
    } else {
      ouputValue = value.replace(/,/g, ' ').split(/\s+/).map(parseFloat);
    }
  } else if (attr === 'transformMatrix') {
    if (parentAttributes && parentAttributes.transformMatrix) {
      ouputValue = multiplyTransformMatrices(parentAttributes.transformMatrix, parseTransformAttribute(value));
    } else {
      ouputValue = parseTransformAttribute(value);
    }
  } else if (attr === 'visible') {
    ouputValue = value !== NONE && value !== 'hidden';
    // display=none on parent element always takes precedence over child element
    if (parentAttributes && parentAttributes.visible === false) {
      ouputValue = false;
    }
  } else if (attr === 'opacity') {
    ouputValue = parseFloat(value);
    if (parentAttributes && typeof parentAttributes.opacity !== 'undefined') {
      ouputValue *= parentAttributes.opacity;
    }
  } else if (attr === 'textAnchor' /* text-anchor */) {
    ouputValue = value === 'start' ? LEFT : value === 'end' ? RIGHT : CENTER;
  } else if (attr === 'charSpacing') {
    // parseUnit returns px and we convert it to em
    parsed = parseUnit(value, fontSize) / fontSize * 1000;
  } else if (attr === 'paintFirst') {
    const fillIndex = value.indexOf(FILL);
    const strokeIndex = value.indexOf(STROKE);
    ouputValue = FILL;
    if (fillIndex > -1 && strokeIndex > -1 && strokeIndex < fillIndex) {
      ouputValue = STROKE;
    } else if (fillIndex === -1 && strokeIndex > -1) {
      ouputValue = STROKE;
    }
  } else if (attr === 'href' || attr === 'xlink:href' || attr === 'font' || attr === 'id') {
    return value;
  } else if (attr === 'imageSmoothing') {
    return value === 'optimizeQuality';
  } else {
    parsed = isArray ? value.map(parseUnit) : parseUnit(value, fontSize);
  }
  return !isArray && isNaN(parsed) ? ouputValue : parsed;
}

export { normalizeValue };
//# sourceMappingURL=normalizeValue.mjs.map
