import { defineProperty as _defineProperty } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { classRegistry } from '../ClassRegistry.mjs';
import { Polyline, polylineDefaultValues } from './Polyline.mjs';

class Polygon extends Polyline {
  isOpen() {
    return false;
  }
}
_defineProperty(Polygon, "ownDefaults", polylineDefaultValues);
_defineProperty(Polygon, "type", 'Polygon');
classRegistry.setClass(Polygon);
classRegistry.setSVGClass(Polygon);

export { Polygon };
//# sourceMappingURL=Polygon.mjs.map
