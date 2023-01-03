import { TClassProperties } from '../typedefs';
import { classRegistry } from '../util/class_registry';
import { Polyline, polylineDefaultValues } from './polyline.class';

export class Polygon extends Polyline {
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
