import type { CollectionEvents, ObjectEvents } from '../EventTypeDefs';
import { createCollectionMixin } from '../Collection';
import type {
  TClassProperties,
  TSVGReviver,
  TOptions,
  Abortable,
} from '../typedefs';
import {
  invertTransform,
  multiplyTransformMatrices,
} from '../util/misc/matrix';
import {
  enlivenObjectEnlivables,
  enlivenObjects,
} from '../util/misc/objectEnlive';
import { applyTransformToObject } from '../util/misc/objectTransforms';
import { FabricObject } from './Object/FabricObject';
import { Rect } from './Rect';
import { classRegistry } from '../ClassRegistry';
import type { FabricObjectProps, SerializedObjectProps } from './Object/types';
import { log } from '../util/internals/console';
import type {
  ImperativeLayoutOptions,
  LayoutBeforeEvent,
  LayoutAfterEvent,
} from '../LayoutManager/types';
import { LayoutManager } from '../LayoutManager/LayoutManager';
import {
  LAYOUT_TYPE_ADDED,
  LAYOUT_TYPE_IMPERATIVE,
  LAYOUT_TYPE_INITIALIZATION,
  LAYOUT_TYPE_REMOVED,
} from '../LayoutManager/constants';
import type { SerializedLayoutManager } from '../LayoutManager/LayoutManager';
import type { FitContentLayout } from '../LayoutManager';
import type { DrawContext } from './Object/Object';

/**
 * This class handles the specific case of creating a group using {@link Group#fromObject} and is not meant to be used in any other case.
 * We could have used a boolean in the constructor, as we did previously, but we think the boolean
 * would stay in the group's constructor interface and create confusion, therefore it was removed.
 * This layout manager doesn't do anything and therefore keeps the exact layout the group had when {@link Group#toObject} was called.
 */
class NoopLayoutManager extends LayoutManager {
  performLayout() {}
}

export interface GroupEvents extends ObjectEvents, CollectionEvents {
  'layout:before': LayoutBeforeEvent;
  'layout:after': LayoutAfterEvent;
}

export interface GroupOwnProps {
  subTargetCheck: boolean;
  interactive: boolean;
}

export interface SerializedGroupProps
  extends SerializedObjectProps,
    GroupOwnProps {
  objects: SerializedObjectProps[];
  layoutManager: SerializedLayoutManager;
}

export interface GroupProps extends FabricObjectProps, GroupOwnProps {
  layoutManager: LayoutManager;
}

export const groupDefaultValues: Partial<TClassProperties<Group>> = {
  strokeWidth: 0,
  subTargetCheck: false,
  interactive: false,
};

/**
 * @fires object:added
 * @fires object:removed
 * @fires layout:before
 * @fires layout:after
 */
