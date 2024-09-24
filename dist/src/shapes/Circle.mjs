import { defineProperty as _defineProperty, objectSpread2 as _objectSpread2, objectWithoutProperties as _objectWithoutProperties } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { SHARED_ATTRIBUTES } from '../parser/attributes.mjs';
import { parseAttributes } from '../parser/parseAttributes.mjs';
import { cos } from '../util/misc/cos.mjs';
import { degreesToRadians } from '../util/misc/radiansDegreesConversion.mjs';
import { sin } from '../util/misc/sin.mjs';
import { classRegistry } from '../ClassRegistry.mjs';
import { FabricObject } from './Object/FabricObject.mjs';
import { SCALE_X, SCALE_Y } from '../constants.mjs';
import { cacheProperties } from './Object/defaultValues.mjs';

const _excluded = ["left", "top", "radius"];
const CIRCLE_PROPS = ['radius', 'startAngle', 'endAngle', 'counterClockwise'];
const circleDefaultValues = {
  radius: 0,
  startAngle: 0,
  endAngle: 360,
  counterClockwise: false
};
class Circle extends FabricObject {
  static getDefaults() {
    return _objectSpread2(_objectSpread2({}, super.getDefaults()), Circle.ownDefaults);
  }

  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor(options) {
    super();
    Object.assign(this, Circle.ownDefaults);
    this.setOptions(options);
  }

  /**
   * @private
   * @param {String} key
   * @param {*} value
   */
  _set(key, value) {
    super._set(key, value);
    if (key === 'radius') {
      this.setRadius(value);
    }
    return this;
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx context to render on
   */
  _render(ctx) {
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, degreesToRadians(this.startAngle), degreesToRadians(this.endAngle), this.counterClockwise);
    this._renderPaintInOrder(ctx);
  }

  /**
   * Returns horizontal radius of an object (according to how an object is scaled)
   * @return {Number}
   */
  getRadiusX() {
    return this.get('radius') * this.get(SCALE_X);
  }

  /**
   * Returns vertical radius of an object (according to how an object is scaled)
   * @return {Number}
   */
  getRadiusY() {
    return this.get('radius') * this.get(SCALE_Y);
  }

  /**
   * Sets radius of an object (and updates width accordingly)
   */
  setRadius(value) {
    this.radius = value;
    this.set({
      width: value * 2,
      height: value * 2
    });
  }

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject() {
    let propertiesToInclude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return super.toObject([...CIRCLE_PROPS, ...propertiesToInclude]);
  }

  /* _TO_SVG_START_ */

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const angle = (this.endAngle - this.startAngle) % 360;
    if (angle === 0) {
      return ['<circle ', 'COMMON_PARTS', 'cx="0" cy="0" ', 'r="', "".concat(this.radius), '" />\n'];
    } else {
      const {
        radius
      } = this;
      const start = degreesToRadians(this.startAngle),
        end = degreesToRadians(this.endAngle),
        startX = cos(start) * radius,
        startY = sin(start) * radius,
        endX = cos(end) * radius,
        endY = sin(end) * radius,
        largeFlag = angle > 180 ? 1 : 0,
        sweepFlag = this.counterClockwise ? 0 : 1;
      return ["<path d=\"M ".concat(startX, " ").concat(startY, " A ").concat(radius, " ").concat(radius, " 0 ").concat(largeFlag, " ").concat(sweepFlag, " ").concat(endX, " ").concat(endY, "\" "), 'COMMON_PARTS', ' />\n'];
    }
  }
  /* _TO_SVG_END_ */

  /* _FROM_SVG_START_ */
  /**
   * List of attribute names to account for when parsing SVG element (used by {@link Circle.fromElement})
   * @static
   * @memberOf Circle
   * @see: http://www.w3.org/TR/SVG/shapes.html#CircleElement
   */

  /**
   * Returns {@link Circle} instance from an SVG element
   * @static
   * @memberOf Circle
   * @param {HTMLElement} element Element to parse
   * @param {Object} [options] Partial Circle object to default missing properties on the element.
   * @throws {Error} If value of `r` attribute is missing or invalid
   */
  static async fromElement(element, options, cssRules) {
    const _ref = parseAttributes(element, this.ATTRIBUTE_NAMES, cssRules),
      {
        left = 0,
        top = 0,
        radius = 0
      } = _ref,
      otherParsedAttributes = _objectWithoutProperties(_ref, _excluded);

    // this probably requires to be fixed for default origins not being top/left.

    return new this(_objectSpread2(_objectSpread2({}, otherParsedAttributes), {}, {
      radius,
      left: left - radius,
      top: top - radius
    }));
  }

  /* _FROM_SVG_END_ */

  /**
   * @todo how do we declare this??
   */
  static fromObject(object) {
    return super._fromObject(object);
  }
}
_defineProperty(Circle, "type", 'Circle');
_defineProperty(Circle, "cacheProperties", [...cacheProperties, ...CIRCLE_PROPS]);
_defineProperty(Circle, "ownDefaults", circleDefaultValues);
_defineProperty(Circle, "ATTRIBUTE_NAMES", ['cx', 'cy', 'r', ...SHARED_ATTRIBUTES]);
classRegistry.setClass(Circle);
classRegistry.setSVGClass(Circle);

export { Circle, circleDefaultValues };
//# sourceMappingURL=Circle.mjs.map
