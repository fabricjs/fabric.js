import { TDegree, TOriginX, TOriginY } from '../../../typedefs';

export interface BaseProps {
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
}
