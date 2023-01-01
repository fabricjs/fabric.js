import { classRegistry } from '../util/class_registry';
import { Polyline } from './polyline.class';

export class Polygon extends Polyline {
  protected isOpen() {
    return false;
  }

  static getDefaults() {
    const superDefaults = super.getDefaults();
    return {
      ...superDefaults,
      type: 'polygon',
    };
  }
}

classRegistry.setClass(Polygon);
classRegistry.setSVGClass(Polygon);
