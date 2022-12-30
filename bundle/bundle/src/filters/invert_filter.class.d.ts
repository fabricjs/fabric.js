import type { TClassProperties } from '../typedefs';
import { BaseFilter } from './base_filter.class';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
/**
 * @example
 * const filter = new Invert();
 * object.filters.push(filter);
 * object.applyFilters(canvas.renderAll.bind(canvas));
 */
export declare class Invert extends BaseFilter {
    /**
     * Invert also alpha.
     * @param {Boolean} alpha
     * @default
     **/
    alpha: boolean;
    /**
     * Filter invert. if false, does nothing
     * @param {Boolean} invert
     * @default
     */
    invert: boolean;
    /**
     * Apply the Invert operation to a Uint8Array representing the pixels of an image.
     *
     * @param {Object} options
     * @param {ImageData} options.imageData The Uint8Array to be filtered.
     */
    applyTo2d({ imageData: { data } }: T2DPipelineState): void;
    /**
     * Invert filter isNeutralState implementation
     * Used only in image applyFilters to discard filters that will not have an effect
     * on the image
     * @param {Object} options
     **/
    isNeutralState(): boolean;
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
    static fromObject(object: any): Promise<Invert>;
}
export declare const invertDefaultValues: Partial<TClassProperties<Invert>>;
//# sourceMappingURL=invert_filter.class.d.ts.map