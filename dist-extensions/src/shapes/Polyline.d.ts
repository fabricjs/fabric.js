import type { XY } from '../Point';
import { Point } from '../Point';
import type { Abortable, TClassProperties, TOptions } from '../typedefs';
import type { TProjectStrokeOnPointsOptions } from '../util/misc/projectStroke/types';
import { FabricObject } from './Object/FabricObject';
import type { FabricObjectProps, SerializedObjectProps } from './Object/types';
import type { ObjectEvents } from '../EventTypeDefs';
import type { CSSRules } from '../parser/typedefs';
export declare const polylineDefaultValues: Partial<TClassProperties<Polyline>>;
export interface SerializedPolylineProps extends SerializedObjectProps {
    points: XY[];
}
export declare class Polyline<Props extends TOptions<FabricObjectProps> = Partial<FabricObjectProps>, SProps extends SerializedPolylineProps = SerializedPolylineProps, EventSpec extends ObjectEvents = ObjectEvents> extends FabricObject<Props, SProps, EventSpec> {
    /**
     * Points array
     * @type Array
     * @default
     */
    points: XY[];
    /**
     * WARNING: Feature in progress
     * Calculate the exact bounding box taking in account strokeWidth on acute angles
     * this will be turned to true by default on fabric 6.0
     * maybe will be left in as an optimization since calculations may be slow
     * @deprecated transient option soon to be removed in favor of a different design
     * @type Boolean
     * @default false
     */
    exactBoundingBox: boolean;
    private initialized;
    static ownDefaults: Partial<TClassProperties<Polyline<Partial<FabricObjectProps>, SerializedPolylineProps, ObjectEvents>>>;
    static type: string;
    static getDefaults(): Record<string, any>;
    /**
     * A list of properties that if changed trigger a recalculation of dimensions
     * @todo check if you really need to recalculate for all cases
     */
    static layoutProperties: (keyof Polyline)[];
    pathOffset: Point;
    strokeOffset: Point;
    static cacheProperties: string[];
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
    constructor(points?: XY[], options?: Props);
    protected isOpen(): boolean;
    private _projectStrokeOnPoints;
    /**
     * Calculate the polygon bounding box
     * @private
     */
    _calcDimensions(options?: Partial<TProjectStrokeOnPointsOptions>): {
        left: number;
        top: number;
        width: number;
        height: number;
        pathOffset: Point;
        strokeOffset: Point;
        strokeDiff: Point;
    };
    /**
     * This function is an helper for svg import. it returns the center of the object in the svg
     * untransformed coordinates, by look at the polyline/polygon points.
     * @private
     * @return {Point} center point from element coordinates
     */
    _findCenterFromElement(): Point;
    setDimensions(): void;
    setBoundingBox(adjustPosition?: boolean): void;
    /**
     * @deprecated intermidiate method to be removed, do not use
     */
    protected isStrokeAccountedForInDimensions(): boolean;
    /**
     * @override stroke is taken in account in size
     */
    _getNonTransformedDimensions(): Point;
    /**
     * @override stroke and skewing are taken into account when projecting stroke on points,
     * therefore we don't want the default calculation to account for skewing as well.
     * Though it is possible to pass `width` and `height` in `options`, doing so is very strange, use with discretion.
     *
     * @private
     */
    _getTransformedDimensions(options?: any): Point;
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
    toObject<T extends Omit<Props & TClassProperties<this>, keyof SProps>, K extends keyof T = never>(propertiesToInclude?: K[]): Pick<T, K> & SProps;
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
     * @param {HTMLElement} element Element to parser
     * @param {Object} [options] Options object
     */
    static fromElement(element: HTMLElement, options: Abortable, cssRules?: CSSRules): Promise<Polyline<{
        signal?: AbortSignal;
    }, SerializedPolylineProps, ObjectEvents>>;
    /**
     * Returns Polyline instance from an object representation
     * @static
     * @memberOf Polyline
     * @param {Object} object Object to create an instance from
     * @returns {Promise<Polyline>}
     */
    static fromObject<T extends TOptions<SerializedPolylineProps>>(object: T): Promise<Polyline<Partial<FabricObjectProps>, SerializedPolylineProps, ObjectEvents>>;
}
//# sourceMappingURL=Polyline.d.ts.map