import { TClassProperties } from '../typedefs';
import { FabricObject } from './Object/FabricObject';
export declare class Circle extends FabricObject {
    /**
     * Radius of this circle
     * @type Number
     * @default
     */
    radius: number;
    /**
     * degrees of start of the circle.
     * probably will change to degrees in next major version
     * @type Number 0 - 359
     * @default 0
     */
    startAngle: number;
    /**
     * End angle of the circle
     * probably will change to degrees in next major version
     * @type Number 1 - 360
     * @default 360
     */
    endAngle: number;
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
    toObject(propertiesToInclude?: (keyof this)[]): object;
    /**
     * Returns svg representation of an instance
     * @return {Array} an array of strings with the specific svg representation
     * of the instance
     */
    _toSVG(): (string | number)[];
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
     * @param {SVGElement} element Element to parse
     * @param {Function} [callback] Options callback invoked after parsing is finished
     * @param {Object} [options] Partial Circle object to default missing properties on the element.
     * @throws {Error} If value of `r` attribute is missing or invalid
     */
    static fromElement(element: SVGElement, callback: (circle: Circle) => any): void;
}
export declare const circleDefaultValues: Partial<TClassProperties<Circle>>;
//# sourceMappingURL=circle.class.d.ts.map