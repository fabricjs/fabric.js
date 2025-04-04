import { getEnv } from '../env';
import type {
  T2DPipelineState,
  TWebGLAttributeLocationMap,
  TWebGLPipelineState,
  TWebGLProgramCacheItem,
  TWebGLUniformLocationMap,
} from './typedefs';
import { isWebGLPipelineState } from './utils';
import {
  highPsourceCode,
  identityFragmentShader,
  vertexSource,
} from './shaders/baseFilter';
import type { Abortable } from '../typedefs';
import { FabricError } from '../util/internals/console';
import { createCanvasElementFor } from '../util/misc/dom';

const regex = new RegExp(highPsourceCode, 'g');

export class BaseFilter<
  Name extends string,
  OwnProps extends Record<string, any> = object,
  SerializedProps extends Record<string, any> = OwnProps,
> {
  /**
   * Filter type
   * @param {String} type
   * @default
   */
  get type(): Name {
    return (this.constructor as typeof BaseFilter).type as Name;
  }

  /**
   * The class type. Used to identify which class this is.
   * This is used for serialization purposes and internally it can be used
   * to identify classes. As a developer you could use `instance of Class`
   * but to avoid importing all the code and blocking tree shaking we try
   * to avoid doing that.
   */
  static type = 'BaseFilter';

  /**
   * Contains the uniform locations for the fragment shader.
   * uStepW and uStepH are handled by the BaseFilter, each filter class
   * needs to specify all the one that are needed
   */
  static uniformLocations: string[] = [];

  declare static defaults: Record<string, unknown>;

  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor({
    type,
    ...options
  }: { type?: never } & Partial<OwnProps> & Record<string, any> = {}) {
    Object.assign(
      this,
      (this.constructor as typeof BaseFilter).defaults,
      options,
    );
  }

  protected getFragmentSource(): string {
    return identityFragmentShader;
  }

  getVertexSource(): string {
    return vertexSource;
  }

  /**
   * Compile this filter's shader program.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context to use for shader compilation.
   * @param {String} fragmentSource fragmentShader source for compilation
   * @param {String} vertexSource vertexShader source for compilation
   */
  createProgram(
    gl: WebGLRenderingContext,
    fragmentSource: string = this.getFragmentSource(),
    vertexSource: string = this.getVertexSource(),
  ) {
    const {
      WebGLProbe: { GLPrecision = 'highp' },
    } = getEnv();
    if (GLPrecision !== 'highp') {
      fragmentSource = fragmentSource.replace(
        regex,
        highPsourceCode.replace('highp', GLPrecision),
      );
    }
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    const program = gl.createProgram();

    if (!vertexShader || !fragmentShader || !program) {
      throw new FabricError(
        'Vertex, fragment shader or program creation error',
      );
    }
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      throw new FabricError(
        `Vertex shader compile error for ${this.type}: ${gl.getShaderInfoLog(
          vertexShader,
        )}`,
      );
    }

    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      throw new FabricError(
        `Fragment shader compile error for ${this.type}: ${gl.getShaderInfoLog(
          fragmentShader,
        )}`,
      );
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new FabricError(
        `Shader link error for "${this.type}" ${gl.getProgramInfoLog(program)}`,
      );
    }

    const uniformLocations = this.getUniformLocations(gl, program) || {};
    uniformLocations.uStepW = gl.getUniformLocation(program, 'uStepW');
    uniformLocations.uStepH = gl.getUniformLocation(program, 'uStepH');

    return {
      program,
      attributeLocations: this.getAttributeLocations(gl, program),
      uniformLocations,
    };
  }

  /**
   * Return a map of attribute names to WebGLAttributeLocation objects.
   *
   * @param {WebGLRenderingContext} gl The canvas context used to compile the shader program.
   * @param {WebGLShaderProgram} program The shader program from which to take attribute locations.
   * @returns {Object} A map of attribute names to attribute locations.
   */
  getAttributeLocations(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
  ): TWebGLAttributeLocationMap {
    return {
      aPosition: gl.getAttribLocation(program, 'aPosition'),
    };
  }

  /**
   * Return a map of uniform names to WebGLUniformLocation objects.
   *
   * @param {WebGLRenderingContext} gl The canvas context used to compile the shader program.
   * @param {WebGLShaderProgram} program The shader program from which to take uniform locations.
   * @returns {Object} A map of uniform names to uniform locations.
   */
  getUniformLocations(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
  ): TWebGLUniformLocationMap {
    const locations = (this.constructor as unknown as typeof BaseFilter<string>)
      .uniformLocations;

    const uniformLocations: Record<string, WebGLUniformLocation | null> = {};
    for (let i = 0; i < locations.length; i++) {
      uniformLocations[locations[i]] = gl.getUniformLocation(
        program,
        locations[i],
      );
    }
    return uniformLocations;
  }

  /**
   * Send attribute data from this filter to its shader program on the GPU.
   *
   * @param {WebGLRenderingContext} gl The canvas context used to compile the shader program.
   * @param {Object} attributeLocations A map of shader attribute names to their locations.
   */
  sendAttributeData(
    gl: WebGLRenderingContext,
    attributeLocations: Record<string, number>,
    aPositionData: Float32Array,
  ) {
    const attributeLocation = attributeLocations.aPosition;
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(attributeLocation);
    gl.vertexAttribPointer(attributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, aPositionData, gl.STATIC_DRAW);
  }

  _setupFrameBuffer(options: TWebGLPipelineState) {
    const gl = options.context;
    if (options.passes > 1) {
      const width = options.destinationWidth;
      const height = options.destinationHeight;
      if (options.sourceWidth !== width || options.sourceHeight !== height) {
        gl.deleteTexture(options.targetTexture);
        options.targetTexture = options.filterBackend.createTexture(
          gl,
          width,
          height,
        );
      }
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        options.targetTexture,
        0,
      );
    } else {
      // draw last filter on canvas and not to framebuffer.
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.finish();
    }
  }

  _swapTextures(options: TWebGLPipelineState) {
    options.passes--;
    options.pass++;
    const temp = options.targetTexture;
    options.targetTexture = options.sourceTexture;
    options.sourceTexture = temp;
  }

  /**
   * Generic isNeutral implementation for one parameter based filters.
   * Used only in image applyFilters to discard filters that will not have an effect
   * on the image
   * Other filters may need their own version ( ColorMatrix, HueRotation, gamma, ComposedFilter )
   * @param {Object} options
   **/
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isNeutralState(options?: any): boolean {
    return false;
  }

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
  applyTo(options: TWebGLPipelineState | T2DPipelineState) {
    if (isWebGLPipelineState(options)) {
      this._setupFrameBuffer(options);
      this.applyToWebGL(options);
      this._swapTextures(options);
    } else {
      this.applyTo2d(options);
    }
  }

  applyTo2d(_options: T2DPipelineState): void {
    // override by subclass
  }

  /**
   * Returns a string that represent the current selected shader code for the filter.
   * Used to force recompilation when parameters change or to retrieve the shader from cache
   * @type string
   **/
  getCacheKey(): string {
    return this.type;
  }

  /**
   * Retrieves the cached shader.
   * @param {Object} options
   * @param {WebGLRenderingContext} options.context The GL context used for rendering.
   * @param {Object} options.programCache A map of compiled shader programs, keyed by filter type.
   * @return {WebGLProgram} the compiled program shader
   */
  retrieveShader(options: TWebGLPipelineState): TWebGLProgramCacheItem {
    const key = this.getCacheKey();
    if (!options.programCache[key]) {
      options.programCache[key] = this.createProgram(options.context);
    }
    return options.programCache[key];
  }

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
  applyToWebGL(options: TWebGLPipelineState) {
    const gl = options.context;
    const shader = this.retrieveShader(options);
    if (options.pass === 0 && options.originalTexture) {
      gl.bindTexture(gl.TEXTURE_2D, options.originalTexture);
    } else {
      gl.bindTexture(gl.TEXTURE_2D, options.sourceTexture);
    }
    gl.useProgram(shader.program);
    this.sendAttributeData(gl, shader.attributeLocations, options.aPosition);

    gl.uniform1f(shader.uniformLocations.uStepW, 1 / options.sourceWidth);
    gl.uniform1f(shader.uniformLocations.uStepH, 1 / options.sourceHeight);

    this.sendUniformData(gl, shader.uniformLocations);
    gl.viewport(0, 0, options.destinationWidth, options.destinationHeight);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  bindAdditionalTexture(
    gl: WebGLRenderingContext,
    texture: WebGLTexture,
    textureUnit: number,
  ) {
    gl.activeTexture(textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // reset active texture to 0 as usual
    gl.activeTexture(gl.TEXTURE0);
  }

  unbindAdditionalTexture(gl: WebGLRenderingContext, textureUnit: number) {
    gl.activeTexture(textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.activeTexture(gl.TEXTURE0);
  }

  /**
   * Send uniform data from this filter to its shader program on the GPU.
   *
   * Intended to be overridden by subclasses.
   *
   * @param {WebGLRenderingContext} _gl The canvas context used to compile the shader program.
   * @param {Object} _uniformLocations A map of shader uniform names to their locations.
   */
  sendUniformData(
    _gl: WebGLRenderingContext,
    _uniformLocations: TWebGLUniformLocationMap,
  ): void {
    // override by subclass
  }

  /**
   * If needed by a 2d filter, this functions can create an helper canvas to be used
   * remember that options.targetCanvas is available for use till end of chain.
   */
  createHelpLayer(options: T2DPipelineState) {
    if (!options.helpLayer) {
      const { sourceWidth, sourceHeight } = options;
      const helpLayer = createCanvasElementFor({
        width: sourceWidth,
        height: sourceHeight,
      });
      options.helpLayer = helpLayer;
    }
  }

  /**
   * Returns object representation of an instance
   * It will automatically export the default values of a filter,
   * stored in the static defaults property.
   * @return {Object} Object representation of an instance
   */
  toObject(): { type: Name } & SerializedProps {
    const defaultKeys = Object.keys(
      (this.constructor as typeof BaseFilter).defaults || {},
    ) as (keyof SerializedProps)[];

    return {
      type: this.type,
      ...defaultKeys.reduce<SerializedProps>((acc, key) => {
        acc[key] = this[
          key as keyof this
        ] as unknown as (typeof acc)[typeof key];
        return acc;
      }, {} as SerializedProps),
    };
  }

  /**
   * Returns a JSON representation of an instance
   * @return {Object} JSON
   */
  toJSON() {
    // delegate, not alias
    return this.toObject();
  }

  static async fromObject(
    { type, ...filterOptions }: Record<string, any>,
    _options: Abortable,
  ): Promise<BaseFilter<string, object>> {
    return new this(filterOptions);
  }
}
