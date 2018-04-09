import { fabric } from "../index";
import { Point } from "./point";
import { StaticCanvas, StaticCanvasOptions } from "./static-canvas";
import { CommonMethods } from "./fabric-sink";

export interface CanvasOptions extends StaticCanvasOptions {

  /**
   * When true, objects can be transformed by one side (unproportionally)
   * @type Boolean
   * @default
   */
  uniScaleTransform?: boolean;

  /**
   * Indicates which key enable unproportional scaling
   * values: 'altKey', 'shiftKey', 'ctrlKey'.
   * If `null` or 'none' or any other string that is not a modifier key
   * feature is disabled feature disabled.
   * @since 1.6.2
   * @type String
   * @default
   */
  uniScaleKey?: 'altKey' | 'shiftKey' | 'ctrlKey' | 'none';

  /**
   * When true, objects use center point as the origin of scale transformation.
   * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
   * @since 1.3.4
   * @type Boolean
   * @default
   */
  centeredScaling?: boolean;

  /**
   * When true, objects use center point as the origin of rotate transformation.
   * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
   * @since 1.3.4
   * @type Boolean
   * @default
   */
  centeredRotation?: boolean;

  /**
   * Indicates which key enable centered Transform
   * values: 'altKey', 'shiftKey', 'ctrlKey'.
   * If `null` or 'none' or any other string that is not a modifier key
   * feature is disabled feature disabled.
   * @since 1.6.2
   * @type String
   * @default
   */
  centeredKey?: 'altKey' | 'shiftKey' | 'ctrlKey' | 'none';

  /**
   * Indicates which key enable alternate action on corner
   * values: 'altKey', 'shiftKey', 'ctrlKey'.
   * If `null` or 'none' or any other string that is not a modifier key
   * feature is disabled feature disabled.
   * @since 1.6.2
   * @type String
   * @default
   */
  altActionKey?: 'altKey' | 'shiftKey' | 'ctrlKey' | 'none';

  /**
   * Indicates that canvas is interactive. This property should not be changed.
   * @type Boolean
   * @default
   */
  interactive?: boolean;

  /**
   * Indicates whether group selection should be enabled
   * @type Boolean
   * @default
   */
  selection?: boolean;

  /**
   * Indicates which key or keys enable multiple click selection
   * Pass value as a string or array of strings
   * values: 'altKey', 'shiftKey', 'ctrlKey'.
   * If `null` or empty or containing any other string that is not a modifier key
   * feature is disabled.
   * @since 1.6.2
   * @type String|Array
   * @default
   */
  selectionKey?:  'altKey' | 'shiftKey' | 'ctrlKey' | 'none';

  /**
   * Indicates which key enable alternative selection
   * in case of target overlapping with active object
   * values: 'altKey', 'shiftKey', 'ctrlKey'.
   * If `null` or 'none' or any other string that is not a modifier key
   * feature is disabled feature disabled.
   * @since 1.6.5
   * @type null|String
   * @default
   */
  altSelectionKey?: 'altKey' | 'shiftKey' | 'ctrlKey' | 'none';

  /**
   * Color of selection
   * Example: 'rgba(100, 100, 255, 0.3)'
   * @type String
   * @default
   */
  selectionColor?: string; // blue

  /**
   * Default dash array pattern
   * If not empty the selection border is dashed
   * @type Array
   */
  selectionDashArray?: ReadonlyArray<number>[];

  /**
   * Color of the border of selection (usually slightly darker than color of selection itself)
   * Example: 'rgba(255, 255, 255, 0.3)'
   * @type String
   * @default
   */
  selectionBorderColor?: string;

  /**
   * Width of a line used in object/group selection
   * @type Number
   * @default
   */
  selectionLineWidth?: number;

  /**
   * Select only shapes that are fully contained in the dragged selection rectangle.
   * @type Boolean
   * @default
   */
  selectionFullyContained?: Boolean;

  /**
   * Default cursor value used when hovering over an object on canvas
   * @type String
   * @default
   */
  hoverCursor?: string;

  /**
   * Default cursor value used when moving an object on canvas
   * @type String
   * @default
   */
  moveCursor?: string;

  /**
   * Default cursor value used for the entire canvas
   * @type String
   * @default
   */
  defaultCursor?: string;

  /**
   * Cursor value used during free drawing
   * @type String
   * @default
   */
  freeDrawingCursor?: string;

  /**
   * Cursor value used for rotation point
   * @type String
   * @default
   */
  rotationCursor?: string;

  /**
   * Cursor value used for disabled elements ( corners with disabled action )
   * @type String
   * @since 2.0.0
   * @default
   */
  notAllowedCursor?: string;

  /**
   * Default element class that's given to wrapper (div) element of canvas
   * @type String
   * @default
   */
  containerClass?: string;

  /**
   * When true, object detection happens on per-pixel basis rather than on per-bounding-box
   * @type Boolean
   * @default
   */
  perPixelTargetFind?: boolean;

  /**
   * Number of pixels around target pixel to tolerate (consider active) during object detection
   * @type Number
   * @default
   */
  targetFindTolerance?: number;

  /**
   * When true, target detection is skipped when hovering over canvas. This can be used to improve performance.
   * @type Boolean
   * @default
   */
  skipTargetFind?: boolean;

  /**
   * When true, mouse events on canvas (mousedown/mousemove/mouseup) result in free drawing.
   * After mousedown, mousemove creates a shape,
   * and then mouseup finalizes it and adds an instance of `fabric.Path` onto canvas.
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-4#free_drawing}
   * @type Boolean
   * @default
   */
  isDrawingMode?: boolean;

