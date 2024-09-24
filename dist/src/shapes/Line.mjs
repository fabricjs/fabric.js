import { defineProperty as _defineProperty, objectSpread2 as _objectSpread2, objectWithoutProperties as _objectWithoutProperties } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { SHARED_ATTRIBUTES } from '../parser/attributes.mjs';
import { parseAttributes } from '../parser/parseAttributes.mjs';
import { classRegistry } from '../ClassRegistry.mjs';
import { FabricObject } from './Object/FabricObject.mjs';
import { Point } from '../Point.mjs';
import { isFiller } from '../util/typeAssertions.mjs';
import { LEFT, TOP, CENTER } from '../constants.mjs';
import '../util/misc/vectors.mjs';
import '../util/misc/projectStroke/StrokeLineJoinProjections.mjs';
import '../config.mjs';
import './Group.mjs';
import { makeBoundingBoxFromPoints } from '../util/misc/boundingBoxFromPoints.mjs';
import '../cache.mjs';
import '../parser/constants.mjs';
import '../util/animation/AnimationRegistry.mjs';
import { cacheProperties } from './Object/defaultValues.mjs';

const _excluded = ["x1", "y1", "x2", "y2"],
  _excluded2 = ["x1", "y1", "x2", "y2"];
// @TODO this code is terrible and Line should be a special case of polyline.

