import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
type ContrastOwnProps = {
    contrast: number;
};
export declare const contrastDefaultValues: ContrastOwnProps;
/**
 * Contrast filter class
 * @example
 * const filter = new Contrast({
 *   contrast: 0.25
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
export declare class Contrast extends BaseFilter<'Contrast', ContrastOwnProps> {
    /**
     * contrast value, range from -1 to 1.
     * @param {Number} contrast
     * @default 0
     */
    contrast: ContrastOwnProps['contrast'];
    static type: string;
    static defaults: ContrastOwnProps;
    static uniformLocations: string[];
    getFragmentSource(): string;
    isNeutralState(): boolean;
    /**
     * Apply the Contrast operation to a Uint8Array representing the pixels of an image.
     *
     * @param {Object} options
     * @param {ImageData} options.imageData The Uint8Array to be filtered.
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
//# sourceMappingURL=Contrast.d.ts.map