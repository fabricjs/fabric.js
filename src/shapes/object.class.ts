// @ts-nocheck
import { fabric } from '../../HEADER';
import { cache } from '../cache';
import { config } from '../config';
import { ALIASING_LIMIT, iMatrix, VERSION } from '../constants';
import { ObjectGeometry } from '../mixins/object_geometry.mixin';
import { Point } from '../point.class';
import { Shadow } from '../shadow.class';
import type { TClassProperties, TDegree, TFiller, TSize } from '../typedefs';
import { runningAnimations } from '../util/animation_registry';
import { clone } from '../util/lang_object';
import { capitalize } from '../util/lang_string';
import { capValue } from '../util/misc/capValue';
import { createCanvasElement } from '../util/misc/dom';
import { qrDecompose, transformPoint } from '../util/misc/matrix';
import { enlivenObjectEnlivables } from '../util/misc/objectEnlive';
import { pick } from '../util/misc/pick';
import { toFixed } from '../util/misc/toFixed';
import { Shadow } from '../__types__';
import { Canvas, StaticCanvas } from '../__types__';
import { ObjectEvents } from '../EventTypeDefs';
import type { Group } from './group.class';

// temporary hack for unfinished migration
type TCallSuper = (arg0: string, ...moreArgs: any[]) => any;

