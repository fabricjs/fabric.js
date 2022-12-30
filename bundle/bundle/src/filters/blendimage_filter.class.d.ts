import { Image } from '../shapes/image.class';
import type { TClassProperties } from '../typedefs';
import { AbstractBaseFilter } from './base_filter.class';
import type { T2DPipelineState, TWebGLPipelineState, TWebGLUniformLocationMap } from './typedefs';
import { WebGLFilterBackend } from './webgl_backend.class';
/**
 * Image Blend filter class
 * @example
 * const filter = new filters.BlendColor({
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
export declare class BlendImage extends AbstractBaseFilter<Record<string, string>> {
    /**
     * Color to make the blend operation with. default to a reddish color since black or white
     * gives always strong result.
     **/
    image: Image;
    mode: 'multiply' | 'mask';
    /**
     * alpha value. represent the strength of the blend image operation.
     * not implemented.
     **/
    alpha: number;
    getCacheKey(): string;
    getFragmentSource(): string;
    applyToWebGL(options: TWebGLPipelineState): void;
    createTexture(backend: WebGLFilterBackend, image: Image): any;
    /**
     * Calculate a transformMatrix to adapt the image to blend over
     * @param {Object} options
     * @param {WebGLRenderingContext} options.context The GL context used for rendering.
     * @param {Object} options.programCache A map of compiled shader programs, keyed by filter type.
     */
    calculateMatrix(): number[];
    /**
     * Apply the Blend operation to a Uint8ClampedArray representing the pixels of an image.
     *
     * @param {Object} options
     * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
     */
    applyTo2d({ imageData: { data, width, height }, filterBackend: { resources }, }: T2DPipelineState): void;
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
        image: Record<string, any>;
        mode: "multiply" | "mask";
        alpha: number;
    };
    /**
     * Create filter instance from an object representation
     * @static
     * @param {object} object Object to create an instance from
     * @param {object} [options]
     * @param {AbortSignal} [options.signal] handle aborting image loading, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
     * @returns {Promise<BlendImage>}
     */
    static fromObject(object: any, options: any): Promise<BlendImage>;
}
export declare const blendImageDefaultValues: Partial<TClassProperties<BlendImage>>;
//# sourceMappingURL=blendimage_filter.class.d.ts.map