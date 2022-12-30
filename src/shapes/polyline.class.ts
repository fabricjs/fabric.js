import { fabric } from '../../HEADER';
import { config } from '../config';
import { SHARED_ATTRIBUTES } from '../parser/attributes';
import { parseAttributes } from '../parser/parseAttributes';
import { parsePointsAttribute } from '../parser/parsePointsAttribute';
import { IPoint, Point } from '../point.class';
import { TClassProperties } from '../typedefs';
import { classRegistry } from '../util/class_registry';
import { makeBoundingBoxFromPoints } from '../util/misc/boundingBoxFromPoints';
import { calcDimensionsMatrix, transformPoint } from '../util/misc/matrix';
import { projectStrokeOnPoints } from '../util/misc/projectStroke';
import { TProjectStrokeOnPointsOptions } from '../util/misc/projectStroke/types';
import { degreesToRadians } from '../util/misc/radiansDegreesConversion';
import { toFixed } from '../util/misc/toFixed';
import { FabricObject, fabricObjectDefaultValues } from './Object/FabricObject';

const strokeProjectionOptions: (keyof TProjectStrokeOnPointsOptions)[] = [
  'scaleX',
  'scaleY',
  'skewX',
  'skewY',
  'strokeLineCap',
  'strokeLineJoin',
  'strokeMiterLimit',
  'strokeUniform',
  'strokeWidth',
];

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

  strokeDiff: Point;

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

  private _projectStrokeOnPoints(options: TProjectStrokeOnPointsOptions) {
    return projectStrokeOnPoints(this.points, options, this.isOpen());
  }

  /**
   * Calculate the polygon bounding box
   * @private
   */
  _calcDimensions(options?: Partial<TProjectStrokeOnPointsOptions>) {
    options = {
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      skewX: this.skewX,
      skewY: this.skewY,
      strokeLineCap: this.strokeLineCap,
      strokeLineJoin: this.strokeLineJoin,
      strokeMiterLimit: this.strokeMiterLimit,
      strokeUniform: this.strokeUniform,
      strokeWidth: this.strokeWidth,
      ...(options || {}),
    };
    const points = this.exactBoundingBox
      ? this._projectStrokeOnPoints(
          options as TProjectStrokeOnPointsOptions
        ).map((projection) => projection.projectedPoint)
      : this.points;
    if (points.length === 0) {
      return {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        pathOffset: new Point(),
        strokeOffset: new Point(),
        strokeDiff: new Point(),
      };
    }
    const bbox = makeBoundingBoxFromPoints(points),
      // Remove scale effect, since it's applied after
      matrix = calcDimensionsMatrix({ ...options, scaleX: 1, scaleY: 1 }),
      bboxNoStroke = makeBoundingBoxFromPoints(
        this.points.map((p) => transformPoint(p, matrix, true))
      ),
      offsetX = bbox.left + bbox.width / 2,
      offsetY = bbox.top + bbox.height / 2,
      pathOffsetX = offsetX - offsetY * Math.tan(degreesToRadians(this.skewX)),
      pathOffsetY =
        offsetY - pathOffsetX * Math.tan(degreesToRadians(this.skewY)),
      scale = new Point(this.scaleX, this.scaleY),
      // TODO: remove next line
      legacyCorrection =
        !this.fromSVG && !this.exactBoundingBox ? this.strokeWidth / 2 : 0;
    return {
      ...bbox,
      left: bbox.left - legacyCorrection,
      top: bbox.top - legacyCorrection,
      pathOffset: new Point(pathOffsetX, pathOffsetY),
      strokeOffset: new Point(bboxNoStroke.left, bboxNoStroke.top)
        .subtract(new Point(bbox.left, bbox.top))
        .multiply(scale),
      strokeDiff: new Point(bbox.width, bbox.height)
        .subtract(new Point(bboxNoStroke.width, bboxNoStroke.height))
        .multiply(scale),
    };
  }

  setDimensions() {
    this.setBoundingBox();
  }

  setBoundingBox(adjustPosition?: boolean) {
    const { left, top, width, height, pathOffset, strokeOffset, strokeDiff } =
      this._calcDimensions();
    this.set({ width, height, pathOffset, strokeOffset, strokeDiff });
    adjustPosition &&
      this.setPositionByOrigin(new Point(left, top), 'left', 'top');
  }

  /**
   * @override stroke is taken in account in size
   */
  _getNonTransformedDimensions() {
    return this.exactBoundingBox
      ? // TODO: fix this
        new Point(this.width, this.height)
      : super._getNonTransformedDimensions();
  }

  /**
   * @override stroke and skewing are taken into account when projecting stroke on points,
   * therefore we don't want the default calculation to account for skewing as well.
   * Though it is possible to pass `width` and `height` in `options`, doing so is very strange, use with discretion.
   *
   * @private
   */
  _getTransformedDimensions(options: any = {}) {
    if (this.exactBoundingBox) {
      let size: Point;
      if (
        Object.keys(options).some((key) =>
          strokeProjectionOptions.includes(
            key as keyof TProjectStrokeOnPointsOptions
          )
        )
      ) {
        const { width, height } = this._calcDimensions(options);
        size = new Point(options.width ?? width, options.height ?? height);
      } else {
        size = new Point(
          options.width ?? this.width,
          options.height ?? this.height
        );
      }
      return size.multiply(
        new Point(options.scaleX || this.scaleX, options.scaleY || this.scaleY)
      );
    } else {
      return super._getTransformedDimensions(options);
    }
  }

  /**
   * Recalculates dimensions when changing skew and scale
   * @private
   */
  _set(key: string, value: any) {
    const changed = this.initialized && this[key as keyof this] !== value;
    const output = super._set(key, value);
    if (
      this.exactBoundingBox &&
      changed &&
      (((key === 'scaleX' || key === 'scaleY') &&
        this.strokeUniform &&
        this.strokeBBoxAffectingProperties.includes('strokeUniform')) ||
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
