import { TClassProperties } from '../typedefs';
import { FabricObject } from './Object/FabricObject';
export declare class Rect extends FabricObject {
    /**
     * Horizontal border radius
     * @type Number
     * @default
     */
    rx: number;
    /**
     * Vertical border radius
     * @type Number
     * @default
     */
    ry: number;
    /**
     * Constructor
     * @param {Object} [options] Options object
     * @return {Object} thisArg
     */
    constructor(options: Record<string, unknown>);
    /**
     * Initializes rx/ry attributes
     * @private
     */
    _initRxRy(): void;
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render(ctx: CanvasRenderingContext2D): void;
    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject(propertiesToInclude?: (keyof this)[]): Record<string, any>;
    /**
     * Returns svg representation of an instance
     * @return {Array} an array of strings with the specific svg representation
     * of the instance
     */
    _toSVG(): string[];
    /**
     * List of attribute names to account for when parsing SVG element (used by `Rect.fromElement`)
     * @static
     * @memberOf Rect
     * @see: http://www.w3.org/TR/SVG/shapes.html#RectElement
     */
    static ATTRIBUTE_NAMES: string[];
    /**
     * Returns {@link Rect} instance from an SVG element
     * @static
     * @memberOf Rect
     * @param {SVGElement} element Element to parse
     * @param {Function} callback callback function invoked after parsing
     * @param {Object} [options] Options object
     */
    static fromElement(element: SVGElement, callback: (rect: Rect | null) => void, options?: {}): void;
}
export declare const rectDefaultValues: Partial<TClassProperties<Rect>>;
//# sourceMappingURL=rect.class.d.ts.map