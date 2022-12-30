import { SVGElementName, TMat2D } from '../../typedefs';
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
export declare const parseUnit: (value: string, fontSize: number) => number;
declare const enum MeetOrSlice {
    meet = "meet",
    slice = "slice"
}
declare const enum MinMidMax {
    min = "Min",
    mid = "Mid",
    max = "Max",
    none = "none"
}
type TPreserveArParsed = {
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
export {};
//# sourceMappingURL=svgParsing.d.ts.map