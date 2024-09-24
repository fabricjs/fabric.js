import type { Abortable, TClassProperties, TOptions } from '../typedefs';
import { FabricObject } from './Object/FabricObject';
import type { FabricObjectProps, SerializedObjectProps } from './Object/types';
import type { ObjectEvents } from '../EventTypeDefs';
import type { CSSRules } from '../parser/typedefs';
export declare const rectDefaultValues: Partial<TClassProperties<Rect>>;
interface UniqueRectProps {
    rx: number;
    ry: number;
}
export interface SerializedRectProps extends SerializedObjectProps, UniqueRectProps {
}
export interface RectProps extends FabricObjectProps, UniqueRectProps {
}
export declare class Rect<Props extends TOptions<RectProps> = Partial<RectProps>, SProps extends SerializedRectProps = SerializedRectProps, EventSpec extends ObjectEvents = ObjectEvents> extends FabricObject<Props, SProps, EventSpec> implements RectProps {
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
    static type: string;
    static cacheProperties: string[];
    static ownDefaults: Partial<TClassProperties<Rect<Partial<RectProps>, SerializedRectProps, ObjectEvents>>>;
    static getDefaults(): Record<string, any>;
    /**
     * Constructor
     * @param {Object} [options] Options object
     */
    constructor(options?: Props);
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
    toObject<T extends Omit<Props & TClassProperties<this>, keyof SProps>, K extends keyof T = never>(propertiesToInclude?: K[]): Pick<T, K> & SProps;
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
     * @param {HTMLElement} element Element to parse
     * @param {Object} [options] Options object
     */
    static fromElement(element: HTMLElement, options: Abortable, cssRules?: CSSRules): Promise<Rect<{
        left: any;
        top: any;
        width: any;
        height: any;
        visible: boolean;
        signal?: AbortSignal;
    }, SerializedRectProps, ObjectEvents>>;
}
export {};
//# sourceMappingURL=Rect.d.ts.map