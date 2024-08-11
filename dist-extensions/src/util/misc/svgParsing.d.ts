import type { TBBox, TMat2D, SVGElementName } from '../../typedefs';
/**
 * Returns array of attributes for given svg that fabric parses
 * @param {SVGElementName} type Type of svg element (eg. 'circle')
 * @return {Array} string names of supported attributes
 */
export declare const getSvgAttributes: (type: SVGElementName) => string[];
/**
 * Converts from attribute value to pixel value if applicable.
 * Returns converted pixels or original value not converted.
 * @param {string} value number to operate on
 * @param {number} fontSize
 * @return {number}
 */
export declare const parseUnit: (value: string, fontSize?: number) => number;
export type MeetOrSlice = 'meet' | 'slice';
export type MinMidMax = 'Min' | 'Mid' | 'Max' | 'none';
export type TPreserveArParsed = {
    meetOrSlice: MeetOrSlice;
    alignX: MinMidMax;
    alignY: MinMidMax;
};
/**
 * Parse preserveAspectRatio attribute from element
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio
 * @param {string} attribute to be parsed
 * @return {Object} an object containing align and meetOrSlice attribute
 */
export declare const parsePreserveAspectRatioAttribute: (attribute: string) => TPreserveArParsed;
/**
 * given an array of 6 number returns something like `"matrix(...numbers)"`
 * @param {TMat2D} transform an array with 6 numbers
 * @return {String} transform matrix for svg
 */
export declare const matrixToSVG: (transform: TMat2D) => string;
/**
 * Adobe Illustrator (at least CS5) is unable to render rgba()-based fill values
 * we work around it by "moving" alpha channel into opacity attribute and setting fill's alpha to 1
 * @param prop
 * @param value
 * @param {boolean} inlineStyle The default is inline style, the separator used is ":", The other is "="
 * @returns
 */
export declare const colorPropToSVG: (prop: string, value?: any, inlineStyle?: boolean) => string;
export declare const createSVGRect: (color: string, { left, top, width, height }: TBBox, precision?: number) => string;
//# sourceMappingURL=svgParsing.d.ts.map