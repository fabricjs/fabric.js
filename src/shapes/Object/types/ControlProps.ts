export interface ControlProps {
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
   * Color of controlling corners of an object (when it's active)
   * @type String
   * @default rgb(178,204,255)
   */
  cornerColor: string;

  /**
   * Color of controlling corners of an object (when it's active and transparentCorners false)
   * @since 1.6.2
   * @type String
   * @default ''
   */
  cornerStrokeColor: string;

  /**
   * Specify style of control, 'rect' or 'circle'
   * This is deprecated. In the future there will be a standard control render
   * And you can swap it with one of the alternative proposed with the control api
   * @since 1.6.2
   * @type 'rect' | 'circle'
   * @default 'rect'
   * @deprecated
   */
  cornerStyle: 'rect' | 'circle';

  /**
   * Array specifying dash pattern of an object's control (hasBorder must be true)
   * @since 1.6.2
   * @type Array | null
   * @default null
   */
  cornerDashArray: number[] | null;

  /**
   * Padding between object and its controlling borders (in pixels)
   * @type Number
   * @default 0
   */
  padding: number;

  /**
   * When set to `false`, object's controls are not displayed and can not be used to manipulate object
   * @type Boolean
   * @default true
   */
  hasControls: boolean;
}
