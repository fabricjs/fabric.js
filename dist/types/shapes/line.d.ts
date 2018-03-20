import { Object, ObjectOptions } from "./object";
import { TextOptions } from "./text";
import { Point } from "../point";

export interface LineOptions extends ObjectOptions {
  width?: number;
  height?: number;
}

/**
 * Line class
 * @class fabric.Line
 * @extends fabric.Object
 * @see {@link fabric.Line#initialize} for constructor definition
 */
export interface Line extends Object, LineOptions {}
export class Line {
  /**
   * Type of an object
   * @type String
   * @default
   */
  readonly type: string;

  /**
   * x value or first line edge
   * @type Number
   * @default
   */
  x1: number;

  /**
   * y value or first line edge
   * @type Number
   * @default
   */
  y1: number;

  /**
   * x value or second line edge
   * @type Number
   * @default
   */
  x2: number;

  /**
   * y value or second line edge
   * @type Number
   * @default
   */
  y2: number;

  /**
   * Constructor
   * @param {Array} [points] Array of points
   * @param {Object} [options] Options object
   * @return {fabric.Line} thisArg
   */
  constructor(points?: [number, number, number, number], options?: LineOptions);

  /**
   * Returns object representation of an instance
   * @methd toObject
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject<T extends keyof this>(propertiesToInclude: (keyof T)[]): any; // TODO

  /**
   * Returns SVG representation of an instance
   * @param {Function} [reviver] Method for further parsing of svg representation.
   * @return {String} svg representation of an instance
   */
  toSVG(reviver?: (svg: string) => string): string;

  /**
   * Returns fabric.Line instance from an SVG element
   * @static
   * @memberOf fabric.Line
   * @param {SVGElement} element Element to parse
   * @param {Function} [callback] callback function invoked after parsing
   * @param {Object} [options] Options object
   */
  static fromElement(element: SVGElement, callback?:(line: Line) => void, options?: (keyof Line)[]): void;

  /**
   * Returns fabric.Line instance from an object representation
   * @static
   * @memberOf fabric.Line
   * @param {Object} object Object to create an instance from
   * @param {function} [callback] invoked with new instance as first argument
   */
   static fromObject(object: Object, callback: (line: Line) => void): void;
}
