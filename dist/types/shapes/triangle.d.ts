import { Object, ObjectOptions } from "../fabric-sink";

export interface TriangleOptions extends ObjectOptions {
  width?: number;
  height?: number;
}

export interface Triangle extends Object, TriangleOptions {}
export class Triangle {
  constructor(options?: TriangleOptions);
}