export class Group
  extends createCollectionMixin(
    FabricObject<GroupProps, SerializedGroupProps, GroupEvents>,
  )
  implements GroupProps
{
  /**
   * Used to optimize performance
   * set to `false` if you don't need contained objects to be targets of events
   * @default
   * @type boolean
   */
  declare subTargetCheck: boolean;

  /**
   * Used to allow targeting of object inside groups.
   * set to true if you want to select an object inside a group.\
   * **REQUIRES** `subTargetCheck` set to true
   * This will be not removed but slowly replaced with a method setInteractive
   * that will take care of enabling subTargetCheck and necessary object events.
   * There is too much attached to group interactivity to just be evaluated by a
   * boolean in the code
   * @default
   * @deprecated
   * @type boolean
   */
  declare interactive: boolean;

  declare layoutManager: LayoutManager;

  /**
   * Used internally to optimize performance
   * Once an object is selected, instance is rendered without the selected object.
   * This way instance is cached only once for the entire interaction with the selected object.
   * @private
   */
  protected _activeObjects: FabricObject[] = [];

  static type = 'Group';

  static ownDefaults: Record<string, any> = groupDefaultValues;
  private __objectSelectionTracker: (ev: ObjectEvents['selected']) => void;
  private __objectSelectionDisposer: (ev: ObjectEvents['deselected']) => void;

  static getDefaults(): Record<string, any> {
    return {
      ...super.getDefaults(),
      ...Group.ownDefaults,
    };
  }

  /**
   * Constructor
   *
   * @param {FabricObject[]} [objects] instance objects
   * @param {Object} [options] Options object
   */
  constructor(objects: FabricObject[] = [], options: Partial<GroupProps> = {}) {
    super();
    Object.assign(this, Group.ownDefaults);
    this.setOptions(options);
    this.groupInit(objects, options);
  }

  /**
   * Shared code between group and active selection
   * Meant to be used by the constructor.
   */
  protected groupInit(
    objects: FabricObject[],
    options: {
      layoutManager?: LayoutManager;
      top?: number;
      left?: number;
    },
  ) {
    this._objects = [...objects]; // Avoid unwanted mutations of Collection to affect the caller

    this.__objectSelectionTracker = this.__objectSelectionMonitor.bind(
      this,
      true,
    );
    this.__objectSelectionDisposer = this.__objectSelectionMonitor.bind(
      this,
      false,
    );

    this.forEachObject((object) => {
      this.enterGroup(object, false);
    });

    // perform initial layout
    this.layoutManager = options.layoutManager ?? new LayoutManager();
    this.layoutManager.performLayout({
      type: LAYOUT_TYPE_INITIALIZATION,
      target: this,
      targets: [...objects],
      // @TODO remove this concept from the layout manager.
      // Layout manager will calculate the correct position,
      // group options can override it later.
      x: options.left,
      y: options.top,
    });
  }

  /**
   * Checks if object can enter group and logs relevant warnings
   * @private
   * @param {FabricObject} object
   * @returns
   */
  canEnterGroup(object: FabricObject) {
    if (object === this || this.isDescendantOf(object)) {
      //  prevent circular object tree
      log(
        'error',
        'Group: circular object trees are not supported, this call has no effect',
      );
      return false;
    } else if (this._objects.indexOf(object) !== -1) {
      // is already in the objects array
      log(
        'error',
        'Group: duplicate objects are not supported inside group, this call has no effect',
      );
      return false;
    }
    return true;
  }

  /**
   * Override this method to enhance performance (for groups with a lot of objects).
   * If Overriding, be sure not pass illegal objects to group - it will break your app.
   * @private
   */
  protected _filterObjectsBeforeEnteringGroup(objects: FabricObject[]) {
    return objects.filter((object, index, array) => {
      // can enter AND is the first occurrence of the object in the passed args (to prevent adding duplicates)
      return this.canEnterGroup(object) && array.indexOf(object) === index;
    });
  }

  /**
   * Add objects
   * @param {...FabricObject[]} objects
   */
  add(...objects: FabricObject[]) {
    const allowedObjects = this._filterObjectsBeforeEnteringGroup(objects);
    const size = super.add(...allowedObjects);
    this._onAfterObjectsChange(LAYOUT_TYPE_ADDED, allowedObjects);
    return size;
  }

  /**
   * Inserts an object into collection at specified index
   * @param {FabricObject[]} objects Object to insert
   * @param {Number} index Index to insert object at
   */
  insertAt(index: number, ...objects: FabricObject[]) {
    const allowedObjects = this._filterObjectsBeforeEnteringGroup(objects);
    const size = super.insertAt(index, ...allowedObjects);
    this._onAfterObjectsChange(LAYOUT_TYPE_ADDED, allowedObjects);
    return size;
  }

  /**
   * Remove objects
   * @param {...FabricObject[]} objects
   * @returns {FabricObject[]} removed objects
   */
  remove(...objects: FabricObject[]) {
    const removed = super.remove(...objects);
    this._onAfterObjectsChange(LAYOUT_TYPE_REMOVED, removed);
    return removed;
  }

  _onObjectAdded(object: FabricObject) {
    this.enterGroup(object, true);
    this.fire('object:added', { target: object });
    object.fire('added', { target: this });
  }

  /**
   * @private
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object should exit group without applying group's transform to it
   */
  _onObjectRemoved(object: FabricObject, removeParentTransform?: boolean) {
    this.exitGroup(object, removeParentTransform);
    this.fire('object:removed', { target: object });
    object.fire('removed', { target: this });
  }

  /**
   * @private
   * @param {'added'|'removed'} type
   * @param {FabricObject[]} targets
   */
  _onAfterObjectsChange(type: 'added' | 'removed', targets: FabricObject[]) {
    this.layoutManager.performLayout({
      type,
      targets,
      target: this,
    });
  }

  _onStackOrderChanged() {
    this._set('dirty', true);
  }

  /**
   * @private
   * @param {string} key
   * @param {*} value
   */
  _set(key: string, value: any) {
    const prev = this[key as keyof this];
    super._set(key, value);
    if (key === 'canvas' && prev !== value) {
      (this._objects || []).forEach((object) => {
        object._set(key, value);
      });
    }
    return this;
  }

  /**
   * @private
   */
  _shouldSetNestedCoords() {
    return this.subTargetCheck;
  }

  /**
   * Remove all objects
   * @returns {FabricObject[]} removed objects
   */
  removeAll() {
    this._activeObjects = [];
    return this.remove(...this._objects);
  }

  /**
   * keeps track of the selected objects
   * @private
   */
  __objectSelectionMonitor<T extends boolean>(
    selected: T,
    {
      target: object,
    }: ObjectEvents[T extends true ? 'selected' : 'deselected'],
  ) {
    const activeObjects = this._activeObjects;
    if (selected) {
      activeObjects.push(object);
      this._set('dirty', true);
    } else if (activeObjects.length > 0) {
      const index = activeObjects.indexOf(object);
      if (index > -1) {
        activeObjects.splice(index, 1);
        this._set('dirty', true);
      }
    }
  }

  /**
   * @private
   * @param {boolean} watch
   * @param {FabricObject} object
   */
  _watchObject(watch: boolean, object: FabricObject) {
    //  make sure we listen only once
    watch && this._watchObject(false, object);
    if (watch) {
      object.on('selected', this.__objectSelectionTracker);
      object.on('deselected', this.__objectSelectionDisposer);
    } else {
      object.off('selected', this.__objectSelectionTracker);
      object.off('deselected', this.__objectSelectionDisposer);
    }
  }

  /**
   * @private
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object is in canvas coordinate plane
   */
  enterGroup(object: FabricObject, removeParentTransform?: boolean) {
    object.group && object.group.remove(object);
    object._set('parent', this);
    this._enterGroup(object, removeParentTransform);
  }

  /**
   * @private
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object is in canvas coordinate plane
   */
  _enterGroup(object: FabricObject, removeParentTransform?: boolean) {
    if (removeParentTransform) {
      // can this be converted to utils (sendObjectToPlane)?
      applyTransformToObject(
        object,
        multiplyTransformMatrices(
          invertTransform(this.calcTransformMatrix()),
          object.calcTransformMatrix(),
        ),
      );
    }
    this._shouldSetNestedCoords() && object.setCoords();
    object._set('group', this);
    object._set('canvas', this.canvas);
    this._watchObject(true, object);
    const activeObject =
      this.canvas &&
      this.canvas.getActiveObject &&
      this.canvas.getActiveObject();
    // if we are adding the activeObject in a group
    if (
      activeObject &&
      (activeObject === object || object.isDescendantOf(activeObject))
    ) {
      this._activeObjects.push(object);
    }
  }

  /**
   * @private
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object should exit group without applying group's transform to it
   */
  exitGroup(object: FabricObject, removeParentTransform?: boolean) {
    this._exitGroup(object, removeParentTransform);
    object._set('parent', undefined);
    object._set('canvas', undefined);
  }

  /**
   * Executes the inner fabric logic of exiting a group.
   * - Stop watching the object
   * - Remove the object from the optimization map this._activeObjects
   * - unset the group property of the object
   * @protected
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object should exit group without applying group's transform to it
   */
  _exitGroup(object: FabricObject, removeParentTransform?: boolean) {
    object._set('group', undefined);
    if (!removeParentTransform) {
      applyTransformToObject(
        object,
        multiplyTransformMatrices(
          this.calcTransformMatrix(),
          object.calcTransformMatrix(),
        ),
      );
      object.setCoords();
    }
    this._watchObject(false, object);
    const index =
      this._activeObjects.length > 0 ? this._activeObjects.indexOf(object) : -1;
    if (index > -1) {
      this._activeObjects.splice(index, 1);
    }
  }

  /**
   * Decide if the group should cache or not. Create its own cache level
   * needsItsOwnCache should be used when the object drawing method requires
   * a cache step.
   * Generally you do not cache objects in groups because the group is already cached.
   * @return {Boolean}
   */
  shouldCache() {
    const ownCache = FabricObject.prototype.shouldCache.call(this);
    if (ownCache) {
      for (let i = 0; i < this._objects.length; i++) {
        if (this._objects[i].willDrawShadow()) {
          this.ownCaching = false;
          return false;
        }
      }
    }
    return ownCache;
  }

  /**
   * Check if this object or a child object will cast a shadow
   * @return {Boolean}
   */
  willDrawShadow() {
    if (super.willDrawShadow()) {
      return true;
    }
    for (let i = 0; i < this._objects.length; i++) {
      if (this._objects[i].willDrawShadow()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if instance or its group are caching, recursively up
   * @return {Boolean}
   */
  isOnACache(): boolean {
    return this.ownCaching || (!!this.parent && this.parent.isOnACache());
  }

  /**
   * Execute the drawing operation for an object on a specified context
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  drawObject(
    ctx: CanvasRenderingContext2D,
    forClipping: boolean | undefined,
    context: DrawContext,
  ) {
    this._renderBackground(ctx);
    for (let i = 0; i < this._objects.length; i++) {
      const obj = this._objects[i];
      // TODO: handle rendering edge case somehow
      if (this.canvas?.preserveObjectStacking && obj.group !== this) {
        ctx.save();
        ctx.transform(...invertTransform(this.calcTransformMatrix()));
        obj.render(ctx);
        ctx.restore();
      } else if (obj.group === this) {
        obj.render(ctx);
      }
    }
    this._drawClipPath(ctx, this.clipPath, context);
  }

  /**
   * @override
   * @return {Boolean}
   */
  setCoords() {
    super.setCoords();
    this._shouldSetNestedCoords() &&
      this.forEachObject((object) => object.setCoords());
  }

  triggerLayout(options: ImperativeLayoutOptions = {}) {
    this.layoutManager.performLayout({
      target: this,
      type: LAYOUT_TYPE_IMPERATIVE,
      ...options,
    });
  }

  /**
   * Renders instance on a given context
   * @param {CanvasRenderingContext2D} ctx context to render instance on
   */
  render(ctx: CanvasRenderingContext2D) {
    this._transformDone = true;
    super.render(ctx);
    this._transformDone = false;
  }

  /**
   *
   * @private
   * @param {'toObject'|'toDatalessObject'} [method]
   * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @returns {FabricObject[]} serialized objects
   */
  __serializeObjects(
    method: 'toObject' | 'toDatalessObject',
    propertiesToInclude?: string[],
  ) {
    const _includeDefaultValues = this.includeDefaultValues;
    return this._objects
      .filter(function (obj) {
        return !obj.excludeFromExport;
      })
      .map(function (obj) {
        const originalDefaults = obj.includeDefaultValues;
        obj.includeDefaultValues = _includeDefaultValues;
        const data = obj[method || 'toObject'](propertiesToInclude);
        obj.includeDefaultValues = originalDefaults;
        // delete data.version;
        return data;
      });
  }

  /**
   * Returns object representation of an instance
   * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject<
    T extends Omit<
      GroupProps & TClassProperties<this>,
      keyof SerializedGroupProps
    >,
    K extends keyof T = never,
  >(propertiesToInclude: K[] = []): Pick<T, K> & SerializedGroupProps {
    const layoutManager = this.layoutManager.toObject();

    return {
      ...super.toObject([
        'subTargetCheck',
        'interactive',
        ...propertiesToInclude,
      ]),
      ...(layoutManager.strategy !== 'fit-content' || this.includeDefaultValues
        ? { layoutManager }
        : {}),
      objects: this.__serializeObjects(
        'toObject',
        propertiesToInclude as string[],
      ),
    };
  }

  toString() {
    return `#<Group: (${this.complexity()})>`;
  }

  dispose() {
    this.layoutManager.unsubscribeTargets({
      targets: this.getObjects(),
      target: this,
    });
    this._activeObjects = [];
    this.forEachObject((object) => {
      this._watchObject(false, object);
      object.dispose();
    });
    super.dispose();
  }

  /**
   * @private
   */
  _createSVGBgRect(reviver?: TSVGReviver) {
    if (!this.backgroundColor) {
      return '';
    }
    const fillStroke = Rect.prototype._toSVG.call(this);
    const commons = fillStroke.indexOf('COMMON_PARTS');
    fillStroke[commons] = 'for="group" ';
    const markup = fillStroke.join('');
    return reviver ? reviver(markup) : markup;
  }

  /**
   * Returns svg representation of an instance
   * @param {TSVGReviver} [reviver] Method for further parsing of svg representation.
   * @return {String} svg representation of an instance
   */
  _toSVG(reviver?: TSVGReviver) {
    const svgString = ['<g ', 'COMMON_PARTS', ' >\n'];
    const bg = this._createSVGBgRect(reviver);
    bg && svgString.push('\t\t', bg);
    for (let i = 0; i < this._objects.length; i++) {
      svgString.push('\t\t', this._objects[i].toSVG(reviver));
    }
    svgString.push('</g>\n');
    return svgString;
  }

  /**
   * Returns styles-string for svg-export, specific version for group
   * @return {String}
   */
  getSvgStyles(): string {
    const opacity =
        typeof this.opacity !== 'undefined' && this.opacity !== 1
          ? `opacity: ${this.opacity};`
          : '',
      visibility = this.visible ? '' : ' visibility: hidden;';
    return [opacity, this.getSvgFilter(), visibility].join('');
  }

  /**
   * Returns svg clipPath representation of an instance
   * @param {Function} [reviver] Method for further parsing of svg representation.
   * @return {String} svg representation of an instance
   */
  toClipPathSVG(reviver?: TSVGReviver): string {
    const svgString = [];
    const bg = this._createSVGBgRect(reviver);
    bg && svgString.push('\t', bg);
    for (let i = 0; i < this._objects.length; i++) {
      svgString.push('\t', this._objects[i].toClipPathSVG(reviver));
    }
    return this._createBaseClipPathSVGMarkup(svgString, {
      reviver,
    });
  }

  /**
   * @todo support loading from svg
   * @private
   * @static
   * @memberOf Group
   * @param {Object} object Object to create a group from
   * @returns {Promise<Group>}
   */
  static fromObject<T extends TOptions<SerializedGroupProps>>(
    { type, objects = [], layoutManager, ...options }: T,
    abortable?: Abortable,
  ) {
    return Promise.all([
      enlivenObjects<FabricObject>(objects, abortable),
      enlivenObjectEnlivables(options, abortable),
    ]).then(([objects, hydratedOptions]) => {
      const group = new this(objects, {
        ...options,
        ...hydratedOptions,
        layoutManager: new NoopLayoutManager(),
      });
      if (layoutManager) {
        const layoutClass = classRegistry.getClass<typeof LayoutManager>(
          layoutManager.type,
        );
        const strategyClass = classRegistry.getClass<typeof FitContentLayout>(
          layoutManager.strategy,
        );
        group.layoutManager = new layoutClass(new strategyClass());
      } else {
        group.layoutManager = new LayoutManager();
      }
      group.layoutManager.subscribeTargets({
        type: LAYOUT_TYPE_INITIALIZATION,
        target: group,
        targets: group.getObjects(),
      });
      group.setCoords();
      return group;
    });
  }
}

classRegistry.setClass(Group);
