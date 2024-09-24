import type { Abortable, TCrossOrigin, TMat2D, TSize } from '../typedefs';
import type { PatternRepeat, PatternOptions, SerializedPatternOptions } from './types';
/**
 * @see {@link http://fabricjs.com/patterns demo}
 * @see {@link http://fabricjs.com/dynamic-patterns demo}
 */
export declare class Pattern {
    static type: string;
    /**
     * Legacy identifier of the class. Prefer using this.constructor.type 'Pattern'
     * or utils like isPattern, or instance of to indentify a pattern in your code.
     * Will be removed in future versiones
     * @TODO add sustainable warning message
     * @type string
     * @deprecated
     */
    get type(): string;
    set type(value: string);
    /**
     * @type PatternRepeat
     * @defaults
     */
    repeat: PatternRepeat;
    /**
     * Pattern horizontal offset from object's left/top corner
     * @type Number
     * @default
     */
    offsetX: number;
    /**
     * Pattern vertical offset from object's left/top corner
     * @type Number
     * @default
     */
    offsetY: number;
    /**
     * @type TCrossOrigin
     * @default
     */
    crossOrigin: TCrossOrigin;
    /**
     * transform matrix to change the pattern, imported from svgs.
     * @todo verify if using the identity matrix as default makes the rest of the code more easy
     * @type Array
     * @default
     */
    patternTransform?: TMat2D;
    /**
     * The actual pixel source of the pattern
     */
    source: CanvasImageSource;
    /**
     * If true, this object will not be exported during the serialization of a canvas
     * @type boolean
     */
    excludeFromExport?: boolean;
    /**
     * ID used for SVG export functionalities
     * @type number
     */
    readonly id: number;
    /**
     * Constructor
     * @param {Object} [options] Options object
     * @param {option.source} [source] the pattern source, eventually empty or a drawable
     */
    constructor(options: PatternOptions);
    /**
     * @returns true if {@link source} is an <img> element
     */
    isImageSource(): this is {
        source: HTMLImageElement;
    };
    /**
     * @returns true if {@link source} is a <canvas> element
     */
    isCanvasSource(): this is {
        source: HTMLCanvasElement;
    };
    sourceToString(): string;
    /**
     * Returns an instance of CanvasPattern
     * @param {CanvasRenderingContext2D} ctx Context to create pattern
     * @return {CanvasPattern}
     */
    toLive(ctx: CanvasRenderingContext2D): CanvasPattern | null;
    /**
     * Returns object representation of a pattern
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {object} Object representation of a pattern instance
     */
    toObject(propertiesToInclude?: string[]): Record<string, any>;
    /**
     * Returns SVG representation of a pattern
     */
    toSVG({ width, height }: TSize): string;
    static fromObject({ type, source, patternTransform, ...otherOptions }: SerializedPatternOptions, options?: Abortable): Promise<Pattern>;
}
//# sourceMappingURL=Pattern.d.ts.map