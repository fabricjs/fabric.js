import type { FabricObject } from './shapes/Object/FabricObject';
import type { TClassProperties } from './typedefs';
export declare const shadowDefaultValues: Partial<TClassProperties<Shadow>>;
export type SerializedShadowOptions = {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
    affectStroke: boolean;
    nonScaling: boolean;
    type: string;
};
export declare class Shadow {
    /**
     * Shadow color
     * @type String
     * @default
     */
    color: string;
    /**
     * Shadow blur
     * @type Number
     */
    blur: number;
    /**
     * Shadow horizontal offset
     * @type Number
     * @default
     */
    offsetX: number;
    /**
     * Shadow vertical offset
     * @type Number
     * @default
     */
    offsetY: number;
    /**
     * Whether the shadow should affect stroke operations
     * @type Boolean
     * @default
     */
    affectStroke: boolean;
    /**
     * Indicates whether toObject should include default values
     * @type Boolean
     * @default
     */
    includeDefaultValues: boolean;
    /**
     * When `false`, the shadow will scale with the object.
     * When `true`, the shadow's offsetX, offsetY, and blur will not be affected by the object's scale.
     * default to false
     * @type Boolean
     * @default
     */
    nonScaling: boolean;
    id: number;
    static ownDefaults: Partial<TClassProperties<Shadow>>;
    static type: string;
    /**
     * @see {@link http://fabricjs.com/shadows|Shadow demo}
     * @param {Object|String} [options] Options object with any of color, blur, offsetX, offsetY properties or string (e.g. "rgba(0,0,0,0.2) 2px 2px 10px")
     */
    constructor(options: Partial<TClassProperties<Shadow>>);
    constructor(svgAttribute: string);
    /**
     * @param {String} value Shadow value to parse
     * @return {Object} Shadow object with color, offsetX, offsetY and blur
     */
    static parseShadow(value: string): {
        color: string;
        offsetX: number;
        offsetY: number;
        blur: number;
    };
    /**
     * Returns a string representation of an instance
     * @see http://www.w3.org/TR/css-text-decor-3/#text-shadow
     * @return {String} Returns CSS3 text-shadow declaration
     */
    toString(): string;
    /**
     * Returns SVG representation of a shadow
     * @param {FabricObject} object
     * @return {String} SVG representation of a shadow
     */
    toSVG(object: FabricObject): string;
    /**
     * Returns object representation of a shadow
     * @return {Object} Object representation of a shadow instance
     */
    toObject(): Partial<SerializedShadowOptions>;
    static fromObject(options: Partial<TClassProperties<Shadow>>): Promise<Shadow>;
}
//# sourceMappingURL=Shadow.d.ts.map