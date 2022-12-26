// @ts-nocheck

import { fabric } from '../../HEADER';
import { SHARED_ATTRIBUTES } from '../parser/attributes';
import { parseAttributes } from '../parser/parseAttributes';
import { TClassProperties } from '../typedefs';
import { clone } from '../util/lang_object';
import { FabricObject, fabricObjectDefaultValues } from './Object/FabricObject';

const coordProps = { x1: 1, x2: 1, y1: 1, y2: 1 };

export class Line extends FabricObject {
  /**
   * x value or first line edge
   * @type Number
   * @default
   */
  x1: number;

  /**
   * y value or first line edge
   * @type Number
   * @default
   */
  y1: number;

  /**
   * x value or second line edge
   * @type Number
   * @default
   */
  x2: number;

  /**
   * y value or second line edge
   * @type Number
   * @default
   */
  y2: number;

  /**
   * Constructor
   * @param {Array} [points] Array of points
   * @param {Object} [options] Options object
   * @return {Line} thisArg
   */
  constructor(points, options) {
    if (!points) {
      points = [0, 0, 0, 0];
    }

    super(options);

    this.set('x1', points[0]);
    this.set('y1', points[1]);
    this.set('x2', points[2]);
    this.set('y2', points[3]);

    this._setWidthHeight(options);
  }

  /**
   * @private
   * @param {Object} [options] Options
   */
  _setWidthHeight(options) {
    options || (options = {});

    this.width = Math.abs(this.x2 - this.x1);
    this.height = Math.abs(this.y2 - this.y1);

    this.left = 'left' in options ? options.left : this._getLeftToOriginX();

    this.top = 'top' in options ? options.top : this._getTopToOriginY();
  }

  /**
   * @private
   * @param {String} key
   * @param {*} value
   */
  _set(key, value) {
    super._set(key, value);
    if (typeof coordProps[key] !== 'undefined') {
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
    ctx.strokeStyle = this.stroke || ctx.fillStyle;
    this.stroke && this._renderStroke(ctx);
    ctx.strokeStyle = origStrokeStyle;
  }

  /**
   * This function is an helper for svg import. it returns the center of the object in the svg
   * untransformed coordinates
   * @private
   * @return {Object} center point from element coordinates
   */
  _findCenterFromElement() {
    return {
      x: (this.x1 + this.x2) / 2,
      y: (this.y1 + this.y2) / 2,
    };
  }

  /**
   * Returns object representation of an instance
   * @method toObject
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject(propertiesToInclude) {
    return { ...super.toObject(propertiesToInclude), ...this.calcLinePoints() };
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
   * @private
   */
  calcLinePoints() {
    const xMult = this.x1 <= this.x2 ? -1 : 1,
      yMult = this.y1 <= this.y2 ? -1 : 1,
      x1 = xMult * this.width * 0.5,
      y1 = yMult * this.height * 0.5,
      x2 = xMult * this.width * -0.5,
      y2 = yMult * this.height * -0.5;

    return {
      x1: x1,
      x2: x2,
      y1: y1,
      y2: y2,
    };
  }

  private makeEdgeToOriginGetter(propertyNames, originValues) {
    const origin = propertyNames.origin,
      axis1 = propertyNames.axis1,
      axis2 = propertyNames.axis2,
      dimension = propertyNames.dimension,
      nearest = originValues.nearest,
      center = originValues.center,
      farthest = originValues.farthest;

    switch (this.get(origin)) {
      case nearest:
        return Math.min(this.get(axis1), this.get(axis2));
      case center:
        return (
          Math.min(this.get(axis1), this.get(axis2)) + 0.5 * this.get(dimension)
        );
      case farthest:
        return Math.max(this.get(axis1), this.get(axis2));
    }
  }

  /**
   * @private
   * @return {Number} leftToOriginX Distance from left edge of canvas to originX of Line.
   */
  _getLeftToOriginX() {
    return this.makeEdgeToOriginGetter(
      {
        // property names
        origin: 'originX',
        axis1: 'x1',
        axis2: 'x2',
        dimension: 'width',
      },
      {
        // possible values of origin
        nearest: 'left',
        center: 'center',
        farthest: 'right',
      }
    );
  }

  /**
   * @private
   * @return {Number} leftToOriginX Distance from left edge of canvas to originX of Line.
   */
  _getTopToOriginY() {
    return this.makeEdgeToOriginGetter(
      {
        // property names
        origin: 'originY',
        axis1: 'y1',
        axis2: 'y2',
        dimension: 'height',
      },
      {
        // possible values of origin
        nearest: 'top',
        center: 'center',
        farthest: 'bottom',
      }
    );
  }

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const p = this.calcLinePoints();
    return [
      '<line ',
      'COMMON_PARTS',
      'x1="',
      p.x1,
      '" y1="',
      p.y1,
      '" x2="',
      p.x2,
      '" y2="',
      p.y2,
      '" />\n',
    ];
  }

  /* _FROM_SVG_START_ */

  /**
   * List of attribute names to account for when parsing SVG element (used by {@link Line.fromElement})
   * @static
   * @memberOf Line
   * @see http://www.w3.org/TR/SVG/shapes.html#LineElement
   */
  static ATTRIBUTE_NAMES = SHARED_ATTRIBUTES.concat('x1 y1 x2 y2'.split(' '));

  /**
   * Returns Line instance from an SVG element
   * @static
   * @memberOf Line
   * @param {SVGElement} element Element to parse
   * @param {Object} [options] Options object
   * @param {Function} [callback] callback function invoked after parsing
   */
  static fromElement(element, callback, options) {
    options = options || {};
    const parsedAttributes = parseAttributes(element, this.ATTRIBUTE_NAMES),
      points = [
        parsedAttributes.x1 || 0,
        parsedAttributes.y1 || 0,
        parsedAttributes.x2 || 0,
        parsedAttributes.y2 || 0,
      ];
    callback(new this(points, { ...parsedAttributes, ...options }));
  }

  /* _FROM_SVG_END_ */

  /**
   * Returns Line instance from an object representation
   * @static
   * @memberOf Line
   * @param {Object} object Object to create an instance from
   * @returns {Promise<Line>}
   */
  static fromObject(object) {
    const options = clone(object, true);
    options.points = [object.x1, object.y1, object.x2, object.y2];
    return this._fromObject(options, {
      extraParam: 'points',
    }).then((fabricLine) => {
      delete fabricLine.points;
      return fabricLine;
    });
  }
}

export const lineDefaultValues: Partial<TClassProperties<Line>> = {
  type: 'line',
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  cacheProperties: fabricObjectDefaultValues.cacheProperties.concat(
    'x1',
    'x2',
    'y1',
    'y2'
  ),
};

Object.assign(Line.prototype, lineDefaultValues);
/** @todo TODO_JS_MIGRATION remove next line after refactoring build */
fabric.Line = Line;