/**
 * Root object class from which all 2d shape classes inherit from
 * @class fabric.Object
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-1#objects}
 * @see {@link fabric.Object#initialize} for constructor definition
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
  EventSpec extends ObjectEvents = ObjectEvents
> extends ObjectGeometry<EventSpec> {
  type: string;

  /**
   * Opacity of an object
   * @type Number
   * @default 1
   */
  opacity: number;

  /**
   * Size of object's controlling corners (in pixels)
   * @type Number
   * @default 13
   */
  cornerSize: number;

  /**
   * Size of object's controlling corners when touch interaction is detected
   * @type Number
   * @default 24
   */
  touchCornerSize: number;

  /**
   * When true, object's controlling corners are rendered as transparent inside (i.e. stroke instead of fill)
   * @type Boolean
   * @default true
   */
  transparentCorners: boolean;

  /**
   * Default cursor value used when hovering over this object on canvas
   * @type String
   * @default null
   */
  hoverCursor: null;

  /**
   * Default cursor value used when moving this object on canvas
   * @type String
   * @default null
   */
  moveCursor: null;

  /**
   * Color of controlling borders of an object (when it's active)
   * @type String
   * @default rgb(178,204,255)
   */
  borderColor: string;

  /**
   * Array specifying dash pattern of an object's borders (hasBorder must be true)
   * @since 1.6.2
   * @type Array | null
   * default null;
   */
  borderDashArray: number[] | null;

  /**
   * Color of controlling corners of an object (when it's active)
   * @type String
   * @default rgb(178,204,255)
   */
  cornerColor: string;

  /**
   * Color of controlling corners of an object (when it's active and transparentCorners false)
   * @since 1.6.2
   * @type String
   * @default null
   */
  cornerStrokeColor: string;

  /**
   * Specify style of control, 'rect' or 'circle'
   * @since 1.6.2
   * @type 'rect' | 'circle'
   * @default rect
   */
  cornerStyle: 'rect' | 'circle';

  /**
   * Array specifying dash pattern of an object's control (hasBorder must be true)
   * @since 1.6.2
   * @type Array | null
   */
  cornerDashArray: number[] | null;

  /**
   * When true, this object will use center point as the origin of transformation
   * when being scaled via the controls.
   * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
   * @since 1.3.4
   * @type Boolean
   * @default
   */
  centeredScaling: false;

  /**
   * When true, this object will use center point as the origin of transformation
   * when being rotated via the controls.
   * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
   * @since 1.3.4
   * @type Boolean
   * @default
   */
  centeredRotation: true;

  /**
   * When defined, an object is rendered via stroke and this property specifies its color
   * takes css colors https://www.w3.org/TR/css-color-3/
   * @type String
   * @default null
   */
  stroke: string | TFiller | null;

  /**
   * Color of object's fill
   * takes css colors https://www.w3.org/TR/css-color-3/
   * @type String
   * @default rgb(0,0,0)
   */
  fill: string | null;

  /**
   * Fill rule used to fill an object
   * accepted values are nonzero, evenodd
   * <b>Backwards incompatibility note:</b> This property was used for setting globalCompositeOperation until v1.4.12 (use `fabric.Object#globalCompositeOperation` instead)
   * @type String
   * @default nonzero
   */
  fillRule: CanvasFillRule;

  /**
   * Composite rule used for canvas globalCompositeOperation
   * @type String
   * @default
   */
  globalCompositeOperation: GlobalCompositeOperation;

  /**
   * Background color of an object.
   * takes css colors https://www.w3.org/TR/css-color-3/
   * @type String
   * @default
   */
  backgroundColor: string;

  /**
   * Selection Background color of an object. colored layer behind the object when it is active.
   * does not mix good with globalCompositeOperation methods.
   * @type String
   * @default
   */
  selectionBackgroundColor: string;

  /**
   * Array specifying dash pattern of an object's stroke (stroke must be defined)
   * @type Array
   * @default null;
   */
  strokeDashArray: number[] | null;

  /**
   * Line offset of an object's stroke
   * @type Number
   * @default 0
   */
  strokeDashOffset: number;

  /**
   * Line endings style of an object's stroke (one of "butt", "round", "square")
   * @type String
   * @default butt
   */
  strokeLineCap: CanvasLineCap;

  /**
   * Corner style of an object's stroke (one of "bevel", "round", "miter")
   * @type String
   * @default
   */
  strokeLineJoin: CanvasLineJoin;

  /**
   * Maximum miter length (used for strokeLineJoin = "miter") of an object's stroke
   * @type Number
   * @default 4
   */
  strokeMiterLimit: number;

  /**
   * Shadow object representing shadow of this shape
   * @type Shadow
   * @default null
   */
  shadow: Shadow | null;

  /**
   * Opacity of object's controlling borders when object is active and moving
   * @type Number
   * @default 0.4
   */
  borderOpacityWhenMoving: number;

  /**
   * Scale factor of object's controlling borders
   * bigger number will make a thicker border
   * border is 1, so this is basically a border thickness
   * since there is no way to change the border itself.
   * @type Number
   * @default 1
   */
  borderScaleFactor: number;

  /**
   * Minimum allowed scale value of an object
   * @type Number
   * @default 0
   */
  minScaleLimit: number;

  /**
   * When set to `false`, an object can not be selected for modification (using either point-click-based or group-based selection).
   * But events still fire on it.
   * @type Boolean
   * @default
   */
  selectable: boolean;

  /**
   * When set to `false`, an object can not be a target of events. All events propagate through it. Introduced in v1.3.4
   * @type Boolean
   * @default
   */
  evented: boolean;

  /**
   * When set to `false`, an object is not rendered on canvas
   * @type Boolean
   * @default
   */
  visible: boolean;

  /**
   * When set to `false`, object's controls are not displayed and can not be used to manipulate object
   * @type Boolean
   * @default
   */
  hasControls: boolean;

  /**
   * When set to `false`, object's controlling borders are not rendered
   * @type Boolean
   * @default
   */
  hasBorders: boolean;

  /**
   * When set to `true`, objects are "found" on canvas on per-pixel basis rather than according to bounding box
   * @type Boolean
   * @default
   */
  perPixelTargetFind: boolean;

  /**
   * When `false`, default object's values are not included in its serialization
   * @type Boolean
   * @default
   */
  includeDefaultValues: boolean;

  /**
   * When `true`, object horizontal movement is locked
   * @type Boolean
   * @default
   */
  lockMovementX: boolean;

  /**
   * When `true`, object vertical movement is locked
   * @type Boolean
   * @default
   */
  lockMovementY: boolean;

  /**
   * When `true`, object rotation is locked
   * @type Boolean
   * @default
   */
  lockRotation: boolean;

  /**
   * When `true`, object horizontal scaling is locked
   * @type Boolean
   * @default
   */
  lockScalingX: boolean;

  /**
   * When `true`, object vertical scaling is locked
   * @type Boolean
   * @default
   */
  lockScalingY: boolean;

  /**
   * When `true`, object horizontal skewing is locked
   * @type Boolean
   * @default
   */
  lockSkewingX: boolean;

  /**
   * When `true`, object vertical skewing is locked
   * @type Boolean
   * @default
   */
  lockSkewingY: boolean;

  /**
   * When `true`, object cannot be flipped by scaling into negative values
   * @type Boolean
   * @default
   */
  lockScalingFlip: boolean;

  /**
   * When `true`, object is not exported in OBJECT/JSON
   * @since 1.6.3
   * @type Boolean
   * @default
   */
  excludeFromExport: boolean;

  /**
   * When `true`, object is cached on an additional canvas.
   * When `false`, object is not cached unless necessary ( clipPath )
   * default to true
   * @since 1.7.0
   * @type Boolean
   * @default true
   */
  objectCaching: boolean;

  /**
   * When `true`, object properties are checked for cache invalidation. In some particular
   * situation you may want this to be disabled ( spray brush, very big, groups)
   * or if your application does not allow you to modify properties for groups child you want
   * to disable it for groups.
   * default to false
   * since 1.7.0
   * @type Boolean
   * @default false
   */
  statefullCache: boolean;

  /**
   * When `true`, cache does not get updated during scaling. The picture will get blocky if scaled
   * too much and will be redrawn with correct details at the end of scaling.
   * this setting is performance and application dependant.
   * default to true
   * since 1.7.0
   * @type Boolean
   * @default true
   */
  noScaleCache: boolean;

  /**
   * When set to `true`, object's cache will be rerendered next render call.
   * since 1.7.0
   * @type Boolean
   * @default true
   */
  dirty: boolean;

  /**
   * Determines if the fill or the stroke is drawn first (one of "fill" or "stroke")
   * @type String
   * @default
   */
  paintFirst: 'fill' | 'stroke';

  /**
   * When 'down', object is set to active on mousedown/touchstart
   * When 'up', object is set to active on mouseup/touchend
   * Experimental. Let's see if this breaks anything before supporting officially
   * @private
   * since 4.4.0
   * @type String
   * @default 'down'
   */
  activeOn: 'down' | 'up';

  /**
   * List of properties to consider when checking if state
   * of an object is changed (fabric.Object#hasStateChanged)
   * as well as for history (undo/redo) purposes
   * @type Array
   */
  stateProperties: string[];

  /**
   * List of properties to consider when checking if cache needs refresh
   * Those properties are checked by statefullCache ON ( or lazy mode if we want ) or from single
   * calls to Object.set(key, value). If the key is in this list, the object is marked as dirty
   * and refreshed at the next render
   * @type Array
   */
  cacheProperties: string[];

  /**
   * List of properties to consider for animating colors.
   * @type String[]
   */
  colorProperties: string[];

  /**
   * a fabricObject that, without stroke define a clipping area with their shape. filled in black
   * the clipPath object gets used when the object has rendered, and the context is placed in the center
   * of the object cacheCanvas.
   * If you want 0,0 of a clipPath to align with an object center, use clipPath.originX/Y to 'center'
   * @type fabric.Object
   */
  clipPath?: FabricObject;

  /**
   * Meaningful ONLY when the object is used as clipPath.
   * if true, the clipPath will make the object clip to the outside of the clipPath
   * since 2.4.0
   * @type boolean
   * @default false
   */
  inverted: boolean;

  /**
   * Meaningful ONLY when the object is used as clipPath.
   * if true, the clipPath will have its top and left relative to canvas, and will
   * not be influenced by the object transform. This will make the clipPath relative
   * to the canvas, but clipping just a particular object.
   * WARNING this is beta, this feature may change or be renamed.
   * since 2.4.0
   * @type boolean
   * @default false
   */
  absolutePositioned: boolean;

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
  _cacheCanvas?: HTMLCanvasElement;

  /**
   * Size of the cache canvas, width
   * since 1.7.0
   * @type number
   * @default undefined
   * @private
   */
  cacheWidth?: number;

  /**
   * Size of the cache canvas, height
   * since 1.7.0
   * @type number
   * @default undefined
   * @private
   */
  cacheHeight?: number;

  /**
   * zoom level used on the cacheCanvas to draw the cache, X axe
   * since 1.7.0
   * @type number
   * @default undefined
   * @private
   */
  zoomX?: number;

  /**
   * zoom level used on the cacheCanvas to draw the cache, Y axe
   * since 1.7.0
   * @type number
   * @default undefined
   * @private
   */
  zoomY?: number;

  /**
   * zoom level used on the cacheCanvas to draw the cache, Y axe
   * since 1.7.0
   * @type number
   * @default undefined
   * @private
   */
  cacheTranslationX?: number;

  /**
   * translation of the cacheCanvas away from the center, for subpixel accuracy and crispness
   * since 1.7.0
   * @type number
   * @default undefined
   * @private
   */
  cacheTranslationY?: number;

  /**
   * A reference to the parent of the object, usually a Group
   * @type number
   * @default undefined
   * @private
   */
  group?: Group;

  /**
   * A reference to the parent of the object
   * Used to keep the original parent ref when the object has been added to an ActiveSelection, hence loosing the `group` ref
   */
  __owningGroup?: Group;

  /**
   * Indicate if the object is sitting on a cache dedicated to it
   * or is part of a larger cache for many object ( a group for example)
   * @type number
   * @default undefined
   * @private
   */
  ownCaching?: boolean;

  /**
   * translation of the cacheCanvas away from the center, for subpixel accuracy and crispness
   * @static
   * @memberOf fabric.Object
   * @type Number
   */
  static __uid = 0;

  callSuper?: TCallSuper;

  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor(options?: Partial<TClassProperties<FabricObject>>) {
    super();
    if (options) {
      this.setOptions(options);
    }
  }

  /**
   * Temporary compatibility issue with old classes
   * @param {Object} [options] Options object
   */
  initialize(options?: Partial<TClassProperties<FabricObject>>) {
    if (options) {
      this.setOptions(options);
    }
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
  _getCacheCanvasDimensions() {
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
    const targetCanvas = this.canvas;
    if (this.noScaleCache && targetCanvas && targetCanvas._currentTransform) {
      const target = targetCanvas._currentTransform.target,
        action = targetCanvas._currentTransform.action;
      if (this === target && action.slice && action.slice(0, 5) === 'scale') {
        return false;
      }
    }
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
    if (this instanceof fabric.Text && this.path) {
      shouldRedraw = true;
      shouldResizeCanvas = true;
      // IMHO in those lines we are using zoomX and zoomY not the this version.
      additionalWidth += this.getHeightOfLine(0) * this.zoomX;
      additionalHeight += this.getHeightOfLine(0) * this.zoomY;
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
   * Sets object's properties from options
   * @param {Object} [options] Options object
   */
  setOptions(options: Record<string, any> = {}) {
    this._setOptions(options);
  }

  /**
   * Transforms context when rendering an object
   * @param {CanvasRenderingContext2D} ctx Context
   */
  transform(ctx: CanvasRenderingContext2D) {
    const needFullTransform =
      (this.group && !this.group._transformDone) ||
      (this.group && this.canvas && ctx === this.canvas.contextTop);
    const m = this.calcTransformMatrix(!needFullTransform);
    ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
  }

  /**
   * Returns an object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} Object representation of an instance
   */
  toObject(propertiesToInclude?: (keyof this)[]): Record<string, any> {
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
        ...pick(this, propertiesToInclude),
        type: this.type,
        version: VERSION,
        originX: this.originX,
        originY: this.originY,
        left: toFixed(this.left, NUM_FRACTION_DIGITS),
        top: toFixed(this.top, NUM_FRACTION_DIGITS),
        width: toFixed(this.width, NUM_FRACTION_DIGITS),
        height: toFixed(this.height, NUM_FRACTION_DIGITS),
        fill:
          this.fill && this.fill.toObject ? this.fill.toObject() : this.fill,
        stroke:
          this.stroke && this.stroke.toObject
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
  toDatalessObject(propertiesToInclude: (keyof this)[]) {
    // will be overwritten by subclasses
    return this.toObject(propertiesToInclude);
  }

  /**
   * @private
   * @param {Object} object
   */
  _removeDefaultValues(object: Record<string, any>) {
    const prototype = fabric.util.getKlass(object.type).prototype;
    Object.keys(object).forEach(function (prop) {
      if (prop === 'left' || prop === 'top' || prop === 'type') {
        return;
      }
      if (object[prop] === prototype[prop]) {
        delete object[prop];
      }
      // basically a check for [] === []
      if (
        Array.isArray(object[prop]) &&
        Array.isArray(prototype[prop]) &&
        object[prop].length === 0 &&
        prototype[prop].length === 0
      ) {
        delete object[prop];
      }
    });

    return object;
  }

  /**
   * Returns a string representation of an instance
   * @return {String}
   */
  toString() {
    return '#<fabric.' + capitalize(this.type) + '>';
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
   * @private
   * @param {String} key
   * @param {*} value
   * @return {fabric.Object} thisArg
   */
  _set(key: string, value: any) {
    const isChanged = this[key] !== value;

    if (key === 'scaleX' || key === 'scaleY') {
      value = this._constrainScale(value);
    }
    if (key === 'scaleX' && value < 0) {
      this.flipX = !this.flipX;
      value *= -1;
    } else if (key === 'scaleY' && value < 0) {
      this.flipY = !this.flipY;
      value *= -1;
    } else if (key === 'shadow' && value && !(value instanceof Shadow)) {
      value = new Shadow(value);
    } else if (key === 'dirty' && this.group) {
      this.group.set('dirty', value);
    }

    this[key] = value;

    if (isChanged) {
      const groupNeedsUpdate = this.group && this.group.isOnACache();
      if (this.cacheProperties.indexOf(key) > -1) {
        this.dirty = true;
        groupNeedsUpdate && this.group.set('dirty', true);
      } else if (groupNeedsUpdate && this.stateProperties.indexOf(key) > -1) {
        this.group.set('dirty', true);
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
      this.drawCacheOnCanvas(ctx);
    } else {
      this._removeCacheCanvas();
      this.dirty = false;
      this.drawObject(ctx);
      if (this.objectCaching && this.statefullCache) {
        this.saveState({ propertySet: 'cacheProperties' });
      }
    }
    ctx.restore();
  }

  renderCache(options?: any) {
    options = options || {};
    if (!this._cacheCanvas || !this._cacheContext) {
      this._createCacheCanvas();
    }
    if (this.isCacheDirty() && this._cacheContext) {
      this.statefullCache && this.saveState({ propertySet: 'cacheProperties' });
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
   * @param {fabric.Object} clipPath
   * todo while converting things, we need a type that is a union of classes that
   * represent the fabricObjects. Rect, Circle...
   */
  drawClipPathOnCache(ctx: CanvasRenderingContext2D, clipPath: FabricObject) {
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
      const m = fabric.util.invertTransform(this.calcTransformMatrix());
      ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
    }
    clipPath.transform(ctx);
    ctx.scale(1 / clipPath.zoomX!, 1 / clipPath.zoomY!);
    ctx.drawImage(
      clipPath._cacheCanvas!,
      -clipPath.cacheTranslationX!,
      -clipPath.cacheTranslationY!
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
   * @param {fabric.Object} clipPath
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
    this.drawClipPathOnCache(ctx, clipPath);
  }

  /**
   * Paint the cached copy of the object on the target context.
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  drawCacheOnCanvas(ctx: CanvasRenderingContext2D) {
    ctx.scale(1 / this.zoomX!, 1 / this.zoomY!);
    ctx.drawImage(
      this._cacheCanvas!,
      -this.cacheTranslationX!,
      -this.cacheTranslationY!
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
      if (
        this.dirty ||
        (this.clipPath && this.clipPath.absolutePositioned) ||
        (this.statefullCache && this.hasStateChanged('cacheProperties'))
      ) {
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
      if (stroke.toLive) {
        if (
          stroke.gradientUnits === 'percentage' ||
          stroke.gradientTransform ||
          stroke.patternTransform
        ) {
          // need to transform gradient in a pattern.
          // this is a slow process. If you are hitting this codepath, and the object
          // is not using caching, you should consider switching it on.
          // we need a canvas as big as the current object caching canvas.
          this._applyPatternForTransformedGradient(ctx, stroke);
        } else {
          // is a simple gradient or pattern
          ctx.strokeStyle = stroke.toLive(ctx, this);
          this._applyPatternGradientTransform(ctx, stroke);
        }
      } else {
        // is a color
        ctx.strokeStyle = decl.stroke;
      }
    }
  }

  _setFillStyles(ctx: CanvasRenderingContext2D, { fill }: Pick<this, 'fill'>) {
    if (fill) {
      if (fill.toLive) {
        ctx.fillStyle = fill.toLive(ctx, this);
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
   * @param {Object} filler fabric.Pattern or fabric.Gradient
   * @return {Object} offset.offsetX offset for text rendering
   * @return {Object} offset.offsetY offset for text rendering
   */
  _applyPatternGradientTransform(
    ctx: CanvasRenderingContext2D,
    filler: TFiller
  ) {
    if (!filler || !filler.toLive) {
      return { offsetX: 0, offsetY: 0 };
    }
    const t = filler.gradientTransform || filler.patternTransform;
    const offsetX = -this.width / 2 + filler.offsetX || 0,
      offsetY = -this.height / 2 + filler.offsetY || 0;

    if (filler.gradientUnits === 'percentage') {
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
   * @param {fabric.Gradient} filler a fabric gradient instance
   */
  _applyPatternForTransformedGradient(
    ctx: CanvasRenderingContext2D,
    filler: TFiller
  ) {
    const dims = this._limitCacheSize(this._getCacheCanvasDimensions()),
      pCanvas = fabric.util.createCanvasElement(),
      retinaScaling = this.getCanvasRetinaScaling(),
      width = dims.x / this.scaleX / retinaScaling,
      height = dims.y / this.scaleY / retinaScaling;
    pCanvas.width = width;
    pCanvas.height = height;
    const pCtx = pCanvas.getContext('2d');
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
    pCtx.fillStyle = filler.toLive(ctx);
    pCtx.fill();
    ctx.translate(
      -this.width / 2 - this.strokeWidth / 2,
      -this.height / 2 - this.strokeWidth / 2
    );
    ctx.scale(
      (retinaScaling * this.scaleX) / dims.zoomX,
      (retinaScaling * this.scaleY) / dims.zoomY
    );
    ctx.strokeStyle = pCtx.createPattern(pCanvas, 'no-repeat');
  }

  /**
   * This function is an helper for svg import. it returns the center of the object in the svg
   * untransformed coordinates
   * @private
   * @return {Object} center point from element coordinates
   */
  _findCenterFromElement() {
    return { x: this.left + this.width / 2, y: this.top + this.height / 2 };
  }

  /**
   * This function is an helper for svg import. it decompose the transformMatrix
   * and assign properties to object.
   * untransformed coordinates
   * @todo move away in the svg import stuff.
   * @private
   */
  _assignTransformMatrixProps() {
    if (this.transformMatrix) {
      const options = qrDecompose(this.transformMatrix);
      this.flipX = false;
      this.flipY = false;
      this.set('scaleX', options.scaleX);
      this.set('scaleY', options.scaleY);
      this.angle = options.angle;
      this.skewX = options.skewX;
      this.skewY = 0;
    }
  }

  /**
   * This function is an helper for svg import. it removes the transform matrix
   * and set to object properties that fabricjs can handle
   * @todo move away in the svg import stuff.
   * @private
   * @param {Object} preserveAspectRatioOptions
   */
  _removeTransformMatrix(preserveAspectRatioOptions) {
    let center = this._findCenterFromElement();
    if (this.transformMatrix) {
      this._assignTransformMatrixProps();
      center = transformPoint(center, this.transformMatrix);
    }
    this.transformMatrix = null;
    if (preserveAspectRatioOptions) {
      this.scaleX *= preserveAspectRatioOptions.scaleX;
      this.scaleY *= preserveAspectRatioOptions.scaleY;
      this.cropX = preserveAspectRatioOptions.cropX;
      this.cropY = preserveAspectRatioOptions.cropY;
      center.x += preserveAspectRatioOptions.offsetLeft;
      center.y += preserveAspectRatioOptions.offsetTop;
      this.width = preserveAspectRatioOptions.width;
      this.height = preserveAspectRatioOptions.height;
    }
    this.setPositionByOrigin(center, 'center', 'center');
  }

  /**
   * Clones an instance.
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @returns {Promise<fabric.Object>}
   */
  clone(propertiesToInclude: (keyof this)[]) {
    const objectForm = this.toObject(propertiesToInclude);
    // todo ok understand this. is static or it isn't?
    return this.constructor.fromObject(objectForm);
  }

  /**
   * Creates an instance of fabric.Image out of an object
   * makes use of toCanvasElement.
   * Once this method was based on toDataUrl and loadImage, so it also had a quality
   * and format option. toCanvasElement is faster and produce no loss of quality.
   * If you need to get a real Jpeg or Png from an object, using toDataURL is the right way to do it.
   * toCanvasElement and then toBlob from the obtained canvas is also a good option.
   * @param {Object} [options] for clone as image, passed to toDataURL
   * @param {Number} [options.multiplier=1] Multiplier to scale by
   * @param {Number} [options.left] Cropping left offset. Introduced in v1.2.14
   * @param {Number} [options.top] Cropping top offset. Introduced in v1.2.14
   * @param {Number} [options.width] Cropping width. Introduced in v1.2.14
   * @param {Number} [options.height] Cropping height. Introduced in v1.2.14
   * @param {Boolean} [options.enableRetinaScaling] Enable retina scaling for clone image. Introduce in 1.6.4
   * @param {Boolean} [options.withoutTransform] Remove current object transform ( no scale , no angle, no flip, no skew ). Introduced in 2.3.4
   * @param {Boolean} [options.withoutShadow] Remove current object shadow. Introduced in 2.4.2
   * @return {fabric.Image} Object cloned as image.
   */
  cloneAsImage(options: any) {
    const canvasEl = this.toCanvasElement(options);
    return new fabric.Image(canvasEl);
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
   * @return {HTMLCanvasElement} Returns DOM element <canvas> with the fabric.Object
   */
  toCanvasElement(options: any) {
    options || (options = {});

    const utils = fabric.util,
      origParams = utils.saveObjectTransform(this),
      originalGroup = this.group,
      originalShadow = this.shadow,
      abs = Math.abs,
      retinaScaling = options.enableRetinaScaling
        ? Math.max(config.devicePixelRatio, 1)
        : 1,
      multiplier = (options.multiplier || 1) * retinaScaling;
    delete this.group;
    if (options.withoutTransform) {
      utils.resetObjectTransform(this);
    }
    if (options.withoutShadow) {
      this.shadow = null;
    }

    const el = fabric.util.createCanvasElement(),
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
    let canvas = new fabric.StaticCanvas(el, {
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
    canvas = null;

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
    return fabric.util.toDataURL(
      this.toCanvasElement(options),
      options.format || 'png',
      options.quality || 1
    );
  }

  /**
   * Returns true if specified type is identical to the type of an instance
   * @param {String} type Type to check against
   * @return {Boolean}
   */
  isType(...types: string[]) {
    return types.includes(this.type);
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
   * @param {Number} angle Angle value (in degrees)
   * @return {fabric.Object} thisArg
   * @chainable
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

    return this;
  }

  /**
   * Centers object horizontally on canvas to which it was added last.
   * You might need to call `setCoords` on an object after centering, to update controls area.
   * @return {fabric.Object} thisArg
   * @chainable
   */
  centerH() {
    this.canvas && this.canvas.centerObjectH(this);
    return this;
  }

  /**
   * Centers object horizontally on current viewport of canvas to which it was added last.
   * You might need to call `setCoords` on an object after centering, to update controls area.
   * @return {fabric.Object} thisArg
   * @chainable
   */
  viewportCenterH() {
    this.canvas && this.canvas.viewportCenterObjectH(this);
    return this;
  }

  /**
   * Centers object vertically on canvas to which it was added last.
   * You might need to call `setCoords` on an object after centering, to update controls area.
   * @return {fabric.Object} thisArg
   * @chainable
   */
  centerV() {
    this.canvas && this.canvas.centerObjectV(this);
    return this;
  }

  /**
   * Centers object vertically on current viewport of canvas to which it was added last.
   * You might need to call `setCoords` on an object after centering, to update controls area.
   * @return {fabric.Object} thisArg
   * @chainable
   */
  viewportCenterV() {
    this.canvas && this.canvas.viewportCenterObjectV(this);
    return this;
  }

  /**
   * Centers object vertically and horizontally on canvas to which is was added last
   * You might need to call `setCoords` on an object after centering, to update controls area.
   * @return {fabric.Object} thisArg
   * @chainable
   */
  center() {
    this.canvas && this.canvas.centerObject(this);
    return this;
  }

  /**
   * Centers object on current viewport of canvas to which it was added last.
   * You might need to call `setCoords` on an object after centering, to update controls area.
   * @return {fabric.Object} thisArg
   * @chainable
   */
  viewportCenter() {
    this.canvas && this.canvas.viewportCenterObject(this);
    return this;
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
    // todo verify this.
    // runningAnimations is always truthy
    if (runningAnimations) {
      runningAnimations.cancelByTarget(this);
    }
  }

  /**
   *
   * @param {Function} klass
   * @param {object} object
   * @param {object} [options]
   * @param {string} [options.extraParam] property to pass as first argument to the constructor
   * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @returns {Promise<fabric.Object>}
   */
  static _fromObject<
    T extends FabricObject,
    X,
    K extends X extends keyof T
      ? { new (arg0: T[X], ...args: any[]): T }
      : { new (...args: any[]): T }
  >(
    klass: K,
    object: Record<string, unknown>,
    { extraParam, ...options }: { extraParam?: X; signal?: AbortSignal } = {}
  ) {
    return enlivenObjectEnlivables<InstanceType<K>>(
      clone(object, true),
      options
    ).then((enlivedMap) => {
      // from the resulting enlived options, extract options.extraParam to arg0
      // to avoid accidental overrides later
      const { [extraParam]: arg0, ...rest } = { ...options, ...enlivedMap };
      return extraParam ? new klass(arg0, rest) : new klass(rest);
    });
  }

  /**
   *
   * @static
   * @memberOf fabric.Object
   * @param {object} object
   * @param {object} [options]
   * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @returns {Promise<fabric.Object>}
   */
  static fromObject(
    object: Record<string, unknown>,
    options?: { signal?: AbortSignal }
  ) {
    return FabricObject._fromObject(FabricObject, object, options);
  }
}

export const fabricObjectDefaultValues = {
  type: 'object',
  originX: 'left',
  originY: 'top',
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  scaleX: 1,
  scaleY: 1,
  flipX: false,
  flipY: false,
  opacity: 1,
  angle: 0,
  skewX: 0,
  skewY: 0,
  cornerSize: 13,
  touchCornerSize: 24,
  transparentCorners: true,
  hoverCursor: null,
  moveCursor: null,
  padding: 0,
  borderColor: 'rgb(178,204,255)',
  borderDashArray: null,
  cornerColor: 'rgb(178,204,255)',
  cornerStrokeColor: '',
  cornerStyle: 'rect',
  cornerDashArray: null,
  centeredScaling: false,
  centeredRotation: true,
  fill: 'rgb(0,0,0)',
  fillRule: 'nonzero',
  globalCompositeOperation: 'source-over',
  backgroundColor: '',
  selectionBackgroundColor: '',
  stroke: null,
  strokeWidth: 1,
  strokeDashArray: null,
  strokeDashOffset: 0,
  strokeLineCap: 'butt',
  strokeLineJoin: 'miter',
  strokeMiterLimit: 4,
  shadow: null,
  borderOpacityWhenMoving: 0.4,
  borderScaleFactor: 1,
  minScaleLimit: 0,
  selectable: true,
  evented: true,
  visible: true,
  hasControls: true,
  hasBorders: true,
  perPixelTargetFind: false,
  includeDefaultValues: true,
  lockMovementX: false,
  lockMovementY: false,
  lockRotation: false,
  lockScalingX: false,
  lockScalingY: false,
  lockSkewingX: false,
  lockSkewingY: false,
  lockScalingFlip: false,
  excludeFromExport: false,
  objectCaching: !fabric.isLikelyNode,
  statefullCache: false,
  noScaleCache: true,
  strokeUniform: false,
  dirty: true,
  __corner: 0,
  paintFirst: 'fill',
  activeOn: 'down',
  stateProperties: [
    'top',
    'left',
    'width',
    'height',
    'scaleX',
    'scaleY',
    'flipX',
    'flipY',
    'originX',
    'originY',
    'transformMatrix',
    'stroke',
    'strokeWidth',
    'strokeDashArray',
    'strokeLineCap',
    'strokeDashOffset',
    'strokeLineJoin',
    'strokeMiterLimit',
    'angle',
    'opacity',
    'fill',
    'globalCompositeOperation',
    'shadow',
    'visible',
    'backgroundColor',
    'skewX',
    'skewY',
    'fillRule',
    'paintFirst',
    'clipPath',
    'strokeUniform',
  ],
  cacheProperties: [
    'fill',
    'stroke',
    'strokeWidth',
    'strokeDashArray',
    'width',
    'height',
    'paintFirst',
    'strokeUniform',
    'strokeLineCap',
    'strokeDashOffset',
    'strokeLineJoin',
    'strokeMiterLimit',
    'backgroundColor',
    'clipPath',
  ],
  colorProperties: ['fill', 'stroke', 'backgroundColor'],
  clipPath: undefined,
  inverted: false,
  absolutePositioned: false,
};

Object.assign(FabricObject.prototype, fabricObjectDefaultValues);
