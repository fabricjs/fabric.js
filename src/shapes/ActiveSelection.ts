import type { ControlRenderingStyleOverride } from '../controls/controlRendering';
import { classRegistry } from '../ClassRegistry';
import type { GroupProps } from './Group';
import { Group } from './Group';
import type { FabricObject } from './Object/FabricObject';
import {
  LAYOUT_TYPE_ADDED,
  LAYOUT_TYPE_REMOVED,
} from '../LayoutManager/constants';
import type { TClassProperties } from '../typedefs';
import { log } from '../util/internals/console';
import { ActiveSelectionLayoutManager } from '../LayoutManager/ActiveSelectionLayoutManager';

export type MultiSelectionStacking = 'canvas-stacking' | 'selection-order';

export interface ActiveSelectionOptions extends GroupProps {
  multiSelectionStacking: MultiSelectionStacking;
}

const activeSelectionDefaultValues: Partial<TClassProperties<ActiveSelection>> =
  {
    multiSelectionStacking: 'canvas-stacking',
  };

/**
 * Used by Canvas to manage selection.
 *
 * @example
 * class MyActiveSelection extends ActiveSelection {
 *   ...
 * }
 *
 * // override the default `ActiveSelection` class
 * classRegistry.setClass(MyActiveSelection)
 */
export class ActiveSelection extends Group {
  static type = 'ActiveSelection';

  static ownDefaults: Record<string, any> = activeSelectionDefaultValues;

  static getDefaults(): Record<string, any> {
    return { ...super.getDefaults(), ...ActiveSelection.ownDefaults };
  }

  /**
   * The ActiveSelection needs to use the ActiveSelectionLayoutManager
   * or selections on interactive groups may be broken
   */
  declare layoutManager: ActiveSelectionLayoutManager;

  /**
   * controls how selected objects are added during a multiselection event
   * - `canvas-stacking` adds the selected object to the active selection while respecting canvas object stacking order
   * - `selection-order` adds the selected object to the top of the stack,
   * meaning that the stack is ordered by the order in which objects were selected
   * @default `canvas-stacking`
   */
  declare multiSelectionStacking: MultiSelectionStacking;

  constructor(
    objects: FabricObject[] = [],
    options: Partial<ActiveSelectionOptions> = {},
  ) {
    super();
    Object.assign(this, ActiveSelection.ownDefaults);
    this.setOptions(options);
    const { left, top, layoutManager } = options;
    this.groupInit(objects, {
      left,
      top,
      layoutManager: layoutManager ?? new ActiveSelectionLayoutManager(),
    });
  }

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
   * @override block ancestors/descendants of selected objects from being selected to prevent a circular object tree
   */
  canEnterGroup(object: FabricObject) {
    if (
      this.getObjects().some(
        (o) => o.isDescendantOf(object) || object.isDescendantOf(o),
      )
    ) {
      //  prevent circular object tree
      log(
        'error',
        'ActiveSelection: circular object trees are not supported, this call has no effect',
      );
      return false;
    }

    return super.canEnterGroup(object);
  }

  /**
   * Change an object so that it can be part of an active selection.
   * this method is called by multiselectAdd from canvas code.
   * @private
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object is in canvas coordinate plane
   */
  enterGroup(object: FabricObject, removeParentTransform?: boolean) {
    // This condition check that the object has currently a group, and the group
    // is also its parent, meaning that is not in an active selection, but is
    // in a normal group.
    if (object.parent && object.parent === object.group) {
      // Disconnect the object from the group functionalities, but keep the ref parent intact
      // for later re-enter
      object.parent._exitGroup(object);
      // in this case the object is probably inside an active selection.
    } else if (object.group && object.parent !== object.group) {
      // in this case group.remove will also clear the old parent reference.
      object.group.remove(object);
    }
    // enter the active selection from a render perspective
    // the object will be in the objects array of both the ActiveSelection and the Group
    // but referenced in the group's _activeObjects so that it won't be rendered twice.
    this._enterGroup(object, removeParentTransform);
  }

  /**
   * we want objects to retain their canvas ref when exiting instance
   * @private
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object should exit group without applying group's transform to it
   */
  exitGroup(object: FabricObject, removeParentTransform?: boolean) {
    this._exitGroup(object, removeParentTransform);
    // return to parent
    object.parent && object.parent._enterGroup(object, true);
  }

  /**
   * @private
   * @param {'added'|'removed'} type
   * @param {FabricObject[]} targets
   */
  _onAfterObjectsChange(type: 'added' | 'removed', targets: FabricObject[]) {
    super._onAfterObjectsChange(type, targets);
    const groups = new Set<Group>();
    targets.forEach((object) => {
      const { parent } = object;
      parent && groups.add(parent);
    });
    if (type === LAYOUT_TYPE_REMOVED) {
      //  invalidate groups' layout and mark as dirty
      groups.forEach((group) => {
        group._onAfterObjectsChange(LAYOUT_TYPE_ADDED, targets);
      });
    } else {
      //  mark groups as dirty
      groups.forEach((group) => {
        group._set('dirty', true);
      });
    }
  }

  /**
   * @override remove all objects
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
    childrenOverride?: ControlRenderingStyleOverride,
  ) {
    ctx.save();
    ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
    const options = {
      hasControls: false,
      ...childrenOverride,
      forActiveSelection: true,
    };
    for (let i = 0; i < this._objects.length; i++) {
      this._objects[i]._renderControls(ctx, options);
    }
    super._renderControls(ctx, styleOverride);
    ctx.restore();
  }
}

classRegistry.setClass(ActiveSelection);
classRegistry.setClass(ActiveSelection, 'activeSelection');
