import type { TClassProperties } from '../typedefs';
import { BaseFilter } from './base_filter.class';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
/**
 * Remove white filter class
 * @example
 * const filter = new RemoveColor({
 *   threshold: 0.2,
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 */
export declare class RemoveColor extends BaseFilter {
    /**
     * Color to remove, in any format understood by {@link Color}.
     * @param {String} type
     * @default
     */
    color: string;
    /**
     * distance to actual color, as value up or down from each r,g,b
     * between 0 and 1
     **/
    distance: number;
    /**
     * For color to remove inside distance, use alpha channel for a smoother deletion
     * NOT IMPLEMENTED YET
     **/
    useAlpha: boolean;
    /**
     * Applies filter to canvas element
     * @param {Object} canvasEl Canvas element to apply filter to
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
    /**
     * Returns object representation of an instance
     * @return {Object} Object representation of an instance
     */
    toObject(): {
        color: string;
        distance: number;
        type: string;
    };
    static fromObject(object: any): Promise<RemoveColor>;
}
export declare const removeColorDefaultValues: Partial<TClassProperties<RemoveColor>>;
//# sourceMappingURL=removecolor_filter.class.d.ts.map