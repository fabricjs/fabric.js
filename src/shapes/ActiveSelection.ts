import type { ControlRenderingStyleOverride } from '../controls/controlRendering';
import { classRegistry } from '../ClassRegistry';
import type { GroupProps, LayoutContext } from './Group';
import { Group } from './Group';
import type { FabricObject } from './Object/FabricObject';

export type MultiSelectionStacking = 'canvas-stacking' | 'selection-order';

export interface ActiveSelectionOptions extends GroupProps {
  multiSelectionStacking: MultiSelectionStacking;
}

/**
 * Used by Canvas to manage selection.
 * Canvas accepts an `activeSelection` option allowing overriding and customization.
 *
 * @example
 * class MyActiveSelection extends ActiveSelection {
 *   ...
 * }
 *
 * const canvas = new Canvas(el, {
 *  activeSelection: new MyActiveSelection()
 * })
 */
export class ActiveSelection extends Group {
  declare _objects: FabricObject[];

  /**
   * controls how selected objects are added during a multiselection event
   * - `canvas-stacking` adds the selected object to the active selection while respecting canvas object stacking order
   * - `selection-order` adds the selected object to the top of the stack,
   * meaning that the stack is ordered by the order in which objects were selected
   * @default `canvas-stacking`
   */
  // TODO FIX THIS WITH THE DEFAULTS LOGIC
  multiSelectionStacking: MultiSelectionStacking = 'canvas-stacking';

  static type = 'ActiveSelection';

  /**
   * @private
   */
  _shouldSetNestedCoords() {
    return true;
  }

  /**
   * @private
   * @override we don't want the selection monitor to be active
   */
  __objectSelectionMonitor() {
    //  noop
  }

  /**
   * Adds objects with respect to {@link multiSelectionStacking}
   * @param targets object to add to selection
   */
  multiSelectAdd(...targets: FabricObject[]) {
    if (this.multiSelectionStacking === 'selection-order') {
      this.add(...targets);
    } else {
      //  respect object stacking as it is on canvas
      //  perf enhancement for large ActiveSelection: consider a binary search of `isInFrontOf`
      targets.forEach((target) => {
        const index = this._objects.findIndex((obj) => obj.isInFrontOf(target));
        const insertAt =
          index === -1
            ? //  `target` is in front of all other objects
              this.size()
            : index;
        this.insertAt(insertAt, target);
      });
    }
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
      // make sure we are setting the correct owning group
      // in case `object` is transferred between active selections
      !(parent instanceof ActiveSelection) && (object.__owningGroup = parent);
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
      parent._enterGroup(object, true);
      delete object.__owningGroup;
    }
  }

  /**
   * @private
   * @param {'added'|'removed'} type
   * @param {FabricObject[]} targets
   */
  _onAfterObjectsChange(type: 'added' | 'removed', targets: FabricObject[]) {
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

  _applyLayoutStrategy(context: LayoutContext): void {
    super._applyLayoutStrategy(context);
    if (this._objects.length === 0) {
      // in this case layout was skipped
      // we reset transform for the next selection
      Object.assign(this, {
        left: 0,
        top: 0,
        angle: 0,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        skewY: 0,
        flipX: false,
        flipY: false,
      });
    }
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
}

classRegistry.setClass(ActiveSelection);
classRegistry.setClass(ActiveSelection, 'activeSelection');
