import { Shadow } from '../../Shadow';
import { TDegree, TFiller, TOriginX, TOriginY } from '../../typedefs';
import { FabricObject } from './Object';

export interface ObjectBaseProps {
  /**
   * Top position of an object. Note that by default it's relative to object top. You can change this by setting originY={top/center/bottom}
   * @type Number
   * @default 0
   */
  top: number;

  /**
   * Left position of an object. Note that by default it's relative to object left. You can change this by setting originX={left/center/right}
   * @type Number
   * @default 0
   */
  left: number;

  /**
   * Object width
   * @type Number
   * @default
   */
  width: number;

  /**
   * Object height
   * @type Number
   * @default
   */
  height: number;

  /**
   * When true, an object is rendered as flipped horizontally
   * @type Boolean
   * @default false
   */
  flipX: boolean;

  /**
   * When true, an object is rendered as flipped vertically
   * @type Boolean
   * @default false
   */
  flipY: boolean;

  /**
   * Object scale factor (horizontal)
   * @type Number
   * @default 1
   */
  scaleX: number;

  /**
   * Object scale factor (vertical)
   * @type Number
   * @default 1
   */
  scaleY: number;

  /**
   * Angle of skew on x axes of an object (in degrees)
   * @type Number
   * @default 0
   */
  skewX: number;

  /**
   * Angle of skew on y axes of an object (in degrees)
   * @type Number
   * @default 0
   */
  skewY: number;

  /**
   * Horizontal origin of transformation of an object (one of "left", "right", "center")
   * See http://jsfiddle.net/1ow02gea/244/ on how originX/originY affect objects in groups
   * @type String
   * @default 'left'
   */
  originX: TOriginX;

  /**
   * Vertical origin of transformation of an object (one of "top", "bottom", "center")
   * See http://jsfiddle.net/1ow02gea/244/ on how originX/originY affect objects in groups
   * @type String
   * @default 'top'
   */
  originY: TOriginY;

  /**
   * Angle of rotation of an object (in degrees)
   * @type Number
   * @default 0
   */
  angle: TDegree;

  /**
   * Width of a stroke used to render this object
   * @type Number
   * @default 1
   */
  strokeWidth: number;

  /**
   * When `false`, the stoke width will scale with the object.
   * When `true`, the stroke will always match the exact pixel size entered for stroke width.
   * this Property does not work on Text classes or drawing call that uses strokeText,fillText methods
   * default to false
   * @since 2.6.0
   * @type Boolean
   * @default false
   * @type Boolean
   * @default false
   */
  strokeUniform: boolean;

  /**
   * Padding between object and its controlling borders (in pixels)
   * @type Number
   * @default 0
   */
  padding: number;
}

export interface ObjectProps extends ObjectBaseProps {
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
   * @type CSSStyleDeclaration['cursor'] | null
   * @default null
   */
  hoverCursor: CSSStyleDeclaration['cursor'] | null;

  /**
   * Default cursor value used when moving this object on canvas
   * @type CSSStyleDeclaration['cursor'] | null
   * @default null
   */
  moveCursor: CSSStyleDeclaration['cursor'] | null;

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
   * This is deprecated. In the future there will be a standard control render
   * And you can swap it with one of the alternative proposed with the control api
   * @since 1.6.2
   * @type 'rect' | 'circle'
   * @default rect
   * @deprecated
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
  fill: string | TFiller | null;

  /**
   * Fill rule used to fill an object
   * accepted values are nonzero, evenodd
   * <b>Backwards incompatibility note:</b> This property was used for setting globalCompositeOperation until v1.4.12 (use `globalCompositeOperation` instead)
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
   * @deprecated
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
   * When `true`, object is not exported in OBJECT/JSON
   * @since 1.6.3
   * @type Boolean
   * @default
   */
  excludeFromExport: boolean;

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
   * When `true`, object is cached on an additional canvas.
   * When `false`, object is not cached unless necessary ( clipPath )
   * default to true
   * @since 1.7.0
   * @type Boolean
   * @default true
   */
  objectCaching: boolean;

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
   * a fabricObject that, without stroke define a clipping area with their shape. filled in black
   * the clipPath object gets used when the object has rendered, and the context is placed in the center
   * of the object cacheCanvas.
   * If you want 0,0 of a clipPath to align with an object center, use clipPath.originX/Y to 'center'
   * @type FabricObject
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
}

export interface FabricObjectProps extends ObjectProps {
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
   * The angle that an object will lock to while rotating.
   * @type [TDegree]
   */
  snapAngle?: TDegree;

  /**
   * The angle difference from the current snapped angle in which snapping should occur.
   * When undefined, the snapThreshold will default to the snapAngle.
   * @type [TDegree]
   */
  snapThreshold?: TDegree;
}
