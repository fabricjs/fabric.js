import { TClassProperties } from '../typedefs';
import { FabricObject } from './Object/FabricObject';
export declare class Line extends FabricObject {
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
    constructor(points: any, options: any);
    /**
     * @private
     * @param {Object} [options] Options
     */
    _setWidthHeight(options: any): void;
    /**
     * @private
     * @param {String} key
     * @param {*} value
     */
    _set(key: any, value: any): this;
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render(ctx: any): void;
    /**
     * This function is an helper for svg import. it returns the center of the object in the svg
     * untransformed coordinates
     * @private
     * @return {Object} center point from element coordinates
     */
    _findCenterFromElement(): {
        x: number;
        y: number;
    };
    /**
     * Returns object representation of an instance
     * @method toObject
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject(propertiesToInclude: any): {
        x1: number;
        x2: number;
        y1: number;
        y2: number;
    };
    _getNonTransformedDimensions(): import("../point.class").Point;
    /**
     * Recalculates line points given width and height
     * @private
     */
    calcLinePoints(): {
        x1: number;
        x2: number;
        y1: number;
        y2: number;
    };
    private makeEdgeToOriginGetter;
    /**
     * @private
     * @return {Number} leftToOriginX Distance from left edge of canvas to originX of Line.
     */
    _getLeftToOriginX(): number | undefined;
    /**
     * @private
     * @return {Number} leftToOriginX Distance from left edge of canvas to originX of Line.
     */
    _getTopToOriginY(): number | undefined;
    /**
     * Returns svg representation of an instance
     * @return {Array} an array of strings with the specific svg representation
     * of the instance
     */
    _toSVG(): (string | number)[];
    /**
     * List of attribute names to account for when parsing SVG element (used by {@link Line.fromElement})
     * @static
     * @memberOf Line
     * @see http://www.w3.org/TR/SVG/shapes.html#LineElement
     */
    static ATTRIBUTE_NAMES: string[];
    /**
     * Returns Line instance from an SVG element
     * @static
     * @memberOf Line
     * @param {SVGElement} element Element to parse
     * @param {Object} [options] Options object
     * @param {Function} [callback] callback function invoked after parsing
     */
    static fromElement(element: any, callback: any, options: any): void;
    /**
     * Returns Line instance from an object representation
     * @static
     * @memberOf Line
     * @param {Object} object Object to create an instance from
     * @returns {Promise<Line>}
     */
    static fromObject(object: any): Promise<import("./Object/Object").FabricObject<import("../EventTypeDefs").ObjectEvents>>;
}
export declare const lineDefaultValues: Partial<TClassProperties<Line>>;
//# sourceMappingURL=line.class.d.ts.map