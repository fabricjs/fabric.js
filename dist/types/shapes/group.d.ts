import { Collection } from "../mixin/collection";
import { Object, ObjectOptions } from "./object";
import { Point } from "../point";

export interface GroupOptions extends ObjectOptions {
  centerPoint: Point;
}

/**
 * Group class
 * @class fabric.Group
 * @extends fabric.Object
 * @mixes fabric.Collection
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-3#groups}
 * @see {@link fabric.Group#initialize} for constructor definition
 */
export interface Group extends Object, Collection {}
export class Group {

  /**
   * Type of an object ("group")
   * @type String
   * @default
   */
  readonly type: string;

  /**
   * Width of stroke
   * @type Number
   * @default
   */
  strokeWidth: number;

  /**
   * Indicates if click events should also check for subtargets
   * @type Boolean
   * @default
   */
  subTargetCheck: boolean;

  /**
   * Groups are container, do not render anything on their own, hence no cache properties
   * @type Array
   * @default
   */
  cacheProperties: string[];

  /**
   * setOnGroup is a method used for TextBox that is no more used since 2.0.0 The behavior is still
   * available setting this boolean to true.
   * @type Boolean
   * @since 2.0.0
   * @default
   */
  useSetOnGroup: boolean;

  /**
   * Constructor
   * @param {Object} objects Group objects
   * @param {Object} [options] Options object
   * @param {Boolean} [isAlreadyGrouped] if true, objects have been grouped already.
   * @return {Object} thisArg
   */
  constructor(objects: Object[], options?: GroupOptions, isAlreadyGrouped?: boolean);

  /**
   * Returns string representation of a group
   * @return {String}
   */
  toString(): string;

  /**
   * Adds an object to a group; Then recalculates group's dimension, position.
   * @param {Object} object
   * @return {fabric.Group} thisArg
   * @chainable
   */
  addWithUpdate(object: Object) : this;

  /**
   * Removes an object from a group; Then recalculates group's dimension, position.
   * @param {Object} object
   * @return {fabric.Group} thisArg
   * @chainable
   */
  removeWithUpdate(object: Object): this;

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject<T extends keyof this>(propertiesToInclude: (keyof T)[]): Object;

  /**
   * Returns object representation of an instance, in dataless mode.
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toDatalessObject(propertiesToInclude: (keyof this)[]): Object;

  /**
   * Renders instance on a given context
   * @param {CanvasRenderingContext2D} ctx context to render instance on
   */
  render(ctx: CanvasRenderingContext2D): void;

  /**
   * Decide if the object should cache or not. Create its own cache level
   * objectCaching is a global flag, wins over everything
   * needsItsOwnCache should be used when the object drawing method requires
   * a cache step. None of the fabric classes requires it.
   * Generally you do not cache objects in groups because the group outside is cached.
   * @return {Boolean}
   */
  shouldCache(): boolean;

  /**
   * Check if this object or a child object will cast a shadow
   * @return {Boolean}
   */
  willDrawShadow(): boolean;

  /**
   * Check if this group or its parent group are caching, recursively up
   * @return {Boolean}
   */
  isOnACache(): boolean

  /**
   * Execute the drawing operation for an object on a specified context
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  drawObject(ctx: CanvasRenderingContext2D): void;

  /**
   * Check if cache is dirty
   */
  isCacheDirty(): boolean;

  /**
   * Realises the transform from this group onto the supplied object
   * i.e. it tells you what would happen if the supplied object was in
   * the group, and then the group was destroyed. It mutates the supplied
   * object.
   * @param {Object} object
   * @return {Object} transformedObject
   */
  realizeTransform(object: Object): Object;

  /**
   * Destroys a group (restoring state of its objects)
   * @return {fabric.Group} thisArg
   * @chainable
   */
  destroy(): this;

  /**
   * make a group an active selection, remove the group from canvas
   * the group has to be on canvas for this to work.
   * @return {ActiveSelection} thisArg
   * @chainable
   */
  toActiveSelection(): this;

  /**
   * Destroys a group (restoring state of its objects)
   * @return {fabric.Group} thisArg
   * @chainable
   */
  ungroupOnCanvas(): this;

  /**
   * Sets coordinates of all objects inside group
   * @return {fabric.Group} thisArg
   * @chainable
   */
  setObjectsCoords(): this

  /**
   * Returns svg representation of an instance
   * @param {Function} [reviver] Method for further parsing of svg representation.
   * @return {String} svg representation of an instance
   */
  toSVG(reviver:(svg: string) => string): string;

  /**
   * Returns {@link fabric.Group} instance from an object representation
   * @static
   * @memberOf fabric.Group
   * @param {Object} object Object to create a group from
   * @param {Function} [callback] Callback to invoke when an group instance is created
   */
  static fromObject(object: Object, callback?: (group: Group) => void): void;
}
