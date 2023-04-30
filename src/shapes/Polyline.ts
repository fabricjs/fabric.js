import { config } from '../config';
import { SHARED_ATTRIBUTES } from '../parser/attributes';
import { parseAttributes } from '../parser/parseAttributes';
import { parsePointsAttribute } from '../parser/parsePointsAttribute';
import { XY, Point } from '../Point';
import { TClassProperties } from '../typedefs';
import { classRegistry } from '../ClassRegistry';
import { makeBoundingBoxFromPoints } from '../util/misc/boundingBoxFromPoints';
import { projectStrokeOnPoints } from '../util/misc/projectStroke';
import { degreesToRadians } from '../util/misc/radiansDegreesConversion';
import { toFixed } from '../util/misc/toFixed';
import { FabricObject, cacheProperties } from './Object/FabricObject';
import type {
  FabricObjectProps,
  SerializedObjectProps,
  TProps,
} from './Object/types';
import type { ObjectEvents } from '../EventTypeDefs';
import { cloneDeep } from '../util/internals/cloneDeep';

export const polylineDefaultValues: Partial<TClassProperties<Polyline>> = {
  exactBoundingBox: false,
};

export interface SerializedPolylineProps extends SerializedObjectProps {
  points: XY[];
}

export class Polyline<
  Props extends TProps<FabricObjectProps> = Partial<FabricObjectProps>,
  SProps extends SerializedPolylineProps = SerializedPolylineProps,
  EventSpec extends ObjectEvents = ObjectEvents
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
   * @deprecated
   * @type Boolean
   * @default false
   */
  declare exactBoundingBox: boolean;

  private declare initialized: true | undefined;

  static ownDefaults: Record<string, any> = polylineDefaultValues;

  static getDefaults() {
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
    'skewX',
    'skewY',
    'strokeLineCap',
    'strokeLineJoin',
    'strokeMiterLimit',
    'strokeWidth',
    'strokeUniform',
    'points',
  ];

  declare fromSVG: boolean;

  declare pathOffset: Point;

  declare strokeOffset: Point;

  static cacheProperties = [...cacheProperties, 'points'];

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
    super({ points, ...options });
    const { left, top } = options;
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
  _getTransformedDimensions(options?: any) {
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
        (this.constructor as typeof Polyline).layoutProperties.includes(
          'strokeUniform'
        ) &&
        this.strokeLineJoin !== 'round') ||
        (this.constructor as typeof Polyline).layoutProperties.includes(
          key as keyof Polyline
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
    K extends keyof T = never
  >(propertiesToInclude: K[] = []): Pick<T, K> & SProps {
    return {
      ...super.toObject(propertiesToInclude),
      points: cloneDeep(this.points),
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
      `<${this.constructor.name.toLowerCase() as 'polyline' | 'polygon'} `,
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
  static fromObject<T extends TProps<SerializedPolylineProps>>(object: T) {
    return this._fromObject<Polyline>(object, {
      extraParam: 'points',
    });
  }
}

classRegistry.setClass(Polyline);
classRegistry.setSVGClass(Polyline);
