import { fabric } from '../../HEADER';
import { config } from '../config';
import { SHARED_ATTRIBUTES } from '../parser/attributes';
import { parseAttributes } from '../parser/parseAttributes';
import { parsePointsAttribute } from '../parser/parsePointsAttribute';
import { IPoint, Point } from '../point.class';
import { TClassProperties } from '../typedefs';
import { classRegistry } from '../util/class_registry';
import { makeBoundingBoxFromPoints } from '../util/misc/boundingBoxFromPoints';
import { projectStrokeOnPoints } from '../util/misc/projectStroke';
import { degreesToRadians } from '../util/misc/radiansDegreesConversion';
import { toFixed } from '../util/misc/toFixed';
import { FabricObject, fabricObjectDefaultValues } from './Object/FabricObject';

export class Polyline extends FabricObject {
  /**
   * Points array
   * @type Array
   * @default
   */
  points: IPoint[];

  /**
   * WARNING: Feature in progress
   * Calculate the exact bounding box taking in account strokeWidth on acute angles
   * this will be turned to true by default on fabric 6.0
   * maybe will be left in as an optimization since calculations may be slow
   * @deprecated
   * @type Boolean
   * @default false
   * @todo set default to true and remove flag and related logic
   */
  exactBoundingBox: boolean;

  private initialized: true | undefined;

  /**
   * A list of properties that if changed trigger a recalculation of dimensions
   * @todo check if you really need to recalculate for all cases
   */
  strokeBBoxAffectingProperties: (keyof this)[];

  fromSVG: boolean;

  pathOffset: Point;

  strokeOffset: Point;

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
  constructor(points: IPoint[] = [], { left, top, ...options }: any = {}) {
    super({ points, ...options });
    this.initialized = true;
    this.setBoundingBox(true);
    typeof left === 'number' && this.set('left', left);
    typeof top === 'number' && this.set('top', top);
  }

  protected isOpen() {
    return true;
  }

  private _projectStrokeOnPoints() {
    return projectStrokeOnPoints(this.points, this, this.isOpen());
  }

  /**
   * Calculate the polygon bounding box
   * @private
   */
  _calcDimensions() {
    const points = this.exactBoundingBox
      ? this._projectStrokeOnPoints().map(
          (projection) => projection.projectedPoint
        )
      : this.points;
    if (points.length === 0) {
      return {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        pathOffset: new Point(),
        strokeOffset: new Point(),
      };
    }
    const bbox = makeBoundingBoxFromPoints(points);
    const bboxNoStroke = makeBoundingBoxFromPoints(this.points);
    const offsetX = bbox.left + bbox.width / 2,
      offsetY = bbox.top + bbox.height / 2;
    const pathOffsetX =
      offsetX - offsetY * Math.tan(degreesToRadians(this.skewX));
    const pathOffsetY =
      offsetY - pathOffsetX * Math.tan(degreesToRadians(this.skewY));
    // TODO: remove next line
    const legacyCorrection =
      !this.fromSVG && !this.exactBoundingBox ? this.strokeWidth / 2 : 0;
    return {
      ...bbox,
      left: bbox.left - legacyCorrection,
      top: bbox.top - legacyCorrection,
      pathOffset: new Point(pathOffsetX, pathOffsetY),
      strokeOffset: new Point(bboxNoStroke.left, bboxNoStroke.top).subtract(
        new Point(bbox.left, bbox.top)
      ),
    };
  }

  setDimensions() {
    this.setBoundingBox();
  }

  setBoundingBox(adjustPosition?: boolean) {
    const { left, top, width, height, pathOffset, strokeOffset } =
      this._calcDimensions();
    this.set({ width, height, pathOffset, strokeOffset });
    adjustPosition &&
      this.setPositionByOrigin(new Point(left, top), 'left', 'top');
  }

  /**
   * @override stroke is taken in account in size
   */
  _getNonTransformedDimensions() {
    return this.exactBoundingBox
      ? new Point(this.width, this.height)
      : super._getNonTransformedDimensions();
  }

