import { cache } from '../../cache';
import { config } from '../../config';
import { ALIASING_LIMIT, iMatrix, VERSION } from '../../constants';
import { ObjectEvents } from '../../EventTypeDefs';
import { AnimatableObject } from './AnimatableObject';
import { Point } from '../../Point';
import { Shadow } from '../../Shadow';
import type {
  TDegree,
  TFiller,
  TSize,
  TCacheCanvasDimensions,
} from '../../typedefs';
import { classRegistry } from '../../ClassRegistry';
import { runningAnimations } from '../../util/animation/AnimationRegistry';
import { cloneDeep } from '../../util/internals/cloneDeep';
import { capValue } from '../../util/misc/capValue';
import { createCanvasElement, toDataURL } from '../../util/misc/dom';
import { invertTransform, qrDecompose } from '../../util/misc/matrix';
import { enlivenObjectEnlivables } from '../../util/misc/objectEnlive';
import {
  resetObjectTransform,
  saveObjectTransform,
} from '../../util/misc/objectTransforms';
import { sendObjectToPlane } from '../../util/misc/planeChange';
import { pick, pickBy } from '../../util/misc/pick';
import { toFixed } from '../../util/misc/toFixed';
import type { Group } from '../Group';
import { StaticCanvas } from '../../canvas/StaticCanvas';
import { isFiller, isSerializableFiller, isTextObject } from '../../util/types';
import type { Image } from '../Image';
import {
  cacheProperties,
  fabricObjectDefaultValues,
  stateProperties,
} from './defaultValues';
import type { Gradient } from '../../gradient/Gradient';
import type { Pattern } from '../../Pattern';
import type { Canvas } from '../../canvas/Canvas';
import { SerializedObjectProps } from './types/SerializedObjectProps';
import { ObjectProps } from './types/ObjectProps';
import { TProps } from './types';

export type TCachedFabricObject = FabricObject &
  Required<
    Pick<
      FabricObject,
      | 'zoomX'
      | 'zoomY'
      | '_cacheCanvas'
      | '_cacheContext'
      | 'cacheTranslationX'
      | 'cacheTranslationY'
    >
  > & {
    _cacheContext: CanvasRenderingContext2D;
  };

/**
 * Root object class from which all 2d shape classes inherit from
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-1#objects}
 *
 * @fires added
 * @fires removed
 *
 * @fires selected
 * @fires deselected
 *
 * @fires rotating
 * @fires scaling
 * @fires moving
 * @fires skewing
 * @fires modified
 *
 * @fires mousedown
 * @fires mouseup
 * @fires mouseover
 * @fires mouseout
 * @fires mousewheel
 * @fires mousedblclick
 *
 * @fires dragover
 * @fires dragenter
 * @fires dragleave
 * @fires drop
 */
