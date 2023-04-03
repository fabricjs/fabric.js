import { getDocument, getEnv } from '../env';
import { config } from '../config';
import { iMatrix, VERSION } from '../constants';
import type { CanvasEvents, StaticCanvasEvents } from '../EventTypeDefs';
import type { Gradient } from '../gradient/Gradient';
import { createCollectionMixin } from '../Collection';
import { CommonMethods } from '../CommonMethods';
import type { Pattern } from '../Pattern';
import { Point } from '../Point';
import type { BaseFabricObject as FabricObject } from '../EventTypeDefs';
import type { TCachedFabricObject } from '../shapes/Object/Object';
import type { Rect } from '../shapes/Rect';
import {
  Constructor,
  ImageFormat,
  TCornerPoint,
  TDataUrlOptions,
  TFiller,
  TMat2D,
  TSize,
  TSVGReviver,
  TToCanvasElementOptions,
  TValidToObjectMethod,
} from '../typedefs';
import {
  cancelAnimFrame,
  requestAnimFrame,
} from '../util/animation/AnimationFrameProvider';
import { getElementOffset } from '../util/dom_misc';
import { uid } from '../util/internals/uid';
import { createCanvasElement, isHTMLCanvas, toDataURL } from '../util/misc/dom';
import { invertTransform, transformPoint } from '../util/misc/matrix';
import {
  enlivenObjectEnlivables,
  EnlivenObjectOptions,
  enlivenObjects,
} from '../util/misc/objectEnlive';
import { pick } from '../util/misc/pick';
import { matrixToSVG } from '../util/misc/svgParsing';
import { toFixed } from '../util/misc/toFixed';
import { isCollection, isFiller, isPattern, isTextObject } from '../util/types';

type TDestroyed<T, K extends keyof any> = {
  // @ts-expect-error TS doesn't recognize protected/private fields using the `keyof` directive so we use `keyof any`
  [R in K | keyof T]: R extends K ? T[R] | undefined | null : T[R];
};

export type TDestroyedCanvas<T extends StaticCanvas> = TDestroyed<
  T,
  | 'contextTop'
  | 'pixelFindContext'
  | 'lowerCanvasEl'
  | 'upperCanvasEl'
  | 'pixelFindCanvasEl'
  | 'wrapperEl'
  | '_activeSelection'
>;

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
  encoding?: 'UTF-8'; // test Encoding type and see what happens
  width?: string;
  height?: string;
  reviver?: TSVGReviver;
};

type TCanvasHydrationOption = {
  signal?: AbortSignal;
};

