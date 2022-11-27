//@ts-nocheck

import { fabric } from '../../HEADER';
import { config } from '../config';
import { SHARED_ATTRIBUTES } from '../parser/attributes';
import { parseAttributes } from '../parser/parseAttributes';
import { Point } from '../point.class';
import { PathData, TClassProperties } from '../typedefs';
import { makeBoundingBoxFromPoints } from '../util/misc/boundingBoxFromPoints';
import { toFixed } from '../util/misc/toFixed';
import {
  getBoundsOfCurve,
  joinPath,
  makePathSimpler,
  parsePath,
} from '../util/path';
import { FabricObject, fabricObjectDefaultValues } from './fabricObject.class';

export class Path extends FabricObject {
  /**
   * Array of path points
   * @type Array
   * @default
   */
  path: PathData;

  pathOffset: Point;

  fromSVG?: boolean;

  sourcePath?: string;

  /**
   * Constructor
   * @param {Array|String} path Path data (sequence of coordinates and corresponding "command" tokens)
   * @param {Object} [options] Options object
   * @return {Path} thisArg
   */
  constructor(
    path: PathData | string,
    { path: _, left, top, ...options }: any = {}
  ) {
    super(options);

    const pathTL = this._setPath(path || []);
    const origin = this.translateToGivenOrigin(
      new Point(left ?? pathTL.x, top ?? pathTL.y),
      typeof left === 'number' ? this.originX : 'left',
      typeof top === 'number' ? this.originY : 'top',
      this.originX,
      this.originY
    );
    this.setPositionByOrigin(origin, this.originX, this.originY);
  }

