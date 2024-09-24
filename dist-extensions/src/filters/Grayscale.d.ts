import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
export type TGrayscaleMode = 'average' | 'lightness' | 'luminosity';
type GrayscaleOwnProps = {
    mode: TGrayscaleMode;
};
export declare const grayscaleDefaultValues: GrayscaleOwnProps;
/**
 * Grayscale image filter class
 * @example
 * const filter = new Grayscale();
 * object.filters.push(filter);
 * object.applyFilters();
 */
export declare class Grayscale extends BaseFilter<'Grayscale', GrayscaleOwnProps> {
    mode: TGrayscaleMode;
    static type: string;
    static defaults: GrayscaleOwnProps;
    static uniformLocations: string[];
    /**
     * Apply the Grayscale operation to a Uint8Array representing the pixels of an image.
     *
     * @param {Object} options
     * @param {ImageData} options.imageData The Uint8Array to be filtered.
     */
    applyTo2d({ imageData: { data } }: T2DPipelineState): void;
    getCacheKey(): string;
    getFragmentSource(): string;
    /**
     * Send data from this filter to its shader program's uniforms.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
     */
    sendUniformData(gl: WebGLRenderingContext, uniformLocations: TWebGLUniformLocationMap): void;
    /**
     * Grayscale filter isNeutralState implementation
     * The filter is never neutral
     * on the image
     **/
    isNeutralState(): boolean;
}
export {};
//# sourceMappingURL=Grayscale.d.ts.map