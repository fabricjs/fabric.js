import { classRegistry } from '../ClassRegistry';
import { Polyline, polylineDefaultValues } from './Polyline';

export class Polygon extends Polyline {

  static ownDefaults: Record<string,any> = polylineDefaultValues;

  get defaultValues() {
    return {
      ...super.defaultValues,
      ...Polyline.ownDefaults,
    };
  }

  protected isOpen() {
    return false;
  }
}

Polygon.prototype.type = 'polygon';

classRegistry.setClass(Polygon);
classRegistry.setSVGClass(Polygon);
