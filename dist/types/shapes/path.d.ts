import { Object, ObjectOptions } from "./object";

export interface PathOptions extends ObjectOptions {
  // TODO - even necessary?
}

/**
 * Path class
 * @class fabric.Path
 * @extends fabric.Object
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-1#path_and_pathgroup}
 * @see {@link fabric.Path#initialize} for constructor definition
 */
export interface Path extends Object {}
export class Path {

  /**
   * Type of an object ("path")
   * @type String
   * @default
   */
  type: string;

  /**
   * Array of path points
   * @type Array
   * @default
   */
  path: Array<string>;

  /**
   * Constructor
   * @param {Array|String} path Path data (sequence of coordinates and corresponding "command" tokens)
   * @param {Object} [options] Options object
   * @return {fabric.Path} thisArg
   */
  constructor(path: Array<string> | String, options: PathOptions);

  /**
   * Returns string representation of an instance
   * @return {String} string representation of an instance
   */
  toString(): string;

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject<T extends keyof this>(propertiesToInclude: (keyof T)[]): Object;

  /**
   * Returns dataless object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toDatalessObject(propertiesToInclude: (keyof this)[]): Object;

  /* _TO_SVG_START_ */
  /**
   * Returns svg representation of an instance
   * @param {Function} [reviver] Method for further parsing of svg representation.
   * @return {String} svg representation of an instance
   */
  toSVG(reviver: (svg: string) => string): string;

  /**
   * Returns number representation of an instance complexity
   * @return {Number} complexity of this instance
   */
  complexity(): number;


  /**
   * Creates an instance of fabric.Path from an object
   * @static
   * @memberOf fabric.Path
   * @param {Object} object
   * @param {Function} [callback] Callback to invoke when an fabric.Path instance is created
   */
  static fromObject(object: Object, callback: (path: Path) => void): void;

  /**
   * Creates an instance of fabric.Path from an SVG <path> element
   * @static
   * @memberOf fabric.Path
   * @param {SVGElement} element to parse
   * @param {Function} callback Callback to invoke when an fabric.Path instance is created
   * @param {Object} [options] Options object
   */
  static fromElement(element: SVGElement, callback: (path: Path) => void, options: PathOptions): void;
}
