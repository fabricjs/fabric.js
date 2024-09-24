import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
export type NoiseOwnProps = {
    noise: number;
};
export declare const noiseDefaultValues: NoiseOwnProps;
/**
 * Noise filter class
 * @example
 * const filter = new Noise({
 *   noise: 700
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 */
export declare class Noise extends BaseFilter<'Noise', NoiseOwnProps> {
    /**
     * Noise value, from
     * @param {Number} noise
     * @default
     */
    noise: NoiseOwnProps['noise'];
    static type: string;
    static defaults: NoiseOwnProps;
    static uniformLocations: string[];
    getFragmentSource(): string;
    /**
     * Apply the Brightness operation to a Uint8ClampedArray representing the pixels of an image.
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
    isNeutralState(): boolean;
}
//# sourceMappingURL=Noise.d.ts.map