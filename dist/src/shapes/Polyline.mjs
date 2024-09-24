import { defineProperty as _defineProperty, objectSpread2 as _objectSpread2, objectWithoutProperties as _objectWithoutProperties } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { config } from '../config.mjs';
import { SHARED_ATTRIBUTES } from '../parser/attributes.mjs';
import { parseAttributes } from '../parser/parseAttributes.mjs';
import { parsePointsAttribute } from '../parser/parsePointsAttribute.mjs';
import { Point } from '../Point.mjs';
import { classRegistry } from '../ClassRegistry.mjs';
import { makeBoundingBoxFromPoints } from '../util/misc/boundingBoxFromPoints.mjs';
import { calcDimensionsMatrix, transformPoint } from '../util/misc/matrix.mjs';
import { projectStrokeOnPoints } from '../util/misc/projectStroke/index.mjs';
import { degreesToRadians } from '../util/misc/radiansDegreesConversion.mjs';
import { toFixed } from '../util/misc/toFixed.mjs';
import { FabricObject } from './Object/FabricObject.mjs';
import { LEFT, TOP, CENTER, SCALE_X, SCALE_Y, SKEW_X, SKEW_Y } from '../constants.mjs';
import { cacheProperties } from './Object/defaultValues.mjs';

const _excluded = ["left", "top"];
const polylineDefaultValues = {
  /**
   * @deprecated transient option soon to be removed in favor of a different design
   */
  exactBoundingBox: false
};
class Polyline extends FabricObject {
  static getDefaults() {
    return _objectSpread2(_objectSpread2({}, super.getDefaults()), Polyline.ownDefaults);
  }

  /**
   * A list of properties that if changed trigger a recalculation of dimensions
   * @todo check if you really need to recalculate for all cases
   */

  /**
   * Constructor
   * @param {Array} points Array of points (where each point is an object with x and y)
   * @param {Object} [options] Options object
   * @return {Polyline} thisArg
   * @example
   * var poly = new Polyline([
   *     { x: 10, y: 10 },
   *     { x: 50, y: 30 },
   *     { x: 40, y: 70 },
   *     { x: 60, y: 50 },
   *     { x: 100, y: 150 },
   *     { x: 40, y: 100 }
   *   ], {
   *   stroke: 'red',
   *   left: 100,
   *   top: 100
   * });
   */
  constructor() {
    let points = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super();
    _defineProperty(this, "strokeDiff", void 0);
    Object.assign(this, Polyline.ownDefaults);
    this.setOptions(options);
    this.points = points;
    const {
      left,
      top
    } = options;
    this.initialized = true;
    this.setBoundingBox(true);
    typeof left === 'number' && this.set(LEFT, left);
    typeof top === 'number' && this.set(TOP, top);
  }
  isOpen() {
    return true;
  }
  _projectStrokeOnPoints(options) {
    return projectStrokeOnPoints(this.points, options, this.isOpen());
  }

  /**
   * Calculate the polygon bounding box
   * @private
   */
  _calcDimensions(options) {
    options = _objectSpread2({
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      skewX: this.skewX,
      skewY: this.skewY,
      strokeLineCap: this.strokeLineCap,
      strokeLineJoin: this.strokeLineJoin,
      strokeMiterLimit: this.strokeMiterLimit,
      strokeUniform: this.strokeUniform,
      strokeWidth: this.strokeWidth
    }, options || {});
    const points = this.exactBoundingBox ? this._projectStrokeOnPoints(options).map(projection => projection.projectedPoint) : this.points;
    if (points.length === 0) {
      return {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        pathOffset: new Point(),
        strokeOffset: new Point(),
        strokeDiff: new Point()
      };
    }
    const bbox = makeBoundingBoxFromPoints(points),
      // Remove scale effect, since it's applied after
      matrix = calcDimensionsMatrix(_objectSpread2(_objectSpread2({}, options), {}, {
        scaleX: 1,
        scaleY: 1
      })),
      bboxNoStroke = makeBoundingBoxFromPoints(this.points.map(p => transformPoint(p, matrix, true))),
      scale = new Point(this.scaleX, this.scaleY);
    let offsetX = bbox.left + bbox.width / 2,
      offsetY = bbox.top + bbox.height / 2;
    if (this.exactBoundingBox) {
      offsetX = offsetX - offsetY * Math.tan(degreesToRadians(this.skewX));
      // Order of those assignments is important.
      // offsetY relies on offsetX being already changed by the line above
      offsetY = offsetY - offsetX * Math.tan(degreesToRadians(this.skewY));
    }
    return _objectSpread2(_objectSpread2({}, bbox), {}, {
      pathOffset: new Point(offsetX, offsetY),
      strokeOffset: new Point(bboxNoStroke.left, bboxNoStroke.top).subtract(new Point(bbox.left, bbox.top)).multiply(scale),
      strokeDiff: new Point(bbox.width, bbox.height).subtract(new Point(bboxNoStroke.width, bboxNoStroke.height)).multiply(scale)
    });
  }

