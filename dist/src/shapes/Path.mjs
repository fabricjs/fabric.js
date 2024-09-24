import { defineProperty as _defineProperty, objectWithoutProperties as _objectWithoutProperties, objectSpread2 as _objectSpread2 } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { config } from '../config.mjs';
import { SHARED_ATTRIBUTES } from '../parser/attributes.mjs';
import { parseAttributes } from '../parser/parseAttributes.mjs';
import { Point } from '../Point.mjs';
import { makeBoundingBoxFromPoints } from '../util/misc/boundingBoxFromPoints.mjs';
import { toFixed } from '../util/misc/toFixed.mjs';
import { makePathSimpler, parsePath, joinPath, getBoundsOfCurve } from '../util/path/index.mjs';
import { classRegistry } from '../ClassRegistry.mjs';
import { FabricObject } from './Object/FabricObject.mjs';
import { LEFT, TOP, CENTER } from '../constants.mjs';
import { cacheProperties } from './Object/defaultValues.mjs';

const _excluded = ["path", "left", "top"],
  _excluded2 = ["d"];
class Path extends FabricObject {
  /**
   * Constructor
   * @param {TComplexPathData} path Path data (sequence of coordinates and corresponding "command" tokens)
   * @param {Partial<PathProps>} [options] Options object
   * @return {Path} thisArg
   */
  constructor(path) {
    let _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      {
        path: _,
        left,
        top
      } = _ref,
      options = _objectWithoutProperties(_ref, _excluded);
    super();
    Object.assign(this, Path.ownDefaults);
    this.setOptions(options);
    this._setPath(path || [], true);
    typeof left === 'number' && this.set(LEFT, left);
    typeof top === 'number' && this.set(TOP, top);
  }

  /**
   * @private
   * @param {TComplexPathData | string} path Path data (sequence of coordinates and corresponding "command" tokens)
   * @param {boolean} [adjustPosition] pass true to reposition the object according to the bounding box
   * @returns {Point} top left position of the bounding box, useful for complementary positioning
   */
  _setPath(path, adjustPosition) {
    this.path = makePathSimpler(Array.isArray(path) ? path : parsePath(path));
    this.setBoundingBox(adjustPosition);
  }

