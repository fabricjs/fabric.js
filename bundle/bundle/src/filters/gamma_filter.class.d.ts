import type { TClassProperties } from '../typedefs';
import { BaseFilter, BaseFilterOptions } from './base_filter.class';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
export type GammaInput = [number, number, number];
/**
 * Gamma filter class
 * @example
 * const filter = new Gamma({
 *   gamma: [1, 0.5, 2.1]
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
export declare class Gamma extends BaseFilter {
    /**
     * Gamma array value, from 0.01 to 2.2.
     * @param {Array} gamma
     * @default
     */
    gamma: GammaInput;
    rgbValues?: {
        r: Uint8Array;
        g: Uint8Array;
        b: Uint8Array;
    };
    constructor({ gamma, ...options }?: Partial<BaseFilterOptions> & {
        gamma?: GammaInput;
    });
    /**
     * Apply the Gamma operation to a Uint8Array representing the pixels of an image.
     *
     * @param {Object} options
     * @param {ImageData} options.imageData The Uint8Array to be filtered.
     */
    applyTo2d({ imageData: { data } }: T2DPipelineState): void;
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
    static fromObject(object: any): Promise<Gamma>;
}
export declare const gammaDefaultValues: Partial<TClassProperties<Gamma>>;
//# sourceMappingURL=gamma_filter.class.d.ts.map