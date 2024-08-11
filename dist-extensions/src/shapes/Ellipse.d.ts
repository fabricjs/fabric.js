import type { Abortable, TClassProperties, TOptions } from '../typedefs';
import { FabricObject } from './Object/FabricObject';
import type { FabricObjectProps, SerializedObjectProps } from './Object/types';
import type { ObjectEvents } from '../EventTypeDefs';
import type { CSSRules } from '../parser/typedefs';
export declare const ellipseDefaultValues: Partial<TClassProperties<Ellipse>>;
interface UniqueEllipseProps {
    rx: number;
    ry: number;
}
export interface SerializedEllipseProps extends SerializedObjectProps, UniqueEllipseProps {
}
export interface EllipseProps extends FabricObjectProps, UniqueEllipseProps {
}
export declare class Ellipse<Props extends TOptions<EllipseProps> = Partial<EllipseProps>, SProps extends SerializedEllipseProps = SerializedEllipseProps, EventSpec extends ObjectEvents = ObjectEvents> extends FabricObject<Props, SProps, EventSpec> implements EllipseProps {
    /**
     * Horizontal radius
     * @type Number
     * @default
     */
    rx: number;
    /**
     * Vertical radius
     * @type Number
     * @default
     */
    ry: number;
    static type: string;
    static cacheProperties: string[];
    static ownDefaults: Partial<TClassProperties<Ellipse<Partial<EllipseProps>, SerializedEllipseProps, ObjectEvents>>>;
    static getDefaults(): Record<string, any>;
    /**
     * Constructor
     * @param {Object} [options] Options object
     */
    constructor(options?: Props);
    /**
     * @private
     * @param {String} key
     * @param {*} value
     * @return {Ellipse} thisArg
     */
    _set(key: string, value: any): this;
    /**
     * Returns horizontal radius of an object (according to how an object is scaled)
     * @return {Number}
     */
    getRx(): number;
    /**
     * Returns Vertical radius of an object (according to how an object is scaled)
     * @return {Number}
     */
    getRy(): number;
    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
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
     * @param {CanvasRenderingContext2D} ctx context to render on
     */
    _render(ctx: CanvasRenderingContext2D): void;
    /**
     * List of attribute names to account for when parsing SVG element (used by {@link Ellipse.fromElement})
     * @static
     * @memberOf Ellipse
     * @see http://www.w3.org/TR/SVG/shapes.html#EllipseElement
     */
    static ATTRIBUTE_NAMES: string[];
    /**
     * Returns {@link Ellipse} instance from an SVG element
     * @static
     * @memberOf Ellipse
     * @param {HTMLElement} element Element to parse
     * @return {Ellipse}
     */
    static fromElement(element: HTMLElement, options: Abortable, cssRules?: CSSRules): Promise<Ellipse<Record<string, any>, SerializedEllipseProps, ObjectEvents>>;
}
export {};
//# sourceMappingURL=Ellipse.d.ts.map