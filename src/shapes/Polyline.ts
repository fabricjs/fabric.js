import { config } from '../config';
import { SHARED_ATTRIBUTES } from '../parser/attributes';
import { parseAttributes } from '../parser/parseAttributes';
import { parsePointsAttribute } from '../parser/parsePointsAttribute';
import type { XY } from '../Point';
import { Point } from '../Point';
import type { Abortable, TClassProperties, TOptions } from '../typedefs';
import { classRegistry } from '../ClassRegistry';
import { makeBoundingBoxFromPoints } from '../util/misc/boundingBoxFromPoints';
import { calcDimensionsMatrix, transformPoint } from '../util/misc/matrix';
import { projectStrokeOnPoints } from '../util/misc/projectStroke';
import type { TProjectStrokeOnPointsOptions } from '../util/misc/projectStroke/types';
import { degreesToRadians } from '../util/misc/radiansDegreesConversion';
import { toFixed } from '../util/misc/toFixed';
import { FabricObject, cacheProperties } from './Object/FabricObject';
import type { FabricObjectProps, SerializedObjectProps } from './Object/types';
import type { ObjectEvents } from '../EventTypeDefs';
import {
  CENTER,
  LEFT,
  SCALE_X,
  SCALE_Y,
  SKEW_X,
  SKEW_Y,
  TOP,
} from '../constants';
import type { CSSRules } from '../parser/typedefs';

export const polylineDefaultValues: Partial<TClassProperties<Polyline>> = {
  /**
   * @deprecated transient option soon to be removed in favor of a different design
   */
  exactBoundingBox: false,
};

export interface SerializedPolylineProps extends SerializedObjectProps {
  points: XY[];
}

export class Polyline<
  Props extends TOptions<FabricObjectProps> = Partial<FabricObjectProps>,
  SProps extends SerializedPolylineProps = SerializedPolylineProps,
  EventSpec extends ObjectEvents = ObjectEvents,
