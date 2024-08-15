import { iMatrix } from '../constants';
import type { FabricObject } from '../shapes/Object/FabricObject';
import type { TFiller, TMat2D, TOptions } from '../typedefs';

interface CanvasDrawableOptions {
  /**
   * if set to false background image is not affected by viewport transform
   * @since 1.6.3
   * @type Boolean
   * @todo we should really find a different way to do this
   * @default
   */
  backgroundVpt: boolean;

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
  backgroundImage?: FabricObject;

  /**
   * if set to false overlay image is not affected by viewport transform
   * @since 1.6.3
   * @type Boolean
   * @todo we should really find a different way to do this
   * @default
   */
  overlayVpt: boolean;

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
  overlayImage?: FabricObject;
}

interface CanvasRenderingOptions {
  /**
   * Indicates whether {@link StaticCanvas#add}, {@link StaticCanvas#insertAt} and {@link StaticCanvas#remove},
   * {@link StaticCanvas#moveTo}, {@link StaticCanvas#clear} and many more, should also re-render canvas.
   * Disabling this option will not give a performance boost when adding/removing a lot of objects to/from canvas at once
   * since the renders are queued and executed one per frame.
   * Disabling is suggested anyway and managing the renders of the app manually is not a big effort ( canvas.requestRenderAll() )
   * Left default to true to do not break documentation and old app, fiddles.
   * @type Boolean
   * @default
   */
  renderOnAddRemove: boolean;

  /**
   * Based on vptCoords and object.aCoords, skip rendering of objects that
   * are not included in current viewport.
   * May greatly help in applications with crowded canvas and use of zoom/pan
   * If One of the corner of the bounding box of the object is on the canvas
   * the objects get rendered.
   * @type Boolean
   * @default true
   */
  skipOffscreen: boolean;

  /**
   * When true, canvas is scaled by devicePixelRatio for better rendering on retina screens
   * @type Boolean
   * @default
   */
  enableRetinaScaling: boolean;

  /**
   * Indicates whether this canvas will use image smoothing, this is on by default in browsers
   * @type Boolean
   * @default
   */
  imageSmoothingEnabled: boolean;

  /**
   * a fabricObject that, without stroke define a clipping area with their shape. filled in black
   * the clipPath object gets used when the canvas has rendered, and the context is placed in the
   * top left corner of the canvas.
   * clipPath will clip away controls, if you do not want this to happen use controlsAboveOverlay = true
   * @type FabricObject
   */
  clipPath?: FabricObject;
}

export interface CanvasExportOptions {
  /**
   * Indicates whether toObject/toDatalessObject should include default values
   * if set to false, takes precedence over the object value.
   * @type Boolean
   * @default
   */
  includeDefaultValues: boolean;

  /**
   * When true, getSvgTransform() will apply the StaticCanvas.viewportTransform to the SVG transformation. When true,
   * a zoomed canvas will then produce zoomed SVG output.
   * @type Boolean
   * @default
   */
  svgViewportTransformation: boolean;
}

export interface StaticCanvasOptions
  extends CanvasDrawableOptions,
    CanvasRenderingOptions,
    CanvasExportOptions {
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
   * Indicates whether object controls (borders/controls) are rendered above overlay image
   * @type Boolean
   * @default
   *
   * @todo move to Canvas
   */
  controlsAboveOverlay: boolean;

  /**
   * Indicates whether the browser can be scrolled when using a touchscreen and dragging on the canvas
   * @type Boolean
   * @default
   *
   * @todo move to Canvas
   */
  allowTouchScrolling: boolean;

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
}

export const staticCanvasDefaults: TOptions<StaticCanvasOptions> = {
  backgroundVpt: true,
  backgroundColor: '',
  overlayVpt: true,
  overlayColor: '',

  includeDefaultValues: true,
  svgViewportTransformation: true,

  renderOnAddRemove: true,
  skipOffscreen: true,
  enableRetinaScaling: true,
  imageSmoothingEnabled: true,

  /**
   * @todo move to Canvas
   */
  controlsAboveOverlay: false,
  /**
   * @todo move to Canvas
   */
  allowTouchScrolling: false,

  viewportTransform: [...iMatrix],
};
