import { Object, ObjectOptions } from "../fabric-sink";

export interface EllipseOptions extends ObjectOptions {

  /**
   * Horizontal radius
   * @type Number
   * @default
   */
  rx?: number;

  /**
   * Vertical radius
   * @type Number
   * @default
   */
  ry?: number;
}

export interface Ellipse extends Object, EllipseOptions { }
export class Ellipse {
  constructor(options?: EllipseOptions);
}