  /**
   * @private
   * @param {PathData | string} path Path data (sequence of coordinates and corresponding "command" tokens)
   * @param {boolean} [adjustPosition] pass true to reposition the object according to the bounding box
   * @returns {Point} top left position of the bounding box, useful for complementary positioning
   */
  _setPath(path: PathData | string, adjustPosition?: boolean) {
    this.path = makePathSimpler(Array.isArray(path) ? path : parsePath(path));
    return this.setDimensions();
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx context to render path on
   */
  _renderPathCommands(ctx: CanvasRenderingContext2D) {
    let current, // current instruction
      subpathStartX = 0,
      subpathStartY = 0,
      x = 0, // current x
      y = 0, // current y
      controlX = 0, // current control point x
      controlY = 0; // current control point y
    const l = -this.pathOffset.x,
      t = -this.pathOffset.y;

    ctx.beginPath();

    for (let i = 0, len = this.path.length; i < len; ++i) {
      current = this.path[i];

      switch (
        current[0] // first letter
      ) {
        case 'L': // lineto, absolute
          x = current[1];
          y = current[2];
          ctx.lineTo(x + l, y + t);
          break;

        case 'M': // moveTo, absolute
          x = current[1];
          y = current[2];
          subpathStartX = x;
          subpathStartY = y;
          ctx.moveTo(x + l, y + t);
          break;

        case 'C': // bezierCurveTo, absolute
          x = current[5];
          y = current[6];
          controlX = current[3];
          controlY = current[4];
          ctx.bezierCurveTo(
            current[1] + l,
            current[2] + t,
            controlX + l,
            controlY + t,
            x + l,
            y + t
          );
          break;

        case 'Q': // quadraticCurveTo, absolute
          ctx.quadraticCurveTo(
            current[1] + l,
            current[2] + t,
            current[3] + l,
            current[4] + t
          );
          x = current[3];
          y = current[4];
          controlX = current[1];
          controlY = current[2];
          break;

        case 'z':
        case 'Z':
          x = subpathStartX;
          y = subpathStartY;
          ctx.closePath();
          break;
      }
    }
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx context to render path on
   */
  _render(ctx: CanvasRenderingContext2D) {
    this._renderPathCommands(ctx);
    this._renderPaintInOrder(ctx);
  }

  /**
   * Returns string representation of an instance
   * @return {String} string representation of an instance
   */
  toString() {
    return `#<Path (${this.complexity()}): { "top": ${this.top}, "left": ${
      this.left
    } }>`;
  }

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject(propertiesToInclude: (keyof this)[] = []) {
    return {
      ...super.toObject(propertiesToInclude),
      path: this.path.map((item) => {
        return item.slice();
      }),
    };
  }

  /**
   * Returns dataless object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toDatalessObject(propertiesToInclude: (keyof this)[] = []) {
    const o = this.toObject(['sourcePath', ...propertiesToInclude]);
    if (o.sourcePath) {
      delete o.path;
    }
    return o;
  }

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const path = joinPath(this.path);
    return [
      '<path ',
      'COMMON_PARTS',
      `d="${path}" stroke-linecap="round" />\n`,
    ];
  }

  _getOffsetTransform() {
    const digits = config.NUM_FRACTION_DIGITS;
    return ` translate(${toFixed(-this.pathOffset.x, digits)}, ${toFixed(
      -this.pathOffset.y,
      digits
    )})`;
  }

  /**
   * Returns svg clipPath representation of an instance
   * @param {Function} [reviver] Method for further parsing of svg representation.
   * @return {String} svg representation of an instance
   */
  toClipPathSVG(reviver) {
    const additionalTransform = this._getOffsetTransform();
    return (
      '\t' +
      this._createBaseClipPathSVGMarkup(this._toSVG(), {
        reviver: reviver,
        additionalTransform: additionalTransform,
      })
    );
  }

  /**
   * Returns svg representation of an instance
   * @param {Function} [reviver] Method for further parsing of svg representation.
   * @return {String} svg representation of an instance
   */
  toSVG(reviver) {
    const additionalTransform = this._getOffsetTransform();
    return this._createBaseSVGMarkup(this._toSVG(), {
      reviver: reviver,
      additionalTransform: additionalTransform,
    });
  }

  /**
   * Returns number representation of an instance complexity
   * @return {Number} complexity of this instance
   */
  complexity() {
    return this.path.length;
  }

  setDimensions() {
    const { left, top, width, height, pathOffset } = this._calcDimensions();
    this.set({ width, height, pathOffset });
    return new Point(left, top);
  }

  /**
   * @private
   */
  _calcDimensions() {
    const bounds: Point[] = [];
    let subpathStartX = 0,
      subpathStartY = 0,
      x = 0, // current x
      y = 0; // current y

    for (let i = 0; i < this.path.length; ++i) {
      const current = this.path[i]; // current instruction
      switch (
        current[0] // first letter
      ) {
        case 'L': // lineto, absolute
          x = current[1];
          y = current[2];
          bounds.push(new Point(subpathStartX, subpathStartY), new Point(x, y));
          break;

        case 'M': // moveTo, absolute
          x = current[1];
          y = current[2];
          subpathStartX = x;
          subpathStartY = y;
          break;

        case 'C': // bezierCurveTo, absolute
          bounds.push(
            ...getBoundsOfCurve(
              x,
              y,
              current[1],
              current[2],
              current[3],
              current[4],
              current[5],
              current[6]
            )
          );
          x = current[5];
          y = current[6];
          break;

        case 'Q': // quadraticCurveTo, absolute
          bounds.push(
            ...getBoundsOfCurve(
              x,
              y,
              current[1],
              current[2],
              current[1],
              current[2],
              current[3],
              current[4]
            )
          );
          x = current[3];
          y = current[4];
          break;

        case 'z':
        case 'Z':
          x = subpathStartX;
          y = subpathStartY;
          break;
      }
    }

    const bbox = makeBoundingBoxFromPoints(bounds);
    const strokeCorrection = this.fromSVG ? 0 : this.strokeWidth / 2;

    return {
      ...bbox,
      left: bbox.left - strokeCorrection,
      top: bbox.top - strokeCorrection,
      pathOffset: new Point(
        bbox.left + bbox.width / 2,
        bbox.top + bbox.height / 2
      ),
    };
  }

  /**
   * List of attribute names to account for when parsing SVG element (used by `Path.fromElement`)
   * @static
   * @memberOf Path
   * @see http://www.w3.org/TR/SVG/paths.html#PathElement
   */
  static ATTRIBUTE_NAMES = [...SHARED_ATTRIBUTES, 'd'];

  /**
   * Creates an instance of Path from an object
   * @static
   * @memberOf Path
   * @param {Object} object
   * @returns {Promise<Path>}
   */
  static fromObject(object) {
    return FabricObject._fromObject(Path, object, {
      extraParam: 'path',
    });
  }

  /**
   * Creates an instance of Path from an SVG <path> element
   * @static
   * @memberOf Path
   * @param {SVGElement} element to parse
   * @param {Function} callback Callback to invoke when an Path instance is created
   * @param {Object} [options] Options object
   * @param {Function} [callback] Options callback invoked after parsing is finished
   */
  static fromElement(element, callback, options) {
    const parsedAttributes = parseAttributes(element, Path.ATTRIBUTE_NAMES);
    callback(
      new Path(parsedAttributes.d, {
        ...parsedAttributes,
        ...options,
        // we pass undefined to instruct the constructor to position the object using the bbox
        left: undefined,
        top: undefined,
        fromSVG: true,
      })
    );
  }
}

export const pathDefaultValues: Partial<TClassProperties<Path>> = {
  type: 'path',
  path: null,
  cacheProperties: fabricObjectDefaultValues.cacheProperties.concat(
    'path',
    'fillRule'
  ),
  stateProperties: fabricObjectDefaultValues.stateProperties.concat('path'),
};

Object.assign(Path.prototype, pathDefaultValues);
/** @todo TODO_JS_MIGRATION remove next line after refactoring build */
fabric.Path = Path;

/* _FROM_SVG_START_ */
