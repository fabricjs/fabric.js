import { IPoint } from '../point.class';
import { TClassProperties } from '../typedefs';
import { classRegistry } from '../util/class_registry';
import { Polyline, polylineDefaultValues } from './polyline.class';

export class Polygon extends Polyline {
  constructor(points: IPoint[] = [], options: any = {}) {
    super(points, options);
  }

  protected isOpen() {
    return false;
  }
}

export const polygonDefaultValues: Partial<TClassProperties<Polygon>> = {
  ...polylineDefaultValues,
  type: 'polygon',
};

Object.assign(Polygon.prototype, polygonDefaultValues);

classRegistry.setClass(Polygon);
classRegistry.setSVGClass(Polygon);