export class FabricObject<
    Props extends TProps<ObjectProps> = Partial<ObjectProps>,
    SProps extends SerializedObjectProps = SerializedObjectProps,
    EventSpec extends ObjectEvents = ObjectEvents
  >
  extends AnimatableObject<EventSpec>
  implements ObjectProps
{
  declare minScaleLimit: number;

  declare opacity: number;

  declare paintFirst: 'fill' | 'stroke';
  declare fill: string | TFiller | null;
  declare fillRule: CanvasFillRule;
  declare stroke: string | TFiller | null;
  declare strokeDashArray: number[] | null;
  declare strokeDashOffset: number;
  declare strokeLineCap: CanvasLineCap;
  declare strokeLineJoin: CanvasLineJoin;
  declare strokeMiterLimit: number;

  declare globalCompositeOperation: GlobalCompositeOperation;
  declare backgroundColor: string;

  declare shadow: Shadow | null;

  declare visible: boolean;

  declare includeDefaultValues: boolean;
  declare excludeFromExport: boolean;

  declare objectCaching: boolean;

  declare clipPath?: FabricObject;
  declare inverted: boolean;
  declare absolutePositioned: boolean;
  declare centeredRotation: boolean;

  /**
   * This list of properties is used to check if the state of an object is changed.
   * This state change now is only used for children of groups to understand if a group
   * needs its cache regenerated during a .set call
   * @type Array
   */
  static stateProperties: string[] = stateProperties;

  /**
   * List of properties to consider when checking if cache needs refresh
   * Those properties are checked by
   * calls to Object.set(key, value). If the key is in this list, the object is marked as dirty
   * and refreshed at the next render
   * @type Array
   */
  static cacheProperties: string[] = cacheProperties;

  /**
   * When set to `true`, object's cache will be rerendered next render call.
   * since 1.7.0
   * @type Boolean
   * @default true
   */
  declare dirty: boolean;

  /**
   * Quick access for the _cacheCanvas rendering context
   * This is part of the objectCaching feature
   * since 1.7.0
   * @type boolean
   * @default undefined
   * @private
   */
  _cacheContext: CanvasRenderingContext2D | null = null;

  /**
   * A reference to the HTMLCanvasElement that is used to contain the cache of the object
   * this canvas element is resized and cleared as needed
   * Is marked private, you can read it, don't use it since it is handled by fabric
   * since 1.7.0
   * @type HTMLCanvasElement
   * @default undefined
   * @private
   */
  declare _cacheCanvas?: HTMLCanvasElement;

  /**
   * Size of the cache canvas, width
   * since 1.7.0
   * @type number
   * @default undefined
   * @private
   */
  declare cacheWidth?: number;

  /**
   * Size of the cache canvas, height
   * since 1.7.0
   * @type number
   * @default undefined
   * @private
   */
  declare cacheHeight?: number;

  /**
   * zoom level used on the cacheCanvas to draw the cache, X axe
   * since 1.7.0
   * @type number
   * @default undefined
   * @private
   */
  declare zoomX?: number;

  /**
   * zoom level used on the cacheCanvas to draw the cache, Y axe
   * since 1.7.0
   * @type number
   * @default undefined
   * @private
   */
  declare zoomY?: number;

  /**
   * zoom level used on the cacheCanvas to draw the cache, Y axe
   * since 1.7.0
   * @type number
   * @default undefined
   * @private
   */
  declare cacheTranslationX?: number;

  /**
   * translation of the cacheCanvas away from the center, for subpixel accuracy and crispness
   * since 1.7.0
   * @type number
   * @default undefined
   * @private
   */
  declare cacheTranslationY?: number;

  /**
   * A reference to the parent of the object, usually a Group
   * @type number
   * @default undefined
   * @private
   */
  declare group?: Group;

  /**
   * Indicate if the object is sitting on a cache dedicated to it
   * or is part of a larger cache for many object ( a group for example)
   * @type number
   * @default undefined
   * @private
   */
  declare ownCaching?: boolean;

  /**
   * Private. indicates if the object inside a group is on a transformed context or not
   * or is part of a larger cache for many object ( a group for example)
   * @type boolean
   * @default undefined
   * @private
   */
  declare _transformDone?: boolean;

  static ownDefaults: Record<string, any> = fabricObjectDefaultValues;

  static getDefaults(): Record<string, any> {
    return { ...FabricObject.ownDefaults };
  }

  /**
   * Legacy identifier of the class. Prefer using utils like isType or instanceOf
   * Will be removed in fabric 7 or 8.
   * The setter exists because is very hard to catch all the ways in which a type value
   * could be set in the instance
   * @TODO add sustainable warning message
   * @type string
   * @deprecated
   */
  get type() {
    const name = this.constructor.name;
    if (name === 'FabricObject') {
      return 'object';
    }
    return name.toLowerCase();
  }

  set type(value) {
    console.warn('Setting type has no effect', value);
  }

  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor(options: Props = {} as Props) {
    super();
    Object.assign(
      this,
      (this.constructor as typeof FabricObject).getDefaults()
    );
    this.setOptions(options);
  }

  /**
   * Create a the canvas used to keep the cached copy of the object
   * @private
   */
  _createCacheCanvas() {
    this._cacheCanvas = createCanvasElement();
    this._cacheContext = this._cacheCanvas.getContext('2d');
    this._updateCacheCanvas();
    // if canvas gets created, is empty, so dirty.
    this.dirty = true;
  }

  /**
   * Limit the cache dimensions so that X * Y do not cross config.perfLimitSizeTotal
   * and each side do not cross fabric.cacheSideLimit
   * those numbers are configurable so that you can get as much detail as you want
   * making bargain with performances.
   * @param {Object} dims
   * @param {Object} dims.width width of canvas
   * @param {Object} dims.height height of canvas
   * @param {Object} dims.zoomX zoomX zoom value to unscale the canvas before drawing cache
   * @param {Object} dims.zoomY zoomY zoom value to unscale the canvas before drawing cache
   * @return {Object}.width width of canvas
   * @return {Object}.height height of canvas
   * @return {Object}.zoomX zoomX zoom value to unscale the canvas before drawing cache
   * @return {Object}.zoomY zoomY zoom value to unscale the canvas before drawing cache
   */
  _limitCacheSize(
    dims: TSize & { zoomX: number; zoomY: number; capped: boolean } & any
  ) {
    const width = dims.width,
      height = dims.height,
      max = config.maxCacheSideLimit,
      min = config.minCacheSideLimit;
    if (
      width <= max &&
      height <= max &&
      width * height <= config.perfLimitSizeTotal
    ) {
      if (width < min) {
        dims.width = min;
      }
      if (height < min) {
        dims.height = min;
      }
      return dims;
    }
    const ar = width / height,
      [limX, limY] = cache.limitDimsByArea(ar),
      x = capValue(min, limX, max),
      y = capValue(min, limY, max);
    if (width > x) {
      dims.zoomX /= width / x;
      dims.width = x;
      dims.capped = true;
    }
    if (height > y) {
      dims.zoomY /= height / y;
      dims.height = y;
      dims.capped = true;
    }
    return dims;
  }

  /**
   * Return the dimension and the zoom level needed to create a cache canvas
   * big enough to host the object to be cached.
   * @private
   * @return {Object}.x width of object to be cached
   * @return {Object}.y height of object to be cached
   * @return {Object}.width width of canvas
   * @return {Object}.height height of canvas
   * @return {Object}.zoomX zoomX zoom value to unscale the canvas before drawing cache
   * @return {Object}.zoomY zoomY zoom value to unscale the canvas before drawing cache
   */
  _getCacheCanvasDimensions(): TCacheCanvasDimensions {
    const objectScale = this.getTotalObjectScaling(),
      // calculate dimensions without skewing
      dim = this._getTransformedDimensions({ skewX: 0, skewY: 0 }),
      neededX = (dim.x * objectScale.x) / this.scaleX,
      neededY = (dim.y * objectScale.y) / this.scaleY;
    return {
      // for sure this ALIASING_LIMIT is slightly creating problem
      // in situation in which the cache canvas gets an upper limit
      // also objectScale contains already scaleX and scaleY
      width: neededX + ALIASING_LIMIT,
      height: neededY + ALIASING_LIMIT,
      zoomX: objectScale.x,
      zoomY: objectScale.y,
      x: neededX,
      y: neededY,
    };
  }

  /**
   * Update width and height of the canvas for cache
   * returns true or false if canvas needed resize.
   * @private
   * @return {Boolean} true if the canvas has been resized
   */
  _updateCacheCanvas() {
    const canvas = this._cacheCanvas,
      context = this._cacheContext,
      dims = this._limitCacheSize(this._getCacheCanvasDimensions()),
      minCacheSize = config.minCacheSideLimit,
      width = dims.width,
      height = dims.height,
      zoomX = dims.zoomX,
      zoomY = dims.zoomY,
      dimensionsChanged =
        width !== this.cacheWidth || height !== this.cacheHeight,
      zoomChanged = this.zoomX !== zoomX || this.zoomY !== zoomY;

    if (!canvas || !context) {
      return false;
    }

    let drawingWidth,
      drawingHeight,
      shouldRedraw = dimensionsChanged || zoomChanged,
      additionalWidth = 0,
      additionalHeight = 0,
      shouldResizeCanvas = false;

    if (dimensionsChanged) {
      const canvasWidth = (this._cacheCanvas as HTMLCanvasElement).width,
        canvasHeight = (this._cacheCanvas as HTMLCanvasElement).height,
        sizeGrowing = width > canvasWidth || height > canvasHeight,
        sizeShrinking =
          (width < canvasWidth * 0.9 || height < canvasHeight * 0.9) &&
          canvasWidth > minCacheSize &&
          canvasHeight > minCacheSize;
      shouldResizeCanvas = sizeGrowing || sizeShrinking;
      if (
        sizeGrowing &&
        !dims.capped &&
        (width > minCacheSize || height > minCacheSize)
      ) {
        additionalWidth = width * 0.1;
        additionalHeight = height * 0.1;
      }
    }
    if (isTextObject(this) && this.path) {
      shouldRedraw = true;
      shouldResizeCanvas = true;
      // IMHO in those lines we are using zoomX and zoomY not the this version.
      additionalWidth += this.getHeightOfLine(0) * this.zoomX!;
      additionalHeight += this.getHeightOfLine(0) * this.zoomY!;
    }
    if (shouldRedraw) {
      if (shouldResizeCanvas) {
        canvas.width = Math.ceil(width + additionalWidth);
        canvas.height = Math.ceil(height + additionalHeight);
      } else {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
      drawingWidth = dims.x / 2;
      drawingHeight = dims.y / 2;
      this.cacheTranslationX =
        Math.round(canvas.width / 2 - drawingWidth) + drawingWidth;
      this.cacheTranslationY =
        Math.round(canvas.height / 2 - drawingHeight) + drawingHeight;
      this.cacheWidth = width;
      this.cacheHeight = height;
      context.translate(this.cacheTranslationX, this.cacheTranslationY);
      context.scale(zoomX, zoomY);
      this.zoomX = zoomX;
      this.zoomY = zoomY;
      return true;
    }
    return false;
  }

  /**
   * Sets object's properties from options, for class constructor only.
   * Needs to be overridden for different defaults.
   * @protected
   * @param {Object} [options] Options object
   */
  protected setOptions(options: Record<string, any> = {}) {
    this._setOptions(options);
  }

  /**
   * Transforms context when rendering an object
   * @param {CanvasRenderingContext2D} ctx Context
   */
  transform(ctx: CanvasRenderingContext2D) {
    const needFullTransform =
      (this.group && !this.group._transformDone) ||
      (this.group && this.canvas && ctx === (this.canvas as Canvas).contextTop);
    const m = this.calcTransformMatrix(!needFullTransform);
    ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
  }

  /**
   * Returns an object representation of an instance
   * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} Object representation of an instance
   */
  protected toObject(propertiesToInclude: any[] = []): any {
    const NUM_FRACTION_DIGITS = config.NUM_FRACTION_DIGITS,
      clipPathData =
        this.clipPath && !this.clipPath.excludeFromExport
          ? {
              ...this.clipPath.toObject(propertiesToInclude),
              inverted: this.clipPath.inverted,
              absolutePositioned: this.clipPath.absolutePositioned,
            }
          : null,
      object = {
        ...pick(this, propertiesToInclude as (keyof this)[]),
        type: this.constructor.name,
        version: VERSION,
        originX: this.originX,
        originY: this.originY,
        left: toFixed(this.left, NUM_FRACTION_DIGITS),
        top: toFixed(this.top, NUM_FRACTION_DIGITS),
        width: toFixed(this.width, NUM_FRACTION_DIGITS),
        height: toFixed(this.height, NUM_FRACTION_DIGITS),
        fill: isSerializableFiller(this.fill)
          ? this.fill.toObject()
          : this.fill,
        stroke: isSerializableFiller(this.stroke)
          ? this.stroke.toObject()
          : this.stroke,
        strokeWidth: toFixed(this.strokeWidth, NUM_FRACTION_DIGITS),
        strokeDashArray: this.strokeDashArray
          ? this.strokeDashArray.concat()
          : this.strokeDashArray,
        strokeLineCap: this.strokeLineCap,
        strokeDashOffset: this.strokeDashOffset,
        strokeLineJoin: this.strokeLineJoin,
        strokeUniform: this.strokeUniform,
        strokeMiterLimit: toFixed(this.strokeMiterLimit, NUM_FRACTION_DIGITS),
        scaleX: toFixed(this.scaleX, NUM_FRACTION_DIGITS),
        scaleY: toFixed(this.scaleY, NUM_FRACTION_DIGITS),
        angle: toFixed(this.angle, NUM_FRACTION_DIGITS),
        flipX: this.flipX,
        flipY: this.flipY,
        opacity: toFixed(this.opacity, NUM_FRACTION_DIGITS),
        shadow:
          this.shadow && this.shadow.toObject
            ? this.shadow.toObject()
            : this.shadow,
        visible: this.visible,
        backgroundColor: this.backgroundColor,
        fillRule: this.fillRule,
        paintFirst: this.paintFirst,
        globalCompositeOperation: this.globalCompositeOperation,
        skewX: toFixed(this.skewX, NUM_FRACTION_DIGITS),
        skewY: toFixed(this.skewY, NUM_FRACTION_DIGITS),
        ...(clipPathData ? { clipPath: clipPathData } : null),
      };

    return !this.includeDefaultValues
      ? this._removeDefaultValues(object)
      : object;
  }

  /**
   * Returns (dataless) object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} Object representation of an instance
   */
  toDatalessObject(propertiesToInclude?: any[]): any {
    // will be overwritten by subclasses
    return this.toObject(propertiesToInclude);
  }

  /**
   * @private
   * @param {Object} object
   */
  _removeDefaultValues<T extends object>(object: T): Partial<T> {
    // getDefaults() ( get from static ownDefaults ) should win over prototype since anyway they get assigned to instance
    // ownDefault vs prototype is swappable only if you change all the fabric objects consistently.
    const defaults = (this.constructor as typeof FabricObject).getDefaults();
    const hasStaticDefaultValues = Object.keys(defaults).length > 0;
    const baseValues = hasStaticDefaultValues
      ? defaults
      : Object.getPrototypeOf(this);

    return pickBy(object, (value, key) => {
      if (key === 'left' || key === 'top' || key === 'type') {
        return true;
      }
      const baseValue = baseValues[key];
      return (
        value !== baseValue &&
        // basically a check for [] === []
        !(
          Array.isArray(value) &&
          Array.isArray(baseValue) &&
          value.length === 0 &&
          baseValue.length === 0
        )
      );
    });
  }

  /**
   * Returns a string representation of an instance
   * @return {String}
   */
  toString() {
    return `#<${this.constructor.name}>`;
  }

  /**
   * Return the object scale factor counting also the group scaling
   * @return {Point}
   */
  getObjectScaling() {
    // if the object is a top level one, on the canvas, we go for simple aritmetic
    // otherwise the complex method with angles will return approximations and decimals
    // and will likely kill the cache when not needed
    // https://github.com/fabricjs/fabric.js/issues/7157
    if (!this.group) {
      return new Point(Math.abs(this.scaleX), Math.abs(this.scaleY));
    }
    // if we are inside a group total zoom calculation is complex, we defer to generic matrices
    const options = qrDecompose(this.calcTransformMatrix());
    return new Point(Math.abs(options.scaleX), Math.abs(options.scaleY));
  }

  /**
   * Return the object scale factor counting also the group scaling, zoom and retina
   * @return {Object} object with scaleX and scaleY properties
   */
  getTotalObjectScaling() {
    const scale = this.getObjectScaling();
    if (this.canvas) {
      const zoom = this.canvas.getZoom();
      const retina = this.getCanvasRetinaScaling();
      return scale.scalarMultiply(zoom * retina);
    }
    return scale;
  }

  /**
   * Return the object opacity counting also the group property
   * @return {Number}
   */
  getObjectOpacity() {
    let opacity = this.opacity;
    if (this.group) {
      opacity *= this.group.getObjectOpacity();
    }
    return opacity;
  }

  /**
   * Makes sure the scale is valid and modifies it if necessary
   * @todo: this is a control action issue, not a geometry one
   * @private
   * @param {Number} value, unconstrained
   * @return {Number} constrained value;
   */
  _constrainScale(value: number): number {
    if (Math.abs(value) < this.minScaleLimit) {
      if (value < 0) {
        return -this.minScaleLimit;
      } else {
        return this.minScaleLimit;
      }
    } else if (value === 0) {
      return 0.0001;
    }
    return value;
  }

  /**
   * Handles setting values on the instance and handling internal side effects
   * @protected
   * @param {String} key
   * @param {*} value
   */
  _set(key: string, value: any) {
    const isChanged = this[key as keyof this] !== value;

    if (key === 'scaleX' || key === 'scaleY') {
      value = this._constrainScale(value);
    }
    if (key === 'scaleX' && value < 0) {
      this.flipX = !this.flipX;
      value *= -1;
    } else if (key === 'scaleY' && value < 0) {
      this.flipY = !this.flipY;
      value *= -1;
      // i don't like this automatic initialization here
    } else if (key === 'shadow' && value && !(value instanceof Shadow)) {
      value = new Shadow(value);
    } else if (key === 'dirty' && this.group) {
      this.group.set('dirty', value);
    }

    this[key as keyof this] = value;

    if (isChanged) {
      const groupNeedsUpdate = this.group && this.group.isOnACache();
      if (
        (this.constructor as typeof FabricObject).cacheProperties.includes(key)
      ) {
        this.dirty = true;
        groupNeedsUpdate && this.group!.set('dirty', true);
      } else if (
        groupNeedsUpdate &&
        (this.constructor as typeof FabricObject).stateProperties.includes(key)
      ) {
        this.group!.set('dirty', true);
      }
    }
    return this;
  }

  /*
   * @private
   * return if the object would be visible in rendering
   * @memberOf FabricObject.prototype
   * @return {Boolean}
   */
  isNotVisible() {
    return (
      this.opacity === 0 ||
      (!this.width && !this.height && this.strokeWidth === 0) ||
      !this.visible
    );
  }

  /**
   * Renders an object on a specified context
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  render(ctx: CanvasRenderingContext2D) {
    // do not render if width/height are zeros or object is not visible
    if (this.isNotVisible()) {
      return;
    }
    if (
      this.canvas &&
      this.canvas.skipOffscreen &&
      !this.group &&
      !this.isOnScreen()
    ) {
      return;
    }
    ctx.save();
    this._setupCompositeOperation(ctx);
    this.drawSelectionBackground(ctx);
    this.transform(ctx);
    this._setOpacity(ctx);
    this._setShadow(ctx);
    if (this.shouldCache()) {
      this.renderCache();
      (this as TCachedFabricObject).drawCacheOnCanvas(ctx);
    } else {
      this._removeCacheCanvas();
      this.dirty = false;
      this.drawObject(ctx);
    }
    ctx.restore();
  }

  drawSelectionBackground(ctx: CanvasRenderingContext2D) {
    /* no op */
  }

  renderCache(options?: any) {
    options = options || {};
    if (!this._cacheCanvas || !this._cacheContext) {
      this._createCacheCanvas();
    }
    if (this.isCacheDirty() && this._cacheContext) {
      this.drawObject(this._cacheContext, options.forClipping);
      this.dirty = false;
    }
  }

  /**
   * Remove cacheCanvas and its dimensions from the objects
   */
  _removeCacheCanvas() {
    this._cacheCanvas = undefined;
    this._cacheContext = null;
    this.cacheWidth = 0;
    this.cacheHeight = 0;
  }

  /**
   * return true if the object will draw a stroke
   * Does not consider text styles. This is just a shortcut used at rendering time
   * We want it to be an approximation and be fast.
   * wrote to avoid extra caching, it has to return true when stroke happens,
   * can guess when it will not happen at 100% chance, does not matter if it misses
   * some use case where the stroke is invisible.
   * @since 3.0.0
   * @returns Boolean
   */
  hasStroke() {
    return (
      this.stroke && this.stroke !== 'transparent' && this.strokeWidth !== 0
    );
  }

  /**
   * return true if the object will draw a fill
   * Does not consider text styles. This is just a shortcut used at rendering time
   * We want it to be an approximation and be fast.
   * wrote to avoid extra caching, it has to return true when fill happens,
   * can guess when it will not happen at 100% chance, does not matter if it misses
   * some use case where the fill is invisible.
   * @since 3.0.0
   * @returns Boolean
   */
  hasFill() {
    return this.fill && this.fill !== 'transparent';
  }

  /**
   * When set to `true`, force the object to have its own cache, even if it is inside a group
   * it may be needed when your object behave in a particular way on the cache and always needs
   * its own isolated canvas to render correctly.
   * Created to be overridden
   * since 1.7.12
   * @returns Boolean
   */
  needsItsOwnCache() {
    if (
      this.paintFirst === 'stroke' &&
      this.hasFill() &&
      this.hasStroke() &&
      typeof this.shadow === 'object'
    ) {
      return true;
    }
    if (this.clipPath) {
      return true;
    }
    return false;
  }

  /**
   * Decide if the object should cache or not. Create its own cache level
   * objectCaching is a global flag, wins over everything
   * needsItsOwnCache should be used when the object drawing method requires
   * a cache step. None of the fabric classes requires it.
   * Generally you do not cache objects in groups because the group outside is cached.
   * Read as: cache if is needed, or if the feature is enabled but we are not already caching.
   * @return {Boolean}
   */
  shouldCache() {
    this.ownCaching =
      this.needsItsOwnCache() ||
      (this.objectCaching && (!this.group || !this.group.isOnACache()));
    return this.ownCaching;
  }

  /**
   * Check if this object or a child object will cast a shadow
   * used by Group.shouldCache to know if child has a shadow recursively
   * @return {Boolean}
   * @deprecated
   */
  willDrawShadow() {
    return (
      !!this.shadow && (this.shadow.offsetX !== 0 || this.shadow.offsetY !== 0)
    );
  }

  /**
   * Execute the drawing operation for an object clipPath
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {FabricObject} clipPath
   */
  drawClipPathOnCache(
    ctx: CanvasRenderingContext2D,
    clipPath: TCachedFabricObject
  ) {
    ctx.save();
    // DEBUG: uncomment this line, comment the following
    // ctx.globalAlpha = 0.4
    if (clipPath.inverted) {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'destination-in';
    }
    //ctx.scale(1 / 2, 1 / 2);
    if (clipPath.absolutePositioned) {
      const m = invertTransform(this.calcTransformMatrix());
      ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
    }
    clipPath.transform(ctx);
    ctx.scale(1 / clipPath.zoomX, 1 / clipPath.zoomY);
    ctx.drawImage(
      clipPath._cacheCanvas,
      -clipPath.cacheTranslationX,
      -clipPath.cacheTranslationY
    );
    ctx.restore();
  }

  /**
   * Execute the drawing operation for an object on a specified context
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {boolean} forClipping apply clipping styles
   */
  drawObject(ctx: CanvasRenderingContext2D, forClipping?: boolean) {
    const originalFill = this.fill,
      originalStroke = this.stroke;
    if (forClipping) {
      this.fill = 'black';
      this.stroke = '';
      this._setClippingProperties(ctx);
    } else {
      this._renderBackground(ctx);
    }
    this._render(ctx);
    this._drawClipPath(ctx, this.clipPath);
    this.fill = originalFill;
    this.stroke = originalStroke;
  }

  /**
   * Prepare clipPath state and cache and draw it on instance's cache
   * @param {CanvasRenderingContext2D} ctx
   * @param {FabricObject} clipPath
   */
  _drawClipPath(ctx: CanvasRenderingContext2D, clipPath?: FabricObject) {
    if (!clipPath) {
      return;
    }
    // needed to setup a couple of variables
    // path canvas gets overridden with this one.
    // TODO find a better solution?
    clipPath._set('canvas', this.canvas);
    clipPath.shouldCache();
    clipPath._transformDone = true;
    clipPath.renderCache({ forClipping: true });
    this.drawClipPathOnCache(ctx, clipPath as TCachedFabricObject);
  }

  /**
   * Paint the cached copy of the object on the target context.
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  drawCacheOnCanvas(this: TCachedFabricObject, ctx: CanvasRenderingContext2D) {
    ctx.scale(1 / this.zoomX, 1 / this.zoomY);
    ctx.drawImage(
      this._cacheCanvas,
      -this.cacheTranslationX,
      -this.cacheTranslationY
    );
  }

  /**
   * Check if cache is dirty
   * @param {Boolean} skipCanvas skip canvas checks because this object is painted
   * on parent canvas.
   */
  isCacheDirty(skipCanvas = false) {
    if (this.isNotVisible()) {
      return false;
    }
    if (
      this._cacheCanvas &&
      this._cacheContext &&
      !skipCanvas &&
      this._updateCacheCanvas()
    ) {
      // in this case the context is already cleared.
      return true;
    } else {
      if (this.dirty || (this.clipPath && this.clipPath.absolutePositioned)) {
        if (this._cacheCanvas && this._cacheContext && !skipCanvas) {
          const width = this.cacheWidth! / this.zoomX!;
          const height = this.cacheHeight! / this.zoomY!;
          this._cacheContext.clearRect(-width / 2, -height / 2, width, height);
        }
        return true;
      }
    }
    return false;
  }

  /**
   * Draws a background for the object big as its untransformed dimensions
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderBackground(ctx: CanvasRenderingContext2D) {
    if (!this.backgroundColor) {
      return;
    }
    const dim = this._getNonTransformedDimensions();
    ctx.fillStyle = this.backgroundColor;

    ctx.fillRect(-dim.x / 2, -dim.y / 2, dim.x, dim.y);
    // if there is background color no other shadows
    // should be casted
    this._removeShadow(ctx);
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _setOpacity(ctx: CanvasRenderingContext2D) {
    if (this.group && !this.group._transformDone) {
      ctx.globalAlpha = this.getObjectOpacity();
    } else {
      ctx.globalAlpha *= this.opacity;
    }
  }

  _setStrokeStyles(
    ctx: CanvasRenderingContext2D,
    decl: Pick<
      this,
      | 'stroke'
      | 'strokeWidth'
      | 'strokeLineCap'
      | 'strokeDashOffset'
      | 'strokeLineJoin'
      | 'strokeMiterLimit'
    >
  ) {
    const stroke = decl.stroke;
    if (stroke) {
      ctx.lineWidth = decl.strokeWidth;
      ctx.lineCap = decl.strokeLineCap;
      ctx.lineDashOffset = decl.strokeDashOffset;
      ctx.lineJoin = decl.strokeLineJoin;
      ctx.miterLimit = decl.strokeMiterLimit;
      if (isFiller(stroke)) {
        if (
          (stroke as Gradient<'linear'>).gradientUnits === 'percentage' ||
          (stroke as Gradient<'linear'>).gradientTransform ||
          (stroke as Pattern).patternTransform
        ) {
          // need to transform gradient in a pattern.
          // this is a slow process. If you are hitting this codepath, and the object
          // is not using caching, you should consider switching it on.
          // we need a canvas as big as the current object caching canvas.
          this._applyPatternForTransformedGradient(ctx, stroke);
        } else {
          // is a simple gradient or pattern
          ctx.strokeStyle = stroke.toLive(ctx)!;
          this._applyPatternGradientTransform(ctx, stroke);
        }
      } else {
        // is a color
        ctx.strokeStyle = decl.stroke as string;
      }
    }
  }

  _setFillStyles(ctx: CanvasRenderingContext2D, { fill }: Pick<this, 'fill'>) {
    if (fill) {
      if (isFiller(fill)) {
        ctx.fillStyle = fill.toLive(ctx)!;
        this._applyPatternGradientTransform(ctx, fill);
      } else {
        ctx.fillStyle = fill;
      }
    }
  }

  _setClippingProperties(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'transparent';
    ctx.fillStyle = '#000000';
  }

  /**
   * @private
   * Sets line dash
   * @param {CanvasRenderingContext2D} ctx Context to set the dash line on
   * @param {Array} dashArray array representing dashes
   */
  _setLineDash(ctx: CanvasRenderingContext2D, dashArray?: number[] | null) {
    if (!dashArray || dashArray.length === 0) {
      return;
    }
    // Spec requires the concatenation of two copies of the dash array when the number of elements is odd
    if (1 & dashArray.length) {
      dashArray.push(...dashArray);
    }
    ctx.setLineDash(dashArray);
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _setShadow(ctx: CanvasRenderingContext2D) {
    if (!this.shadow) {
      return;
    }

    const shadow = this.shadow,
      canvas = this.canvas,
      retinaScaling = this.getCanvasRetinaScaling(),
      [sx, , , sy] = canvas?.viewportTransform || iMatrix,
      multX = sx * retinaScaling,
      multY = sy * retinaScaling,
      scaling = shadow.nonScaling ? new Point(1, 1) : this.getObjectScaling();
    ctx.shadowColor = shadow.color;
    ctx.shadowBlur =
      (shadow.blur *
        config.browserShadowBlurConstant *
        (multX + multY) *
        (scaling.x + scaling.y)) /
      4;
    ctx.shadowOffsetX = shadow.offsetX * multX * scaling.x;
    ctx.shadowOffsetY = shadow.offsetY * multY * scaling.y;
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _removeShadow(ctx: CanvasRenderingContext2D) {
    if (!this.shadow) {
      return;
    }

    ctx.shadowColor = '';
    ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {TFiller} filler {@link Pattern} or {@link Gradient}
   */
  _applyPatternGradientTransform(
    ctx: CanvasRenderingContext2D,
    filler: TFiller
  ) {
    if (!isFiller(filler)) {
      return { offsetX: 0, offsetY: 0 };
    }
    const t =
      (filler as Gradient<'linear'>).gradientTransform ||
      (filler as Pattern).patternTransform;
    const offsetX = -this.width / 2 + filler.offsetX || 0,
      offsetY = -this.height / 2 + filler.offsetY || 0;

    if ((filler as Gradient<'linear'>).gradientUnits === 'percentage') {
      ctx.transform(this.width, 0, 0, this.height, offsetX, offsetY);
    } else {
      ctx.transform(1, 0, 0, 1, offsetX, offsetY);
    }
    if (t) {
      ctx.transform(t[0], t[1], t[2], t[3], t[4], t[5]);
    }
    return { offsetX: offsetX, offsetY: offsetY };
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderPaintInOrder(ctx: CanvasRenderingContext2D) {
    if (this.paintFirst === 'stroke') {
      this._renderStroke(ctx);
      this._renderFill(ctx);
    } else {
      this._renderFill(ctx);
      this._renderStroke(ctx);
    }
  }

  /**
   * @private
   * function that actually render something on the context.
   * empty here to allow Obects to work on tests to benchmark fabric functionalites
   * not related to rendering
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(ctx: CanvasRenderingContext2D) {
    // placeholder to be overridden
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderFill(ctx: CanvasRenderingContext2D) {
    if (!this.fill) {
      return;
    }

    ctx.save();
    this._setFillStyles(ctx, this);
    if (this.fillRule === 'evenodd') {
      ctx.fill('evenodd');
    } else {
      ctx.fill();
    }
    ctx.restore();
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderStroke(ctx: CanvasRenderingContext2D) {
    if (!this.stroke || this.strokeWidth === 0) {
      return;
    }

    if (this.shadow && !this.shadow.affectStroke) {
      this._removeShadow(ctx);
    }

    ctx.save();
    if (this.strokeUniform) {
      const scaling = this.getObjectScaling();
      ctx.scale(1 / scaling.x, 1 / scaling.y);
    }
    this._setLineDash(ctx, this.strokeDashArray);
    this._setStrokeStyles(ctx, this);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * This function try to patch the missing gradientTransform on canvas gradients.
   * transforming a context to transform the gradient, is going to transform the stroke too.
   * we want to transform the gradient but not the stroke operation, so we create
   * a transformed gradient on a pattern and then we use the pattern instead of the gradient.
   * this method has drawbacks: is slow, is in low resolution, needs a patch for when the size
   * is limited.
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {Gradient} filler
   */
  _applyPatternForTransformedGradient(
    ctx: CanvasRenderingContext2D,
    filler: TFiller
  ) {
    const dims = this._limitCacheSize(this._getCacheCanvasDimensions()),
      pCanvas = createCanvasElement(),
      retinaScaling = this.getCanvasRetinaScaling(),
      width = dims.x / this.scaleX / retinaScaling,
      height = dims.y / this.scaleY / retinaScaling;
    // in case width and height are less than 1px, we have to round up.
    // since the pattern is no-repeat, this is fine
    pCanvas.width = Math.ceil(width);
    pCanvas.height = Math.ceil(height);
    const pCtx = pCanvas.getContext('2d');
    if (!pCtx) {
      return;
    }
    pCtx.beginPath();
    pCtx.moveTo(0, 0);
    pCtx.lineTo(width, 0);
    pCtx.lineTo(width, height);
    pCtx.lineTo(0, height);
    pCtx.closePath();
    pCtx.translate(width / 2, height / 2);
    pCtx.scale(
      dims.zoomX / this.scaleX / retinaScaling,
      dims.zoomY / this.scaleY / retinaScaling
    );
    this._applyPatternGradientTransform(pCtx, filler);
    pCtx.fillStyle = filler.toLive(ctx)!;
    pCtx.fill();
    ctx.translate(
      -this.width / 2 - this.strokeWidth / 2,
      -this.height / 2 - this.strokeWidth / 2
    );
    ctx.scale(
      (retinaScaling * this.scaleX) / dims.zoomX,
      (retinaScaling * this.scaleY) / dims.zoomY
    );
    ctx.strokeStyle = pCtx.createPattern(pCanvas, 'no-repeat') ?? '';
  }

  /**
   * This function is an helper for svg import. it returns the center of the object in the svg
   * untransformed coordinates
   * @private
   * @return {Point} center point from element coordinates
   */
  _findCenterFromElement() {
    return new Point(this.left + this.width / 2, this.top + this.height / 2);
  }

  /**
   * Clones an instance.
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @returns {Promise<FabricObject>}
   */
  clone(propertiesToInclude: string[]) {
    const objectForm = this.toObject(propertiesToInclude);
    return (this.constructor as typeof FabricObject).fromObject(
      objectForm
    ) as unknown as this;
  }

  /**
   * Creates an instance of Image out of an object
   * makes use of toCanvasElement.
   * Once this method was based on toDataUrl and loadImage, so it also had a quality
   * and format option. toCanvasElement is faster and produce no loss of quality.
   * If you need to get a real Jpeg or Png from an object, using toDataURL is the right way to do it.
   * toCanvasElement and then toBlob from the obtained canvas is also a good option.
   * @todo fix the export type, it could not be Image but the type that getClass return for 'image'.
   * @param {Object} [options] for clone as image, passed to toDataURL
   * @param {Number} [options.multiplier=1] Multiplier to scale by
   * @param {Number} [options.left] Cropping left offset. Introduced in v1.2.14
   * @param {Number} [options.top] Cropping top offset. Introduced in v1.2.14
   * @param {Number} [options.width] Cropping width. Introduced in v1.2.14
   * @param {Number} [options.height] Cropping height. Introduced in v1.2.14
   * @param {Boolean} [options.enableRetinaScaling] Enable retina scaling for clone image. Introduce in 1.6.4
   * @param {Boolean} [options.withoutTransform] Remove current object transform ( no scale , no angle, no flip, no skew ). Introduced in 2.3.4
   * @param {Boolean} [options.withoutShadow] Remove current object shadow. Introduced in 2.4.2
   * @return {Image} Object cloned as image.
   */
  cloneAsImage(options: any): Image {
    const canvasEl = this.toCanvasElement(options);
    // TODO: how to import Image w/o an import cycle?
    const ImageClass = classRegistry.getClass('image');
    return new ImageClass(canvasEl);
  }

  /**
   * Converts an object into a HTMLCanvas element
   * @param {Object} options Options object
   * @param {Number} [options.multiplier=1] Multiplier to scale by
   * @param {Number} [options.left] Cropping left offset. Introduced in v1.2.14
   * @param {Number} [options.top] Cropping top offset. Introduced in v1.2.14
   * @param {Number} [options.width] Cropping width. Introduced in v1.2.14
   * @param {Number} [options.height] Cropping height. Introduced in v1.2.14
   * @param {Boolean} [options.enableRetinaScaling] Enable retina scaling for clone image. Introduce in 1.6.4
   * @param {Boolean} [options.withoutTransform] Remove current object transform ( no scale , no angle, no flip, no skew ). Introduced in 2.3.4
   * @param {Boolean} [options.withoutShadow] Remove current object shadow. Introduced in 2.4.2
   * @param {Boolean} [options.viewportTransform] Account for canvas viewport transform
   * @return {HTMLCanvasElement} Returns DOM element <canvas> with the FabricObject
   */
  toCanvasElement(options: any = {}) {
    const origParams = saveObjectTransform(this),
      originalGroup = this.group,
      originalShadow = this.shadow,
      abs = Math.abs,
      retinaScaling = options.enableRetinaScaling
        ? Math.max(config.devicePixelRatio, 1)
        : 1,
      multiplier = (options.multiplier || 1) * retinaScaling;
    delete this.group;
    if (options.withoutTransform) {
      resetObjectTransform(this);
    }
    if (options.withoutShadow) {
      this.shadow = null;
    }
    if (options.viewportTransform) {
      sendObjectToPlane(this, this.getViewportTransform());
    }

    const el = createCanvasElement(),
      // skip canvas zoom and calculate with setCoords now.
      boundingRect = this.getBoundingRect(true, true),
      shadow = this.shadow,
      shadowOffset = new Point();

    if (shadow) {
      const shadowBlur = shadow.blur;
      const scaling = shadow.nonScaling
        ? new Point(1, 1)
        : this.getObjectScaling();
      // consider non scaling shadow.
      shadowOffset.x =
        2 * Math.round(abs(shadow.offsetX) + shadowBlur) * abs(scaling.x);
      shadowOffset.y =
        2 * Math.round(abs(shadow.offsetY) + shadowBlur) * abs(scaling.y);
    }
    const width = boundingRect.width + shadowOffset.x,
      height = boundingRect.height + shadowOffset.y;
    // if the current width/height is not an integer
    // we need to make it so.
    el.width = Math.ceil(width);
    el.height = Math.ceil(height);
    const canvas = new StaticCanvas(el, {
      enableRetinaScaling: false,
      renderOnAddRemove: false,
      skipOffscreen: false,
    });
    if (options.format === 'jpeg') {
      canvas.backgroundColor = '#fff';
    }
    this.setPositionByOrigin(
      new Point(canvas.width / 2, canvas.height / 2),
      'center',
      'center'
    );
    const originalCanvas = this.canvas;
    // static canvas and canvas have both an array of InteractiveObjects
    // @ts-ignore this needs to be fixed somehow, or ignored globally
    canvas._objects = [this];
    this.set('canvas', canvas);
    this.setCoords();
    const canvasEl = canvas.toCanvasElement(multiplier || 1, options);
    this.set('canvas', originalCanvas);
    this.shadow = originalShadow;
    if (originalGroup) {
      this.group = originalGroup;
    }
    this.set(origParams);
    this.setCoords();
    // canvas.dispose will call image.dispose that will nullify the elements
    // since this canvas is a simple element for the process, we remove references
    // to objects in this way in order to avoid object trashing.
    canvas._objects = [];
    // since render has settled it is safe to destroy canvas
    canvas.destroy();
    return canvasEl;
  }

  /**
   * Converts an object into a data-url-like string
   * @param {Object} options Options object
   * @param {String} [options.format=png] The format of the output image. Either "jpeg" or "png"
   * @param {Number} [options.quality=1] Quality level (0..1). Only used for jpeg.
   * @param {Number} [options.multiplier=1] Multiplier to scale by
   * @param {Number} [options.left] Cropping left offset. Introduced in v1.2.14
   * @param {Number} [options.top] Cropping top offset. Introduced in v1.2.14
   * @param {Number} [options.width] Cropping width. Introduced in v1.2.14
   * @param {Number} [options.height] Cropping height. Introduced in v1.2.14
   * @param {Boolean} [options.enableRetinaScaling] Enable retina scaling for clone image. Introduce in 1.6.4
   * @param {Boolean} [options.withoutTransform] Remove current object transform ( no scale , no angle, no flip, no skew ). Introduced in 2.3.4
   * @param {Boolean} [options.withoutShadow] Remove current object shadow. Introduced in 2.4.2
   * @return {String} Returns a data: URL containing a representation of the object in the format specified by options.format
   */
  toDataURL(options: any = {}) {
    return toDataURL(
      this.toCanvasElement(options),
      options.format || 'png',
      options.quality || 1
    );
  }

  /**
   * Returns true if any of the specified types is identical to the type of an instance
   * @param {String} type Type to check against
   * @return {Boolean}
   */
  isType(...types: string[]) {
    return types.includes(this.constructor.name) || types.includes(this.type);
  }

  /**
   * Returns complexity of an instance
   * @return {Number} complexity of this instance (is 1 unless subclassed)
   */
  complexity() {
    return 1;
  }

  /**
   * Returns a JSON representation of an instance
   * @return {Object} JSON
   */
  toJSON() {
    // delegate, not alias
    return this.toObject();
  }

  /**
   * Sets "angle" of an instance with centered rotation
   * @param {TDegree} angle Angle value (in degrees)
   */
  rotate(angle: TDegree) {
    const shouldCenterOrigin =
      (this.originX !== 'center' || this.originY !== 'center') &&
      this.centeredRotation;

    if (shouldCenterOrigin) {
      this._setOriginToCenter();
    }

    this.set('angle', angle);

    if (shouldCenterOrigin) {
      this._resetOrigin();
    }
  }

  /**
   * This callback function is called by the parent group of an object every
   * time a non-delegated property changes on the group. It is passed the key
   * and value as parameters. Not adding in this function's signature to avoid
   * Travis build error about unused variables.
   */
  setOnGroup() {
    // implemented by sub-classes, as needed.
  }

  /**
   * Sets canvas globalCompositeOperation for specific object
   * custom composition operation for the particular object can be specified using globalCompositeOperation property
   * @param {CanvasRenderingContext2D} ctx Rendering canvas context
   */
  _setupCompositeOperation(ctx: CanvasRenderingContext2D) {
    if (this.globalCompositeOperation) {
      ctx.globalCompositeOperation = this.globalCompositeOperation;
    }
  }

  /**
   * cancel instance's running animations
   * override if necessary to dispose artifacts such as `clipPath`
   */
  dispose() {
    runningAnimations.cancelByTarget(this);
    this.off();
    this._set('canvas', undefined);
  }

  /**
   *
   * @param {Function} klass
   * @param {object} object
   * @param {object} [options]
   * @param {string} [options.extraParam] property to pass as first argument to the constructor
   * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @returns {Promise<FabricObject>}
   */
  static _fromObject<S extends FabricObject>(
    object: Record<string, unknown>,
    {
      extraParam,
      ...options
    }: { extraParam?: string; signal?: AbortSignal } = {}
  ): Promise<S> {
    return enlivenObjectEnlivables<any>(cloneDeep(object), options).then(
      (enlivedMap) => {
        const allOptions = { ...options, ...enlivedMap };
        // from the resulting enlived options, extract options.extraParam to arg0
        // to avoid accidental overrides later
        if (extraParam) {
          const { [extraParam]: arg0, type, ...rest } = allOptions;
          // @ts-ignore;
          return new this(arg0, rest);
        } else {
          return new this(allOptions);
        }
      }
    ) as Promise<S>;
  }

  /**
   *
   * @param {object} object
   * @param {object} [options]
   * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @returns {Promise<FabricObject>}
   */
  static fromObject<T extends TProps<SerializedObjectProps>>(
    object: T,
    options?: { signal?: AbortSignal }
  ) {
    return this._fromObject(object, options);
  }
}

classRegistry.setClass(FabricObject);
classRegistry.setClass(FabricObject, 'object');
