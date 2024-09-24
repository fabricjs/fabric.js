import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
type BrightnessOwnProps = {
    brightness: number;
};
export declare const brightnessDefaultValues: BrightnessOwnProps;
/**
 * Brightness filter class
 * @example
 * const filter = new Brightness({
 *   brightness: 0.05
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
export declare class Brightness extends BaseFilter<'Brightness', BrightnessOwnProps> {
    /**
     * Brightness value, from -1 to 1.
     * translated to -255 to 255 for 2d
     * 0.0039215686 is the part of 1 that get translated to 1 in 2d
     * @param {Number} brightness
     * @default
     */
    brightness: BrightnessOwnProps['brightness'];
    static type: string;
    static defaults: BrightnessOwnProps;
    static uniformLocations: string[];
    getFragmentSource(): string;
    /**
     * Apply the Brightness operation to a Uint8ClampedArray representing the pixels of an image.
     *
     * @param {Object} options
     * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
     */
    applyTo2d({ imageData: { data } }: T2DPipelineState): void;
    isNeutralState(): boolean;
    /**
     * Send data from this filter to its shader program's uniforms.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
     */
    sendUniformData(gl: WebGLRenderingContext, uniformLocations: TWebGLUniformLocationMap): void;
}
export {};
//# sourceMappingURL=Brightness.d.ts.map