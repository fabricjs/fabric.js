import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
export type VibranceOwnProps = {
    vibrance: number;
};
export declare const vibranceDefaultValues: VibranceOwnProps;
/**
 * Vibrance filter class
 * @example
 * const filter = new Vibrance({
 *   vibrance: 1
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
export declare class Vibrance extends BaseFilter<'Vibrance', VibranceOwnProps> {
    /**
     * Vibrance value, from -1 to 1.
     * Increases/decreases the saturation of more muted colors with less effect on saturated colors.
     * A value of 0 has no effect.
     *
     * @param {Number} vibrance
     * @default
     */
    vibrance: VibranceOwnProps['vibrance'];
    static type: string;
    static defaults: VibranceOwnProps;
    static uniformLocations: string[];
    getFragmentSource(): string;
    /**
     * Apply the Vibrance operation to a Uint8ClampedArray representing the pixels of an image.
     *
     * @param {Object} options
     * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
     */
    applyTo2d({ imageData: { data } }: T2DPipelineState): void;
    /**
     * Send data from this filter to its shader program's uniforms.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {TWebGLUniformLocationMap} uniformLocations A map of string uniform names to WebGLUniformLocation objects
     */
    sendUniformData(gl: WebGLRenderingContext, uniformLocations: TWebGLUniformLocationMap): void;
    isNeutralState(): boolean;
}
//# sourceMappingURL=Vibrance.d.ts.map