> extends FabricObject<Props, SProps, EventSpec> {
  /**
   * Points array
   * @type Array
   * @default
   */
  declare points: XY[];

  /**
   * WARNING: Feature in progress
   * Calculate the exact bounding box taking in account strokeWidth on acute angles
   * this will be turned to true by default on fabric 6.0
   * maybe will be left in as an optimization since calculations may be slow
   * @deprecated transient option soon to be removed in favor of a different design
   * @type Boolean
   * @default false
   */
  declare exactBoundingBox: boolean;

  private declare initialized: true | undefined;

  static ownDefaults = polylineDefaultValues;

  static type = 'Polyline';

  static getDefaults(): Record<string, any> {
    return {
      ...super.getDefaults(),
      ...Polyline.ownDefaults,
    };
  }

  /**
   * A list of properties that if changed trigger a recalculation of dimensions
   * @todo check if you really need to recalculate for all cases
   */
  static layoutProperties: (keyof Polyline)[] = [
    SKEW_X,
    SKEW_Y,
    'strokeLineCap',
    'strokeLineJoin',
    'strokeMiterLimit',
    'strokeWidth',
    'strokeUniform',
    'points',
  ];

  declare pathOffset: Point;

  declare strokeOffset: Point;

  static cacheProperties = [...cacheProperties, 'points'];

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
  constructor(points: XY[] = [], options: Props = {} as Props) {
    super();
    Object.assign(this, Polyline.ownDefaults);
    this.setOptions(options);
    this.points = points;
    const { left, top } = options;
    this.initialized = true;
    this.setBoundingBox(true);
    typeof left === 'number' && this.set(LEFT, left);
    typeof top === 'number' && this.set(TOP, top);
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
          options as TProjectStrokeOnPointsOptions,
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
        this.points.map((p) => transformPoint(p, matrix, true)),
      ),
      scale = new Point(this.scaleX, this.scaleY);
    let offsetX = bbox.left + bbox.width / 2,
      offsetY = bbox.top + bbox.height / 2;
    if (this.exactBoundingBox) {
      offsetX = offsetX - offsetY * Math.tan(degreesToRadians(this.skewX));
      // Order of those assignments is important.
      // offsetY relies on offsetX being already changed by the line above
      offsetY = offsetY - offsetX * Math.tan(degreesToRadians(this.skewY));
    }

    return {
      ...bbox,
      pathOffset: new Point(offsetX, offsetY),
      strokeOffset: new Point(bboxNoStroke.left, bboxNoStroke.top)
        .subtract(new Point(bbox.left, bbox.top))
        .multiply(scale),
      strokeDiff: new Point(bbox.width, bbox.height)
        .subtract(new Point(bboxNoStroke.width, bboxNoStroke.height))
        .multiply(scale),
    };
  }

  /**
   * This function is an helper for svg import. it returns the center of the object in the svg
   * untransformed coordinates, by look at the polyline/polygon points.
   * @private
   * @return {Point} center point from element coordinates
   */
  _findCenterFromElement(): Point {
    const bbox = makeBoundingBoxFromPoints(this.points);
    return new Point(bbox.left + bbox.width / 2, bbox.top + bbox.height / 2);
  }

  setDimensions() {
    this.setBoundingBox();
  }

  setBoundingBox(adjustPosition?: boolean) {
    const { left, top, width, height, pathOffset, strokeOffset, strokeDiff } =
      this._calcDimensions();
    this.set({ width, height, pathOffset, strokeOffset, strokeDiff });
    adjustPosition &&
      this.setPositionByOrigin(
        new Point(left + width / 2, top + height / 2),
        CENTER,
        CENTER,
      );
  }

  /**
   * @deprecated intermidiate method to be removed, do not use
   */
  protected isStrokeAccountedForInDimensions() {
    return this.exactBoundingBox;
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
      /* When `strokeUniform = true`, any changes to the properties require recalculating the `width` and `height` because
        the stroke projections are affected.
        When `strokeUniform = false`, we don't need to recalculate for scale transformations, as the effect of scale on
        projections follows a linear function (e.g. scaleX of 2 just multiply width by 2)*/
      if (
        Object.keys(options).some(
          (key) =>
            this.strokeUniform ||
            (this.constructor as typeof Polyline).layoutProperties.includes(
              key as keyof TProjectStrokeOnPointsOptions,
            ),
        )
      ) {
        const { width, height } = this._calcDimensions(options);
        size = new Point(options.width ?? width, options.height ?? height);
      } else {
        size = new Point(
          options.width ?? this.width,
          options.height ?? this.height,
        );
      }
      return size.multiply(
        new Point(options.scaleX || this.scaleX, options.scaleY || this.scaleY),
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
      (((key === SCALE_X || key === SCALE_Y) &&
        this.strokeUniform &&
        (this.constructor as typeof Polyline).layoutProperties.includes(
          'strokeUniform',
        )) ||
        (this.constructor as typeof Polyline).layoutProperties.includes(
          key as keyof Polyline,
        ))
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
  toObject<
    T extends Omit<Props & TClassProperties<this>, keyof SProps>,
    K extends keyof T = never,
  >(propertiesToInclude: K[] = []): Pick<T, K> & SProps {
    return {
      ...super.toObject(propertiesToInclude),
      points: this.points.map(({ x, y }) => ({ x, y })),
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
        ' ',
      );
    }
    return [
      `<${
        (this.constructor as typeof Polyline).type.toLowerCase() as
          | 'polyline'
          | 'polygon'
      } `,
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
   * @param {HTMLElement} element Element to parser
   * @param {Object} [options] Options object
   */
  static async fromElement(
    element: HTMLElement,
    options: Abortable,
    cssRules?: CSSRules,
  ) {
    const points = parsePointsAttribute(element.getAttribute('points')),
      // we omit left and top to instruct the constructor to position the object using the bbox
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      { left, top, ...parsedAttributes } = parseAttributes(
        element,
        this.ATTRIBUTE_NAMES,
        cssRules,
      );
    return new this(points, {
      ...parsedAttributes,
      ...options,
    });
  }

  /* _FROM_SVG_END_ */

  /**
   * Returns Polyline instance from an object representation
   * @static
   * @memberOf Polyline
   * @param {Object} object Object to create an instance from
   * @returns {Promise<Polyline>}
   */
  static fromObject<T extends TOptions<SerializedPolylineProps>>(object: T) {
    return this._fromObject<Polyline>(object, {
      extraParam: 'points',
    });
  }
}

classRegistry.setClass(Polyline);
classRegistry.setSVGClass(Polyline);
