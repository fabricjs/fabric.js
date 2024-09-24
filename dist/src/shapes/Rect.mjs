import { defineProperty as _defineProperty, objectSpread2 as _objectSpread2, objectWithoutProperties as _objectWithoutProperties } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { kRect } from '../constants.mjs';
import { SHARED_ATTRIBUTES } from '../parser/attributes.mjs';
import { parseAttributes } from '../parser/parseAttributes.mjs';
import { classRegistry } from '../ClassRegistry.mjs';
import { FabricObject } from './Object/FabricObject.mjs';
import { cacheProperties } from './Object/defaultValues.mjs';

const _excluded = ["left", "top", "width", "height", "visible"];
const rectDefaultValues = {
  rx: 0,
  ry: 0
};
const RECT_PROPS = ['rx', 'ry'];
class Rect extends FabricObject {
  static getDefaults() {
    return _objectSpread2(_objectSpread2({}, super.getDefaults()), Rect.ownDefaults);
  }

  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor(options) {
    super();
    Object.assign(this, Rect.ownDefaults);
    this.setOptions(options);
    this._initRxRy();
  }
  /**
   * Initializes rx/ry attributes
   * @private
   */
  _initRxRy() {
    const {
      rx,
      ry
    } = this;
    if (rx && !ry) {
      this.ry = rx;
    } else if (ry && !rx) {
      this.rx = ry;
    }
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(ctx) {
    const {
      width: w,
      height: h
    } = this;
    const x = -w / 2;
    const y = -h / 2;
    const rx = this.rx ? Math.min(this.rx, w / 2) : 0;
    const ry = this.ry ? Math.min(this.ry, h / 2) : 0;
    const isRounded = rx !== 0 || ry !== 0;
    ctx.beginPath();
    ctx.moveTo(x + rx, y);
    ctx.lineTo(x + w - rx, y);
    isRounded && ctx.bezierCurveTo(x + w - kRect * rx, y, x + w, y + kRect * ry, x + w, y + ry);
    ctx.lineTo(x + w, y + h - ry);
    isRounded && ctx.bezierCurveTo(x + w, y + h - kRect * ry, x + w - kRect * rx, y + h, x + w - rx, y + h);
    ctx.lineTo(x + rx, y + h);
    isRounded && ctx.bezierCurveTo(x + kRect * rx, y + h, x, y + h - kRect * ry, x, y + h - ry);
    ctx.lineTo(x, y + ry);
    isRounded && ctx.bezierCurveTo(x, y + kRect * ry, x + kRect * rx, y, x + rx, y);
    ctx.closePath();
    this._renderPaintInOrder(ctx);
  }

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject() {
    let propertiesToInclude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return super.toObject([...RECT_PROPS, ...propertiesToInclude]);
  }

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const {
      width,
      height,
      rx,
      ry
    } = this;
    return ['<rect ', 'COMMON_PARTS', "x=\"".concat(-width / 2, "\" y=\"").concat(-height / 2, "\" rx=\"").concat(rx, "\" ry=\"").concat(ry, "\" width=\"").concat(width, "\" height=\"").concat(height, "\" />\n")];
  }

  /**
   * List of attribute names to account for when parsing SVG element (used by `Rect.fromElement`)
   * @static
   * @memberOf Rect
   * @see: http://www.w3.org/TR/SVG/shapes.html#RectElement
   */

  /* _FROM_SVG_START_ */

  /**
   * Returns {@link Rect} instance from an SVG element
   * @static
   * @memberOf Rect
   * @param {HTMLElement} element Element to parse
   * @param {Object} [options] Options object
   */
  static async fromElement(element, options, cssRules) {
    const _parseAttributes = parseAttributes(element, this.ATTRIBUTE_NAMES, cssRules),
      {
        left = 0,
        top = 0,
        width = 0,
        height = 0,
        visible = true
      } = _parseAttributes,
      restOfparsedAttributes = _objectWithoutProperties(_parseAttributes, _excluded);
    return new this(_objectSpread2(_objectSpread2(_objectSpread2({}, options), restOfparsedAttributes), {}, {
      left,
      top,
      width,
      height,
      visible: Boolean(visible && width && height)
    }));
  }

  /* _FROM_SVG_END_ */
}
/**
 * Horizontal border radius
 * @type Number
 * @default
 */
/**
 * Vertical border radius
 * @type Number
 * @default
 */
_defineProperty(Rect, "type", 'Rect');
_defineProperty(Rect, "cacheProperties", [...cacheProperties, ...RECT_PROPS]);
_defineProperty(Rect, "ownDefaults", rectDefaultValues);
_defineProperty(Rect, "ATTRIBUTE_NAMES", [...SHARED_ATTRIBUTES, 'x', 'y', 'rx', 'ry', 'width', 'height']);
classRegistry.setClass(Rect);
classRegistry.setSVGClass(Rect);

export { Rect, rectDefaultValues };
//# sourceMappingURL=Rect.mjs.map
