import { Point } from '../point.class';
import { PathData, TClassProperties } from '../typedefs';
import { type TPathSegmentsInfo } from '../util/path';
import { FabricObject } from './Object/FabricObject';
export declare class Path extends FabricObject {
    /**
     * Array of path points
     * @type Array
     * @default
     */
    path: PathData;
    pathOffset: Point;
    fromSVG?: boolean;
    sourcePath?: string;
    segmentsInfo?: TPathSegmentsInfo[];
    /**
     * Constructor
     * @param {Array|String} path Path data (sequence of coordinates and corresponding "command" tokens)
     * @param {Object} [options] Options object
     * @return {Path} thisArg
     */
    constructor(path: PathData | string, { path, left, top, ...options }?: any);
    /**
     * @private
     * @param {PathData | string} path Path data (sequence of coordinates and corresponding "command" tokens)
     * @param {boolean} [adjustPosition] pass true to reposition the object according to the bounding box
     * @returns {Point} top left position of the bounding box, useful for complementary positioning
     */
    _setPath(path: PathData | string, adjustPosition?: boolean): Point;
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx context to render path on
     */
    _renderPathCommands(ctx: CanvasRenderingContext2D): void;
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx context to render path on
     */
    _render(ctx: CanvasRenderingContext2D): void;
    /**
     * Returns string representation of an instance
     * @return {String} string representation of an instance
     */
    toString(): string;
    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject(propertiesToInclude?: (keyof this)[]): {
        path: (string | number)[][];
    };
    /**
     * Returns dataless object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toDatalessObject(propertiesToInclude?: (keyof this)[]): {
        path: (string | number)[][];
    };
    /**
     * Returns svg representation of an instance
     * @return {Array} an array of strings with the specific svg representation
     * of the instance
     */
    _toSVG(): string[];
    _getOffsetTransform(): string;
    /**
     * Returns svg clipPath representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toClipPathSVG(reviver: any): string;
    /**
     * Returns svg representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG(reviver: any): string;
    /**
     * Returns number representation of an instance complexity
     * @return {Number} complexity of this instance
     */
    complexity(): number;
    setDimensions(): Point;
    /**
     * @private
     */
    _calcDimensions(): {
        left: number;
        top: number;
        pathOffset: Point;
        width: number;
        height: number;
    };
    /**
     * List of attribute names to account for when parsing SVG element (used by `Path.fromElement`)
     * @static
     * @memberOf Path
     * @see http://www.w3.org/TR/SVG/paths.html#PathElement
     */
    static ATTRIBUTE_NAMES: string[];
    /**
     * Creates an instance of Path from an object
     * @static
     * @memberOf Path
     * @param {Object} object
     * @returns {Promise<Path>}
     */
    static fromObject(object: any): Promise<import("./Object/Object").FabricObject<import("../EventTypeDefs").ObjectEvents>>;
    /**
     * Creates an instance of Path from an SVG <path> element
     * @static
     * @memberOf Path
     * @param {SVGElement} element to parse
     * @param {Function} callback Callback to invoke when an Path instance is created
     * @param {Object} [options] Options object
     * @param {Function} [callback] Options callback invoked after parsing is finished
     */
    static fromElement(element: any, callback: any, options: any): void;
}
export declare const pathDefaultValues: Partial<TClassProperties<Path>>;
//# sourceMappingURL=path.class.d.ts.map