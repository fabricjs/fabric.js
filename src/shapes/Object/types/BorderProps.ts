export interface BorderProps {
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
   * When set to `false`, object's controlling borders are not rendered
   * @type Boolean
   * @default
   */
  hasBorders: boolean;

  /**
   * Opacity of object's controlling borders when object is active and moving
   * @type Number
   * @default 0.4
   */
  borderOpacityWhenMoving: number;

  /**
   * Scale factor for the border of the objects ( selection box and controls stroke ).
   * Bigger number will make a thicker border
   * border default value is 1, so this scale value is equal to a border and control strokeWidth.
   * Id you need to divide border from control strokeWidth
   * you will need to write your own render function for controls
   * @type Number
   * @default 1
   */
  borderScaleFactor: number;
}
