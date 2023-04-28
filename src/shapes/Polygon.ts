import { classRegistry } from '../ClassRegistry';
import { Polyline, polylineDefaultValues } from './Polyline';

export class Polygon extends Polyline {
  static ownDefaults: Record<string, any> = polylineDefaultValues;

  static getDefaults() {
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
