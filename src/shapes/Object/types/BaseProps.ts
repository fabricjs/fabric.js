import type { TDegree, TOriginX, TOriginY } from '../../../typedefs';

export interface BaseProps {
  /**
   * Left position of an object.
   * Note that by default it's relative to object left.
   * You can change this by setting {@link originX}
   * @type Number
   * @default 0
   */
  left: number;

  /**
   * Top position of an object.
   * Note that by default it's relative to object top.
   * You can change this by setting {@link originY}
   * @type Number
   * @default 0
   */
  top: number;

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
   * Horizontal origin of transformation of an object (`left`, `center`, `right`  or `[0, 1]`)
   * See http://jsfiddle.net/1ow02gea/244/ on how originX/originY affect objects in groups
   * @type String
   * @deprecated please set your default to 'center' in new projects and don't use it to build logic
   * The reason is explained here: https://github.com/fabricjs/fabric.js/discussions/9736
   * To set the default value to 'center' import BaseFabricObject and set the static BaseFabricObject.ownDefaults.originX = 'center'
   * @default 'left'
   */
  originX: TOriginX;

  /**
   * Vertical origin of transformation of an object (`top`, `center`, `bottom` or `[0, 1]`)
   * See http://jsfiddle.net/1ow02gea/244/ on how originX/originY affect objects in groups
   * @type String
   * @deprecated please set your default to 'center' in new projects and don't use it to build logic
   * The reason is explained here: https://github.com/fabricjs/fabric.js/discussions/9736
   * To set the default value to 'center' import BaseFabricObject and set the static BaseFabricObject.ownDefaults.originY = 'center'
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
  skewX: TDegree;

  /**
   * Angle of skew on y axes of an object (in degrees)
   * @type Number
   * @default 0
   */
  skewY: TDegree;
}
