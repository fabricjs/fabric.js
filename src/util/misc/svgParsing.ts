import { Color } from '../../color/Color';
import { config } from '../../config';
import { DEFAULT_SVG_FONT_SIZE, FILL, NONE } from '../../constants';
import type { TBBox, SVGElementName, SupportedSVGUnit } from '../../typedefs';
import { toFixed } from './toFixed';

/**
 * Returns array of attributes for given svg that fabric parses
 * @param {SVGElementName} type Type of svg element (eg. 'circle')
 * @return {Array} string names of supported attributes
 */
export const getSvgAttributes = (type: SVGElementName) => {
  const commonAttributes = ['instantiated_by_use', 'style', 'id', 'class'];
  switch (type) {
    case 'linearGradient':
      return commonAttributes.concat([
        'x1',
        'y1',
        'x2',
        'y2',
        'gradientUnits',
        'gradientTransform',
      ]);
    case 'radialGradient':
      return commonAttributes.concat([
        'gradientUnits',
        'gradientTransform',
        'cx',
        'cy',
        'r',
        'fx',
        'fy',
        'fr',
      ]);
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
export const parseUnit = (value: string, fontSize = DEFAULT_SVG_FONT_SIZE) => {
  const unit = /\D{0,2}$/.exec(value),
    number = parseFloat(value);
  const dpi = config.DPI;
  switch (unit?.[0] as SupportedSVGUnit) {
    case 'mm':
      return (number * dpi) / 25.4;

    case 'cm':
      return (number * dpi) / 2.54;

    case 'in':
      return number * dpi;

    case 'pt':
      return (number * dpi) / 72; // or * 4 / 3

    case 'pc':
      return ((number * dpi) / 72) * 12; // or * 16

    case 'em':
      return number * fontSize;

    default:
      return number;
  }
};

export type MeetOrSlice = 'meet' | 'slice';

export type MinMidMax = 'Min' | 'Mid' | 'Max' | 'none';

export type TPreserveArParsed = {
  meetOrSlice: MeetOrSlice;
  alignX: MinMidMax;
  alignY: MinMidMax;
};

// align can be either none or undefined or a combination of mid/max
const parseAlign = (align: string): MinMidMax[] => {
  //divide align in alignX and alignY
  if (align && align !== NONE) {
    return [align.slice(1, 4) as MinMidMax, align.slice(5, 8) as MinMidMax];
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
export const parsePreserveAspectRatioAttribute = (
  attribute: string,
): TPreserveArParsed => {
  const [firstPart, secondPart] = attribute.trim().split(' ') as [
    MinMidMax,
    MeetOrSlice | undefined,
  ];
  const [alignX, alignY] = parseAlign(firstPart);
  return {
    meetOrSlice: secondPart || 'meet',
    alignX,
    alignY,
  };
};

/**
 * Adobe Illustrator (at least CS5) is unable to render rgba()-based fill values
 * we work around it by "moving" alpha channel into opacity attribute and setting fill's alpha to 1
 * @param prop
 * @param value
 * @param {boolean} inlineStyle The default is inline style, the separator used is ":", The other is "="
 * @returns
 */
export const colorPropToSVG = (
  prop: string,
  value?: any,
  inlineStyle = true,
) => {
  let colorValue;
  let opacityValue;
  if (!value) {
    colorValue = 'none';
  } else if (value.toLive) {
    colorValue = `url(#SVGID_${value.id})`;
  } else {
    const color = new Color(value),
      opacity = color.getAlpha();

    colorValue = color.toRgb();
    if (opacity !== 1) {
      opacityValue = opacity.toString();
    }
  }
  if (inlineStyle) {
    return `${prop}: ${colorValue}; ${
      opacityValue ? `${prop}-opacity: ${opacityValue}; ` : ''
    }`;
  } else {
    return `${prop}="${colorValue}" ${
      opacityValue ? `${prop}-opacity="${opacityValue}" ` : ''
    }`;
  }
};

export const createSVGRect = (
  color: string,
  { left, top, width, height }: TBBox,
  precision = config.NUM_FRACTION_DIGITS,
) => {
  const svgColor = colorPropToSVG(FILL, color, false);
  const [x, y, w, h] = [left, top, width, height].map((value) =>
    toFixed(value, precision),
  );
  return `<rect ${svgColor} x="${x}" y="${y}" width="${w}" height="${h}"></rect>`;
};
