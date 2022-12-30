import { TClassProperties } from '../typedefs';
import { AbstractBaseFilter } from './base_filter.class';
import { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
/**
 * Color Blend filter class
 * @example
 * const filter = new BlendColor({
 *  color: '#000',
 *  mode: 'multiply'
 * });
 *
 * const filter = new BlendImage({
 *  image: fabricImageObject,
 *  mode: 'multiply',
 *  alpha: 0.5
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 */
export declare class BlendColor extends AbstractBaseFilter<Record<string, string>> {
    /**
     * Color to make the blend operation with. default to a reddish color since black or white
     * gives always strong result.
     * @type String
     * @default
     **/
    color: string;
    mode: 'multiply' | 'add' | 'diff' | 'difference' | 'screen' | 'subtract' | 'darken' | 'lighten' | 'overlay' | 'exclusion' | 'tint';
    /**
     * alpha value. represent the strength of the blend color operation.
     * @type Number
     * @default
     **/
    alpha: number;
    /**
     * build the fragment source for the filters, joining the common part with
     * the specific one.
     * @param {String} mode the mode of the filter, a key of this.fragmentSource
     * @return {String} the source to be compiled
     * @private
     */
    buildSource(mode: string): string;
    getCacheKey(): string;
    getFragmentSource(): string;
    /**
     * Apply the Blend operation to a Uint8ClampedArray representing the pixels of an image.
     *
     * @param {Object} options
     * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
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
        type: string;
        color: string;
        mode: "darken" | "difference" | "exclusion" | "lighten" | "multiply" | "overlay" | "screen" | "add" | "diff" | "subtract" | "tint";
        alpha: number;
    };
    static fromObject(object: any): Promise<BlendColor>;
}
export declare const blendColorDefaultValues: Partial<TClassProperties<BlendColor>>;
//# sourceMappingURL=blendcolor_filter.class.d.ts.map