//@ts-nocheck
import { enlivenObjects } from '../util';
import { Group } from './group.class';
import type { FabricObject } from './object.class';

/**
 * @class ActiveSelection
 * @extends Group
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-3#groups}
 */
export class ActiveSelection extends Group {

  /**
   * Type of an object
   * @type String
   * @default
   */
  type: string = 'activeSelection'

  /**
   * @override
   */
  layout = 'fit-content'

  /**
   * @override
   */
  subTargetCheck = false

  /**
   * @override
   */
  interactive = false

  /**
   * Constructor
   *
   * @param {FabricObject[]} [objects] instance objects
   * @param {FabricObject} [options] Options object
   * @param {boolean} [objectsRelativeToGroup] true if objects exist in group coordinate plane
   * @return {ActiveSelection} thisArg
   */
  constructor(objects: FabricObject[], options: object, objectsRelativeToGroup: boolean) {
    super(objects, options, objectsRelativeToGroup);
    this.setCoords();
  }

  /**
   * @private
   */
  protected _shouldSetNestedCoords() {
    return true;
  }

  /**
   * @private
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object is in canvas coordinate plane
   * @returns {boolean} true if object entered group
   */
  enterGroup(object: FabricObject, removeParentTransform: boolean): boolean {
    if (object.group) {
      //  save ref to group for later in order to return to it
      var parent = object.group;
      parent._exitGroup(object);
      object.__owningGroup = parent;
    }
    this._enterGroup(object, removeParentTransform);
    return true;
  }

  /**
   * we want objects to retain their canvas ref when exiting instance
   * @private
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object should exit group without applying group's transform to it
   */
  exitGroup(object: FabricObject, removeParentTransform: boolean) {
    this._exitGroup(object, removeParentTransform);
    var parent = object.__owningGroup;
    if (parent) {
      //  return to owning group
      parent.enterGroup(object);
      delete object.__owningGroup;
    }
  }

  /**
   * @private
   * @param {'added'|'removed'} type
   * @param {FabricObject[]} targets
   */
  protected _onAfterObjectsChange(type: 'added' | 'removed', targets: FabricObject[]) {
    var groups = [] as Group[];
    targets.forEach(function (object) {
      object.group && !groups.includes(object.group) && groups.push(object.group);
    });
    if (type === 'removed') {
      //  invalidate groups' layout and mark as dirty
      groups.forEach(function (group) {
        group._onAfterObjectsChange('added', targets);
      });
    }
    else {
      //  mark groups as dirty
      groups.forEach(function (group) {
        group._set('dirty', true);
      });
    }
  }

  /**
   * If returns true, deselection is cancelled.
   * @since 2.0.0
   * @return {Boolean} [cancel]
   */
  onDeselect(): boolean {
    this.removeAll();
    return false;
  }

  /**
   * Returns string representation of a group
   * @return {String}
   */
  toString(): string {
    return '#<fabric.ActiveSelection: (' + this.complexity() + ')>';
  }

  /**
   * Decide if the object should cache or not. Create its own cache level
   * objectCaching is a global flag, wins over everything
   * needsItsOwnCache should be used when the object drawing method requires
   * a cache step. None of the fabric classes requires it.
   * Generally you do not cache objects in groups because the group outside is cached.
   * @return {Boolean}
   */
  shouldCache(): boolean {
    return false;
  }

  /**
   * Check if this group or its parent group are caching, recursively up
   * @return {Boolean}
   */
  isOnACache(): boolean {
    return false;
  }

  /**
   * Renders controls and borders for the object
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {object} [styleOverride] properties to override the object style
   * @param {object} [childrenOverride] properties to override the children overrides
   */
  _renderControls(ctx: CanvasRenderingContext2D, styleOverride: object, childrenOverride: object) {
    ctx.save();
    ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
    super._renderControls(ctx, styleOverride);
    var options = { hasControls: false, ...childrenOverride, forActiveSelection: true };
    for (var i = 0; i < this._objects.length; i++) {
      this._objects[i]._renderControls(ctx, options);
    }
    ctx.restore();
  }

  /**
   * Returns {@link ActiveSelection} instance from an object representation
   * @static
   * @memberOf ActiveSelection
   * @param {object} object Object to create a group from
   * @returns {Promise<ActiveSelection>}
   */
  static async fromObject({ objects, ...options }: object): Promise<ActiveSelection> {
    return new ActiveSelection(await enlivenObjects(objects || []), options, true);
  }
}
