// @ts-nocheck
import type { CollectionEvents, ObjectEvents } from '../EventTypeDefs';
import { createCollectionMixin } from '../Collection';
import { resolveOrigin } from '../util/misc/resolveOrigin';
import { Point } from '../Point';
import { cos } from '../util/misc/cos';
import type { TClassProperties, TSVGReviver } from '../typedefs';
import { makeBoundingBoxFromPoints } from '../util/misc/boundingBoxFromPoints';
import {
  invertTransform,
  multiplyTransformMatrices,
  transformPoint,
} from '../util/misc/matrix';
import {
  enlivenObjectEnlivables,
  enlivenObjects,
} from '../util/misc/objectEnlive';
import { applyTransformToObject } from '../util/misc/objectTransforms';
import { degreesToRadians } from '../util/misc/radiansDegreesConversion';
import { sin } from '../util/misc/sin';
import { FabricObject } from './Object/FabricObject';
import { Rect } from './Rect';
import { classRegistry } from '../ClassRegistry';
import {
  FabricObjectProps,
  SerializedObjectProps,
  TProps,
} from './Object/types';

export type LayoutContextType =
  | 'initialization'
  | 'object_modified'
  | 'added'
  | 'removed'
  | 'layout_change'
  | 'imperative';

export type LayoutContext = {
  type: LayoutContextType;
  /**
   * array of objects starting from the object that triggered the call to the current one
   */
  path?: Group[];
  [key: string]: any;
};

export type GroupEvents = ObjectEvents &
  CollectionEvents & {
    layout: {
      context: LayoutContext;
      result: LayoutResult;
      diff: Point;
    };
  };

export type LayoutStrategy =
  | 'fit-content'
  | 'fit-content-lazy'
  | 'fixed'
  | 'clip-path';

/**
 * positioning and layout data **relative** to instance's parent
 */
export type LayoutResult = {
  /**
   * new centerX as measured by the containing plane (same as `left` with `originX` set to `center`)
   */
  centerX: number;
  /**
   * new centerY as measured by the containing plane (same as `top` with `originY` set to `center`)
   */
  centerY: number;
  /**
   * correctionX to translate objects by, measured as `centerX`
   */
  correctionX?: number;
  /**
   * correctionY to translate objects by, measured as `centerY`
   */
  correctionY?: number;
  width: number;
  height: number;
};

export interface GroupOwnProps {
  layout: LayoutStrategy;
  subTargetCheck: boolean;
  interactive: boolean;
}

export interface SerializedGroupProps
  extends SerializedObjectProps,
    GroupOwnProps {
  objects: SerializedObjectProps[];
}

export interface GroupProps extends FabricObjectProps, GroupOwnProps {}

export const groupDefaultValues = {
  layout: 'fit-content',
  strokeWidth: 0,
  subTargetCheck: false,
  interactive: false,
};

/**
 * @fires object:added
 * @fires object:removed
 * @fires layout once layout completes
 */
