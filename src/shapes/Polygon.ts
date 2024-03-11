import { classRegistry } from '../ClassRegistry';
import { Polyline, polylineDefaultValues } from './Polyline';

export class Polygon extends Polyline {
  static ownDefaults = polylineDefaultValues;

  static type = 'Polygon';

  static getDefaults(): Record<string, any> {
    return {
      ...super.getDefaults(),
      ...Polyline.ownDefaults,
    };
  }

  protected isOpen() {
    return false;
  }
}

classRegistry.setClass(Polygon);
classRegistry.setSVGClass(Polygon);
