import { IPoint, Point } from '../point.class';
import { TClassProperties } from '../typedefs';
import { FabricObject } from './Object/FabricObject';
export declare class Polyline extends FabricObject {
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
    private initialized;
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
    constructor(points?: IPoint[], { left, top, ...options }?: any);
    protected isOpen(): boolean;
    private _projectStrokeOnPoints;
    /**
     * Calculate the polygon bounding box
     * @private
     */
    _calcDimensions(): {
        left: number;
        top: number;
        width: number;
        height: number;
        pathOffset: Point;
        strokeOffset: Point;
    };
    setDimensions(): void;
    setBoundingBox(adjustPosition?: boolean): void;
    /**
     * @override stroke is taken in account in size
     */
    _getNonTransformedDimensions(): Point;
    /**
     * @override stroke and skewing are taken into account when projecting stroke on points,
     * therefore we don't want the default calculation to account for skewing as well
     *
     * @private
     */
    _getTransformedDimensions(options: any): Point;
    /**
     * Recalculates dimensions when changing skew and scale
     * @private
     */
    _set(key: string, value: any): this;
    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} Object representation of an instance
     */
    toObject(propertiesToInclude?: (keyof this)[]): object;
    /**
     * Returns svg representation of an instance
     * @return {Array} an array of strings with the specific svg representation
     * of the instance
     */
    _toSVG(): string[];
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render(ctx: CanvasRenderingContext2D): void;
    /**
     * Returns complexity of an instance
     * @return {Number} complexity of this instance
     */
    complexity(): number;
    /**
     * List of attribute names to account for when parsing SVG element (used by {@link Polyline.fromElement})
     * @static
     * @memberOf Polyline
     * @see: http://www.w3.org/TR/SVG/shapes.html#PolylineElement
     */
    static ATTRIBUTE_NAMES: string[];
    /**
     * Returns Polyline instance from an SVG element
     * @static
     * @memberOf Polyline
     * @param {SVGElement} element Element to parser
     * @param {Function} callback callback function invoked after parsing
     * @param {Object} [options] Options object
     */
    static fromElement(element: SVGElement, callback: (poly: Polyline | null) => any, options?: any): any;
    /**
     * Returns Polyline instance from an object representation
     * @static
     * @memberOf Polyline
     * @param {Object} object Object to create an instance from
     * @returns {Promise<Polyline>}
     */
    static fromObject(object: Record<string, unknown>): Promise<import("./Object/Object").FabricObject<import("../EventTypeDefs").ObjectEvents>>;
}
export declare const polylineDefaultValues: Partial<TClassProperties<Polyline>>;
//# sourceMappingURL=polyline.class.d.ts.map