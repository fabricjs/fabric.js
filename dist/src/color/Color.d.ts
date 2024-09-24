import type { TRGBAColorSource, TColorArg } from './typedefs';
/**
 * @class Color common color operations
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-2/#colors colors}
 */
export declare class Color {
    private _source;
    isUnrecognised: boolean;
    /**
     *
     * @param {string} [color] optional in hex or rgb(a) or hsl format or from known color list
     */
    constructor(color?: TColorArg);
    /**
     * @private
     * @param {string} [color] Color value to parse
     * @returns {TRGBAColorSource}
     */
    protected _tryParsingColor(color: string): TRGBAColorSource;
    /**
     * Returns source of this color (where source is an array representation; ex: [200, 200, 100, 1])
     * @return {TRGBAColorSource}
     */
    getSource(): TRGBAColorSource;
    /**
     * Sets source of this color (where source is an array representation; ex: [200, 200, 100, 1])
     * @param {TRGBAColorSource} source
     */
    setSource(source: TRGBAColorSource): void;
    /**
     * Returns color representation in RGB format
     * @return {String} ex: rgb(0-255,0-255,0-255)
     */
    toRgb(): string;
    /**
     * Returns color representation in RGBA format
     * @return {String} ex: rgba(0-255,0-255,0-255,0-1)
     */
    toRgba(): string;
    /**
     * Returns color representation in HSL format
     * @return {String} ex: hsl(0-360,0%-100%,0%-100%)
     */
    toHsl(): string;
    /**
     * Returns color representation in HSLA format
     * @return {String} ex: hsla(0-360,0%-100%,0%-100%,0-1)
     */
    toHsla(): string;
    /**
     * Returns color representation in HEX format
     * @return {String} ex: FF5555
     */
    toHex(): string;
    /**
     * Returns color representation in HEXA format
     * @return {String} ex: FF5555CC
     */
    toHexa(): string;
    /**
     * Gets value of alpha channel for this color
     * @return {Number} 0-1
     */
    getAlpha(): number;
    /**
     * Sets value of alpha channel for this color
     * @param {Number} alpha Alpha value 0-1
     * @return {Color} thisArg
     */
    setAlpha(alpha: number): this;
    /**
     * Transforms color to its grayscale representation
     * @return {Color} thisArg
     */
    toGrayscale(): this;
    /**
     * Transforms color to its black and white representation
     * @param {Number} threshold
     * @return {Color} thisArg
     */
    toBlackWhite(threshold: number): this;
    /**
     * Overlays color with another color
     * @param {String|Color} otherColor
     * @return {Color} thisArg
     */
    overlayWith(otherColor: string | Color): this;
    /**
     * Returns new color object, when given a color in RGB format
     * @memberOf Color
     * @param {String} color Color value ex: rgb(0-255,0-255,0-255)
     * @return {Color}
     */
    static fromRgb(color: string): Color;
    /**
     * Returns new color object, when given a color in RGBA format
     * @static
     * @function
     * @memberOf Color
     * @param {String} color
     * @return {Color}
     */
    static fromRgba(color: string): Color;
    /**
     * Returns array representation (ex: [100, 100, 200, 1]) of a color that's in RGB or RGBA format
     * @memberOf Color
     * @param {String} color Color value ex: rgb(0-255,0-255,0-255), rgb(0%-100%,0%-100%,0%-100%)
     * @return {TRGBAColorSource | undefined} source
     */
    static sourceFromRgb(color: string): TRGBAColorSource | undefined;
    /**
     * Returns new color object, when given a color in HSL format
     * @param {String} color Color value ex: hsl(0-260,0%-100%,0%-100%)
     * @memberOf Color
     * @return {Color}
     */
    static fromHsl(color: string): Color;
    /**
     * Returns new color object, when given a color in HSLA format
     * @static
     * @function
     * @memberOf Color
     * @param {String} color
     * @return {Color}
     */
    static fromHsla(color: string): Color;
    /**
     * Returns array representation (ex: [100, 100, 200, 1]) of a color that's in HSL or HSLA format.
     * Adapted from <a href="https://rawgithub.com/mjijackson/mjijackson.github.com/master/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript.html">https://github.com/mjijackson</a>
     * @memberOf Color
     * @param {String} color Color value ex: hsl(0-360,0%-100%,0%-100%) or hsla(0-360,0%-100%,0%-100%, 0-1)
     * @return {TRGBAColorSource | undefined} source
     * @see http://http://www.w3.org/TR/css3-color/#hsl-color
     */
    static sourceFromHsl(color: string): TRGBAColorSource | undefined;
    /**
     * Returns new color object, when given a color in HEX format
     * @static
     * @memberOf Color
     * @param {String} color Color value ex: FF5555
     * @return {Color}
     */
    static fromHex(color: string): Color;
    /**
     * Returns array representation (ex: [100, 100, 200, 1]) of a color that's in HEX format
     * @static
     * @memberOf Color
     * @param {String} color ex: FF5555 or FF5544CC (RGBa)
     * @return {TRGBAColorSource | undefined} source
     */
    static sourceFromHex(color: string): TRGBAColorSource | undefined;
    /**
     * Converts a string that could be any angle notation (50deg, 0.5turn, 2rad)
     * into degrees without the 'deg' suffix
     * @static
     * @memberOf Color
     * @param {String} value ex: 0deg, 0.5turn, 2rad
     * @return {Number} number in degrees or NaN if inputs are invalid
     */
    static parseAngletoDegrees(value: string): number;
}
//# sourceMappingURL=Color.d.ts.map