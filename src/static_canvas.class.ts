// @ts-nocheck
import { fabric } from '../HEADER';
import type { BaseBrush } from './brushes';
import { config } from './config';
import { iMatrix, VERSION } from './constants';
import type { StaticCanvasEvents } from './EventTypeDefs';
import { Gradient } from './gradient';
import { createCollectionMixin } from './mixins/collection.mixin';
import { TSVGReviver } from './mixins/object.svg_export';
import { CommonMethods } from './mixins/shared_methods.mixin';
import { Pattern } from './pattern.class';
import { Point } from './point.class';
import type { FabricObject } from './shapes/fabricObject.class';
import { TCachedFabricObject } from './shapes/object.class';
import { Rect } from './shapes/rect.class';
import type {
  TCornerPoint,
  TFiller,
  TMat2D,
  TSize,
  TValidToObjectMethod,
} from './typedefs';
import { cancelAnimFrame, requestAnimFrame } from './util/animate';
import {
  cleanUpJsdomNode,
  getElementOffset,
  getNodeCanvas,
} from './util/dom_misc';
import { removeFromArray } from './util/internals';
import { uid } from './util/internals/uid';
import { createCanvasElement, isHTMLCanvas } from './util/misc/dom';
import { invertTransform, transformPoint } from './util/misc/matrix';
import { pick } from './util/misc/pick';
import { matrixToSVG } from './util/misc/svgParsing';
import { toFixed } from './util/misc/toFixed';
import {
  isActiveSelection,
  isCollection,
  isFiller,
  isTextObject,
} from './util/types';

const CANVAS_INIT_ERROR = 'Could not initialize `canvas` element';

export type TCanvasSizeOptions = {
  backstoreOnly?: boolean;
  cssOnly?: boolean;
};

export type TSVGExportOptions = {
  suppressPreamble?: boolean;
  viewBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  encoding?: 'UTF-8'; // test Econding type and see what happens
  width?: string;
  height?: string;
  reviver?: TSVGReviver;
};

/**
 * Static canvas class
 * @see {@link http://fabricjs.com/static_canvas|StaticCanvas demo}
 * @fires before:render
 * @fires after:render
 * @fires canvas:cleared
 * @fires object:added
 * @fires object:removed
 */