  /**
   * This function is an helper for svg import. it returns the center of the object in the svg
   * untransformed coordinates, by look at the polyline/polygon points.
   * @private
   * @return {Point} center point from element coordinates
   */
  _findCenterFromElement() {
    const bbox = makeBoundingBoxFromPoints(this.points);
    return new Point(bbox.left + bbox.width / 2, bbox.top + bbox.height / 2);
  }
  setDimensions() {
    this.setBoundingBox();
  }
  setBoundingBox(adjustPosition) {
    const {
      left,
      top,
      width,
      height,
      pathOffset,
      strokeOffset,
      strokeDiff
    } = this._calcDimensions();
    this.set({
      width,
      height,
      pathOffset,
      strokeOffset,
      strokeDiff
    });
    adjustPosition && this.setPositionByOrigin(new Point(left + width / 2, top + height / 2), CENTER, CENTER);
  }

  /**
   * @deprecated intermidiate method to be removed, do not use
   */
  isStrokeAccountedForInDimensions() {
    return this.exactBoundingBox;
  }

  /**
   * @override stroke is taken in account in size
   */
  _getNonTransformedDimensions() {
    return this.exactBoundingBox ?
    // TODO: fix this
    new Point(this.width, this.height) : super._getNonTransformedDimensions();
  }

