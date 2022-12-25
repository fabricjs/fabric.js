import { TEvent } from '../EventTypeDefs';
import { Point } from '../point.class';
import { Shadow } from '../shadow.class';
import { FabricObject } from '../shapes/fabricObject.class';

export type TBrushEventData = TEvent & { pointer: Point };

export type BrushOptions = {
  /**
   * Color of a brush
   */
  color: string;

  /**
   * Width of a brush, has to be a Number, no string literals
   */
  width: number;

  /**
   * Shadow object representing shadow of this shape.
   */
  shadow: Shadow | null;

  /**
   * Line endings style of a brush (one of "butt", "round", "square")
   */
  strokeLineCap: CanvasLineCap;

  /**
   * Corner style of a brush (one of "bevel", "round", "miter")
   */
  strokeLineJoin: CanvasLineJoin;

  /**
   * Maximum miter length (used for strokeLineJoin = "miter") of a brush's
   * @type Number
   * @default
   */
  strokeMiterLimit: number;

  /**
   * Stroke Dash Array.
   * @type Array
   * @default
   */
  strokeDashArray: number[] | null;

  /**
   * When `true`, the free drawing is limited to the whiteboard size. Default to false.
   * @type Boolean
   * @default false
   */
  limitedToCanvasSize: boolean;

  /**
   * Same as FabricObject `clipPath` property.
   * The clip path is positioned relative to the top left corner of the viewport.
   * The `absolutePositioned` property renders the clip path w/o viewport transform.
   */
  clipPath?: FabricObject;
};
