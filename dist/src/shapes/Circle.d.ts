import type { ObjectEvents } from '../EventTypeDefs';
import { FabricObject } from './Object/FabricObject';
import type { Abortable, TClassProperties, TOptions } from '../typedefs';
import type { FabricObjectProps, SerializedObjectProps } from './Object/types';
import type { CSSRules } from '../parser/typedefs';
interface UniqueCircleProps {
    /**
     * Radius of this circle
     * @type Number
     * @default 0
     */
    radius: number;
    /**
     * Angle for the start of the circle, in degrees.
     * @type TDegree 0 - 359
     * @default 0
     */
    startAngle: number;
    /**
     * Angle for the end of the circle, in degrees
     * @type TDegree 1 - 360
     * @default 360
     */
    endAngle: number;
    /**
     * Orientation for the direction of the circle.
     * Setting to true will switch the arc of the circle to traverse from startAngle to endAngle in a counter-clockwise direction.
     * Note: this will only change how the circle is drawn, and does not affect rotational transformation.
     * @default false
     */
    counterClockwise: boolean;
}
export interface SerializedCircleProps extends SerializedObjectProps, UniqueCircleProps {
}
export interface CircleProps extends FabricObjectProps, UniqueCircleProps {
}
export declare const circleDefaultValues: Partial<TClassProperties<Circle>>;
export declare class Circle<Props extends TOptions<CircleProps> = Partial<CircleProps>, SProps extends SerializedCircleProps = SerializedCircleProps, EventSpec extends ObjectEvents = ObjectEvents> extends FabricObject<Props, SProps, EventSpec> implements UniqueCircleProps {
    radius: number;
    startAngle: number;
    endAngle: number;
    counterClockwise: boolean;
    static type: string;
    static cacheProperties: string[];
    static ownDefaults: Partial<TClassProperties<Circle<Partial<CircleProps>, SerializedCircleProps, ObjectEvents>>>;
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
     */
    _set(key: string, value: any): this;
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx context to render on
     */
    _render(ctx: CanvasRenderingContext2D): void;
    /**
     * Returns horizontal radius of an object (according to how an object is scaled)
     * @return {Number}
     */
    getRadiusX(): number;
    /**
     * Returns vertical radius of an object (according to how an object is scaled)
     * @return {Number}
     */
    getRadiusY(): number;
    /**
     * Sets radius of an object (and updates width accordingly)
     */
    setRadius(value: number): void;
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
     * List of attribute names to account for when parsing SVG element (used by {@link Circle.fromElement})
     * @static
     * @memberOf Circle
     * @see: http://www.w3.org/TR/SVG/shapes.html#CircleElement
     */
    static ATTRIBUTE_NAMES: string[];
    /**
     * Returns {@link Circle} instance from an SVG element
     * @static
     * @memberOf Circle
     * @param {HTMLElement} element Element to parse
     * @param {Object} [options] Partial Circle object to default missing properties on the element.
     * @throws {Error} If value of `r` attribute is missing or invalid
     */
    static fromElement(element: HTMLElement, options: Abortable, cssRules?: CSSRules): Promise<Circle>;
    /**
     * @todo how do we declare this??
     */
    static fromObject<T extends TOptions<SerializedCircleProps>>(object: T): Promise<Circle<Partial<CircleProps>, SerializedCircleProps, ObjectEvents>>;
}
export {};
//# sourceMappingURL=Circle.d.ts.map