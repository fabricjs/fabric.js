import type { FabricObject } from '../shapes/Object/FabricObject';
import type { TMat2D } from '../typedefs';
import type { ColorStop, GradientCoords, GradientOptions, GradientType, GradientUnits, SVGOptions } from './typedefs';
/**
 * Gradient class
 * @class Gradient
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-2#gradients}
 */
export declare class Gradient<S, T extends GradientType = S extends GradientType ? S : 'linear'> {
    /**
     * Horizontal offset for aligning gradients coming from SVG when outside pathgroups
     * @type Number
     * @default 0
     */
    offsetX: number;
    /**
     * Vertical offset for aligning gradients coming from SVG when outside pathgroups
     * @type Number
     * @default 0
     */
    offsetY: number;
    /**
     * A transform matrix to apply to the gradient before painting.
     * Imported from svg gradients, is not applied with the current transform in the center.
     * Before this transform is applied, the origin point is at the top left corner of the object
     * plus the addition of offsetY and offsetX.
     * @type Number[]
     * @default null
     */
    gradientTransform?: TMat2D;
    /**
     * coordinates units for coords.
     * If `pixels`, the number of coords are in the same unit of width / height.
     * If set as `percentage` the coords are still a number, but 1 means 100% of width
     * for the X and 100% of the height for the y. It can be bigger than 1 and negative.
     * allowed values pixels or percentage.
     * @type GradientUnits
     * @default 'pixels'
     */
    gradientUnits: GradientUnits;
    /**
     * Gradient type linear or radial
     * @type GradientType
     * @default 'linear'
     */
    type: T;
    /**
     * Defines how the gradient is located in space and spread
     * @type GradientCoords
     */
    coords: GradientCoords<T>;
    /**
     * Defines how many colors a gradient has and how they are located on the axis
     * defined by coords
     * @type GradientCoords
     */
    colorStops: ColorStop[];
    /**
     * If true, this object will not be exported during the serialization of a canvas
     * @type boolean
     */
    excludeFromExport?: boolean;
    /**
     * ID used for SVG export functionalities
     * @type number | string
     */
    readonly id: string | number;
    static type: string;
    constructor(options: GradientOptions<T>);
    /**
     * Adds another colorStop
     * @param {Record<string, string>} colorStop Object with offset and color
     * @return {Gradient} thisArg
     */
    addColorStop(colorStops: Record<string, string>): this;
    /**
     * Returns object representation of a gradient
     * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {object}
     */
    toObject(propertiesToInclude?: (keyof this | string)[]): Partial<this> & {
        type: T;
        coords: GradientCoords<T>;
        colorStops: {
            color: string;
            offset: number;
            opacity?: number;
        }[];
        offsetX: number;
        offsetY: number;
        gradientUnits: GradientUnits;
        gradientTransform: number[] | undefined;
    };
    /**
     * Returns SVG representation of an gradient
     * @param {FabricObject} object Object to create a gradient for
     * @return {String} SVG representation of an gradient (linear/radial)
     */
    toSVG(object: FabricObject, { additionalTransform: preTransform, }?: {
        additionalTransform?: string;
    }): string;
    /**
     * Returns an instance of CanvasGradient
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @return {CanvasGradient}
     */
    toLive(ctx: CanvasRenderingContext2D): CanvasGradient;
    static fromObject(options: GradientOptions<'linear'>): Promise<Gradient<'radial'>>;
    static fromObject(options: GradientOptions<'radial'>): Promise<Gradient<'radial'>>;
    /**
     * Returns {@link Gradient} instance from an SVG element
     * @static
     * @memberOf Gradient
     * @param {SVGGradientElement} el SVG gradient element
     * @param {FabricObject} instance
     * @param {String} opacity A fill-opacity or stroke-opacity attribute to multiply to each stop's opacity.
     * @param {SVGOptions} svgOptions an object containing the size of the SVG in order to parse correctly gradients
     * that uses gradientUnits as 'userSpaceOnUse' and percentages.
     * @return {Gradient} Gradient instance
     * @see http://www.w3.org/TR/SVG/pservers.html#LinearGradientElement
     * @see http://www.w3.org/TR/SVG/pservers.html#RadialGradientElement
     *
     *  @example
     *
     *  <linearGradient id="linearGrad1">
     *    <stop offset="0%" stop-color="white"/>
     *    <stop offset="100%" stop-color="black"/>
     *  </linearGradient>
     *
     *  OR
     *
     *  <linearGradient id="linearGrad2">
     *    <stop offset="0" style="stop-color:rgb(255,255,255)"/>
     *    <stop offset="1" style="stop-color:rgb(0,0,0)"/>
     *  </linearGradient>
     *
     *  OR
     *
     *  <radialGradient id="radialGrad1">
     *    <stop offset="0%" stop-color="white" stop-opacity="1" />
     *    <stop offset="50%" stop-color="black" stop-opacity="0.5" />
     *    <stop offset="100%" stop-color="white" stop-opacity="1" />
     *  </radialGradient>
     *
     *  OR
     *
     *  <radialGradient id="radialGrad2">
     *    <stop offset="0" stop-color="rgb(255,255,255)" />
     *    <stop offset="0.5" stop-color="rgb(0,0,0)" />
     *    <stop offset="1" stop-color="rgb(255,255,255)" />
     *  </radialGradient>
     *
     */
    static fromElement(el: SVGGradientElement, instance: FabricObject, svgOptions: SVGOptions): Gradient<GradientType>;
}
//# sourceMappingURL=Gradient.d.ts.map