  /**
   * @override stroke and skewing are taken into account when projecting stroke on points,
   * therefore we don't want the default calculation to account for skewing as well.
   * Though it is possible to pass `width` and `height` in `options`, doing so is very strange, use with discretion.
   *
   * @private
   */
  _getTransformedDimensions() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (this.exactBoundingBox) {
      let size;
      /* When `strokeUniform = true`, any changes to the properties require recalculating the `width` and `height` because
        the stroke projections are affected.
        When `strokeUniform = false`, we don't need to recalculate for scale transformations, as the effect of scale on
        projections follows a linear function (e.g. scaleX of 2 just multiply width by 2)*/
      if (Object.keys(options).some(key => this.strokeUniform || this.constructor.layoutProperties.includes(key))) {
        var _options$width, _options$height;
        const {
          width,
          height
        } = this._calcDimensions(options);
        size = new Point((_options$width = options.width) !== null && _options$width !== void 0 ? _options$width : width, (_options$height = options.height) !== null && _options$height !== void 0 ? _options$height : height);
      } else {
        var _options$width2, _options$height2;
        size = new Point((_options$width2 = options.width) !== null && _options$width2 !== void 0 ? _options$width2 : this.width, (_options$height2 = options.height) !== null && _options$height2 !== void 0 ? _options$height2 : this.height);
      }
      return size.multiply(new Point(options.scaleX || this.scaleX, options.scaleY || this.scaleY));
    } else {
      return super._getTransformedDimensions(options);
    }
  }

  /**
   * Recalculates dimensions when changing skew and scale
   * @private
   */
  _set(key, value) {
    const changed = this.initialized && this[key] !== value;
    const output = super._set(key, value);
    if (this.exactBoundingBox && changed && ((key === SCALE_X || key === SCALE_Y) && this.strokeUniform && this.constructor.layoutProperties.includes('strokeUniform') || this.constructor.layoutProperties.includes(key))) {
      this.setDimensions();
    }
    return output;
  }

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} Object representation of an instance
   */
  toObject() {
    let propertiesToInclude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return _objectSpread2(_objectSpread2({}, super.toObject(propertiesToInclude)), {}, {
      points: this.points.map(_ref => {
        let {
          x,
          y
        } = _ref;
        return {
          x,
          y
        };
      })
    });
  }

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const points = [],
      diffX = this.pathOffset.x,
      diffY = this.pathOffset.y,
      NUM_FRACTION_DIGITS = config.NUM_FRACTION_DIGITS;
    for (let i = 0, len = this.points.length; i < len; i++) {
      points.push(toFixed(this.points[i].x - diffX, NUM_FRACTION_DIGITS), ',', toFixed(this.points[i].y - diffY, NUM_FRACTION_DIGITS), ' ');
    }
    return ["<".concat(this.constructor.type.toLowerCase(), " "), 'COMMON_PARTS', "points=\"".concat(points.join(''), "\" />\n")];
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(ctx) {
    const len = this.points.length,
      x = this.pathOffset.x,
      y = this.pathOffset.y;
    if (!len || isNaN(this.points[len - 1].y)) {
      // do not draw if no points or odd points
      // NaN comes from parseFloat of a empty string in parser
      return;
    }
    ctx.beginPath();
    ctx.moveTo(this.points[0].x - x, this.points[0].y - y);
    for (let i = 0; i < len; i++) {
      const point = this.points[i];
      ctx.lineTo(point.x - x, point.y - y);
    }
    !this.isOpen() && ctx.closePath();
    this._renderPaintInOrder(ctx);
  }

  /**
   * Returns complexity of an instance
   * @return {Number} complexity of this instance
   */
  complexity() {
    return this.points.length;
  }

  /* _FROM_SVG_START_ */

  /**
   * List of attribute names to account for when parsing SVG element (used by {@link Polyline.fromElement})
   * @static
   * @memberOf Polyline
   * @see: http://www.w3.org/TR/SVG/shapes.html#PolylineElement
   */

  /**
   * Returns Polyline instance from an SVG element
   * @static
   * @memberOf Polyline
   * @param {HTMLElement} element Element to parser
   * @param {Object} [options] Options object
   */
  static async fromElement(element, options, cssRules) {
    const points = parsePointsAttribute(element.getAttribute('points')),
      _parseAttributes = parseAttributes(element, this.ATTRIBUTE_NAMES, cssRules),
      parsedAttributes = _objectWithoutProperties(_parseAttributes, _excluded);
    return new this(points, _objectSpread2(_objectSpread2({}, parsedAttributes), options));
  }

  /* _FROM_SVG_END_ */

  /**
   * Returns Polyline instance from an object representation
   * @static
   * @memberOf Polyline
   * @param {Object} object Object to create an instance from
   * @returns {Promise<Polyline>}
   */
  static fromObject(object) {
    return this._fromObject(object, {
      extraParam: 'points'
    });
  }
}
/**
 * Points array
 * @type Array
 * @default
 */
/**
 * WARNING: Feature in progress
 * Calculate the exact bounding box taking in account strokeWidth on acute angles
 * this will be turned to true by default on fabric 6.0
 * maybe will be left in as an optimization since calculations may be slow
 * @deprecated transient option soon to be removed in favor of a different design
 * @type Boolean
 * @default false
 */
_defineProperty(Polyline, "ownDefaults", polylineDefaultValues);
_defineProperty(Polyline, "type", 'Polyline');
_defineProperty(Polyline, "layoutProperties", [SKEW_X, SKEW_Y, 'strokeLineCap', 'strokeLineJoin', 'strokeMiterLimit', 'strokeWidth', 'strokeUniform', 'points']);
_defineProperty(Polyline, "cacheProperties", [...cacheProperties, 'points']);
_defineProperty(Polyline, "ATTRIBUTE_NAMES", [...SHARED_ATTRIBUTES]);
classRegistry.setClass(Polyline);
classRegistry.setSVGClass(Polyline);

export { Polyline, polylineDefaultValues };
//# sourceMappingURL=Polyline.mjs.map
