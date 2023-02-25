import { classRegistry } from '../ClassRegistry';
import { Polyline, polylineDefaultValues } from './Polyline';

export class Polygon extends Polyline {
  static ownDefaults: Record<string, any> = polylineDefaultValues;

  getDefaultValues() {
    return {
      ...super.getDefaultValues(),
      ...Polyline.ownDefaults,
    };
  }

  protected isOpen() {
    return false;
  }
}

// @ts-expect-error
Polygon.prototype.type = 'polygon';

classRegistry.setClass(Polygon);
classRegistry.setSVGClass(Polygon);
