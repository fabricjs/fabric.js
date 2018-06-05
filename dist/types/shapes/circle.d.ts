import { ObjectOptions } from "./object";
import { ObjectGeometry } from "../mixin/object_geometry";
import { Object } from '../shapes/object';

export interface Circle extends Object, CircleOptions {}
export class Circle {
  constructor(options?: CircleOptions);

  getRadiusX() : number;

  getRadiusY() : number;

  setRadius(radius: number) : number;
}
//#endregion

//#region options



export interface CircleOptions extends ObjectOptions {
  radius?: number;
  startAngle?: number;
  endAngle?: number;
}