// eslint-disable-next-line max-len
export class StaticCanvas extends createCollectionMixin(
  CommonMethods<StaticCanvasEvents>
) {
  /**
   * Background color of canvas instance.
   * @type {(String|TFiller)}
   * @default
   */
  backgroundColor: TFiller | string;

  /**
   * Background image of canvas instance.
   * since 2.4.0 image caching is active, please when putting an image as background, add to the
   * canvas property a reference to the canvas it is on. Otherwise the image cannot detect the zoom
   * vale. As an alternative you can disable image objectCaching
   * @type FabricObject
   * @default
   */
  backgroundImage: FabricObject | null;

  /**
   * Overlay color of canvas instance.
   * @since 1.3.9
   * @type {(String|TFiller)}
   * @default
   */
  overlayColor: TFiller | string;

  /**
   * Overlay image of canvas instance.
   * since 2.4.0 image caching is active, please when putting an image as overlay, add to the
   * canvas property a reference to the canvas it is on. Otherwise the image cannot detect the zoom
   * vale. As an alternative you can disable image objectCaching
   * @type FabricObject
   * @default
   */
  overlayImage: FabricObject | null;

  /**
   * Indicates whether toObject/toDatalessObject should include default values
   * if set to false, takes precedence over the object value.
   * @type Boolean
   * @default
   */
  includeDefaultValues: boolean;

  /**
   * Indicates whether objects' state should be saved
   * @type Boolean
   * @deprecated
   * @default
   */
  stateful: boolean;

  /**
   * Indicates whether {@link add}, {@link insertAt} and {@link remove},
   * {@link moveTo}, {@link clear} and many more, should also re-render canvas.
   * Disabling this option will not give a performance boost when adding/removing a lot of objects to/from canvas at once
   * since the renders are quequed and executed one per frame.
   * Disabling is suggested anyway and managing the renders of the app manually is not a big effort ( canvas.requestRenderAll() )
   * Left default to true to do not break documentation and old app, fiddles.
   * @type Boolean
   * @default
   */
  renderOnAddRemove: boolean;

  /**
   * Indicates whether object controls (borders/controls) are rendered above overlay image
   * @type Boolean
   * @default
   */
  controlsAboveOverlay: boolean;

  /**
   * Indicates whether the browser can be scrolled when using a touchscreen and dragging on the canvas
   * @type Boolean
   * @default
   */
  allowTouchScrolling: boolean;

  /**
   * Indicates whether this canvas will use image smoothing, this is on by default in browsers
   * @type Boolean
   * @default
   */
  imageSmoothingEnabled: boolean;

  /**
   * The transformation (a Canvas 2D API transform matrix) which focuses the viewport
   * @type Array
   * @example <caption>Default transform</caption>
   * canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
   * @example <caption>Scale by 70% and translate toward bottom-right by 50, without skewing</caption>
   * canvas.viewportTransform = [0.7, 0, 0, 0.7, 50, 50];
   * @default
   */
  viewportTransform: TMat2D;

  /**
   * if set to false background image is not affected by viewport transform
   * @since 1.6.3
   * @type Boolean
   * @todo we should really find a different way to do this
   * @default
   */
  backgroundVpt: boolean;

  /**
   * if set to false overlya image is not affected by viewport transform
   * @since 1.6.3
   * @type Boolean
   * @todo we should really find a different way to do this
   * @default
   */
  overlayVpt: boolean;

  /**
   * When true, canvas is scaled by devicePixelRatio for better rendering on retina screens
   * @type Boolean
   * @default
   */
  enableRetinaScaling: boolean;

  /**
   * Describe canvas element extension over design
   * properties are tl,tr,bl,br.
   * if canvas is not zoomed/panned those points are the four corner of canvas
   * if canvas is viewportTransformed you those points indicate the extension
   * of canvas element in plain untrasformed coordinates
   * The coordinates get updated with @method calcViewportBoundaries.
   */
  vptCoords: TCornerPoint;

  /**
   * Based on vptCoords and object.aCoords, skip rendering of objects that
   * are not included in current viewport.
   * May greatly help in applications with crowded canvas and use of zoom/pan
   * If One of the corner of the bounding box of the object is on the canvas
   * the objects get rendered.
   * @type Boolean
   * @default
   */
  skipOffscreen: boolean;

  /**
   * a fabricObject that, without stroke define a clipping area with their shape. filled in black
   * the clipPath object gets used when the canvas has rendered, and the context is placed in the
   * top left corner of the canvas.
   * clipPath will clip away controls, if you do not want this to happen use controlsAboveOverlay = true
   * @type FabricObject
   */
  clipPath: FabricObject;

  /**
   * A reference to the canvas actual HTMLCanvasElement.
   * Can be use to read the raw pixels, but never write or manipulate
   * @type HTMLCanvasElement
   */
  lowerCanvasEl: HTMLCanvasElement;

  contextContainer: CanvasRenderingContext2D;

  /**
   * Width in virtual/logical pixels of the canvas.
   * The canvas can be larger than width if retina scaling is active
   * @type number
   */
  width: number;

  /**
   * Height in virtual/logical pixels of the canvas.
   * The canvas can be taller than width if retina scaling is active
   * @type height
   */
  height: number;

  /**
   * If true the Canvas is in the process or has been disposed/destroyed.
   * No more rendering operation will be executed on this canvas.
   * @type boolean
   */
  destroyed?: boolean;

  /**
   * Started the process of disposing but not done yet.
   * WIll likely complete the render cycle already scheduled but stopping adding more.
   * @type boolean
   */
  disposed?: boolean;

  renderAndResetBound: () => void;
  requestRenderAllBound: () => StaticCanvas;

  // TODO: move to canvas
  interactive: boolean;
  upperCanvasEl: HTMLCanvasElement;
  contextTop: CanvasRenderingContext2D;
  wrapperEl: HTMLDivElement;
  cacheCanvasEl: HTMLCanvasElement;
  protected _isCurrentlyDrawing: boolean;
  freeDrawingBrush: BaseBrush;
  _activeObject: FabricObject;

  _offset: { left: number; top: number };
  protected _originalCanvasStyle?: string;
  protected hasLostContext: boolean;
  protected nextRenderHandle: number;
  protected __cleanupTask: {
    (): void;
    kill: (reason?: any) => void;
  };

  add(...objects: FabricObject[]) {
    const size = super.add(...objects);
    objects.length > 0 && this.renderOnAddRemove && this.requestRenderAll();
    return size;
  }

  insertAt(index: number, ...objects: FabricObject[]) {
    const size = super.insertAt(index, ...objects);
    objects.length > 0 && this.renderOnAddRemove && this.requestRenderAll();
    return size;
  }

  remove(...objects: FabricObject[]) {
    const removed = super.remove(...objects);
    removed.length > 0 && this.renderOnAddRemove && this.requestRenderAll();
    return removed;
  }

  _onObjectAdded(obj: FabricObject) {
    // @ts-ignore;
    this.stateful && obj.setupState();
    if (obj.canvas && obj.canvas !== this) {
      /* _DEV_MODE_START_ */
      console.warn(
        'fabric.Canvas: trying to add an object that belongs to a different canvas.\n' +
          'Resulting to default behavior: removing object from previous canvas and adding to new canvas'
      );
      /* _DEV_MODE_END_ */
      obj.canvas.remove(obj);
    }
    obj._set('canvas', this);
    obj.setCoords();
    this.fire('object:added', { target: obj });
    obj.fire('added', { target: this });
  }

  _onObjectRemoved(obj: FabricObject) {
    obj._set('canvas', undefined);
    this.fire('object:removed', { target: obj });
    obj.fire('removed', { target: this });
  }

  initialize(el: string | HTMLCanvasElement, options = {}) {
    this.renderAndResetBound = this.renderAndReset.bind(this);
    this.requestRenderAllBound = this.requestRenderAll.bind(this);
    this._initStatic(el, options);
    this.calcViewportBoundaries();
  }

  constructor(el: string | HTMLCanvasElement, options = {}) {
    super();
    this.renderAndResetBound = this.renderAndReset.bind(this);
    this.requestRenderAllBound = this.requestRenderAll.bind(this);
    this._initStatic(el, options);
    this.calcViewportBoundaries();
  }

  /**
   * @private
   * @param {HTMLCanvasElement | String} el <canvas> element to initialize instance on
   * @param {Object} [options] Options object
   */
  _initStatic(el: string | HTMLCanvasElement, options = {}) {
    this._objects = [];
    this._createLowerCanvas(el);
    this._initOptions(options);
    // only initialize retina scaling once
    if (!this.interactive) {
      this._initRetinaScaling();
    }
    this.calcOffset();
  }

  /**
   * @private
   */
  _isRetinaScaling() {
    return config.devicePixelRatio > 1 && this.enableRetinaScaling;
  }

  /**
   * @private
   * @return {Number} retinaScaling if applied, otherwise 1;
   */
  getRetinaScaling() {
    return this._isRetinaScaling() ? Math.max(1, config.devicePixelRatio) : 1;
  }

  /**
   * @private
   */
  _initRetinaScaling() {
    if (!this._isRetinaScaling()) {
      return;
    }
    const scaleRatio = config.devicePixelRatio;
    this.__initRetinaScaling(
      scaleRatio,
      this.lowerCanvasEl,
      this.contextContainer
    );
    if (this.upperCanvasEl) {
      this.__initRetinaScaling(scaleRatio, this.upperCanvasEl, this.contextTop);
    }
  }

  __initRetinaScaling(
    scaleRatio: number,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ) {
    canvas.setAttribute('width', (this.width * scaleRatio).toString());
    canvas.setAttribute('height', (this.height * scaleRatio).toString());
    context.scale(scaleRatio, scaleRatio);
  }

  /**
   * Calculates canvas element offset relative to the document
   * This method is also attached as "resize" event handler of window
   * @return {fabric.Canvas} instance
   * @chainable
   */
  calcOffset() {
    this._offset = getElementOffset(this.lowerCanvasEl);
    return this;
  }

  /**
   * @private
   */
  _createCanvasElement() {
    const element = createCanvasElement();
    if (!element) {
      throw new Error(CANVAS_INIT_ERROR);
    }
    if (typeof element.getContext === 'undefined') {
      throw new Error(CANVAS_INIT_ERROR);
    }
    return element;
  }

  /**
   * @private
   * @param {Object} [options] Options object
   */
  _initOptions(options = {}) {
    const lowerCanvasEl = this.lowerCanvasEl;
    this.set(options);

    this.width = this.width || lowerCanvasEl.width || 0;
    this.height = this.height || lowerCanvasEl.height || 0;

    if (!this.lowerCanvasEl.style) {
      return;
    }

    lowerCanvasEl.width = this.width;
    lowerCanvasEl.height = this.height;

    lowerCanvasEl.style.width = this.width + 'px';
    lowerCanvasEl.style.height = this.height + 'px';

    this.viewportTransform = [...this.viewportTransform];
  }

  /**
   * Creates a bottom canvas
   * @private
   * @param {HTMLElement} [canvasEl]
   */
  _createLowerCanvas(canvasEl: HTMLCanvasElement | string) {
    // canvasEl === 'HTMLCanvasElement' does not work on jsdom/node
    if (isHTMLCanvas(canvasEl)) {
      this.lowerCanvasEl = canvasEl;
    } else {
      this.lowerCanvasEl =
        fabric.document.getElementById(canvasEl) ||
        canvasEl ||
        this._createCanvasElement();
    }
    if (this.lowerCanvasEl.hasAttribute('data-fabric')) {
      /* _DEV_MODE_START_ */
      throw new Error(
        'fabric.js: trying to initialize a canvas that has already been initialized'
      );
      /* _DEV_MODE_END_ */
    }
    this.lowerCanvasEl.classList.add('lower-canvas');
    this.lowerCanvasEl.setAttribute('data-fabric', 'main');
    if (this.interactive) {
      this._originalCanvasStyle = this.lowerCanvasEl.style.cssText;
      this._applyCanvasStyle(this.lowerCanvasEl);
    }

    this.contextContainer = this.lowerCanvasEl.getContext('2d');
  }

  /**
   * Returns canvas width (in px)
   * @return {Number}
   */
  getWidth(): number {
    return this.width;
  }

  /**
   * Returns canvas height (in px)
   * @return {Number}
   */
  getHeight(): number {
    return this.height;
  }

  /**
   * Sets width of this canvas instance
   * @param {Number|String} value                         Value to set width to
   * @param {Object}        [options]                     Options object
   * @param {Boolean}       [options.backstoreOnly=false] Set the given dimensions only as canvas backstore dimensions
   * @param {Boolean}       [options.cssOnly=false]       Set the given dimensions only as css dimensions
   * @deprecated will be removed in 7.0
   */
  setWidth(value: number, options: TCanvasSizeOptions) {
    return this.setDimensions({ width: value }, options);
  }

  /**
   * Sets height of this canvas instance
   * @param {Number|String} value                         Value to set height to
   * @param {Object}        [options]                     Options object
   * @param {Boolean}       [options.backstoreOnly=false] Set the given dimensions only as canvas backstore dimensions
   * @param {Boolean}       [options.cssOnly=false]       Set the given dimensions only as css dimensions
   * @deprecated will be removed in 7.0
   */
  setHeight(value: number, options: TCanvasSizeOptions) {
    return this.setDimensions({ height: value }, options);
  }

  /**
   * Sets dimensions (width, height) of this canvas instance. when options.cssOnly flag active you should also supply the unit of measure (px/%/em)
   * @param {Object}        dimensions                    Object with width/height properties
   * @param {Number|String} [dimensions.width]            Width of canvas element
   * @param {Number|String} [dimensions.height]           Height of canvas element
   * @param {Object}        [options]                     Options object
   * @param {Boolean}       [options.backstoreOnly=false] Set the given dimensions only as canvas backstore dimensions
   * @param {Boolean}       [options.cssOnly=false]       Set the given dimensions only as css dimensions
   * @return {fabric.Canvas} thisArg
   * @chainable
   */
  setDimensions(
    dimensions: Partial<TSize>,
    { cssOnly = false, backstoreOnly = false }: TCanvasSizeOptions = {}
  ) {
    Object.entries(dimensions).forEach(([prop, value]) => {
      let cssValue = `${value}`;

      if (!cssOnly) {
        this._setBackstoreDimension(prop as keyof TSize, value);
        cssValue += 'px';
        this.hasLostContext = true;
      }

      if (!backstoreOnly) {
        this._setCssDimension(prop as keyof TSize, cssValue);
      }
    });

    // @TODO: move to Canvas
    if (this._isCurrentlyDrawing) {
      this.freeDrawingBrush &&
        this.freeDrawingBrush._setBrushStyles(this.contextTop);
    }
    this._initRetinaScaling();
    this.calcOffset();

    if (!cssOnly) {
      this.requestRenderAll();
    }

    return this;
  }

  /**
   * Helper for setting width/height
   * @private
   * @param {String} prop property (width|height)
   * @param {Number} value value to set property to
   * @return {fabric.Canvas} instance
   * @todo subclass in canvas and handle upperCanvasEl there.
   * @chainable true
   */
  _setBackstoreDimension(prop: keyof TSize, value: number) {
    this.lowerCanvasEl[prop] = value;

    if (this.upperCanvasEl) {
      this.upperCanvasEl[prop] = value;
    }

    // TODO: move to canvas
    if (this.cacheCanvasEl) {
      this.cacheCanvasEl[prop] = value;
    }

    this[prop] = value;

    return this;
  }

  /**
   * Helper for setting css width/height
   * @private
   * @param {String} prop property (width|height)
   * @param {String} value value to set property to
   * @return {fabric.Canvas} instance
   * @todo subclass in canvas and handle upperCanvasEl there.
   * @chainable true
   */
  _setCssDimension(prop: keyof TSize, value: string) {
    this.lowerCanvasEl.style[prop] = value;

    if (this.upperCanvasEl) {
      this.upperCanvasEl.style[prop] = value;
    }

    if (this.wrapperEl) {
      this.wrapperEl.style[prop] = value;
    }

    return this;
  }

  /**
   * Returns canvas zoom level
   * @return {Number}
   */
  getZoom() {
    return this.viewportTransform[0];
  }

  /**
   * Sets viewport transformation of this canvas instance
   * @param {Array} vpt a Canvas 2D API transform matrix
   * @return {fabric.Canvas} instance
   * @chainable true
   */
  setViewportTransform(vpt: TMat2D) {
    const activeObject = this._activeObject,
      backgroundObject = this.backgroundImage,
      overlayObject = this.overlayImage,
      len = this._objects.length;

    this.viewportTransform = vpt;
    for (let i = 0; i < len; i++) {
      const object = this._objects[i];
      object.group || object.setCoords();
    }
    if (activeObject) {
      activeObject.setCoords();
    }
    if (backgroundObject) {
      backgroundObject.setCoords();
    }
    if (overlayObject) {
      overlayObject.setCoords();
    }
    this.calcViewportBoundaries();
    this.renderOnAddRemove && this.requestRenderAll();
    return this;
  }

  /**
   * Sets zoom level of this canvas instance, the zoom centered around point
   * meaning that following zoom to point with the same point will have the visual
   * effect of the zoom originating from that point. The point won't move.
   * It has nothing to do with canvas center or visual center of the viewport.
   * @param {Point} point to zoom with respect to
   * @param {Number} value to set zoom to, less than 1 zooms out
   * @return {fabric.Canvas} instance
   * @chainable true
   */
  zoomToPoint(point: Point, value: number) {
    // TODO: just change the scale, preserve other transformations
    const before = point,
      vpt: TMat2D = [...this.viewportTransform];
    const newPoint = transformPoint(point, invertTransform(vpt));
    vpt[0] = value;
    vpt[3] = value;
    const after = transformPoint(newPoint, vpt);
    vpt[4] += before.x - after.x;
    vpt[5] += before.y - after.y;
    return this.setViewportTransform(vpt);
  }

  /**
   * Sets zoom level of this canvas instance
   * @param {Number} value to set zoom to, less than 1 zooms out
   * @return {fabric.Canvas} instance
   * @chainable true
   */
  setZoom(value: number) {
    return this.zoomToPoint(new Point(0, 0), value);
  }

  /**
   * Pan viewport so as to place point at top left corner of canvas
   * @param {Point} point to move to
   */
  absolutePan(point: Point) {
    const vpt: TMat2D = [...this.viewportTransform];
    vpt[4] = -point.x;
    vpt[5] = -point.y;
    return this.setViewportTransform(vpt);
  }

  /**
   * Pans viewpoint relatively
   * @param {Point} point (position vector) to move by
   */
  relativePan(point: Point) {
    return this.absolutePan(
      new Point(
        -point.x - this.viewportTransform[4],
        -point.y - this.viewportTransform[5]
      )
    );
  }

  /**
   * Returns &lt;canvas> element corresponding to this instance
   * @return {HTMLCanvasElement}
   */
  getElement() {
    return this.lowerCanvasEl;
  }

  /**
   * Clears specified context of canvas element
   * @param {CanvasRenderingContext2D} ctx Context to clear
   * @return {fabric.Canvas} thisArg
   * @chainable
   */
  clearContext(ctx: CanvasRenderingContext2D): StaticCanvas {
    ctx.clearRect(0, 0, this.width, this.height);
    return this;
  }

  /**
   * Returns context of canvas where objects are drawn
   * @return {CanvasRenderingContext2D}
   */
  getContext() {
    return this.contextContainer;
  }

  /**
   * Clears all contexts (background, main, top) of an instance
   * @return {fabric.Canvas} thisArg
   * @chainable
   */
  clear(): StaticCanvas {
    this.remove(...this.getObjects());
    this.backgroundImage = null;
    this.overlayImage = null;
    this.backgroundColor = '';
    this.overlayColor = '';
    this.clearContext(this.contextContainer);
    this.fire('canvas:cleared');
    this.renderOnAddRemove && this.requestRenderAll();
    return this;
  }

  /**
   * Renders the canvas
   * @return {fabric.Canvas} instance
   * @chainable
   */
  renderAll(): StaticCanvas {
    this.cancelRequestedRender();
    if (this.destroyed) {
      return this;
    }
    this.renderCanvas(this.contextContainer, this._objects);
    return this;
  }

  /**
   * Function created to be instance bound at initialization
   * used in requestAnimationFrame rendering
   * Let the fabricJS call it. If you call it manually you could have more
   * animationFrame stacking on to of each other
   * for an imperative rendering, use canvas.renderAll
   * @private
   * @return {fabric.Canvas} instance
   * @chainable
   */
  renderAndReset() {
    this.nextRenderHandle = 0;
    this.renderAll();
  }

  /**
   * Append a renderAll request to next animation frame.
   * unless one is already in progress, in that case nothing is done
   * a boolean flag will avoid appending more.
   * @return {fabric.Canvas} instance
   * @chainable
   */
  requestRenderAll(): StaticCanvas {
    if (!this.nextRenderHandle && !this.disposed && !this.destroyed) {
      this.nextRenderHandle = requestAnimFrame(this.renderAndResetBound);
    }
    return this;
  }

  /**
   * Calculate the position of the 4 corner of canvas with current viewportTransform.
   * helps to determinate when an object is in the current rendering viewport using
   * object absolute coordinates ( aCoords )
   * @return {Object} points.tl
   * @chainable
   */
  calcViewportBoundaries(): TCornerPoint {
    const width = this.width,
      height = this.height,
      iVpt = invertTransform(this.viewportTransform),
      a = transformPoint({ x: 0, y: 0 }, iVpt),
      b = transformPoint({ x: width, y: height }, iVpt),
      // we don't support vpt flipping
      // but the code is robust enough to mostly work with flipping
      min = a.min(b),
      max = a.max(b);
    return (this.vptCoords = {
      tl: min,
      tr: new Point(max.x, min.y),
      bl: new Point(min.x, max.y),
      br: max,
    });
  }

  cancelRequestedRender() {
    if (this.nextRenderHandle) {
      cancelAnimFrame(this.nextRenderHandle);
      this.nextRenderHandle = 0;
    }
  }

  /**
   * Renders background, objects, overlay and controls.
   * @param {CanvasRenderingContext2D} ctx
   * @param {Array} objects to render
   * @return {fabric.Canvas} instance
   * @chainable
   */
  renderCanvas(ctx: CanvasRenderingContext2D, objects: FabricObject[]) {
    if (this.destroyed) {
      return;
    }

    const v = this.viewportTransform,
      path = this.clipPath;
    this.calcViewportBoundaries();
    this.clearContext(ctx);
    ctx.imageSmoothingEnabled = this.imageSmoothingEnabled;
    // node-canvas
    // @ts-ignore
    ctx.patternQuality = 'best';
    this.fire('before:render', { ctx: ctx });
    this._renderBackground(ctx);

    ctx.save();
    //apply viewport transform once for all rendering process
    ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
    this._renderObjects(ctx, objects);
    ctx.restore();
    if (!this.controlsAboveOverlay && this.interactive) {
      this.drawControls(ctx);
    }
    if (path) {
      path._set('canvas', this);
      // needed to setup a couple of variables
      path.shouldCache();
      path._transformDone = true;
      path.renderCache({ forClipping: true });
      this.drawClipPathOnCanvas(ctx, path as TCachedFabricObject);
    }
    this._renderOverlay(ctx);
    if (this.controlsAboveOverlay && this.interactive) {
      this.drawControls(ctx);
    }
    this.fire('after:render', { ctx: ctx });

    if (this.__cleanupTask) {
      this.__cleanupTask();
      this.__cleanupTask = undefined;
    }
  }

  /**
   * Paint the cached clipPath on the lowerCanvasEl
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  drawClipPathOnCanvas(
    ctx: CanvasRenderingContext2D,
    clipPath: TCachedFabricObject
  ) {
    const v = this.viewportTransform;
    ctx.save();
    ctx.transform(...v);
    // DEBUG: uncomment this line, comment the following
    // ctx.globalAlpha = 0.4;
    ctx.globalCompositeOperation = 'destination-in';
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
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {Array} objects to render
   */
  _renderObjects(ctx: CanvasRenderingContext2D, objects: FabricObject[]) {
    for (let i = 0, len = objects.length; i < len; ++i) {
      objects[i] && objects[i].render(ctx);
    }
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {string} property 'background' or 'overlay'
   */
  _renderBackgroundOrOverlay(
    ctx: CanvasRenderingContext2D,
    property: 'background' | 'overlay'
  ) {
    const fill = this[`${property}Color`],
      object = this[`${property}Image`],
      v = this.viewportTransform,
      needsVpt = this[`${property}Vpt`];
    if (!fill && !object) {
      return;
    }
    const isAFiller = isFiller(fill);
    if (fill) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.width, 0);
      ctx.lineTo(this.width, this.height);
      ctx.lineTo(0, this.height);
      ctx.closePath();
      ctx.fillStyle = isAFiller ? fill.toLive(ctx /* this */) : fill;
      if (needsVpt) {
        ctx.transform(...v);
      }
      if (isAFiller) {
        ctx.transform(1, 0, 0, 1, fill.offsetX || 0, fill.offsetY || 0);
        const m = ((fill as Gradient<'linear'>).gradientTransform ||
          (fill as Pattern).patternTransform) as TMat2D;
        m && ctx.transform(...m);
      }
      ctx.fill();
      ctx.restore();
    }
    if (object) {
      ctx.save();
      if (needsVpt) {
        ctx.transform(...v);
      }
      object.render(ctx);
      ctx.restore();
    }
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderBackground(ctx: CanvasRenderingContext2D) {
    this._renderBackgroundOrOverlay(ctx, 'background');
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderOverlay(ctx: CanvasRenderingContext2D) {
    this._renderBackgroundOrOverlay(ctx, 'overlay');
  }

  /**
   * Returns coordinates of a center of canvas.
   * Returned value is an object with top and left properties
   * @return {Object} object with "top" and "left" number values
   * @deprecated migrate to `getCenterPoint`
   */
  getCenter() {
    return {
      top: this.height / 2,
      left: this.width / 2,
    };
  }

  /**
   * Returns coordinates of a center of canvas.
   * @return {Point}
   */
  getCenterPoint() {
    return new Point(this.width / 2, this.height / 2);
  }

  /**
   * Centers object horizontally in the canvas
   * @param {FabricObject} object Object to center horizontally
   * @return {fabric.Canvas} thisArg
   */
  centerObjectH(object: FabricObject) {
    return this._centerObject(
      object,
      new Point(this.getCenterPoint().x, object.getCenterPoint().y)
    );
  }

  /**
   * Centers object vertically in the canvas
   * @param {FabricObject} object Object to center vertically
   * @return {fabric.Canvas} thisArg
   * @chainable
   */
  centerObjectV(object: FabricObject) {
    return this._centerObject(
      object,
      new Point(object.getCenterPoint().x, this.getCenterPoint().y)
    );
  }

  /**
   * Centers object vertically and horizontally in the canvas
   * @param {FabricObject} object Object to center vertically and horizontally
   * @return {fabric.Canvas} thisArg
   * @chainable
   */
  centerObject(object: FabricObject) {
    return this._centerObject(object, this.getCenterPoint());
  }

  /**
   * Centers object vertically and horizontally in the viewport
   * @param {FabricObject} object Object to center vertically and horizontally
   * @return {fabric.Canvas} thisArg
   * @chainable
   */
  viewportCenterObject(object: FabricObject) {
    return this._centerObject(object, this.getVpCenter());
  }

  /**
   * Centers object horizontally in the viewport, object.top is unchanged
   * @param {FabricObject} object Object to center vertically and horizontally
   * @return {fabric.Canvas} thisArg
   * @chainable
   */
  viewportCenterObjectH(object: FabricObject) {
    return this._centerObject(
      object,
      new Point(this.getVpCenter().x, object.getCenterPoint().y)
    );
  }

  /**
   * Centers object Vertically in the viewport, object.top is unchanged
   * @param {FabricObject} object Object to center vertically and horizontally
   * @return {fabric.Canvas} thisArg
   * @chainable
   */
  viewportCenterObjectV(object: FabricObject) {
    return this._centerObject(
      object,
      new Point(object.getCenterPoint().x, this.getVpCenter().y)
    );
  }

  /**
   * Calculate the point in canvas that correspond to the center of actual viewport.
   * @return {Point} vpCenter, viewport center
   * @chainable
   */
  getVpCenter(): Point {
    return transformPoint(
      this.getCenterPoint(),
      invertTransform(this.viewportTransform)
    );
  }

  /**
   * @private
   * @param {FabricObject} object Object to center
   * @param {Point} center Center point
   * @return {fabric.Canvas} thisArg
   * @chainable
   */
  _centerObject(object: FabricObject, center: Point) {
    object.setXY(center, 'center', 'center');
    object.setCoords();
    this.renderOnAddRemove && this.requestRenderAll();
    return this;
  }

  /**
   * Returns dataless JSON representation of canvas
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {String} json string
   */
  toDatalessJSON(propertiesToInclude?: string[]) {
    return this.toDatalessObject(propertiesToInclude);
  }

  /**
   * Returns object representation of canvas
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject(propertiesToInclude?: string[]) {
    return this._toObjectMethod('toObject', propertiesToInclude);
  }

  /**
   * Returns Object representation of canvas
   * this alias is provided because if you call JSON.stringify on an instance,
   * the toJSON object will be invoked if it exists.
   * Having a toJSON method means you can do JSON.stringify(myCanvas)
   * @return {Object} JSON compatible object
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-3#serialization}
   * @see {@link http://jsfiddle.net/fabricjs/pec86/|jsFiddle demo}
   * @example <caption>JSON without additional properties</caption>
   * var json = canvas.toJSON();
   * @example <caption>JSON with additional properties included</caption>
   * var json = canvas.toJSON(['lockMovementX', 'lockMovementY', 'lockRotation', 'lockScalingX', 'lockScalingY']);
   * @example <caption>JSON without default values</caption>
   * var json = canvas.toJSON();
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Returns dataless object representation of canvas
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toDatalessObject(propertiesToInclude?: string[]) {
    return this._toObjectMethod('toDatalessObject', propertiesToInclude);
  }

  /**
   * @private
   */
  _toObjectMethod(
    methodName: TValidToObjectMethod,
    propertiesToInclude?: string[]
  ) {
    const clipPath = this.clipPath;
    const clipPathData =
      clipPath && !clipPath.excludeFromExport
        ? this._toObject(clipPath, methodName, propertiesToInclude)
        : null;
    return {
      version: VERSION,
      ...pick(this, propertiesToInclude),
      objects: this._objects
        .filter((object) => !object.excludeFromExport)
        .map((instance) =>
          this._toObject(instance, methodName, propertiesToInclude)
        ),
      ...this.__serializeBgOverlay(methodName, propertiesToInclude),
      ...(clipPathData ? { clipPath: clipPathData } : null),
    };
  }

  /**
   * @private
   */
  _toObject(
    instance: FabricObject,
    methodName: TValidToObjectMethod,
    propertiesToInclude?: string[]
  ) {
    let originalValue;

    if (!this.includeDefaultValues) {
      originalValue = instance.includeDefaultValues;
      instance.includeDefaultValues = false;
    }

    const object = instance[methodName](propertiesToInclude);
    if (!this.includeDefaultValues) {
      instance.includeDefaultValues = !!originalValue;
    }
    return object;
  }

  /**
   * @private
   */
  __serializeBgOverlay(
    methodName: TValidToObjectMethod,
    propertiesToInclude?: string[]
  ) {
    const data: any = {},
      bgImage = this.backgroundImage,
      overlayImage = this.overlayImage,
      bgColor = this.backgroundColor,
      overlayColor = this.overlayColor;

    if (isFiller(bgColor)) {
      if (!bgColor.excludeFromExport) {
        data.background = bgColor.toObject(propertiesToInclude);
      }
    } else if (bgColor) {
      data.background = bgColor;
    }

    if (isFiller(overlayColor)) {
      if (!overlayColor.excludeFromExport) {
        data.overlay = overlayColor.toObject(propertiesToInclude);
      }
    } else if (overlayColor) {
      data.overlay = overlayColor;
    }

    if (bgImage && !bgImage.excludeFromExport) {
      data.backgroundImage = this._toObject(
        bgImage,
        methodName,
        propertiesToInclude
      );
    }
    if (overlayImage && !overlayImage.excludeFromExport) {
      data.overlayImage = this._toObject(
        overlayImage,
        methodName,
        propertiesToInclude
      );
    }

    return data;
  }

  /* _TO_SVG_START_ */
  /**
   * When true, getSvgTransform() will apply the StaticCanvas.viewportTransform to the SVG transformation. When true,
   * a zoomed canvas will then produce zoomed SVG output.
   * @type Boolean
   * @default
   */
  svgViewportTransformation: boolean;

  /**
   * Returns SVG representation of canvas
   * @function
   * @param {Object} [options] Options object for SVG output
   * @param {Boolean} [options.suppressPreamble=false] If true xml tag is not included
   * @param {Object} [options.viewBox] SVG viewbox object
   * @param {Number} [options.viewBox.x] x-coordinate of viewbox
   * @param {Number} [options.viewBox.y] y-coordinate of viewbox
   * @param {Number} [options.viewBox.width] Width of viewbox
   * @param {Number} [options.viewBox.height] Height of viewbox
   * @param {String} [options.encoding=UTF-8] Encoding of SVG output
   * @param {String} [options.width] desired width of svg with or without units
   * @param {String} [options.height] desired height of svg with or without units
   * @param {Function} [reviver] Method for further parsing of svg elements, called after each fabric object converted into svg representation.
   * @return {String} SVG string
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-3#serialization}
   * @see {@link http://jsfiddle.net/fabricjs/jQ3ZZ/|jsFiddle demo}
   * @example <caption>Normal SVG output</caption>
   * var svg = canvas.toSVG();
   * @example <caption>SVG output without preamble (without &lt;?xml ../>)</caption>
   * var svg = canvas.toSVG({suppressPreamble: true});
   * @example <caption>SVG output with viewBox attribute</caption>
   * var svg = canvas.toSVG({
   *   viewBox: {
   *     x: 100,
   *     y: 100,
   *     width: 200,
   *     height: 300
   *   }
   * });
   * @example <caption>SVG output with different encoding (default: UTF-8)</caption>
   * var svg = canvas.toSVG({encoding: 'ISO-8859-1'});
   * @example <caption>Modify SVG output with reviver function</caption>
   * var svg = canvas.toSVG(null, function(svg) {
   *   return svg.replace('stroke-dasharray: ; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; ', '');
   * });
   */
  toSVG(options: TSVGExportOptions = {}, reviver: TSVGReviver) {
    options.reviver = reviver;
    const markup: string[] = [];

    this._setSVGPreamble(markup, options);
    this._setSVGHeader(markup, options);
    if (this.clipPath) {
      markup.push(`<g clip-path="url(#${this.clipPath.clipPathId})" >\n`);
    }
    this._setSVGBgOverlayColor(markup, 'background');
    this._setSVGBgOverlayImage(markup, 'backgroundImage', reviver);
    this._setSVGObjects(markup, reviver);
    if (this.clipPath) {
      markup.push('</g>\n');
    }
    this._setSVGBgOverlayColor(markup, 'overlay');
    this._setSVGBgOverlayImage(markup, 'overlayImage', reviver);

    markup.push('</svg>');

    return markup.join('');
  }

  /**
   * @private
   */
  _setSVGPreamble(markup: string[], options: TSVGExportOptions): void {
    if (options.suppressPreamble) {
      return;
    }
    markup.push(
      '<?xml version="1.0" encoding="',
      options.encoding || 'UTF-8',
      '" standalone="no" ?>\n',
      '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ',
      '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n'
    );
  }

  /**
   * @private
   */
  _setSVGHeader(markup: string[], options: TSVGExportOptions): void {
    const width = options.width || `${this.width}`,
      height = options.height || `${this.height}`,
      NUM_FRACTION_DIGITS = config.NUM_FRACTION_DIGITS,
      optViewBox = options.viewBox;
    let viewBox: string;
    if (optViewBox) {
      viewBox = `viewBox="${optViewBox.x} ${optViewBox.y} ${optViewBox.width} ${optViewBox.height}" `;
    } else if (this.svgViewportTransformation) {
      const vpt = this.viewportTransform;
      viewBox = `viewBox="${toFixed(
        -vpt[4] / vpt[0],
        NUM_FRACTION_DIGITS
      )} ${toFixed(-vpt[5] / vpt[3], NUM_FRACTION_DIGITS)} ${toFixed(
        this.width / vpt[0],
        NUM_FRACTION_DIGITS
      )} ${toFixed(this.height / vpt[3], NUM_FRACTION_DIGITS)}" `;
    } else {
      viewBox = `viewBox="0 0 ${this.width} ${this.height}" `;
    }

    markup.push(
      '<svg ',
      'xmlns="http://www.w3.org/2000/svg" ',
      'xmlns:xlink="http://www.w3.org/1999/xlink" ',
      'version="1.1" ',
      'width="',
      width,
      '" ',
      'height="',
      height,
      '" ',
      viewBox,
      'xml:space="preserve">\n',
      '<desc>Created with Fabric.js ',
      VERSION,
      '</desc>\n',
      '<defs>\n',
      this.createSVGFontFacesMarkup(),
      this.createSVGRefElementsMarkup(),
      this.createSVGClipPathMarkup(options),
      '</defs>\n'
    );
  }

  createSVGClipPathMarkup(options: TSVGExportOptions): string {
    const clipPath = this.clipPath;
    if (clipPath) {
      clipPath.clipPathId = `CLIPPATH_${uid()}`;
      return (
        '<clipPath id="' +
        clipPath.clipPathId +
        '" >\n' +
        this.clipPath.toClipPathSVG(options.reviver) +
        '</clipPath>\n'
      );
    }
    return '';
  }

  /**
   * Creates markup containing SVG referenced elements like patterns, gradients etc.
   * @return {String}
   */
  createSVGRefElementsMarkup(): string {
    return ['background', 'overlay']
      .map((prop) => {
        const fill = this[`${prop}Color`];
        if (isFiller(fill)) {
          const shouldTransform = this[`${prop}Vpt`],
            vpt = this.viewportTransform,
            object = {
              width: this.width / (shouldTransform ? vpt[0] : 1),
              height: this.height / (shouldTransform ? vpt[3] : 1),
            };
          return fill.toSVG(object as Rect, {
            additionalTransform: shouldTransform ? matrixToSVG(vpt) : '',
          });
        }
      })
      .join('');
  }

  /**
   * Creates markup containing SVG font faces,
   * font URLs for font faces must be collected by developers
   * and are not extracted from the DOM by fabricjs
   * @param {Array} objects Array of fabric objects
   * @return {String}
   */
  createSVGFontFacesMarkup(): string {
    const objects: FabricObject[] = [],
      fontList: Record<string, boolean> = {},
      fontPaths = config.fontPaths;

    this._objects.forEach(function add(object) {
      objects.push(object);
      if (isCollection(object)) {
        object._objects.forEach(add);
      }
    });

    objects.forEach((obj) => {
      if (!isTextObject(obj)) {
        return;
      }
      let fontFamily = obj.fontFamily;
      if (fontList[fontFamily] || !fontPaths[fontFamily]) {
        return;
      }
      fontList[fontFamily] = true;
      if (!obj.styles) {
        return;
      }
      Object.values(obj.styles).forEach((styleRow) => {
        Object.values(styleRow).forEach((textCharStyle) => {
          fontFamily = textCharStyle.fontFamily;
          if (!fontList[fontFamily] && fontPaths[fontFamily]) {
            fontList[fontFamily] = true;
          }
        });
      });
    });

    const fontListMarkup = Object.keys(fontList)
      .map(
        (fontFamily) =>
          `\t\t@font-face {\n\t\t\tfont-family: '${fontFamily}';\n\t\t\tsrc: url('${fontPaths[fontFamily]}');\n\t\t}\n`
      )
      .join('');

    if (fontListMarkup) {
      return `\t<style type="text/css"><![CDATA[\n${fontListMarkup}]]></style>\n`;
    }
    return '';
  }

  /**
   * @private
   */
  _setSVGObjects(markup: string[], reviver: TSVGReviver) {
    this.forEachObject((fabricObject) => {
      if (fabricObject.excludeFromExport) {
        return;
      }
      this._setSVGObject(markup, fabricObject, reviver);
    });
  }

  /**
   * This is its own function because the Canvas ( non static ) requires extra code here
   * @private
   */
  _setSVGObject(
    markup: string[],
    instance: FabricObject,
    reviver: TSVGReviver
  ) {
    markup.push(instance.toSVG(reviver));
  }

  /**
   * @private
   */
  _setSVGBgOverlayImage(
    markup: string[],
    property: 'overlayImage' | 'backgroundImage',
    reviver: TSVGReviver
  ) {
    const bgOrOverlay = this[property];
    if (bgOrOverlay && !bgOrOverlay.excludeFromExport && bgOrOverlay.toSVG) {
      markup.push(bgOrOverlay.toSVG(reviver));
    }
  }

  /**
   * @TODO this seems to handle patterns but fail at gradients.
   * @private
   */
  _setSVGBgOverlayColor(markup: string[], property: 'background' | 'overlay') {
    const filler = this[`${property}Color`];
    if (!filler) {
      return;
    }
    if (isFiller(filler)) {
      // @ts-ignore TS is so stubbordn that i can't even check if a property exists.
      const repeat = filler.repeat || '',
        finalWidth = this.width,
        finalHeight = this.height,
        shouldInvert = this[`${property}Vpt`],
        additionalTransform = shouldInvert
          ? matrixToSVG(invertTransform(this.viewportTransform))
          : '';
      markup.push(
        `<rect transform="${additionalTransform} translate(${finalWidth / 2},${
          finalHeight / 2
        })" x="${filler.offsetX - finalWidth / 2}" y="${
          filler.offsetY - finalHeight / 2
        }" width="${
          repeat === 'repeat-y' || repeat === 'no-repeat'
            ? // @ts-ignore
              filler.source.width
            : finalWidth
        }" height="${
          repeat === 'repeat-x' || repeat === 'no-repeat'
            ? // @ts-ignore
              filler.source.height
            : finalHeight
          // @ts-ignore
        }" fill="url(#SVGID_${filler.id})"></rect>\n`
      );
    } else {
      markup.push(
        '<rect x="0" y="0" width="100%" height="100%" ',
        'fill="',
        filler,
        '"',
        '></rect>\n'
      );
    }
  }
  /* _TO_SVG_END_ */

  /**
   * Moves an object or the objects of a multiple selection
   * to the bottom of the stack of drawn objects
   * @param {FabricObject} object Object to send to back
   * @return {fabric.Canvas} thisArg
   * @chainable
   */
  sendToBack(object: FabricObject) {
    const activeSelection = this._activeObject;
    // @TODO: this part should be in canvas. StaticCanvas can't handle active selections
    if (object === activeSelection && isActiveSelection(object)) {
      const objs = activeSelection._objects;
      for (let i = objs.length; i--; ) {
        const obj = objs[i];
        removeFromArray(this._objects, obj);
        this._objects.unshift(obj);
      }
    } else {
      removeFromArray(this._objects, object);
      this._objects.unshift(object);
    }
    this.renderOnAddRemove && this.requestRenderAll();
    return this;
  }

  /**
   * Moves an object or the objects of a multiple selection
   * to the top of the stack of drawn objects
   * @param {FabricObject} object Object to send
   * @return {fabric.Canvas} thisArg
   * @chainable
   */
  bringToFront(object: FabricObject) {
    const activeSelection = this._activeObject;
    // @TODO: this part should be in canvas. StaticCanvas can't handle active selections
    if (object === activeSelection && isActiveSelection(object)) {
      const objs = activeSelection._objects;
      for (let i = 0; i < objs.length; i++) {
        const obj = objs[i];
        removeFromArray(this._objects, obj);
        this._objects.push(obj);
      }
    } else {
      removeFromArray(this._objects, object);
      this._objects.push(object);
    }
    this.renderOnAddRemove && this.requestRenderAll();
    return this;
  }

  /**
   * Moves an object or a selection down in stack of drawn objects
   * An optional parameter, intersecting allows to move the object in behind
   * the first intersecting object. Where intersection is calculated with
   * bounding box. If no intersection is found, there will not be change in the
   * stack.
   * @param {FabricObject} object Object to send
   * @param {boolean} [intersecting] If `true`, send object behind next lower intersecting object
   * @return {fabric.Canvas} thisArg
   * @chainable
   */
  sendBackwards(object: FabricObject, intersecting: boolean) {
    const activeSelection = this._activeObject;
    if (object === activeSelection && isActiveSelection(object)) {
      let objsMoved = 0;
      const objs = activeSelection._objects;
      for (let i = 0; i < objs.length; i++) {
        const obj = objs[i];
        const idx = this._objects.indexOf(obj);
        if (idx > 0 + objsMoved) {
          removeFromArray(this._objects, obj);
          this._objects.splice(idx - 1, 0, obj);
        }
        objsMoved++;
      }
    } else {
      const idx: number = this._objects.indexOf(object);
      if (idx !== 0) {
        // if object is not on the bottom of stack
        const newIdx = this._findNewLowerIndex(object, idx, intersecting);
        removeFromArray(this._objects, object);
        this._objects.splice(newIdx, 0, object);
      }
    }
    this.renderOnAddRemove && this.requestRenderAll();
    return this;
  }

  /**
   * @private
   */
  _findNewLowerIndex(
    object: FabricObject,
    idx: number,
    intersecting: boolean
  ): number {
    if (intersecting) {
      // traverse down the stack looking for the nearest intersecting object
      for (let i = idx - 1; i >= 0; --i) {
        const isIntersecting =
          object.intersectsWithObject(this._objects[i]) ||
          object.isContainedWithinObject(this._objects[i]) ||
          this._objects[i].isContainedWithinObject(object);
        if (isIntersecting) {
          return i;
        }
      }
    }
    return idx - 1;
  }

  /**
   * Moves an object or a selection up in stack of drawn objects
   * An optional parameter, intersecting allows to move the object in front
   * of the first intersecting object. Where intersection is calculated with
   * bounding box. If no intersection is found, there will not be change in the
   * stack.
   * @param {FabricObject} object Object to send
   * @param {Boolean} [intersecting] If `true`, send object in front of next upper intersecting object
   * @return {fabric.Canvas} thisArg
   * @chainable
   */
  bringForward(object: FabricObject, intersecting: boolean) {
    const activeSelection = this._activeObject;
    let objsMoved = 0;

    if (object === activeSelection && isActiveSelection(object)) {
      const objs = activeSelection._objects;
      for (let i = objs.length; i--; ) {
        const obj = objs[i];
        const idx = this._objects.indexOf(obj);
        if (idx < this._objects.length - 1 - objsMoved) {
          removeFromArray(this._objects, obj);
          this._objects.splice(idx + 1, 0, obj);
        }
        objsMoved++;
      }
    } else {
      const idx = this._objects.indexOf(object);
      if (idx !== this._objects.length - 1) {
        // if object is not on top of stack (last item in an array)
        const newIdx = this._findNewUpperIndex(object, idx, intersecting);
        removeFromArray(this._objects, object);
        this._objects.splice(newIdx, 0, object);
      }
    }
    this.renderOnAddRemove && this.requestRenderAll();
    return this;
  }

  /**
   * @private
   */
  _findNewUpperIndex(object: FabricObject, idx: number, intersecting: boolean) {
    let newIdx;

    if (intersecting) {
      newIdx = idx;
      const len = this._objects.length;
      // traverse up the stack looking for the nearest intersecting object
      for (let i = idx + 1; i < len; ++i) {
        const isIntersecting =
          object.intersectsWithObject(this._objects[i]) ||
          object.isContainedWithinObject(this._objects[i]) ||
          this._objects[i].isContainedWithinObject(object);

        if (isIntersecting) {
          newIdx = i;
          break;
        }
      }
    } else {
      newIdx = idx + 1;
    }

    return newIdx;
  }

  /**
   * Moves an object to specified level in stack of drawn objects
   * @param {FabricObject} object Object to send
   * @param {Number} index Position to move to
   * @return {fabric.Canvas} thisArg
   * @chainable
   */
  moveTo(object: FabricObject, index: number) {
    removeFromArray(this._objects, object);
    this._objects.splice(index, 0, object);
    return this.renderOnAddRemove && this.requestRenderAll();
  }

  /**
   * Waits until rendering has settled to destroy the canvas
   * @returns {Promise<boolean>} a promise resolving to `true` once the canvas has been destroyed or to `false` if the canvas has was already destroyed
   * @throws if aborted by a consequent call
   */
  dispose() {
    this.disposed = true;
    return new Promise<boolean>((resolve, reject) => {
      const task = () => {
        this.destroy();
        resolve(true);
      };
      task.kill = reject;
      if (this.__cleanupTask) {
        this.__cleanupTask.kill('aborted');
      }

      if (this.destroyed) {
        resolve(false);
      } else if (this.nextRenderHandle) {
        this.__cleanupTask = task;
      } else {
        task();
      }
    });
  }

  /**
   * Clears the canvas element, disposes objects and frees resources
   *
   * **CAUTION**:
   *
   * This method is **UNSAFE**.
   * You may encounter a race condition using it if there's a requested render.
   * Call this method only if you are sure rendering has settled.
   * Consider using {@link dispose} as it is **SAFE**
   *
   * @private
   */
  destroy() {
    this.destroyed = true;
    this.cancelRequestedRender();
    this.forEachObject((object) => object.dispose());
    this._objects = [];
    if (this.backgroundImage && this.backgroundImage.dispose) {
      this.backgroundImage.dispose();
    }
    this.backgroundImage = null;
    if (this.overlayImage && this.overlayImage.dispose) {
      this.overlayImage.dispose();
    }
    this.overlayImage = null;
    this._iTextInstances = null;
    // @ts-expect-error disposing
    this.contextContainer = null;
    const canvasElement = this.lowerCanvasEl;
    // @ts-expect-error disposing
    this.lowerCanvasEl = undefined;
    // restore canvas style and attributes
    canvasElement.classList.remove('lower-canvas');
    canvasElement.removeAttribute('data-fabric');
    // needs to be moved into Canvas class
    if (this.interactive) {
      canvasElement.style.cssText = this._originalCanvasStyle || '';
      delete this._originalCanvasStyle;
    }
    // restore canvas size to original size in case retina scaling was applied
    canvasElement.setAttribute('width', `${this.width}`);
    canvasElement.setAttribute('height', `${this.height}`);
    cleanUpJsdomNode(canvasElement);
  }

  /**
   * Returns a string representation of an instance
   * @return {String} string representation of an instance
   */
  toString() {
    return `#<fabric.Canvas (${this.complexity()}): { objects: ${
      this._objects.length
    } }>`;
  }
}

Object.assign(
  StaticCanvas.prototype,
  {
    backgroundColor: '',
    backgroundImage: null,
    overlayColor: '',
    overlayImage: null,
    includeDefaultValues: true,
    stateful: false,
    renderOnAddRemove: true,
    controlsAboveOverlay: false,
    allowTouchScrolling: false,
    imageSmoothingEnabled: true,
    viewportTransform: iMatrix.concat(),
    backgroundVpt: true,
    overlayVpt: true,
    enableRetinaScaling: true,
    svgViewportTransformation: true,
    skipOffscreen: true,
    clipPath: undefined,
  },
  fabric.DataURLExporter
);

if (fabric.isLikelyNode) {
  StaticCanvas.prototype.createPNGStream = function () {
    const impl = getNodeCanvas(this.lowerCanvasEl);
    return impl && impl.createPNGStream();
  };
  StaticCanvas.prototype.createJPEGStream = function (opts: any) {
    const impl = getNodeCanvas(this.lowerCanvasEl);
    return impl && impl.createJPEGStream(opts);
  };
}

fabric.StaticCanvas = StaticCanvas;
