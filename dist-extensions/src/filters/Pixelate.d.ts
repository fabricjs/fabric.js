import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
export type PixelateOwnProps = {
    blocksize: number;
};
export declare const pixelateDefaultValues: PixelateOwnProps;
/**
 * Pixelate filter class
 * @example
 * const filter = new Pixelate({
 *   blocksize: 8
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
export declare class Pixelate extends BaseFilter<'Pixelate', PixelateOwnProps> {
    blocksize: PixelateOwnProps['blocksize'];
    static type: string;
    static defaults: PixelateOwnProps;
    static uniformLocations: string[];
    /**
     * Apply the Pixelate operation to a Uint8ClampedArray representing the pixels of an image.
     *
     * @param {Object} options
     * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
     */
    applyTo2d({ imageData: { data, width, height } }: T2DPipelineState): void;
    /**
     * Indicate when the filter is not gonna apply changes to the image
     **/
    isNeutralState(): boolean;
    protected getFragmentSource(): string;
    /**
     * Send data from this filter to its shader program's uniforms.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
     */
    sendUniformData(gl: WebGLRenderingContext, uniformLocations: TWebGLUniformLocationMap): void;
}
//# sourceMappingURL=Pixelate.d.ts.map