import { IPoint } from '../point.class';
import { TClassProperties } from '../typedefs';
import { classRegistry } from '../util/class_registry';
import { Polyline, polylineDefaultValues } from './polyline.class';

export const polygonDefaultValues: Partial<TClassProperties<Polygon>> = {
  ...polylineDefaultValues,
  type: 'polygon',
};

export class Polygon extends Polyline {
  constructor(points: IPoint[] = [], options: any = {}) {
    super(points, { ...polygonDefaultValues, ...options });
  }

  protected isOpen() {
    return false;
  }
}

classRegistry.setClass(Polygon);
classRegistry.setSVGClass(Polygon);