const coordProps = ['x1', 'x2', 'y1', 'y2'];
class Line extends FabricObject {
  /**
   * Constructor
   * @param {Array} [points] Array of points
   * @param {Object} [options] Options object
   * @return {Line} thisArg
   */
  constructor() {
    let [x1, y1, x2, y2] = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0, 0, 0, 0];
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super();
    Object.assign(this, Line.ownDefaults);
    this.setOptions(options);
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this._setWidthHeight();
    const {
      left,
      top
    } = options;
    typeof left === 'number' && this.set(LEFT, left);
    typeof top === 'number' && this.set(TOP, top);
  }

  /**
   * @private
   * @param {Object} [options] Options
   */
  _setWidthHeight() {
    const {
      x1,
      y1,
      x2,
      y2
    } = this;
    this.width = Math.abs(x2 - x1);
    this.height = Math.abs(y2 - y1);
    const {
      left,
      top,
      width,
      height
    } = makeBoundingBoxFromPoints([{
      x: x1,
      y: y1
    }, {
      x: x2,
      y: y2
    }]);
    const position = new Point(left + width / 2, top + height / 2);
    this.setPositionByOrigin(position, CENTER, CENTER);
  }

  /**
   * @private
   * @param {String} key
   * @param {*} value
   */
  _set(key, value) {
    super._set(key, value);
    if (coordProps.includes(key)) {
      // this doesn't make sense very much, since setting x1 when top or left
      // are already set, is just going to show a strange result since the
      // line will move way more than the developer expect.
      // in fabric5 it worked only when the line didn't have extra transformations,
      // in fabric6 too. With extra transform they behave bad in different ways.
      // This needs probably a good rework or a tutorial if you have to create a dynamic line
      this._setWidthHeight();
    }
    return this;
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(ctx) {
    ctx.beginPath();
    const p = this.calcLinePoints();
    ctx.moveTo(p.x1, p.y1);
    ctx.lineTo(p.x2, p.y2);
    ctx.lineWidth = this.strokeWidth;

    // TODO: test this
    // make sure setting "fill" changes color of a line
    // (by copying fillStyle to strokeStyle, since line is stroked, not filled)
    const origStrokeStyle = ctx.strokeStyle;
    if (isFiller(this.stroke)) {
      ctx.strokeStyle = this.stroke.toLive(ctx);
    } else {
      var _this$stroke;
      ctx.strokeStyle = (_this$stroke = this.stroke) !== null && _this$stroke !== void 0 ? _this$stroke : ctx.fillStyle;
    }
    this.stroke && this._renderStroke(ctx);
    ctx.strokeStyle = origStrokeStyle;
  }

  /**
   * This function is an helper for svg import. it returns the center of the object in the svg
   * untransformed coordinates
   * @private
   * @return {Point} center point from element coordinates
   */
  _findCenterFromElement() {
    return new Point((this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2);
  }

  /**
   * Returns object representation of an instance
   * @method toObject
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject() {
    let propertiesToInclude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return _objectSpread2(_objectSpread2({}, super.toObject(propertiesToInclude)), this.calcLinePoints());
  }

  /*
   * Calculate object dimensions from its properties
   * @private
   */
  _getNonTransformedDimensions() {
    const dim = super._getNonTransformedDimensions();
    if (this.strokeLineCap === 'butt') {
      if (this.width === 0) {
        dim.y -= this.strokeWidth;
      }
      if (this.height === 0) {
        dim.x -= this.strokeWidth;
      }
    }
    return dim;
  }

  /**
   * Recalculates line points given width and height
   * Those points are simply placed around the center,
   * This is not useful outside internal render functions and svg output
   * Is not meant to be for the developer.
   * @private
   */
  calcLinePoints() {
    const {
      x1: _x1,
      x2: _x2,
      y1: _y1,
      y2: _y2,
      width,
      height
    } = this;
    const xMult = _x1 <= _x2 ? -1 : 1,
      yMult = _y1 <= _y2 ? -1 : 1,
      x1 = xMult * width / 2,
      y1 = yMult * height / 2,
      x2 = xMult * -width / 2,
      y2 = yMult * -height / 2;
    return {
      x1,
      x2,
      y1,
      y2
    };
  }

  /* _FROM_SVG_START_ */

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const {
      x1,
      x2,
      y1,
      y2
    } = this.calcLinePoints();
    return ['<line ', 'COMMON_PARTS', "x1=\"".concat(x1, "\" y1=\"").concat(y1, "\" x2=\"").concat(x2, "\" y2=\"").concat(y2, "\" />\n")];
  }

  /**
   * List of attribute names to account for when parsing SVG element (used by {@link Line.fromElement})
   * @static
   * @memberOf Line
   * @see http://www.w3.org/TR/SVG/shapes.html#LineElement
   */

  /**
   * Returns Line instance from an SVG element
   * @static
   * @memberOf Line
   * @param {HTMLElement} element Element to parse
   * @param {Object} [options] Options object
   * @param {Function} [callback] callback function invoked after parsing
   */
  static async fromElement(element, options, cssRules) {
    const _parseAttributes = parseAttributes(element, this.ATTRIBUTE_NAMES, cssRules),
      {
        x1 = 0,
        y1 = 0,
        x2 = 0,
        y2 = 0
      } = _parseAttributes,
      parsedAttributes = _objectWithoutProperties(_parseAttributes, _excluded);
    return new this([x1, y1, x2, y2], parsedAttributes);
  }

  /* _FROM_SVG_END_ */

  /**
   * Returns Line instance from an object representation
   * @static
   * @memberOf Line
   * @param {Object} object Object to create an instance from
   * @returns {Promise<Line>}
   */
  static fromObject(_ref) {
    let {
        x1,
        y1,
        x2,
        y2
      } = _ref,
      object = _objectWithoutProperties(_ref, _excluded2);
    return this._fromObject(_objectSpread2(_objectSpread2({}, object), {}, {
      points: [x1, y1, x2, y2]
    }), {
      extraParam: 'points'
    });
  }
}
/**
 * x value or first line edge
 * @type number
 * @default
 */
/**
 * y value or first line edge
 * @type number
 * @default
 */
/**
 * x value or second line edge
 * @type number
 * @default
 */
/**
 * y value or second line edge
 * @type number
 * @default
 */
_defineProperty(Line, "type", 'Line');
_defineProperty(Line, "cacheProperties", [...cacheProperties, ...coordProps]);
_defineProperty(Line, "ATTRIBUTE_NAMES", SHARED_ATTRIBUTES.concat(coordProps));
classRegistry.setClass(Line);
classRegistry.setSVGClass(Line);

export { Line };
//# sourceMappingURL=Line.mjs.map
