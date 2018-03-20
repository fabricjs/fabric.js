import { ObjectOptions } from "./object";

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

