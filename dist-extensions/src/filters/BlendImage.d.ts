import { FabricImage } from '../shapes/Image';
import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLPipelineState, TWebGLUniformLocationMap } from './typedefs';
import type { WebGLFilterBackend } from './WebGLFilterBackend';
export type TBlendImageMode = 'multiply' | 'mask';
type BlendImageOwnProps = {
    mode: TBlendImageMode;
    alpha: number;
};
export declare const blendImageDefaultValues: BlendImageOwnProps;
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
 *  mode: 'multiply'
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 */
export declare class BlendImage extends BaseFilter<'BlendImage', BlendImageOwnProps> {
    /**
     * Image to make the blend operation with.
     **/
    image: FabricImage;
    /**
     * Blend mode for the filter: either 'multiply' or 'mask'. 'multiply' will
     * multiply the values of each channel (R, G, B, and A) of the filter image by
     * their corresponding values in the base image. 'mask' will only look at the
     * alpha channel of the filter image, and apply those values to the base
     * image's alpha channel.
     * @type String
     * @default
     **/
    mode: BlendImageOwnProps['mode'];
    /**
     * alpha value. represent the strength of the blend image operation.
     * not implemented.
     **/
    alpha: BlendImageOwnProps['alpha'];
    static type: string;
    static defaults: BlendImageOwnProps;
    static uniformLocations: string[];
    getCacheKey(): string;
    getFragmentSource(): string;
    getVertexSource(): string;
    applyToWebGL(options: TWebGLPipelineState): void;
    createTexture(backend: WebGLFilterBackend, image: FabricImage): WebGLTexture | null;
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
     * Send data from this filter to its shader program's uniforms.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
     */
    sendUniformData(gl: WebGLRenderingContext, uniformLocations: TWebGLUniformLocationMap): void;
    /**
     * Returns object representation of an instance
     * TODO: Handle the possibility of missing image better.
     * As of now a BlendImage filter without image can't be used with fromObject
     * @return {Object} Object representation of an instance
     */
    toObject(): {
        type: 'BlendImage';
        image: ReturnType<FabricImage['toObject']>;
    } & BlendImageOwnProps;
    /**
     * Create filter instance from an object representation
     * @static
     * @param {object} object Object to create an instance from
     * @param {object} [options]
     * @param {AbortSignal} [options.signal] handle aborting image loading, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
     * @returns {Promise<BlendImage>}
     */
    static fromObject({ type, image, ...filterOptions }: Record<string, any>, options: {
        signal: AbortSignal;
    }): Promise<BaseFilter<'BlendImage', BlendImageOwnProps>>;
}
export {};
//# sourceMappingURL=BlendImage.d.ts.map