import { classRegistry } from '../ClassRegistry';
import { Polyline } from './Polyline';

export class Polygon extends Polyline {
  static readonly type = 'polygon';

  protected isOpen() {
    return false;
  }
}

classRegistry.setClass(Polygon);
classRegistry.setSVGClass(Polygon);
