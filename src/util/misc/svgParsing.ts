import { fabric } from '../../../HEADER';
import { SVGElementName, SupportedSVGUnit, TMat2D } from '../../typedefs';
import { DEFAULT_SVG_FONT_SIZE } from '../../constants';
import { toFixed } from './toFixed';
/**
 * Returns array of attributes for given svg that fabric parses
 * @memberOf fabric.util
 * @param {SVGElementName} type Type of svg element (eg. 'circle')
 * @return {Array} string names of supported attributes
 */
export const getSvgAttributes = (type: SVGElementName) => {
  const commonAttributes = [
    'instantiated_by_use',
    'style',
    'id',
    'class'
  ];
  switch (type) {
    case SVGElementName.linearGradient:
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
export const parseUnit = (value: string, fontSize: number) => {
  const unit = /\D{0,2}$/.exec(value), number = parseFloat(value);
  if (!fontSize) {
    fontSize = DEFAULT_SVG_FONT_SIZE;
  }
  const dpi = fabric.DPI;
  switch (unit?.[0]) {
    case SupportedSVGUnit.mm:
      return number * dpi / 25.4;

    case SupportedSVGUnit.cm:
      return number * dpi / 2.54;

    case SupportedSVGUnit.in:
      return number * dpi;

    case SupportedSVGUnit.pt:
      return number * dpi / 72; // or * 4 / 3

    case SupportedSVGUnit.pc:
      return number * dpi / 72 * 12; // or * 16

    case SupportedSVGUnit.em:
      return number * fontSize;

    default:
      return number;
  }
};

/**
 * Groups SVG elements (usually those retrieved from SVG document)
 * @static
 * @memberOf fabric.util
 * @param {Array} elements fabric.Object(s) parsed from svg, to group
 * @return {fabric.Object|fabric.Group}
 */
export const groupSVGElements = (elements: any[]) => {
  if (elements && elements.length === 1) {
    return elements[0];
  }
  return new fabric.Group(elements);
};

const enum MeetOrSlice {
  meet = 'meet',
  slice = 'slice',
};

const enum MinMidMax {
  min = 'Min',
  mid = 'Mid',
  max = 'Max',
  none = 'none',
};

type TPreserveArParsed = {
  meetOrSlice: MeetOrSlice;
  alignX: MinMidMax;
  alignY: MinMidMax;
};

/**
 * Parse preserveAspectRatio attribute from element
 * @param {string} attribute to be parsed
 * @return {Object} an object containing align and meetOrSlice attribute
 */
export const parsePreserveAspectRatioAttribute = (attribute: string): TPreserveArParsed => {
  let meetOrSlice = MeetOrSlice.meet,
      alignX = MinMidMax.mid,
      alignY = MinMidMax.mid,
      align: MinMidMax = MinMidMax.none;
  const aspectRatioAttrs = attribute.split(' ');

  if (aspectRatioAttrs && aspectRatioAttrs.length) {
    const firstAttr = aspectRatioAttrs.pop() as MeetOrSlice | MinMidMax | undefined;
    if (firstAttr !== MeetOrSlice.meet && firstAttr !== MeetOrSlice.slice) {
      align = firstAttr as MinMidMax;
      meetOrSlice = MeetOrSlice.meet;
    }
    // ok firstAttr was meet or slice, then if there is more on the array is an align
    else if (aspectRatioAttrs.length) {
      align = aspectRatioAttrs.pop() as MinMidMax;
    }
  }
  //divide align in alignX and alignY
  if (align !== MinMidMax.none) {
    alignX = align.slice(1, 4) as MinMidMax;
    alignY = align.slice(5, 8) as MinMidMax;
  } else {
    alignX = MinMidMax.none;
    alignY = MinMidMax.none;
  }

  return {
    meetOrSlice,
    alignX,
    alignY,
  };
};

/**
 * given an array of 6 number returns something like `"matrix(...numbers)"`
 * @memberOf fabric.util
 * @param {Array} transform an array with 6 numbers
 * @return {String} transform matrix for svg
 * @return {Object.y} Limited dimensions by Y
 */
export const matrixToSVG = (transform: TMat2D) =>
  'matrix(' + transform.map((value) => toFixed(value, fabric.Object.NUM_FRACTION_DIGITS)).join(' ') + ')';
