import { Object } from "./shapes/object";
import { Point } from "./point";

/**
 * Parses "transform" attribute, returning an array of values
 * @static
 * @function
 * @memberOf fabric
 * @param {String} attributeValue String containing attribute value
 * @return {Array} Array of 6 elements representing transformation matrix
 */
export function parseTransformAttribute(attributeValue: String): [number, number, number, number, number, number];

/**
 * Parses an SVG document, converts it to an array of corresponding fabric.* instances and passes them to a callback
 * @static
 * @function
 * @memberOf fabric
 * @param {SVGDocument} doc SVG document to parse
 * @param {Function} callback Callback to call when parsing is finished;
 * It's being passed an array of elements (parsed from a document).
 * @param {Function} [reviver] Method for further parsing of SVG elements, called after each fabric object created.
 * @param {Object} [parsingOptions] options for parsing document
 * @param {String} [parsingOptions.crossOrigin] crossOrigin settings
 */
export function parseSVGDocument(doc: HTMLElement,
                                 callback: (svg: string) => string,
                                 reviver?: (svg: string) => string,
                                 parsingOptions?: Object): void;

/**
 * Parses a short font declaration, building adding its properties to a style object
 * @static
 * @function
 * @memberOf fabric
 * @param {String} value font declaration
 * @param {Object} oStyle definition
 */
export function parseFontDeclaration(value: String, oStyle: Object): void;

/**
 * Parses an SVG document, returning all of the gradient declarations found in it
 * @static
 * @function
 * @memberOf fabric
 * @param {SVGDocument} doc SVG document to parse
 * @return {Object} Gradient definitions; key corresponds to element id, value -- to gradient definition element
 */
export function getGradientDefs(doc: HTMLDocument): Object;

/**
 * Returns an object of attributes' name/value, given element and an array of attribute names;
 * Parses parent "g" nodes recursively upwards.
 * @static
 * @memberOf fabric
 * @param {DOMElement} element Element to parse
 * @param {Array} attributes Array of attributes to parse
 * @return {Object} object containing parsed attributes' names/values
 */
export function parseAttributes(element: HTMLElement, attributes: Array<string>): Object;

/**
 * Transforms an array of svg elements to corresponding fabric.* instances
 * @static
 * @memberOf fabric
 * @param {Array} elements Array of elements to parse
 * @param {Function} callback Being passed an array of fabric instances (transformed from SVG elements)
 * @param {Object} [options] Options object
 * @param {Function} [reviver] Method for further parsing of SVG elements, called after each fabric object created.
 */
export function parseElements(elements: Array<HTMLElement>,
                              callback: (instances: Object[]) => void,
                              options?: Object,
                              reviver?: (instances: Object[]) => Object[],
                              parsingOptions?: any): void; // TODO: What are parsingOptions?

/**
 * Parses "style" attribute, retuning an object with values
 * @static
 * @memberOf fabric
 * @param {SVGElement} element Element to parse
 * @return {Object} Objects with values parsed from style attribute of an element
 */
export function parseStyleAttribute(element: HTMLElement): Object;

/**
 * Parses "points" attribute, returning an array of values
 * @static
 * @memberOf fabric
 * @param {String} points points attribute string
 * @return {Array} array of points
 */
export function parsePointsAttribute(points: string[]): Array<Point>;

/**
 * Returns CSS rules for a given SVG document
 * @static
 * @function
 * @memberOf fabric
 * @param {SVGDocument} doc SVG document to parse
 * @return {Object} CSS rules of this document
 */
export function getCSSRules(doc: HTMLElement): Object;

/**
 * Takes url corresponding to an SVG document, and parses it into a set of fabric objects.
 * Note that SVG is fetched via XMLHttpRequest, so it needs to conform to SOP (Same Origin Policy)
 * @memberOf fabric
 * @param {String} url
 * @param {Function} callback
 * @param {Function} [reviver] Method for further parsing of SVG elements, called after each fabric object created.
 * @param {Object} [options] Object containing options for parsing
 * @param {String} [options.crossOrigin] crossOrigin crossOrigin setting to use for external resources
 */
export function loadSVGFromURL(url: string,
                               callback: (objects: Object[], options?: any, elements?: any, allElements?: any) => void, // TODO: What are these
                               reviver?: (element: HTMLElement, object: Object) => Object,
                               options?: Object): void;

/**
 * Takes string corresponding to an SVG document, and parses it into a set of fabric objects
 * @memberOf fabric
 * @param {String} string
 * @param {Function} callback
 * @param {Function} [reviver] Method for further parsing of SVG elements, called after each fabric object created.
 * @param {Object} [options] Object containing options for parsing
 * @param {String} [options.crossOrigin] crossOrigin crossOrigin setting to use for external resources
 */
export function loadSVGFromString(string: string,
                                  callback: (objects: Object[], options: any, elements: any, allElements: any) => void, // TODO: What are these
                                  reviver?: (element: HTMLElement, object: Object) => Object,
                                  options?: Object): void;
