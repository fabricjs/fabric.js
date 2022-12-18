import { fabric } from '../../HEADER';
import { ControlRenderingStyleOverride } from '../controls';
import { TClassProperties } from '../typedefs';
import { enlivenObjects } from '../util/misc/objectEnlive';
import { FabricObject } from './Object/FabricObject';
import { Group, groupDefaultValues } from './group.class';

export class ActiveSelection extends Group {
  constructor(
    objects?: FabricObject[],
    options?: any,
    objectsRelativeToGroup?: boolean
  ) {
    super(objects, options, objectsRelativeToGroup);
    this.setCoords();
  }

  /**
   * @private
   */
  _shouldSetNestedCoords() {
    return true;
  }

  /**
   * @private
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object is in canvas coordinate plane
   * @returns {boolean} true if object entered group
   */
  enterGroup(object: FabricObject, removeParentTransform?: boolean) {
    if (object.group) {
      //  save ref to group for later in order to return to it
      const parent = object.group;
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
  exitGroup(object: FabricObject, removeParentTransform?: boolean) {
    this._exitGroup(object, removeParentTransform);
    const parent = object.__owningGroup;
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
  _onAfterObjectsChange(type: 'added' | 'removed', targets: FabricObject[]) {
    // @TODO figure out this change. This part wasn't here before migration.
    super._onAfterObjectsChange(type, targets);
    const groups: Group[] = [];
    targets.forEach((object) => {
      object.group &&
        !groups.includes(object.group) &&
        groups.push(object.group);
    });
    if (type === 'removed') {
      //  invalidate groups' layout and mark as dirty
      groups.forEach((group) => {
        group._onAfterObjectsChange('added', targets);
      });
    } else {
      //  mark groups as dirty
      groups.forEach((group) => {
        group._set('dirty', true);
      });
    }
  }

  /**
   * If returns true, deselection is cancelled.
   * @since 2.0.0
   * @return {Boolean} [cancel]
   */
  onDeselect() {
    this.removeAll();
    return false;
  }

  /**
   * Returns string representation of a group
   * @return {String}
   */
  toString() {
    return `#<ActiveSelection: (${this.complexity()})>`;
  }

  /**
   * Decide if the object should cache or not. Create its own cache level
   * objectCaching is a global flag, wins over everything
   * needsItsOwnCache should be used when the object drawing method requires
   * a cache step. None of the fabric classes requires it.
   * Generally you do not cache objects in groups because the group outside is cached.
   * @return {Boolean}
   */
  shouldCache() {
    return false;
  }

  /**
   * Check if this group or its parent group are caching, recursively up
   * @return {Boolean}
   */
  isOnACache() {
    return false;
  }

  /**
   * Renders controls and borders for the object
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {Object} [styleOverride] properties to override the object style
   * @param {Object} [childrenOverride] properties to override the children overrides
   */
  _renderControls(
    ctx: CanvasRenderingContext2D,
    styleOverride?: ControlRenderingStyleOverride,
    childrenOverride?: ControlRenderingStyleOverride
  ) {
    ctx.save();
    ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
    super._renderControls(ctx, styleOverride);
    const options = {
      hasControls: false,
      ...childrenOverride,
      forActiveSelection: true,
    };
    for (let i = 0; i < this._objects.length; i++) {
      this._objects[i]._renderControls(ctx, options);
    }
    ctx.restore();
  }

  /**
   * Returns {@link ActiveSelection} instance from an object representation
   * @static
   * @memberOf ActiveSelection
   * @param {Object} object Object to create a group from
   * @returns {Promise<ActiveSelection>}
   */
  static fromObject({ objects = [], ...options }) {
    return enlivenObjects(objects).then(
      (enlivenedObjects) => new ActiveSelection(enlivenedObjects, options, true)
    );
  }
}

export const activeSelectionDefaultValues: Partial<
  TClassProperties<ActiveSelection>
> = {
  ...groupDefaultValues,
  type: 'activeSelection',
  layout: 'fit-content',
  subTargetCheck: false,
  interactive: false,
};

Object.assign(ActiveSelection.prototype, activeSelectionDefaultValues);

fabric.ActiveSelection = ActiveSelection;
