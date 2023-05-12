import type { TFiller } from '../../../typedefs';

export interface FillStrokeProps {
  /**
   * Determines if the fill or the stroke is drawn first (one of "fill" or "stroke")
   * @type String
   * @default
   */
  paintFirst: 'fill' | 'stroke';

  /**
   * Color of object's fill
   * takes css colors https://www.w3.org/TR/css-color-3/
   * @type String
   * @default rgb(0,0,0)
   */
  fill: ReturnType<TFiller['toObject']> | string | null;

  /**
   * Fill rule used to fill an object
   * accepted values are nonzero, evenodd
   * <b>Backwards incompatibility note:</b> This property was used for setting globalCompositeOperation until v1.4.12 (use `globalCompositeOperation` instead)
   * @type String
   * @default nonzero
   */
  fillRule: CanvasFillRule;

  /**
   * When defined, an object is rendered via stroke and this property specifies its color
   * takes css colors https://www.w3.org/TR/css-color-3/
   * @type String
   * @default null
   */
  stroke: ReturnType<TFiller['toObject']> | string | null;

  /**
   * Width of a stroke used to render this object
   * @type Number
   * @default 1
   */
  strokeWidth: number;

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
}
