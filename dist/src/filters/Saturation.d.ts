import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
export type SaturationOwnProps = {
    saturation: number;
};
export declare const saturationDefaultValues: SaturationOwnProps;
/**
 * Saturate filter class
 * @example
 * const filter = new Saturation({
 *   saturation: 1
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
export declare class Saturation extends BaseFilter<'Saturation', SaturationOwnProps> {
    /**
     * Saturation value, from -1 to 1.
     * Increases/decreases the color saturation.
     * A value of 0 has no effect.
     *
     * @param {Number} saturation
     * @default
     */
    saturation: SaturationOwnProps['saturation'];
    static type: string;
    static defaults: SaturationOwnProps;
    static uniformLocations: string[];
    getFragmentSource(): string;
    /**
     * Apply the Saturation operation to a Uint8ClampedArray representing the pixels of an image.
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
//# sourceMappingURL=Saturation.d.ts.map