  /**
   * Indicates whether objects should remain in current stack position when selected.
   * When false objects are brought to top and rendered as part of the selection group
   * @type Boolean
   * @default
   */
  preserveObjectStacking?: boolean;

  /**
   * Indicates the angle that an object will lock to while rotating.
   * @type Number
   * @since 1.6.7
   * @default
   */
  snapAngle?: number;

  /**
   * Indicates the distance from the snapAngle the rotation will lock to the snapAngle.
   * When `null`, the snapThreshold will default to the snapAngle.
   * @type null|Number
   * @since 1.6.7
   * @default
   */
  snapThreshold?: null | Number;

  /**
   * Indicates if the right click on canvas can output the context menu or not
   * @type Boolean
   * @since 1.6.5
   * @default
   */
  stopContextMenu?: Boolean;

  /**
   * Indicates if the canvas can fire right click events
   * @type Boolean
   * @since 1.6.5
   * @default
   */
  fireRightClick?: Boolean;

  /**
   * Indicates if the canvas can fire middle click events
   * @type Boolean
   * @since 1.7.8
   * @default
   */
  fireMiddleClick?: Boolean;
}

export interface Canvas extends fabric.StaticCanvas, CanvasOptions {}
export class Canvas {
  /**
   * Constructor
   * @param {HTMLElement | String} el &lt;canvas> element to initialize instance on
   * @param {Object} [options] Options object
   * @return {Object} thisArg
   */
  constructor(el: HTMLElement | String, options?: CanvasOptions)

  /**
   * Renders both the top canvas and the secondary container canvas.
   * @return {Canvas} instance
   * @chainable
   */
  renderAll(): this

  /**
   * Method to render only the top canvas.
   * Also used to render the group selection box.
   * @return {Canvas} thisArg
   * @chainable
   */
  renderTop(): this;

  /**
   * Checks if point is contained within an area of given object
   * @param {Event} e Event object
   * @param {fabric.Object} target Object to test against
   * @param {Point} [point] x,y object of point coordinates we want to check.
   * @return {Boolean} true if point is contained within an area of given object
   */
  containsPoint(e: Event, target: fabric.Object, point?: Point): boolean;

  /**
   * Returns true if object is transparent at a certain location
   * @param {fabric.Object} target Object to check
   * @param {Number} x Left coordinate
   * @param {Number} y Top coordinate
   * @return {Boolean}
   */
  isTargetTransparent(target: fabric.Object, x: number, y: number): boolean;

  /**
   * Set the cursor type of the canvas element
   * @param {String} value Cursor type of the canvas element.
   * @see http://www.w3.org/TR/css3-ui/#cursor
   */
  setCursor(value: string): void;

  /**
   * Method that determines what object we are clicking on
   * the skipGroup parameter is for internal use, is needed for shift+click action
   * @param {Event} e mouse event
   * @param {Boolean} skipGroup when true, activeGroup is skipped and only objects are traversed through
   */
  findTarget(e: Event, skipGroup: Boolean): void | fabric.Object;

  /**
   * Returns pointer coordinates without the effect of the viewport
   * @param {Object} pointer with "x" and "y" number values
   * @return {Object} object with "x" and "y" number values
   */
  restorePointerVpt(pointer: Point): Point;

  /**
   * Returns pointer coordinates relative to canvas.
   * Can return coordinates with or without viewportTransform.
   * ignoreZoom false gives back coordinates that represent
   * the point clicked on canvas element.
   * ignoreZoom true gives back coordinates after being processed
   * by the viewportTransform ( sort of coordinates of what is displayed
   * on the canvas where you are clicking.
   * To interact with your shapes top and left you want to use ignoreZoom true
   * most of the time, while ignoreZoom false will give you coordinates
   * compatible with the object.oCoords system.
   * of the time.
   * @param {Event} e
   * @param {Boolean} ignoreZoom
   * @return {Object} object with "x" and "y" number values
   */
  getPointer(e: Event, ignoreZoom: boolean, upperCanvasEl: fabric.Object): Point;

  /**
   * Returns context of canvas where object selection is drawn
   * @return {CanvasRenderingContext2D}
   */
  getSelectionContext(): CanvasRenderingContext2D;

  /**
   * Returns &lt;canvas> element on which object selection is drawn
   * @return {HTMLCanvasElement}
   */
  getSelectionElement(): HTMLCanvasElement;

  /**
   * Returns currently active object
   * @return {fabric.Object} active object
   */
  getActiveObject(): fabric.Object;

  /**
   * Returns an array with the current selected objects
   * @return {fabric.Object} active object
   */
  getActiveObjects(): fabric.Object[];

  /**
   * Sets given object as the only active object on canvas
   * @param {fabric.Object} object Object to set as an active one
   * @param {Event} [e] Event (passed along when firing "object:selected")
   * @return {Canvas} thisArg
   * @chainable
   */
  setActiveObject(object: fabric.Object, e: Event): this;

  /**
   * Discards currently active object and fire events. If the function is called by fabric
   * as a consequence of a mouse event, the event is passed as a parameter and
   * sent to the fire function for the custom events. When used as a method the
   * e param does not have any application.
   * @param {event} e
   * @return {Canvas} thisArg
   * @chainable
   */
  discardActiveObject(e: Event): this;

  /**
   * Clears a canvas element and removes all event listeners
   * @return {Canvas} thisArg
   * @chainable
   */
  dispose(): this;

  /**
   * Clears all contexts (background, main, top) of an instance
   * @return {Canvas} thisArg
   * @chainable
   */
  clear(): this;

  /**
   * Draws objects' controls (borders/controls)
   * @param {CanvasRenderingContext2D} ctx Context to render controls on
   */
  drawControls(ctx: CanvasRenderingContext2D): void;
}