export class Group extends createCollectionMixin(
  FabricObject<GroupProps, SerializedGroupProps, GroupEvents>
) {
  /**
   * Specifies the **layout strategy** for instance
   * Used by `getLayoutStrategyResult` to calculate layout
   * `fit-content`, `fit-content-lazy`, `fixed`, `clip-path` are supported out of the box
   * @default
   */
  declare layout: LayoutStrategy;

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
   * @default
   * @type boolean
   */
  declare interactive: boolean;

  /**
   * Used internally to optimize performance
   * Once an object is selected, instance is rendered without the selected object.
   * This way instance is cached only once for the entire interaction with the selected object.
   * @private
   */
  protected _activeObjects: FabricObject[] = [];

  static stateProperties: string[] = [
    ...FabricObject.stateProperties,
    'layout',
  ];

  static ownDefaults: Record<string, any> = groupDefaultValues;
  private __objectSelectionTracker: (ev: ObjectEvents['selected']) => void;
  private __objectSelectionDisposer: (ev: ObjectEvents['deselected']) => void;
  private _firstLayoutDone = false;

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
   * @param {boolean} [objectsRelativeToGroup] true if objects exist in group coordinate plane
   */
  constructor(
    objects: FabricObject[] = [],
    options: Partial<GroupProps> = {},
    objectsRelativeToGroup?: boolean
  ) {
    super();
    this._objects = objects;
    this.__objectMonitor = this.__objectMonitor.bind(this);
    this.__objectSelectionTracker = this.__objectSelectionMonitor.bind(
      this,
      true
    );
    this.__objectSelectionDisposer = this.__objectSelectionMonitor.bind(
      this,
      false
    );
    // setting angle, skewX, skewY must occur after initial layout
    this.set({ ...options, angle: 0, skewX: 0, skewY: 0 });
    this.forEachObject((object) => {
      this.enterGroup(object, false);
    });
    this._applyLayoutStrategy({
      type: 'initialization',
      options,
      objectsRelativeToGroup,
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
      /* _DEV_MODE_START_ */
      console.error(
        'fabric.Group: circular object trees are not supported, this call has no effect'
      );
      /* _DEV_MODE_END_ */
      return false;
    } else if (this._objects.indexOf(object) !== -1) {
      // is already in the objects array
      /* _DEV_MODE_START_ */
      console.error(
        'fabric.Group: duplicate objects are not supported inside group, this call has no effect'
      );
      /* _DEV_MODE_END_ */
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
    this._onAfterObjectsChange('added', allowedObjects);
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
    this._onAfterObjectsChange('added', allowedObjects);
    return size;
  }

  /**
   * Remove objects
   * @param {...FabricObject[]} objects
   * @returns {FabricObject[]} removed objects
   */
  remove(...objects: FabricObject[]) {
    const removed = super.remove(...objects);
    this._onAfterObjectsChange('removed', removed);
    return removed;
  }

  _onObjectAdded(object: FabricObject) {
    this.enterGroup(object, true);
    this.fire('object:added', { target: object });
    object.fire('added', { target: this });
  }

  _onRelativeObjectAdded(object: FabricObject) {
    this.enterGroup(object, false);
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
    this._applyLayoutStrategy({
      type: type,
      targets: targets,
    });
    this._set('dirty', true);
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
    const prev = this[key];
    super._set(key, value);
    if (key === 'canvas' && prev !== value) {
      this.forEachObject((object) => {
        object._set(key, value);
      });
    }
    if (key === 'layout' && prev !== value) {
      this._applyLayoutStrategy({
        type: 'layout_change',
        layout: value,
        prevLayout: prev,
      });
    }
    if (key === 'interactive') {
      this.forEachObject((object) => this._watchObject(value, object));
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
   * invalidates layout on object modified
   * @private
   */
  __objectMonitor(ev: ObjectEvents['modified']) {
    this._applyLayoutStrategy({ ...ev, type: 'object_modified' });
    this._set('dirty', true);
  }

  /**
   * keeps track of the selected objects
   * @private
   */
  __objectSelectionMonitor<T extends boolean>(
    selected: T,
    { target: object }: ObjectEvents[T extends true ? 'selected' : 'deselected']
  ) {
    if (selected) {
      this._activeObjects.push(object);
      this._set('dirty', true);
    } else if (this._activeObjects.length > 0) {
      const index = this._activeObjects.indexOf(object);
      if (index > -1) {
        this._activeObjects.splice(index, 1);
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
    const directive = watch ? 'on' : 'off';
    //  make sure we listen only once
    watch && this._watchObject(false, object);
    object[directive]('changed', this.__objectMonitor);
    object[directive]('modified', this.__objectMonitor);
    object[directive]('selected', this.__objectSelectionTracker);
    object[directive]('deselected', this.__objectSelectionDisposer);
  }

  /**
   * @private
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object is in canvas coordinate plane
   * @returns {boolean} true if object entered group
   */
  enterGroup(object: FabricObject, removeParentTransform?: boolean) {
    if (object.group) {
      object.group.remove(object);
    }
    this._enterGroup(object, removeParentTransform);
    return true;
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
          object.calcTransformMatrix()
        )
      );
    }
    this._shouldSetNestedCoords() && object.setCoords();
    object._set('group', this);
    object._set('canvas', this.canvas);
    this.interactive && this._watchObject(true, object);
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
    object._set('canvas', undefined);
  }

  /**
   * @private
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
          object.calcTransformMatrix()
        )
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
   * Decide if the object should cache or not. Create its own cache level
   * needsItsOwnCache should be used when the object drawing method requires
   * a cache step. None of the fabric classes requires it.
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
    if (FabricObject.prototype.willDrawShadow.call(this)) {
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
    return this.ownCaching || (!!this.group && this.group.isOnACache());
  }

  /**
   * Execute the drawing operation for an object on a specified context
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  drawObject(ctx: CanvasRenderingContext2D) {
    this._renderBackground(ctx);
    for (let i = 0; i < this._objects.length; i++) {
      // TODO: handle rendering edge case somehow
      if (
        this.canvas?.preserveObjectStacking &&
        this._objects[i].group !== this
      ) {
        ctx.save();
        ctx.transform(...invertTransform(this.calcTransformMatrix()));
        this._objects[i].render(ctx);
        ctx.restore();
      } else if (this._objects[i].group === this) {
        this._objects[i].render(ctx);
      }
    }
    this._drawClipPath(ctx, this.clipPath);
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
   * @public
   * @param {Partial<LayoutResult> & { layout?: string }} [context] pass values to use for layout calculations
   */
  triggerLayout<T extends this['layout']>(
    context?: Partial<LayoutResult> & { layout?: T }
  ) {
    if (context && context.layout) {
      context.prevLayout = this.layout;
      this.layout = context.layout;
    }
    this._applyLayoutStrategy({ type: 'imperative', context });
  }

  /**
   * @private
   * @param {FabricObject} object
   * @param {Point} diff
   */
  _adjustObjectPosition(object: FabricObject, diff: Point) {
    object.set({
      left: object.left + diff.x,
      top: object.top + diff.y,
    });
  }

  /**
   * initial layout logic:
   * calculate bbox of objects (if necessary) and translate it according to options received from the constructor (left, top, width, height)
   * so it is placed in the center of the bbox received from the constructor
   *
   * @private
   * @param {LayoutContext} context
   */
  _applyLayoutStrategy(context: LayoutContext) {
    const isFirstLayout = context.type === 'initialization';
    if (!isFirstLayout && !this._firstLayoutDone) {
      //  reject layout requests before initialization layout
      return;
    }
    const options = isFirstLayout && context.options;
    const initialTransform = options && {
      angle: options.angle || 0,
      skewX: options.skewX || 0,
      skewY: options.skewY || 0,
    };
    const center = this.getRelativeCenterPoint();
    let result = this.getLayoutStrategyResult(
      this.layout,
      [...this._objects],
      context
    );
    let diff: Point;
    if (result) {
      //  handle positioning
      const newCenter = new Point(result.centerX, result.centerY);
      const vector = center
        .subtract(newCenter)
        .add(new Point(result.correctionX || 0, result.correctionY || 0));
      diff = vector.transform(invertTransform(this.calcOwnMatrix()), true);
      //  set dimensions
      this.set({ width: result.width, height: result.height });
      //  adjust objects to account for new center
      !context.objectsRelativeToGroup &&
        this.forEachObject((object) => {
          object.group === this && this._adjustObjectPosition(object, diff);
        });
      //  clip path as well
      !isFirstLayout &&
        this.layout !== 'clip-path' &&
        this.clipPath &&
        !this.clipPath.absolutePositioned &&
        this._adjustObjectPosition(this.clipPath, diff);
      if (!newCenter.eq(center) || initialTransform) {
        //  set position
        this.setPositionByOrigin(newCenter, 'center', 'center');
        initialTransform && this.set(initialTransform);
        this.setCoords();
      }
    } else if (isFirstLayout) {
      //  fill `result` with initial values for the layout hook
      result = {
        centerX: center.x,
        centerY: center.y,
        width: this.width,
        height: this.height,
      };
      initialTransform && this.set(initialTransform);
      diff = new Point();
    } else {
      //  no `result` so we return
      return;
    }
    //  flag for next layouts
    this._firstLayoutDone = true;
    //  fire layout hook and event (event will fire only for layouts after initialization layout)
    this.onLayout(context, result);
    this.fire('layout', {
      context,
      result,
      diff,
    });
    //  recursive up
    if (this.group && this.group._applyLayoutStrategy) {
      //  append the path recursion to context
      if (!context.path) {
        context.path = [];
      }
      context.path.push(this);
      //  all parents should invalidate their layout
      this.group._applyLayoutStrategy(context);
    }
  }

  /**
   * Override this method to customize layout.
   * If you need to run logic once layout completes use `onLayout`
   * @public
   * @param {string} layoutDirective
   * @param {FabricObject[]} objects
   * @param {LayoutContext} context
   * @returns {LayoutResult | undefined}
   */
  getLayoutStrategyResult<T extends this['layout']>(
    layoutDirective: T,
    objects: FabricObject[],
    context: LayoutContext
  ) {
    if (
      layoutDirective === 'fit-content-lazy' &&
      context.type === 'added' &&
      objects.length > context.targets.length
    ) {
      //  calculate added objects' bbox with existing bbox
      const addedObjects = context.targets.concat(this);
      return this.prepareBoundingBox(layoutDirective, addedObjects, context);
    } else if (
      layoutDirective === 'fit-content' ||
      layoutDirective === 'fit-content-lazy' ||
      (layoutDirective === 'fixed' &&
        (context.type === 'initialization' || context.type === 'imperative'))
    ) {
      return this.prepareBoundingBox(layoutDirective, objects, context);
    } else if (layoutDirective === 'clip-path' && this.clipPath) {
      const clipPath = this.clipPath;
      const clipPathSizeAfter = clipPath._getTransformedDimensions();
      if (
        clipPath.absolutePositioned &&
        (context.type === 'initialization' || context.type === 'layout_change')
      ) {
        //  we want the center point to exist in group's containing plane
        let clipPathCenter = clipPath.getCenterPoint();
        if (this.group) {
          //  send point from canvas plane to group's containing plane
          const inv = invertTransform(this.group.calcTransformMatrix());
          clipPathCenter = transformPoint(clipPathCenter, inv);
        }
        return {
          centerX: clipPathCenter.x,
          centerY: clipPathCenter.y,
          width: clipPathSizeAfter.x,
          height: clipPathSizeAfter.y,
        };
      } else if (!clipPath.absolutePositioned) {
        let center;
        const clipPathRelativeCenter = clipPath.getRelativeCenterPoint(),
          //  we want the center point to exist in group's containing plane, so we send it upwards
          clipPathCenter = transformPoint(
            clipPathRelativeCenter,
            this.calcOwnMatrix(),
            true
          );
        if (
          context.type === 'initialization' ||
          context.type === 'layout_change'
        ) {
          const bbox =
            this.prepareBoundingBox(layoutDirective, objects, context) || {};
          center = new Point(bbox.centerX || 0, bbox.centerY || 0);
          return {
            centerX: center.x + clipPathCenter.x,
            centerY: center.y + clipPathCenter.y,
            correctionX: bbox.correctionX - clipPathCenter.x,
            correctionY: bbox.correctionY - clipPathCenter.y,
            width: clipPath.width,
            height: clipPath.height,
          };
        } else {
          center = this.getRelativeCenterPoint();
          return {
            centerX: center.x + clipPathCenter.x,
            centerY: center.y + clipPathCenter.y,
            width: clipPathSizeAfter.x,
            height: clipPathSizeAfter.y,
          };
        }
      }
    }
  }

  /**
   * Override this method to customize layout.
   * A wrapper around {@link Group#getObjectsBoundingBox}
   * @public
   * @param {string} layoutDirective
   * @param {FabricObject[]} objects
   * @param {LayoutContext} context
   * @returns {LayoutResult | undefined}
   */
  prepareBoundingBox<T extends this['layout']>(
    layoutDirective: T,
    objects: FabricObject[],
    context: LayoutContext
  ) {
    if (context.type === 'initialization') {
      return this.prepareInitialBoundingBox(layoutDirective, objects, context);
    } else if (context.type === 'imperative' && context.context) {
      return {
        ...(this.getObjectsBoundingBox(objects) || {}),
        ...context.context,
      };
    } else {
      return this.getObjectsBoundingBox(objects);
    }
  }

  /**
   * Calculates center taking into account originX, originY while not being sure that width/height are initialized
   * @public
   * @param {string} layoutDirective
   * @param {FabricObject[]} objects
   * @param {LayoutContext} context
   * @returns {LayoutResult | undefined}
   */
  prepareInitialBoundingBox<T extends this['layout']>(
    layoutDirective: T,
    objects: FabricObject[],
    context: LayoutContext
  ) {
    const options = context.options || {},
      hasX = typeof options.left === 'number',
      hasY = typeof options.top === 'number',
      hasWidth = typeof options.width === 'number',
      hasHeight = typeof options.height === 'number';

    //  performance enhancement
    //  skip layout calculation if bbox is defined
    if (
      (hasX &&
        hasY &&
        hasWidth &&
        hasHeight &&
        context.objectsRelativeToGroup) ||
      objects.length === 0
    ) {
      //  return nothing to skip layout
      return;
    }

    const bbox = this.getObjectsBoundingBox(objects) || ({} as LayoutResult);
    const { centerX = 0, centerY = 0, width: w = 0, height: h = 0 } = bbox;
    const width = hasWidth ? this.width : w,
      height = hasHeight ? this.height : h,
      calculatedCenter = new Point(centerX, centerY),
      origin = new Point(
        resolveOrigin(this.originX),
        resolveOrigin(this.originY)
      ),
      size = new Point(width, height),
      strokeWidthVector = this._getTransformedDimensions({
        width: 0,
        height: 0,
      }),
      sizeAfter = this._getTransformedDimensions({
        width: width,
        height: height,
        strokeWidth: 0,
      }),
      bboxSizeAfter = this._getTransformedDimensions({
        width: bbox.width,
        height: bbox.height,
        strokeWidth: 0,
      }),
      rotationCorrection = new Point(0, 0);

    //  calculate center and correction
    const originT = origin.scalarAdd(0.5);
    const originCorrection = sizeAfter.multiply(originT);
    const centerCorrection = new Point(
      hasWidth ? bboxSizeAfter.x / 2 : originCorrection.x,
      hasHeight ? bboxSizeAfter.y / 2 : originCorrection.y
    );
    const center = new Point(
      hasX
        ? this.left - (sizeAfter.x + strokeWidthVector.x) * origin.x
        : calculatedCenter.x - centerCorrection.x,
      hasY
        ? this.top - (sizeAfter.y + strokeWidthVector.y) * origin.y
        : calculatedCenter.y - centerCorrection.y
    );
    const offsetCorrection = new Point(
      hasX
        ? center.x - calculatedCenter.x + bboxSizeAfter.x * (hasWidth ? 0.5 : 0)
        : -(hasWidth
            ? (sizeAfter.x - strokeWidthVector.x) * 0.5
            : sizeAfter.x * originT.x),
      hasY
        ? center.y -
          calculatedCenter.y +
          bboxSizeAfter.y * (hasHeight ? 0.5 : 0)
        : -(hasHeight
            ? (sizeAfter.y - strokeWidthVector.y) * 0.5
            : sizeAfter.y * originT.y)
    ).add(rotationCorrection);
    const correction = new Point(
      hasWidth ? -sizeAfter.x / 2 : 0,
      hasHeight ? -sizeAfter.y / 2 : 0
    ).add(offsetCorrection);

    return {
      centerX: center.x,
      centerY: center.y,
      correctionX: correction.x,
      correctionY: correction.y,
      width: size.x,
      height: size.y,
    };
  }

  /**
   * Calculate the bbox of objects relative to instance's containing plane
   * @public
   * @param {FabricObject[]} objects
   * @returns {LayoutResult | null} bounding box
   */
  getObjectsBoundingBox(
    objects: FabricObject[],
    ignoreOffset?: boolean
  ): LayoutResult | null {
    if (objects.length === 0) {
      return null;
    }
    const objectBounds: Point[] = [];
    objects.forEach((object) => {
      const objCenter = object.getRelativeCenterPoint();
      let sizeVector = object._getTransformedDimensions().scalarDivide(2);
      if (object.angle) {
        const rad = degreesToRadians(object.angle),
          sine = Math.abs(sin(rad)),
          cosine = Math.abs(cos(rad)),
          rx = sizeVector.x * cosine + sizeVector.y * sine,
          ry = sizeVector.x * sine + sizeVector.y * cosine;
        sizeVector = new Point(rx, ry);
      }
      objectBounds.push(
        objCenter.subtract(sizeVector),
        objCenter.add(sizeVector)
      );
    });
    const { left, top, width, height } =
      makeBoundingBoxFromPoints(objectBounds);

    const size = new Point(width, height),
      relativeCenter = (!ignoreOffset ? new Point(left, top) : new Point()).add(
        size.scalarDivide(2)
      ),
      //  we send `relativeCenter` up to group's containing plane
      center = relativeCenter.transform(this.calcOwnMatrix());

    return {
      centerX: center.x,
      centerY: center.y,
      width: size.x,
      height: size.y,
    };
  }

  /**
   * Hook that is called once layout has completed.
   * Provided for layout customization, override if necessary.
   * Complements `getLayoutStrategyResult`, which is called at the beginning of layout.
   * @public
   * @param {LayoutContext} context layout context
   * @param {LayoutResult} result layout result
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onLayout(context: LayoutContext, result: LayoutResult) {}

  /**
   *
   * @private
   * @param {'toObject'|'toDatalessObject'} [method]
   * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @returns {FabricObject[]} serialized objects
   */
  __serializeObjects(
    method: 'toObject' | 'toDatalessObject',
    propertiesToInclude?: string[]
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
        //delete data.version;
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
    K extends keyof T = never
  >(propertiesToInclude: K[] = []): Pick<T, K> & SerializedGroupProps {
    return {
      ...super.toObject([
        'layout',
        'subTargetCheck',
        'interactive',
        ...propertiesToInclude,
      ]),
      objects: this.__serializeObjects('toObject', propertiesToInclude),
    };
  }

  toString() {
    return `#<Group: (${this.complexity()})>`;
  }

  dispose() {
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
  getSvgStyles() {
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
  toClipPathSVG(reviver?: TSVGReviver) {
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
  static fromObject<T extends TProps<SerializedGroupProps>>({
    objects = [],
    ...options
  }: T) {
    return Promise.all([
      enlivenObjects(objects),
      enlivenObjectEnlivables(options),
    ]).then(
      ([objects, hydratedOptions]) =>
        new this(objects, { ...options, ...hydratedOptions }, true)
    );
  }
}

classRegistry.setClass(Group);