  /**
   * This function is an helper for svg import. it returns the center of the object in the svg
   * untransformed coordinates, by look at the polyline/polygon points.
   * @private
   * @return {Point} center point from element coordinates
   */
  _findCenterFromElement() {
    const bbox = this._calcBoundsFromPath();
    return new Point(bbox.left + bbox.width / 2, bbox.top + bbox.height / 2);
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx context to render path on
   */
  _renderPathCommands(ctx) {
    const l = -this.pathOffset.x,
      t = -this.pathOffset.y;
    ctx.beginPath();
    for (const command of this.path) {
      switch (command[0] // first letter
      ) {
        case 'L':
          // lineto, absolute
          ctx.lineTo(command[1] + l, command[2] + t);
          break;
        case 'M':
          // moveTo, absolute
          ctx.moveTo(command[1] + l, command[2] + t);
          break;
        case 'C':
          // bezierCurveTo, absolute
          ctx.bezierCurveTo(command[1] + l, command[2] + t, command[3] + l, command[4] + t, command[5] + l, command[6] + t);
          break;
        case 'Q':
          // quadraticCurveTo, absolute
          ctx.quadraticCurveTo(command[1] + l, command[2] + t, command[3] + l, command[4] + t);
          break;
        case 'Z':
          ctx.closePath();
          break;
      }
    }
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx context to render path on
   */
  _render(ctx) {
    this._renderPathCommands(ctx);
    this._renderPaintInOrder(ctx);
  }

  /**
   * Returns string representation of an instance
   * @return {string} string representation of an instance
   */
  toString() {
    return "#<Path (".concat(this.complexity(), "): { \"top\": ").concat(this.top, ", \"left\": ").concat(this.left, " }>");
  }

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject() {
    let propertiesToInclude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return _objectSpread2(_objectSpread2({}, super.toObject(propertiesToInclude)), {}, {
      path: this.path.map(pathCmd => pathCmd.slice())
    });
  }

  /**
   * Returns dataless object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toDatalessObject() {
    let propertiesToInclude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    const o = this.toObject(propertiesToInclude);
    if (this.sourcePath) {
      delete o.path;
      o.sourcePath = this.sourcePath;
    }
    return o;
  }

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const path = joinPath(this.path, config.NUM_FRACTION_DIGITS);
    return ['<path ', 'COMMON_PARTS', "d=\"".concat(path, "\" stroke-linecap=\"round\" />\n")];
  }

  /**
   * @private
   * @return the path command's translate transform attribute
   */
  _getOffsetTransform() {
    const digits = config.NUM_FRACTION_DIGITS;
    return " translate(".concat(toFixed(-this.pathOffset.x, digits), ", ").concat(toFixed(-this.pathOffset.y, digits), ")");
  }

  /**
   * Returns svg clipPath representation of an instance
   * @param {Function} [reviver] Method for further parsing of svg representation.
   * @return {string} svg representation of an instance
   */
  toClipPathSVG(reviver) {
    const additionalTransform = this._getOffsetTransform();
    return '\t' + this._createBaseClipPathSVGMarkup(this._toSVG(), {
      reviver,
      additionalTransform: additionalTransform
    });
  }

  /**
   * Returns svg representation of an instance
   * @param {Function} [reviver] Method for further parsing of svg representation.
   * @return {string} svg representation of an instance
   */
  toSVG(reviver) {
    const additionalTransform = this._getOffsetTransform();
    return this._createBaseSVGMarkup(this._toSVG(), {
      reviver,
      additionalTransform: additionalTransform
    });
  }

  /**
   * Returns number representation of an instance complexity
   * @return {number} complexity of this instance
   */
  complexity() {
    return this.path.length;
  }
  setDimensions() {
    this.setBoundingBox();
  }
  setBoundingBox(adjustPosition) {
    const {
      width,
      height,
      pathOffset
    } = this._calcDimensions();
    this.set({
      width,
      height,
      pathOffset
    });
    // using pathOffset because it match the use case.
    // if pathOffset change here we need to use left + width/2 , top + height/2
    adjustPosition && this.setPositionByOrigin(pathOffset, CENTER, CENTER);
  }
  _calcBoundsFromPath() {
    const bounds = [];
    let subpathStartX = 0,
      subpathStartY = 0,
      x = 0,
      // current x
      y = 0; // current y

    for (const command of this.path) {
      // current instruction
      switch (command[0] // first letter
      ) {
        case 'L':
          // lineto, absolute
          x = command[1];
          y = command[2];
          bounds.push({
            x: subpathStartX,
            y: subpathStartY
          }, {
            x,
            y
          });
          break;
        case 'M':
          // moveTo, absolute
          x = command[1];
          y = command[2];
          subpathStartX = x;
          subpathStartY = y;
          break;
        case 'C':
          // bezierCurveTo, absolute
          bounds.push(...getBoundsOfCurve(x, y, command[1], command[2], command[3], command[4], command[5], command[6]));
          x = command[5];
          y = command[6];
          break;
        case 'Q':
          // quadraticCurveTo, absolute
          bounds.push(...getBoundsOfCurve(x, y, command[1], command[2], command[1], command[2], command[3], command[4]));
          x = command[3];
          y = command[4];
          break;
        case 'Z':
          x = subpathStartX;
          y = subpathStartY;
          break;
      }
    }
    return makeBoundingBoxFromPoints(bounds);
  }

  /**
   * @private
   */
  _calcDimensions() {
    const bbox = this._calcBoundsFromPath();
    return _objectSpread2(_objectSpread2({}, bbox), {}, {
      pathOffset: new Point(bbox.left + bbox.width / 2, bbox.top + bbox.height / 2)
    });
  }

  /**
   * List of attribute names to account for when parsing SVG element (used by `Path.fromElement`)
   * @static
   * @memberOf Path
   * @see http://www.w3.org/TR/SVG/paths.html#PathElement
   */

  /**
   * Creates an instance of Path from an object
   * @static
   * @memberOf Path
   * @param {Object} object
   * @returns {Promise<Path>}
   */
  static fromObject(object) {
    return this._fromObject(object, {
      extraParam: 'path'
    });
  }

  /**
   * Creates an instance of Path from an SVG <path> element
   * @static
   * @memberOf Path
   * @param {HTMLElement} element to parse
   * @param {Partial<PathProps>} [options] Options object
   */
  static async fromElement(element, options, cssRules) {
    const _parseAttributes = parseAttributes(element, this.ATTRIBUTE_NAMES, cssRules),
      {
        d
      } = _parseAttributes,
      parsedAttributes = _objectWithoutProperties(_parseAttributes, _excluded2);
    return new this(d, _objectSpread2(_objectSpread2(_objectSpread2({}, parsedAttributes), options), {}, {
      // we pass undefined to instruct the constructor to position the object using the bbox
      left: undefined,
      top: undefined
    }));
  }
}
/**
 * Array of path points
 * @type Array
 * @default
 */
_defineProperty(Path, "type", 'Path');
_defineProperty(Path, "cacheProperties", [...cacheProperties, 'path', 'fillRule']);
_defineProperty(Path, "ATTRIBUTE_NAMES", [...SHARED_ATTRIBUTES, 'd']);
classRegistry.setClass(Path);
classRegistry.setSVGClass(Path);

/* _FROM_SVG_START_ */

export { Path };
//# sourceMappingURL=Path.mjs.map
