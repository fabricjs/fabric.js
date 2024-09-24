import { Color } from '../../color/Color.mjs';
import { config } from '../../config.mjs';
import { DEFAULT_SVG_FONT_SIZE, NONE, FILL } from '../../constants.mjs';
import { toFixed } from './toFixed.mjs';

/**
 * Returns array of attributes for given svg that fabric parses
 * @param {SVGElementName} type Type of svg element (eg. 'circle')
 * @return {Array} string names of supported attributes
 */
const getSvgAttributes = type => {
  const commonAttributes = ['instantiated_by_use', 'style', 'id', 'class'];
  switch (type) {
    case 'linearGradient':
      return commonAttributes.concat(['x1', 'y1', 'x2', 'y2', 'gradientUnits', 'gradientTransform']);
    case 'radialGradient':
      return commonAttributes.concat(['gradientUnits', 'gradientTransform', 'cx', 'cy', 'r', 'fx', 'fy', 'fr']);
    case 'stop':
      return commonAttributes.concat(['offset', 'stop-color', 'stop-opacity']);
  }
  return commonAttributes;
};

/**
 * Converts from attribute value to pixel value if applicable.
 * Returns converted pixels or original value not converted.
 * @param {string} value number to operate on
 * @param {number} fontSize
 * @return {number}
 */
const parseUnit = function (value) {
  let fontSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_SVG_FONT_SIZE;
  const unit = /\D{0,2}$/.exec(value),
    number = parseFloat(value);
  const dpi = config.DPI;
  switch (unit === null || unit === void 0 ? void 0 : unit[0]) {
    case 'mm':
      return number * dpi / 25.4;
    case 'cm':
      return number * dpi / 2.54;
    case 'in':
      return number * dpi;
    case 'pt':
      return number * dpi / 72;
    // or * 4 / 3

    case 'pc':
      return number * dpi / 72 * 12;
    // or * 16

    case 'em':
      return number * fontSize;
    default:
      return number;
  }
};
// align can be either none or undefined or a combination of mid/max
const parseAlign = align => {
  //divide align in alignX and alignY
  if (align && align !== NONE) {
    return [align.slice(1, 4), align.slice(5, 8)];
  } else if (align === NONE) {
    return [align, align];
  }
  return ['Mid', 'Mid'];
};

/**
 * Parse preserveAspectRatio attribute from element
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio
 * @param {string} attribute to be parsed
 * @return {Object} an object containing align and meetOrSlice attribute
 */
const parsePreserveAspectRatioAttribute = attribute => {
  const [firstPart, secondPart] = attribute.trim().split(' ');
  const [alignX, alignY] = parseAlign(firstPart);
  return {
    meetOrSlice: secondPart || 'meet',
    alignX,
    alignY
  };
};

/**
 * given an array of 6 number returns something like `"matrix(...numbers)"`
 * @param {TMat2D} transform an array with 6 numbers
 * @return {String} transform matrix for svg
 */
const matrixToSVG = transform => 'matrix(' + transform.map(value => toFixed(value, config.NUM_FRACTION_DIGITS)).join(' ') + ')';

/**
 * Adobe Illustrator (at least CS5) is unable to render rgba()-based fill values
 * we work around it by "moving" alpha channel into opacity attribute and setting fill's alpha to 1
 * @param prop
 * @param value
 * @param {boolean} inlineStyle The default is inline style, the separator used is ":", The other is "="
 * @returns
 */
const colorPropToSVG = function (prop, value) {
  let inlineStyle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  let colorValue;
  let opacityValue;
  if (!value) {
    colorValue = 'none';
  } else if (value.toLive) {
    colorValue = "url(#SVGID_".concat(value.id, ")");
  } else {
    const color = new Color(value),
      opacity = color.getAlpha();
    colorValue = color.toRgb();
    if (opacity !== 1) {
      opacityValue = opacity.toString();
    }
  }
  if (inlineStyle) {
    return "".concat(prop, ": ").concat(colorValue, "; ").concat(opacityValue ? "".concat(prop, "-opacity: ").concat(opacityValue, "; ") : '');
  } else {
    return "".concat(prop, "=\"").concat(colorValue, "\" ").concat(opacityValue ? "".concat(prop, "-opacity=\"").concat(opacityValue, "\" ") : '');
  }
};
const createSVGRect = function (color, _ref) {
  let {
    left,
    top,
    width,
    height
  } = _ref;
  let precision = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : config.NUM_FRACTION_DIGITS;
  const svgColor = colorPropToSVG(FILL, color, false);
  const [x, y, w, h] = [left, top, width, height].map(value => toFixed(value, precision));
  return "<rect ".concat(svgColor, " x=\"").concat(x, "\" y=\"").concat(y, "\" width=\"").concat(w, "\" height=\"").concat(h, "\"></rect>");
};

export { colorPropToSVG, createSVGRect, getSvgAttributes, matrixToSVG, parsePreserveAspectRatioAttribute, parseUnit };
//# sourceMappingURL=svgParsing.mjs.map
