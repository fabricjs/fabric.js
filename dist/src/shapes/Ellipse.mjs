import { defineProperty as _defineProperty, objectSpread2 as _objectSpread2 } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { SCALE_X, SCALE_Y, twoMathPi } from '../constants.mjs';
import { SHARED_ATTRIBUTES } from '../parser/attributes.mjs';
import { parseAttributes } from '../parser/parseAttributes.mjs';
import { classRegistry } from '../ClassRegistry.mjs';
import { FabricObject } from './Object/FabricObject.mjs';
import { cacheProperties } from './Object/defaultValues.mjs';

const ellipseDefaultValues = {
  rx: 0,
  ry: 0
};
const ELLIPSE_PROPS = ['rx', 'ry'];
class Ellipse extends FabricObject {
  static getDefaults() {
    return _objectSpread2(_objectSpread2({}, super.getDefaults()), Ellipse.ownDefaults);
  }

  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor(options) {
    super();
    Object.assign(this, Ellipse.ownDefaults);
    this.setOptions(options);
  }

  /**
   * @private
   * @param {String} key
   * @param {*} value
   * @return {Ellipse} thisArg
   */
  _set(key, value) {
    super._set(key, value);
    switch (key) {
      case 'rx':
        this.rx = value;
        this.set('width', value * 2);
        break;
      case 'ry':
        this.ry = value;
        this.set('height', value * 2);
        break;
    }
    return this;
  }

  /**
   * Returns horizontal radius of an object (according to how an object is scaled)
   * @return {Number}
   */
  getRx() {
    return this.get('rx') * this.get(SCALE_X);
  }

  /**
   * Returns Vertical radius of an object (according to how an object is scaled)
   * @return {Number}
   */
  getRy() {
    return this.get('ry') * this.get(SCALE_Y);
  }

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject() {
    let propertiesToInclude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return super.toObject([...ELLIPSE_PROPS, ...propertiesToInclude]);
  }

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    return ['<ellipse ', 'COMMON_PARTS', "cx=\"0\" cy=\"0\" rx=\"".concat(this.rx, "\" ry=\"").concat(this.ry, "\" />\n")];
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx context to render on
   */
  _render(ctx) {
    ctx.beginPath();
    ctx.save();
    ctx.transform(1, 0, 0, this.ry / this.rx, 0, 0);
    ctx.arc(0, 0, this.rx, 0, twoMathPi, false);
    ctx.restore();
    this._renderPaintInOrder(ctx);
  }

  /* _FROM_SVG_START_ */

  /**
   * List of attribute names to account for when parsing SVG element (used by {@link Ellipse.fromElement})
   * @static
   * @memberOf Ellipse
   * @see http://www.w3.org/TR/SVG/shapes.html#EllipseElement
   */

  /**
   * Returns {@link Ellipse} instance from an SVG element
   * @static
   * @memberOf Ellipse
   * @param {HTMLElement} element Element to parse
   * @return {Ellipse}
   */
  static async fromElement(element, options, cssRules) {
    const parsedAttributes = parseAttributes(element, this.ATTRIBUTE_NAMES, cssRules);
    parsedAttributes.left = (parsedAttributes.left || 0) - parsedAttributes.rx;
    parsedAttributes.top = (parsedAttributes.top || 0) - parsedAttributes.ry;
    return new this(parsedAttributes);
  }

  /* _FROM_SVG_END_ */
}
/**
 * Horizontal radius
 * @type Number
 * @default
 */
/**
 * Vertical radius
 * @type Number
 * @default
 */
_defineProperty(Ellipse, "type", 'Ellipse');
_defineProperty(Ellipse, "cacheProperties", [...cacheProperties, ...ELLIPSE_PROPS]);
_defineProperty(Ellipse, "ownDefaults", ellipseDefaultValues);
_defineProperty(Ellipse, "ATTRIBUTE_NAMES", [...SHARED_ATTRIBUTES, 'cx', 'cy', 'rx', 'ry']);
classRegistry.setClass(Ellipse);
classRegistry.setSVGClass(Ellipse);

export { Ellipse, ellipseDefaultValues };
//# sourceMappingURL=Ellipse.mjs.map
