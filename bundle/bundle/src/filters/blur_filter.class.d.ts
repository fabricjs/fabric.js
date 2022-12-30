import type { TClassProperties } from '../typedefs';
import { BaseFilter } from './base_filter.class';
import type { TWebGLPipelineState, T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
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
export declare class Blur extends BaseFilter {
    /**
     * blur value, in percentage of image dimensions.
     * specific to keep the image blur constant at different resolutions
     * range between 0 and 1.
     * @type Number
     * @default
     */
    blur: number;
    horizontal: boolean;
    aspectRatio: number;
    applyTo(options: TWebGLPipelineState | T2DPipelineState): void;
    applyTo2d(options: T2DPipelineState): void;
    simpleBlur({ ctx, imageData, filterBackend: { resources }, }: T2DPipelineState): ImageData;
    /**
     * Return WebGL uniform locations for this filter's shader.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {WebGLShaderProgram} program This filter's compiled shader program.
     */
    getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram): TWebGLUniformLocationMap;
    /**
     * Send data from this filter to its shader program's uniforms.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
     */
    sendUniformData(gl: WebGLRenderingContext, uniformLocations: TWebGLUniformLocationMap): void;
    /**
     * choose right value of image percentage to blur with
     * @returns {Array} a numeric array with delta values
     */
    chooseRightDelta(): number[];
    static fromObject(object: any): Promise<Blur>;
}
export declare const blurDefaultValues: Partial<TClassProperties<Blur>>;
//# sourceMappingURL=blur_filter.class.d.ts.map