export const StaticCanvasDefaults = {
  backgroundColor: '',
  backgroundImage: null,
  overlayColor: '',
  overlayImage: null,
  includeDefaultValues: true,
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
// TODO: fix `EventSpec` inheritance https://github.com/microsoft/TypeScript/issues/26154#issuecomment-1366616260
export class StaticCanvas<
  EventSpec extends StaticCanvasEvents = StaticCanvasEvents
> extends createCollectionMixin(CommonMethods<CanvasEvents>) {
  /**
   * Background color of canvas instance.
   * @type {(String|TFiller)}
   * @default
   */
  declare backgroundColor: TFiller | string;

  /**
   * Background image of canvas instance.
   * since 2.4.0 image caching is active, please when putting an image as background, add to the
   * canvas property a reference to the canvas it is on. Otherwise the image cannot detect the zoom
   * vale. As an alternative you can disable image objectCaching
   * @type FabricObject
   * @default
   */
  declare backgroundImage: FabricObject | null;

  /**
   * Overlay color of canvas instance.
   * @since 1.3.9
   * @type {(String|TFiller)}
   * @default
   */
  declare overlayColor: TFiller | string;

  /**
   * Overlay image of canvas instance.
   * since 2.4.0 image caching is active, please when putting an image as overlay, add to the
   * canvas property a reference to the canvas it is on. Otherwise the image cannot detect the zoom
   * vale. As an alternative you can disable image objectCaching
   * @type FabricObject
   * @default
   */
  declare overlayImage: FabricObject | null;

  /**
   * Indicates whether toObject/toDatalessObject should include default values
   * if set to false, takes precedence over the object value.
   * @type Boolean
   * @default
   */
  declare includeDefaultValues: boolean;

  /**
   * Indicates whether {@link add}, {@link insertAt} and {@link remove},
   * {@link moveTo}, {@link clear} and many more, should also re-render canvas.
   * Disabling this option will not give a performance boost when adding/removing a lot of objects to/from canvas at once
   * since the renders are queued and executed one per frame.
   * Disabling is suggested anyway and managing the renders of the app manually is not a big effort ( canvas.requestRenderAll() )
   * Left default to true to do not break documentation and old app, fiddles.
   * @type Boolean
   * @default
   */
  declare renderOnAddRemove: boolean;

  /**
   * Indicates whether object controls (borders/controls) are rendered above overlay image
   * @type Boolean
   * @default
   */
  declare controlsAboveOverlay: boolean;

  /**
   * Indicates whether the browser can be scrolled when using a touchscreen and dragging on the canvas
   * @type Boolean
   * @default
   */
  declare allowTouchScrolling: boolean;

  /**
   * Indicates whether this canvas will use image smoothing, this is on by default in browsers
   * @type Boolean
   * @default
   */
  declare imageSmoothingEnabled: boolean;

  /**
   * The transformation (a Canvas 2D API transform matrix) which focuses the viewport
   * @type Array
   * @example <caption>Default transform</caption>
   * canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
   * @example <caption>Scale by 70% and translate toward bottom-right by 50, without skewing</caption>
   * canvas.viewportTransform = [0.7, 0, 0, 0.7, 50, 50];
   * @default
   */
  declare viewportTransform: TMat2D;

  /**
   * if set to false background image is not affected by viewport transform
   * @since 1.6.3
   * @type Boolean
   * @todo we should really find a different way to do this
   * @default
   */
  declare backgroundVpt: boolean;

  /**
   * if set to false overlya image is not affected by viewport transform
   * @since 1.6.3
   * @type Boolean
   * @todo we should really find a different way to do this
   * @default
   */
  declare overlayVpt: boolean;

  /**
   * When true, canvas is scaled by devicePixelRatio for better rendering on retina screens
   * @type Boolean
   * @default
   */
  declare enableRetinaScaling: boolean;

  /**
   * Describe canvas element extension over design
   * properties are tl,tr,bl,br.
   * if canvas is not zoomed/panned those points are the four corner of canvas
   * if canvas is viewportTransformed you those points indicate the extension
   * of canvas element in plain untrasformed coordinates
   * The coordinates get updated with @method calcViewportBoundaries.
   */
  declare vptCoords: TCornerPoint;

  /**
   * Based on vptCoords and object.aCoords, skip rendering of objects that
   * are not included in current viewport.
   * May greatly help in applications with crowded canvas and use of zoom/pan
   * If One of the corner of the bounding box of the object is on the canvas
   * the objects get rendered.
   * @type Boolean
   * @default
   */
  declare skipOffscreen: boolean;

  /**
   * a fabricObject that, without stroke define a clipping area with their shape. filled in black
   * the clipPath object gets used when the canvas has rendered, and the context is placed in the
   * top left corner of the canvas.
   * clipPath will clip away controls, if you do not want this to happen use controlsAboveOverlay = true
   * @type FabricObject
   */
  declare clipPath: FabricObject;

  /**
   * A reference to the canvas actual HTMLCanvasElement.
   * Can be use to read the raw pixels, but never write or manipulate
   * @type HTMLCanvasElement
   */
  declare lowerCanvasEl: HTMLCanvasElement;

  declare contextContainer: CanvasRenderingContext2D;

  /**
   * Width in virtual/logical pixels of the canvas.
   * The canvas can be larger than width if retina scaling is active
   * @type number
   */
  declare width: number;

  /**
   * Height in virtual/logical pixels of the canvas.
   * The canvas can be taller than width if retina scaling is active
   * @type height
   */
  declare height: number;

  /**
   * If true the Canvas is in the process or has been disposed/destroyed.
   * No more rendering operation will be executed on this canvas.
   * @type boolean
   */
  declare destroyed?: boolean;

  /**
   * Started the process of disposing but not done yet.
   * WIll likely complete the render cycle already scheduled but stopping adding more.
   * @type boolean
   */
  declare disposed?: boolean;

  /**
   * Keeps a copy of the canvas style before setting retina scaling and other potions
   * in order to return it to original state on dispose
   * @type string
   */
  declare _originalCanvasStyle?: string;

  declare _offset: { left: number; top: number };
  protected declare hasLostContext: boolean;
  protected declare nextRenderHandle: number;

  static ownDefaults: Record<string, any> = StaticCanvasDefaults;

  // reference to
  protected declare __cleanupTask?: {
    (): void;
    kill: (reason?: any) => void;
  };

  static getDefaults(): Record<string, any> {
    return StaticCanvas.ownDefaults;
  }

  constructor(el: string | HTMLCanvasElement, options = {}) {
    super();
    Object.assign(
      this,
      (this.constructor as typeof StaticCanvas).getDefaults()
    );
    this.set(options);
    this.initElements(el);
    this._setDimensionsImpl({
      width: this.width || this.lowerCanvasEl.width || 0,
      height: this.height || this.lowerCanvasEl.height || 0,
    });
    this.viewportTransform = [...this.viewportTransform];
    this.calcViewportBoundaries();
  }

  protected initElements(el: string | HTMLCanvasElement) {
    this._createLowerCanvas(el);
    this._originalCanvasStyle = this.lowerCanvasEl.style.cssText;
  }

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

  _onStackOrderChanged() {
    this.renderOnAddRemove && this.requestRenderAll();
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

  protected _initRetinaScaling() {
    this.__initRetinaScaling(this.lowerCanvasEl, this.contextContainer);
  }

  protected __initRetinaScaling(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ) {
    const scaleRatio = config.devicePixelRatio;
    canvas.setAttribute('width', (this.width * scaleRatio).toString());
    canvas.setAttribute('height', (this.height * scaleRatio).toString());
    context.scale(scaleRatio, scaleRatio);
  }

  /**
   * Calculates canvas element offset relative to the document
   * This method is also attached as "resize" event handler of window
   */
  calcOffset() {
    return (this._offset = getElementOffset(this.lowerCanvasEl));
  }

  /**
   * @private
   */
  protected _createCanvasElement() {
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
   * Creates a bottom canvas
   * @private
   * @param {HTMLElement} [canvasEl]
   */
  protected _createLowerCanvas(canvasEl: HTMLCanvasElement | string) {
    // canvasEl === 'HTMLCanvasElement' does not work on jsdom/node
    if (isHTMLCanvas(canvasEl)) {
      this.lowerCanvasEl = canvasEl;
    } else {
      this.lowerCanvasEl =
        (getDocument().getElementById(canvasEl) as HTMLCanvasElement) ||
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
    this.contextContainer = this.lowerCanvasEl.getContext('2d')!;
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
   * Internal use only
   * @protected
   */
  protected _setDimensionsImpl(
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

    this._isRetinaScaling() && this._initRetinaScaling();
    this.calcOffset();
  }

  /**
   * Sets dimensions (width, height) of this canvas instance. when options.cssOnly flag active you should also supply the unit of measure (px/%/em)
   * @param {Object}        dimensions                    Object with width/height properties
   * @param {Number|String} [dimensions.width]            Width of canvas element
   * @param {Number|String} [dimensions.height]           Height of canvas element
   * @param {Object}        [options]                     Options object
   * @param {Boolean}       [options.backstoreOnly=false] Set the given dimensions only as canvas backstore dimensions
   * @param {Boolean}       [options.cssOnly=false]       Set the given dimensions only as css dimensions
   */
  setDimensions(
    dimensions: Partial<TSize>,
    { cssOnly = false, backstoreOnly = false }: TCanvasSizeOptions = {}
  ) {
    this._setDimensionsImpl(dimensions, {
      cssOnly,
      backstoreOnly,
    });
    if (!cssOnly) {
      this.requestRenderAll();
    }
  }

  /**
   * Helper for setting width/height
   * @private
   * @param {String} prop property (width|height)
   * @param {Number} value value to set property to
   * @todo subclass in canvas and handle upperCanvasEl there.
   */
  _setBackstoreDimension(prop: keyof TSize, value: number) {
    this.lowerCanvasEl[prop] = value;
    this[prop] = value;
  }

  /**
   * Helper for setting css width/height
   * @private
   * @param {String} prop property (width|height)
   * @param {String} value value to set property to
   * @todo subclass in canvas and handle upperCanvasEl there.
   */
  _setCssDimension(prop: keyof TSize, value: string) {
    this.lowerCanvasEl.style[prop] = value;
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
   */
  setViewportTransform(vpt: TMat2D) {
    const backgroundObject = this.backgroundImage,
      overlayObject = this.overlayImage,
      len = this._objects.length;

    this.viewportTransform = vpt;
    for (let i = 0; i < len; i++) {
      const object = this._objects[i];
      object.group || object.setCoords();
    }
    if (backgroundObject) {
      backgroundObject.setCoords();
    }
    if (overlayObject) {
      overlayObject.setCoords();
    }
    this.calcViewportBoundaries();
    this.renderOnAddRemove && this.requestRenderAll();
  }

  /**
   * Sets zoom level of this canvas instance, the zoom centered around point
   * meaning that following zoom to point with the same point will have the visual
   * effect of the zoom originating from that point. The point won't move.
   * It has nothing to do with canvas center or visual center of the viewport.
   * @param {Point} point to zoom with respect to
   * @param {Number} value to set zoom to, less than 1 zooms out
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
    this.setViewportTransform(vpt);
  }

  /**
   * Sets zoom level of this canvas instance
   * @param {Number} value to set zoom to, less than 1 zooms out
   */
  setZoom(value: number) {
    this.zoomToPoint(new Point(0, 0), value);
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
  getElement(): HTMLCanvasElement {
    return this.lowerCanvasEl;
  }

  /**
   * Clears specified context of canvas element
   * @param {CanvasRenderingContext2D} ctx Context to clear
   */
  clearContext(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Returns context of canvas where objects are drawn
   * @return {CanvasRenderingContext2D}
   */
  getContext(): CanvasRenderingContext2D {
    return this.contextContainer;
  }

  /**
   * Clears all contexts (background, main, top) of an instance
   */
  clear() {
    this.remove(...this.getObjects());
    this.backgroundImage = null;
    this.overlayImage = null;
    this.backgroundColor = '';
    this.overlayColor = '';
    this.clearContext(this.contextContainer);
    this.fire('canvas:cleared');
    this.renderOnAddRemove && this.requestRenderAll();
  }

  /**
   * Renders the canvas
   */
  renderAll() {
    this.cancelRequestedRender();
    if (this.destroyed) {
      return;
    }
    this.renderCanvas(this.contextContainer, this._objects);
  }

  /**
   * Function created to be instance bound at initialization
   * used in requestAnimationFrame rendering
   * Let the fabricJS call it. If you call it manually you could have more
   * animationFrame stacking on to of each other
   * for an imperative rendering, use canvas.renderAll
   * @private
   */
  renderAndReset() {
    this.nextRenderHandle = 0;
    this.renderAll();
  }

  /**
   * Append a renderAll request to next animation frame.
   * unless one is already in progress, in that case nothing is done
   * a boolean flag will avoid appending more.
   */
  requestRenderAll() {
    if (!this.nextRenderHandle && !this.disposed && !this.destroyed) {
      this.nextRenderHandle = requestAnimFrame(() => this.renderAndReset());
    }
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

  drawControls(ctx: CanvasRenderingContext2D) {
    // Static canvas has no controls
  }

  /**
   * Renders background, objects, overlay and controls.
   * @param {CanvasRenderingContext2D} ctx
   * @param {Array} objects to render
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
    // @ts-ignore node-canvas stuff
    ctx.patternQuality = 'best';
    this.fire('before:render', { ctx });
    this._renderBackground(ctx);

    ctx.save();
    //apply viewport transform once for all rendering process
    ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
    this._renderObjects(ctx, objects);
    ctx.restore();
    if (!this.controlsAboveOverlay) {
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
    if (this.controlsAboveOverlay) {
      this.drawControls(ctx);
    }
    this.fire('after:render', { ctx });

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
      ctx.fillStyle = isAFiller ? fill.toLive(ctx /* this */)! : fill;
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
   */
  centerObject(object: FabricObject) {
    return this._centerObject(object, this.getCenterPoint());
  }

  /**
   * Centers object vertically and horizontally in the viewport
   * @param {FabricObject} object Object to center vertically and horizontally
   */
  viewportCenterObject(object: FabricObject) {
    return this._centerObject(object, this.getVpCenter());
  }

  /**
   * Centers object horizontally in the viewport, object.top is unchanged
   * @param {FabricObject} object Object to center vertically and horizontally
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
   */
  _centerObject(object: FabricObject, center: Point) {
    object.setXY(center, 'center', 'center');
    object.setCoords();
    this.renderOnAddRemove && this.requestRenderAll();
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
      ...pick(this, propertiesToInclude as (keyof this)[]),
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
  declare svgViewportTransformation: boolean;

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
    return (['background', 'overlay'] as const)
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
      const repeat = (filler as Pattern).repeat || '',
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
          (repeat === 'repeat-y' || repeat === 'no-repeat') && isPattern(filler)
            ? filler.source.width
            : finalWidth
        }" height="${
          (repeat === 'repeat-x' || repeat === 'no-repeat') && isPattern(filler)
            ? filler.source.height
            : finalHeight
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
   * Populates canvas with data from the specified JSON.
   * JSON format must conform to the one of {@link fabric.Canvas#toJSON}
   *
   * **IMPORTANT**: It is recommended to abort loading tasks before calling this method to prevent race conditions and unnecessary networking
   *
   * @param {String|Object} json JSON string or object
   * @param {Function} [reviver] Method for further parsing of JSON elements, called after each fabric object created.
   * @param {Object} [options] options
   * @param {AbortSignal} [options.signal] see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @return {Promise<Canvas | StaticCanvas>} instance
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-3#deserialization}
   * @see {@link http://jsfiddle.net/fabricjs/fmgXt/|jsFiddle demo}
   * @example <caption>loadFromJSON</caption>
   * canvas.loadFromJSON(json).then((canvas) => canvas.requestRenderAll());
   * @example <caption>loadFromJSON with reviver</caption>
   * canvas.loadFromJSON(json, function(o, object) {
   *   // `o` = json object
   *   // `object` = fabric.Object instance
   *   // ... do some stuff ...
   * }).then((canvas) => {
   *   ... canvas is restored, add your code.
   * });
   *
   */
  loadFromJSON(
    json: string | Record<string, any>,
    reviver?: EnlivenObjectOptions['reviver'],
    { signal }: TCanvasHydrationOption = {}
  ): Promise<this> {
    if (!json) {
      return Promise.reject(new Error('fabric.js: `json` is undefined'));
    }

    // parse json if it wasn't already
    const serialized = typeof json === 'string' ? JSON.parse(json) : json;
    const {
      objects = [],
      backgroundImage,
      background,
      overlayImage,
      overlay,
      clipPath,
    } = serialized;
    const renderOnAddRemove = this.renderOnAddRemove;
    this.renderOnAddRemove = false;

    return Promise.all([
      enlivenObjects(objects, {
        reviver,
        signal,
      }),
      enlivenObjectEnlivables(
        {
          backgroundImage,
          backgroundColor: background,
          overlayImage,
          overlayColor: overlay,
          clipPath,
        },
        { signal }
      ),
    ]).then(([enlived, enlivedMap]) => {
      this.clear();
      this.add(...enlived);
      this.set(serialized);
      this.set(enlivedMap);
      this.renderOnAddRemove = renderOnAddRemove;
      return this;
    });
  }

  /**
   * Clones canvas instance
   * @param {string[]} [properties] Array of properties to include in the cloned canvas and children
   */
  clone(properties: string[]) {
    const data = this.toObject(properties);
    const canvas = this.cloneWithoutData();
    return canvas.loadFromJSON(data);
  }

  /**
   * Clones canvas instance without cloning existing data.
   * This essentially copies canvas dimensions since loadFromJSON does not affect canvas size.
   */
  cloneWithoutData() {
    const el = createCanvasElement();
    el.width = this.width;
    el.height = this.height;
    return new (this.constructor as Constructor<this>)(el);
  }

  /**
   * Exports canvas element to a dataurl image. Note that when multiplier is used, cropping is scaled appropriately
   * @param {Object} [options] Options object
   * @param {String} [options.format=png] The format of the output image. Either "jpeg" or "png"
   * @param {Number} [options.quality=1] Quality level (0..1). Only used for jpeg.
   * @param {Number} [options.multiplier=1] Multiplier to scale by, to have consistent
   * @param {Number} [options.left] Cropping left offset. Introduced in v1.2.14
   * @param {Number} [options.top] Cropping top offset. Introduced in v1.2.14
   * @param {Number} [options.width] Cropping width. Introduced in v1.2.14
   * @param {Number} [options.height] Cropping height. Introduced in v1.2.14
   * @param {Boolean} [options.enableRetinaScaling] Enable retina scaling for clone image. Introduce in 2.0.0
   * @param {(object: fabric.Object) => boolean} [options.filter] Function to filter objects.
   * @return {String} Returns a data: URL containing a representation of the object in the format specified by options.format
   * @see {@link https://jsfiddle.net/xsjua1rd/ demo}
   * @example <caption>Generate jpeg dataURL with lower quality</caption>
   * var dataURL = canvas.toDataURL({
   *   format: 'jpeg',
   *   quality: 0.8
   * });
   * @example <caption>Generate cropped png dataURL (clipping of canvas)</caption>
   * var dataURL = canvas.toDataURL({
   *   format: 'png',
   *   left: 100,
   *   top: 100,
   *   width: 200,
   *   height: 200
   * });
   * @example <caption>Generate double scaled png dataURL</caption>
   * var dataURL = canvas.toDataURL({
   *   format: 'png',
   *   multiplier: 2
   * });
   * @example <caption>Generate dataURL with objects that overlap a specified object</caption>
   * var myObject;
   * var dataURL = canvas.toDataURL({
   *   filter: (object) => object.isContainedWithinObject(myObject) || object.intersectsWithObject(myObject)
   * });
   */
  toDataURL(options = {} as TDataUrlOptions): string {
    const {
      format = ImageFormat.png,
      quality = 1,
      multiplier = 1,
      enableRetinaScaling = false,
    } = options;
    const finalMultiplier =
      multiplier * (enableRetinaScaling ? this.getRetinaScaling() : 1);

    return toDataURL(
      this.toCanvasElement(finalMultiplier, options),
      format,
      quality
    );
  }

  /**
   * Create a new HTMLCanvas element painted with the current canvas content.
   * No need to resize the actual one or repaint it.
   * Will transfer object ownership to a new canvas, paint it, and set everything back.
   * This is an intermediary step used to get to a dataUrl but also it is useful to
   * create quick image copies of a canvas without passing for the dataUrl string
   * @param {Number} [multiplier] a zoom factor.
   * @param {Object} [options] Cropping informations
   * @param {Number} [options.left] Cropping left offset.
   * @param {Number} [options.top] Cropping top offset.
   * @param {Number} [options.width] Cropping width.
   * @param {Number} [options.height] Cropping height.
   * @param {(object: fabric.Object) => boolean} [options.filter] Function to filter objects.
   */
  toCanvasElement(
    multiplier = 1,
    { width, height, left, top, filter } = {} as TToCanvasElementOptions
  ): HTMLCanvasElement {
    const scaledWidth = (width || this.width) * multiplier,
      scaledHeight = (height || this.height) * multiplier,
      zoom = this.getZoom(),
      originalWidth = this.width,
      originalHeight = this.height,
      newZoom = zoom * multiplier,
      vp = this.viewportTransform,
      translateX = (vp[4] - (left || 0)) * multiplier,
      translateY = (vp[5] - (top || 0)) * multiplier,
      newVp = [newZoom, 0, 0, newZoom, translateX, translateY] as TMat2D,
      originalRetina = this.enableRetinaScaling,
      canvasEl = createCanvasElement(),
      objectsToRender = filter
        ? this._objects.filter((obj) => filter(obj))
        : this._objects;
    canvasEl.width = scaledWidth;
    canvasEl.height = scaledHeight;
    this.enableRetinaScaling = false;
    this.viewportTransform = newVp;
    this.width = scaledWidth;
    this.height = scaledHeight;
    this.calcViewportBoundaries();
    this.renderCanvas(canvasEl.getContext('2d')!, objectsToRender);
    this.viewportTransform = vp;
    this.width = originalWidth;
    this.height = originalHeight;
    this.calcViewportBoundaries();
    this.enableRetinaScaling = originalRetina;
    return canvasEl;
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
    if (this.backgroundImage) {
      this.backgroundImage.dispose();
    }
    this.backgroundImage = null;
    if (this.overlayImage) {
      this.overlayImage.dispose();
    }
    this.overlayImage = null;
    // @ts-expect-error disposing
    this.contextContainer = null;
    const canvasElement = this.lowerCanvasEl!;
    (this as TDestroyedCanvas<StaticCanvas>).lowerCanvasEl = undefined;
    // restore canvas style and attributes
    canvasElement.classList.remove('lower-canvas');
    canvasElement.removeAttribute('data-fabric');
    // restore canvas size to original size in case retina scaling was applied
    canvasElement.setAttribute('width', `${this.width}`);
    canvasElement.setAttribute('height', `${this.height}`);
    canvasElement.style.cssText = this._originalCanvasStyle || '';
    this._originalCanvasStyle = undefined;
    getEnv().dispose(canvasElement);
  }

  /**
   * Returns a string representation of an instance
   * @return {String} string representation of an instance
   */
  toString() {
    return `#<Canvas (${this.complexity()}): { objects: ${
      this._objects.length
    } }>`;
  }
}
