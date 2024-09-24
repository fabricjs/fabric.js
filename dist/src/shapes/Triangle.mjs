import { defineProperty as _defineProperty, objectSpread2 as _objectSpread2 } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { classRegistry } from '../ClassRegistry.mjs';
import { FabricObject } from './Object/FabricObject.mjs';

const triangleDefaultValues = {
  width: 100,
  height: 100
};
class Triangle extends FabricObject {
  static getDefaults() {
    return _objectSpread2(_objectSpread2({}, super.getDefaults()), Triangle.ownDefaults);
  }

  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor(options) {
    super();
    Object.assign(this, Triangle.ownDefaults);
    this.setOptions(options);
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(ctx) {
    const widthBy2 = this.width / 2,
      heightBy2 = this.height / 2;
    ctx.beginPath();
    ctx.moveTo(-widthBy2, heightBy2);
    ctx.lineTo(0, -heightBy2);
    ctx.lineTo(widthBy2, heightBy2);
    ctx.closePath();
    this._renderPaintInOrder(ctx);
  }

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const widthBy2 = this.width / 2,
      heightBy2 = this.height / 2,
      points = "".concat(-widthBy2, " ").concat(heightBy2, ",0 ").concat(-heightBy2, ",").concat(widthBy2, " ").concat(heightBy2);
    return ['<polygon ', 'COMMON_PARTS', 'points="', points, '" />'];
  }
}
_defineProperty(Triangle, "type", 'Triangle');
_defineProperty(Triangle, "ownDefaults", triangleDefaultValues);
classRegistry.setClass(Triangle);
classRegistry.setSVGClass(Triangle);

export { Triangle, triangleDefaultValues };
//# sourceMappingURL=Triangle.mjs.map
