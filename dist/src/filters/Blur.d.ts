import { BaseFilter } from './BaseFilter';
import type { TWebGLPipelineState, T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
type BlurOwnProps = {
    blur: number;
};
export declare const blurDefaultValues: BlurOwnProps;
/**
 * Blur filter class
 * @example
 * const filter = new Blur({
 *   blur: 0.5
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 */
export declare class Blur extends BaseFilter<'Blur', BlurOwnProps> {
    /**
     * blur value, in percentage of image dimensions.
     * specific to keep the image blur constant at different resolutions
     * range between 0 and 1.
     * @type Number
     * @default
     */
    blur: BlurOwnProps['blur'];
    horizontal: boolean;
    aspectRatio: number;
    static type: string;
    static defaults: BlurOwnProps;
    static uniformLocations: string[];
    getFragmentSource(): string;
    applyTo(options: TWebGLPipelineState | T2DPipelineState): void;
    applyTo2d(options: T2DPipelineState): void;
    simpleBlur({ ctx, imageData, filterBackend: { resources }, }: T2DPipelineState): ImageData;
    /**
     * Send data from this filter to its shader program's uniforms.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
     */
    sendUniformData(gl: WebGLRenderingContext, uniformLocations: TWebGLUniformLocationMap): void;
    isNeutralState(): boolean;
    /**
     * choose right value of image percentage to blur with
     * @returns {Array} a numeric array with delta values
     */
    chooseRightDelta(): number[];
}
export {};
//# sourceMappingURL=Blur.d.ts.map