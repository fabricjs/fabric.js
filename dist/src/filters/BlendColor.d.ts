import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
export type TBlendMode = 'multiply' | 'add' | 'difference' | 'screen' | 'subtract' | 'darken' | 'lighten' | 'overlay' | 'exclusion' | 'tint';
type BlendColorOwnProps = {
    color: string;
    mode: TBlendMode;
    alpha: number;
};
export declare const blendColorDefaultValues: BlendColorOwnProps;
/**
 * Color Blend filter class
 * @example
 * const filter = new BlendColor({
 *  color: '#000',
 *  mode: 'multiply'
 * });
 *
 * const filter = new BlendImage({
 *  image: fabricImageObject,
 *  mode: 'multiply'
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 */
export declare class BlendColor extends BaseFilter<'BlendColor', BlendColorOwnProps> {
    /**
     * Color to make the blend operation with. default to a reddish color since black or white
     * gives always strong result.
     * @type String
     * @default
     **/
    color: BlendColorOwnProps['color'];
    /**
     * Blend mode for the filter: one of multiply, add, difference, screen, subtract,
     * darken, lighten, overlay, exclusion, tint.
     * @type String
     * @default
     **/
    mode: BlendColorOwnProps['mode'];
    /**
     * alpha value. represent the strength of the blend color operation.
     * @type Number
     * @default
     **/
    alpha: BlendColorOwnProps['alpha'];
    static defaults: BlendColorOwnProps;
    static type: string;
    static uniformLocations: string[];
    getCacheKey(): string;
    protected getFragmentSource(): string;
    /**
     * Apply the Blend operation to a Uint8ClampedArray representing the pixels of an image.
     *
     * @param {Object} options
     * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
     */
    applyTo2d({ imageData: { data } }: T2DPipelineState): void;
    /**
     * Send data from this filter to its shader program's uniforms.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
     */
    sendUniformData(gl: WebGLRenderingContext, uniformLocations: TWebGLUniformLocationMap): void;
}
export {};
//# sourceMappingURL=BlendColor.d.ts.map