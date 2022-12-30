import type { T2DPipelineState, TWebGLAttributeLocationMap, TWebGLPipelineState, TWebGLProgramCacheItem, TWebGLUniformLocationMap } from './typedefs';
export type AbstractBaseFilterOptions<T> = {
    mainParameter: string;
    vertexSource: string;
    fragmentSource: T;
};
export type BaseFilterOptions = AbstractBaseFilterOptions<string>;
export declare abstract class AbstractBaseFilter<T> {
    /**
     * Filter type
     * @param {String} type
     * @default
     */
    type: string;
    /**
     * Array of attributes to send with buffers. do not modify
     * @private
     */
    vertexSource: string;
    fragmentSource: T;
    /**
     * Name of the parameter that can be changed in the filter.
     * Some filters have more than one parameter and there is no
     * mainParameter
     * @private
     */
    mainParameter?: keyof this;
    /**
     * Constructor
     * @param {Object} [options] Options object
     */
    constructor(options?: Partial<AbstractBaseFilterOptions<T>>);
    /**
     * Sets filter's properties from options
     * @param {Object} [options] Options object
     */
    setOptions(options: Record<string, any>): void;
    abstract getFragmentSource(): string;
    /**
     * Compile this filter's shader program.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context to use for shader compilation.
     * @param {String} fragmentSource fragmentShader source for compilation
     * @param {String} vertexSource vertexShader source for compilation
     */
    createProgram(gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string): {
        program: WebGLProgram;
        attributeLocations: TWebGLAttributeLocationMap;
        uniformLocations: TWebGLUniformLocationMap;
    };
    /**
     * Return a map of attribute names to WebGLAttributeLocation objects.
     *
     * @param {WebGLRenderingContext} gl The canvas context used to compile the shader program.
     * @param {WebGLShaderProgram} program The shader program from which to take attribute locations.
     * @returns {Object} A map of attribute names to attribute locations.
     */
    getAttributeLocations(gl: WebGLRenderingContext, program: WebGLProgram): TWebGLAttributeLocationMap;
    /**
     * Return a map of uniform names to WebGLUniformLocation objects.
     *
     * Intended to be overridden by subclasses.
     *
     * @param {WebGLRenderingContext} gl The canvas context used to compile the shader program.
     * @param {WebGLShaderProgram} program The shader program from which to take uniform locations.
     * @returns {Object} A map of uniform names to uniform locations.
     */
    abstract getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram): TWebGLUniformLocationMap;
    /**
     * Send attribute data from this filter to its shader program on the GPU.
     *
     * @param {WebGLRenderingContext} gl The canvas context used to compile the shader program.
     * @param {Object} attributeLocations A map of shader attribute names to their locations.
     */
    sendAttributeData(gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array): void;
    _setupFrameBuffer(options: TWebGLPipelineState): void;
    _swapTextures(options: TWebGLPipelineState): void;
    /**
     * Generic isNeutral implementation for one parameter based filters.
     * Used only in image applyFilters to discard filters that will not have an effect
     * on the image
     * Other filters may need their own version ( ColorMatrix, HueRotation, gamma, ComposedFilter )
     * @param {Object} options
     **/
    isNeutralState(options?: any): boolean;
    /**
     * Apply this filter to the input image data provided.
     *
     * Determines whether to use WebGL or Canvas2D based on the options.webgl flag.
     *
     * @param {Object} options
     * @param {Number} options.passes The number of filters remaining to be executed
     * @param {Boolean} options.webgl Whether to use webgl to render the filter.
     * @param {WebGLTexture} options.sourceTexture The texture setup as the source to be filtered.
     * @param {WebGLTexture} options.targetTexture The texture where filtered output should be drawn.
     * @param {WebGLRenderingContext} options.context The GL context used for rendering.
     * @param {Object} options.programCache A map of compiled shader programs, keyed by filter type.
     */
    applyTo(options: TWebGLPipelineState | T2DPipelineState): void;
    abstract applyTo2d(options: T2DPipelineState): void;
    getCacheKey(): string;
    /**
     * Retrieves the cached shader.
     * @param {Object} options
     * @param {WebGLRenderingContext} options.context The GL context used for rendering.
     * @param {Object} options.programCache A map of compiled shader programs, keyed by filter type.
     * @return {WebGLProgram} the compiled program shader
     */
    retrieveShader(options: TWebGLPipelineState): TWebGLProgramCacheItem;
    /**
     * Apply this filter using webgl.
     *
     * @param {Object} options
     * @param {Number} options.passes The number of filters remaining to be executed
     * @param {Boolean} options.webgl Whether to use webgl to render the filter.
     * @param {WebGLTexture} options.originalTexture The texture of the original input image.
     * @param {WebGLTexture} options.sourceTexture The texture setup as the source to be filtered.
     * @param {WebGLTexture} options.targetTexture The texture where filtered output should be drawn.
     * @param {WebGLRenderingContext} options.context The GL context used for rendering.
     * @param {Object} options.programCache A map of compiled shader programs, keyed by filter type.
     */
    applyToWebGL(options: TWebGLPipelineState): void;
    bindAdditionalTexture(gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number): void;
    unbindAdditionalTexture(gl: WebGLRenderingContext, textureUnit: number): void;
    getMainParameter(): this[keyof this] | undefined;
    setMainParameter(value: any): void;
    /**
     * Send uniform data from this filter to its shader program on the GPU.
     *
     * Intended to be overridden by subclasses.
     *
     * @param {WebGLRenderingContext} gl The canvas context used to compile the shader program.
     * @param {Object} uniformLocations A map of shader uniform names to their locations.
     */
    abstract sendUniformData(gl: WebGLRenderingContext, uniformLocations: TWebGLUniformLocationMap): void;
    /**
     * If needed by a 2d filter, this functions can create an helper canvas to be used
     * remember that options.targetCanvas is available for use till end of chain.
     */
    createHelpLayer(options: T2DPipelineState): void;
    /**
     * Returns object representation of an instance
     * @return {Object} Object representation of an instance
     */
    toObject(): {
        type: string;
    };
    /**
     * Returns a JSON representation of an instance
     * @return {Object} JSON
     */
    toJSON(): {
        type: string;
    };
}
export declare abstract class BaseFilter extends AbstractBaseFilter<string> {
    getFragmentSource(): string;
}
//# sourceMappingURL=base_filter.class.d.ts.map