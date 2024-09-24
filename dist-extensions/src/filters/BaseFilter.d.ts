import type { T2DPipelineState, TWebGLAttributeLocationMap, TWebGLPipelineState, TWebGLProgramCacheItem, TWebGLUniformLocationMap } from './typedefs';
import type { Abortable } from '../typedefs';
export declare class BaseFilter<Name extends string, OwnProps extends Record<string, any> = object> {
    /**
     * Filter type
     * @param {String} type
     * @default
     */
    get type(): Name;
    /**
     * The class type. Used to identify which class this is.
     * This is used for serialization purposes and internally it can be used
     * to identify classes. As a developer you could use `instance of Class`
     * but to avoid importing all the code and blocking tree shaking we try
     * to avoid doing that.
     */
    static type: string;
    /**
     * Contains the uniform locations for the fragment shader.
     * uStepW and uStepH are handled by the BaseFilter, each filter class
     * needs to specify all the one that are needed
     */
    static uniformLocations: string[];
    static defaults: Record<string, unknown>;
    /**
     * Constructor
     * @param {Object} [options] Options object
     */
    constructor({ type, ...options }?: {
        type?: never;
    } & Partial<OwnProps> & Record<string, any>);
    protected getFragmentSource(): string;
    getVertexSource(): string;
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
     * @param {WebGLRenderingContext} gl The canvas context used to compile the shader program.
     * @param {WebGLShaderProgram} program The shader program from which to take uniform locations.
     * @returns {Object} A map of uniform names to uniform locations.
     */
    getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram): TWebGLUniformLocationMap;
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
    applyTo2d(_options: T2DPipelineState): void;
    /**
     * Returns a string that represent the current selected shader code for the filter.
     * Used to force recompilation when parameters change or to retrieve the shader from cache
     * @type string
     **/
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
    /**
     * Send uniform data from this filter to its shader program on the GPU.
     *
     * Intended to be overridden by subclasses.
     *
     * @param {WebGLRenderingContext} _gl The canvas context used to compile the shader program.
     * @param {Object} _uniformLocations A map of shader uniform names to their locations.
     */
    sendUniformData(_gl: WebGLRenderingContext, _uniformLocations: TWebGLUniformLocationMap): void;
    /**
     * If needed by a 2d filter, this functions can create an helper canvas to be used
     * remember that options.targetCanvas is available for use till end of chain.
     */
    createHelpLayer(options: T2DPipelineState): void;
    /**
     * Returns object representation of an instance
     * It will automatically export the default values of a filter,
     * stored in the static defaults property.
     * @return {Object} Object representation of an instance
     */
    toObject(): {
        type: Name;
    } & OwnProps;
    /**
     * Returns a JSON representation of an instance
     * @return {Object} JSON
     */
    toJSON(): {
        type: Name;
    } & OwnProps;
    static fromObject({ type, ...filterOptions }: Record<string, any>, _options: Abortable): Promise<BaseFilter<string, object>>;
}
//# sourceMappingURL=BaseFilter.d.ts.map