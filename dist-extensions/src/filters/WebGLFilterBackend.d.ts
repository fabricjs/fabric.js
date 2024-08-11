import type { TWebGLPipelineState, TProgramCache, TTextureCache, TPipelineResources } from './typedefs';
import type { BaseFilter } from './BaseFilter';
export declare class WebGLFilterBackend {
    tileSize: number;
    /**
     * Define ...
     **/
    aPosition: Float32Array;
    /**
     * If GLPut data is the fastest operation, or if forced, this buffer will be used
     * to transfer the data back in the 2d logic
     **/
    imageBuffer?: ArrayBuffer;
    canvas: HTMLCanvasElement;
    /**
     * The Webgl context that will execute the operations for filtering
     **/
    gl: WebGLRenderingContext;
    /**
     * Keyed map for shader cache
     **/
    programCache: TProgramCache;
    /**
     * Keyed map for texture cache
     **/
    textureCache: TTextureCache;
    /**
     * Contains GPU info for debug
     **/
    gpuInfo: any;
    /**
     * Experimental. This object is a sort of repository of help layers used to avoid
     * of recreating them during frequent filtering. If you are previewing a filter with
     * a slider you probably do not want to create help layers every filter step.
     * in this object there will be appended some canvases, created once, resized sometimes
     * cleared never. Clearing is left to the developer.
     **/
    resources: TPipelineResources;
    constructor({ tileSize }?: {
        tileSize?: number | undefined;
    });
    /**
     * Setup a WebGL context suitable for filtering, and bind any needed event handlers.
     */
    setupGLContext(width: number, height: number): void;
    /**
     * Create a canvas element and associated WebGL context and attaches them as
     * class properties to the GLFilterBackend class.
     */
    createWebGLCanvas(width: number, height: number): void;
    /**
     * Attempts to apply the requested filters to the source provided, drawing the filtered output
     * to the provided target canvas.
     *
     * @param {Array} filters The filters to apply.
     * @param {TexImageSource} source The source to be filtered.
     * @param {Number} width The width of the source input.
     * @param {Number} height The height of the source input.
     * @param {HTMLCanvasElement} targetCanvas The destination for filtered output to be drawn.
     * @param {String|undefined} cacheKey A key used to cache resources related to the source. If
     * omitted, caching will be skipped.
     */
    applyFilters(filters: BaseFilter<string, Record<string, any>>[], source: TexImageSource, width: number, height: number, targetCanvas: HTMLCanvasElement, cacheKey?: string): TWebGLPipelineState | undefined;
    /**
     * Detach event listeners, remove references, and clean up caches.
     */
    dispose(): void;
    /**
     * Wipe out WebGL-related caches.
     */
    clearWebGLCaches(): void;
    /**
     * Create a WebGL texture object.
     *
     * Accepts specific dimensions to initialize the texture to or a source image.
     *
     * @param {WebGLRenderingContext} gl The GL context to use for creating the texture.
     * @param {number} width The width to initialize the texture at.
     * @param {number} height The height to initialize the texture.
     * @param {TexImageSource} textureImageSource A source for the texture data.
     * @param {number} filter gl.NEAREST default or gl.LINEAR filters for the texture.
     * This filter is very useful for LUTs filters. If you need interpolation use gl.LINEAR
     * @returns {WebGLTexture}
     */
    createTexture(gl: WebGLRenderingContext, width: number, height: number, textureImageSource?: TexImageSource, filter?: WebGLRenderingContextBase['NEAREST'] | WebGLRenderingContextBase['LINEAR']): WebGLTexture | null;
    /**
     * Can be optionally used to get a texture from the cache array
     *
     * If an existing texture is not found, a new texture is created and cached.
     *
     * @param {String} uniqueId A cache key to use to find an existing texture.
     * @param {HTMLImageElement|HTMLCanvasElement} textureImageSource A source to use to create the
     * texture cache entry if one does not already exist.
     */
    getCachedTexture(uniqueId: string, textureImageSource: TexImageSource, filter?: WebGLRenderingContextBase['NEAREST'] | WebGLRenderingContextBase['LINEAR']): WebGLTexture | null;
    /**
     * Clear out cached resources related to a source image that has been
     * filtered previously.
     *
     * @param {String} cacheKey The cache key provided when the source image was filtered.
     */
    evictCachesForKey(cacheKey: string): void;
    /**
     * Copy an input WebGL canvas on to an output 2D canvas.
     *
     * The WebGL canvas is assumed to be upside down, with the top-left pixel of the
     * desired output image appearing in the bottom-left corner of the WebGL canvas.
     *
     * @param {WebGLRenderingContext} sourceContext The WebGL context to copy from.
     * @param {Object} pipelineState The 2D target canvas to copy on to.
     */
    copyGLTo2D(gl: WebGLRenderingContext, pipelineState: TWebGLPipelineState): void;
    /**
     * Copy an input WebGL canvas on to an output 2D canvas using 2d canvas' putImageData
     * API. Measurably faster than using ctx.drawImage in Firefox (version 54 on OSX Sierra).
     *
     * @param {WebGLRenderingContext} sourceContext The WebGL context to copy from.
     * @param {HTMLCanvasElement} targetCanvas The 2D target canvas to copy on to.
     * @param {Object} pipelineState The 2D target canvas to copy on to.
     */
    copyGLTo2DPutImageData(this: Required<WebGLFilterBackend>, gl: WebGLRenderingContext, pipelineState: TWebGLPipelineState): void;
    /**
     * Attempt to extract GPU information strings from a WebGL context.
     *
     * Useful information when debugging or blacklisting specific GPUs.
     *
     * @returns {Object} A GPU info object with renderer and vendor strings.
     */
    captureGPUInfo(): any;
}
//# sourceMappingURL=WebGLFilterBackend.d.ts.map