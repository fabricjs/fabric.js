import { Object, ObjectOptions } from "./object";
import { Image } from "./image";

export interface RectangleOptions extends ObjectOptions {
  // TODO - is there anything?
}

/**
 * Rectangle class
 * @class fabric.Rect
 * @extends fabric.Object
 * @return {fabric.Rect} thisArg
 * @see {@link fabric.Rect#initialize} for constructor definition
 */
export interface Rect extends Object, RectangleOptions {}
export class Rect {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: string;

    /**
     * Horizontal border radius
     * @type Number
     * @default
     */
    rx: number;

    /**
     * Vertical border radius
     * @type Number
     * @default
     */
    ry: number;

    /**
     * Constructor
     * @param {Object} [options] Options object
     * @return {Object} thisArg
     */
    constructor(options?: RectangleOptions);

    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject<T extends keyof this>(propertiesToInclude?: (keyof T)[]): Object;

    /**
     * Returns svg representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG(reviver?: (svg: string) => string): string;


  /**
   * Returns {@link fabric.Rect} instance from an SVG element
   * @static
   * @memberOf fabric.Rect
   * @param {SVGElement} element Element to parse
   * @param {Function} callback callback function invoked after parsing
   * @param {Object} [options] Options object
   */
  static fromElement(element: SVGElement, callback?: (rect: Rect) => void, options?: RectangleOptions): void;

  /**
   * Returns {@link fabric.Rect} instance from an object representation
   * @static
   * @memberOf fabric.Rect
   * @param {Object} object Object to create an instance from
   * @param {Function} [callback] Callback to invoke when an fabric.Rect instance is created
   */
  static fromObject(object: Object, callback?: (rect: Rect) => void): void;
}