  /**
   * @override stroke and skewing are taken into account when projecting stroke on points,
   * therefore we don't want the default calculation to account for skewing as well
   *
   * @private
   */
  _getTransformedDimensions(options: any) {
    return this.exactBoundingBox
      ? super._getTransformedDimensions({
          ...(options || {}),
          // disable stroke bbox calculations
          strokeWidth: 0,
          // disable skewing bbox calculations
          skewX: 0,
          skewY: 0,
        })
      : super._getTransformedDimensions(options);
  }

  /**
   * Recalculates dimensions when changing skew and scale
   * @private
   */
  _set(key: string, value: any) {
    const changed = this.initialized && this[key as keyof this] !== value;
    const output = super._set(key, value);
    if (
      changed &&
      (((key === 'scaleX' || key === 'scaleY') &&
        this.strokeUniform &&
        this.strokeBBoxAffectingProperties.includes('strokeUniform') &&
        this.strokeLineJoin !== 'round') ||
        this.strokeBBoxAffectingProperties.includes(key as keyof this))
    ) {
      this.setDimensions();
    }
    return output;
  }

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} Object representation of an instance
   */
  toObject(propertiesToInclude?: (keyof this)[]): object {
    return {
      ...super.toObject(propertiesToInclude),
      points: this.points.concat(),
    };
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
      points.push(
        toFixed(this.points[i].x - diffX, NUM_FRACTION_DIGITS),
        ',',
        toFixed(this.points[i].y - diffY, NUM_FRACTION_DIGITS),
        ' '
      );
    }
    return [
      `<${this.type} `,
      'COMMON_PARTS',
      `points="${points.join('')}" />\n`,
    ];
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(ctx: CanvasRenderingContext2D) {
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
  complexity(): number {
    return this.points.length;
  }

  /* _FROM_SVG_START_ */

  /**
   * List of attribute names to account for when parsing SVG element (used by {@link Polyline.fromElement})
   * @static
   * @memberOf Polyline
   * @see: http://www.w3.org/TR/SVG/shapes.html#PolylineElement
   */
  static ATTRIBUTE_NAMES = [...SHARED_ATTRIBUTES];

  /**
   * Returns Polyline instance from an SVG element
   * @static
   * @memberOf Polyline
   * @param {SVGElement} element Element to parser
   * @param {Function} callback callback function invoked after parsing
   * @param {Object} [options] Options object
   */
  static fromElement(
    element: SVGElement,
    callback: (poly: Polyline | null) => any,
    options?: any
  ) {
    if (!element) {
      return callback(null);
    }
    const points = parsePointsAttribute(element.getAttribute('points')),
      // we omit left and top to instruct the constructor to position the object using the bbox
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      { left, top, ...parsedAttributes } = parseAttributes(
        element,
        this.ATTRIBUTE_NAMES
      );
    callback(
      new this(points || [], {
        ...parsedAttributes,
        ...options,
        fromSVG: true,
      })
    );
  }

  /* _FROM_SVG_END_ */

  /**
   * Returns Polyline instance from an object representation
   * @static
   * @memberOf Polyline
   * @param {Object} object Object to create an instance from
   * @returns {Promise<Polyline>}
   */
  static fromObject(object: Record<string, unknown>) {
    return this._fromObject(object, {
      extraParam: 'points',
    });
  }
}

export const polylineDefaultValues: Partial<TClassProperties<Polyline>> = {
  type: 'polyline',
  exactBoundingBox: false,
  cacheProperties: fabricObjectDefaultValues.cacheProperties.concat('points'),
  strokeBBoxAffectingProperties: [
    'skewX',
    'skewY',
    'strokeLineCap',
    'strokeLineJoin',
    'strokeMiterLimit',
    'strokeWidth',
    'strokeUniform',
    'points',
  ],
};

Object.assign(Polyline.prototype, polylineDefaultValues);

classRegistry.setClass(Polyline);
classRegistry.setSVGClass(Polyline);

/** @todo TODO_JS_MIGRATION remove next line after refactoring build */
fabric.Polyline = Polyline;
