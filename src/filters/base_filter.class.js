/**
 * @namespace fabric.Image.filters
 * @memberOf fabric.Image
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-2#image_filters}
 * @see {@link http://fabricjs.com/image-filters|ImageFilters demo}
 */
fabric.Image.filters = fabric.Image.filters || { };

/**
 * Root filter class from which all filter classes inherit from
 * @class fabric.Image.filters.BaseFilter
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.BaseFilter = fabric.util.createClass(/** @lends fabric.Image.filters.BaseFilter.prototype */ {

  /**
   * Filter type
   * @param {String} type
   * @default
   */
  type: 'BaseFilter',

  vertexSource: 'attribute vec2 aPosition;\n' +
    'attribute vec2 aTexCoord;\n' +
    'varying vec2 vTexCoord;\n' +
    'void main() {\n' +
      'vTexCoord = aTexCoord;\n' +
      'gl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);\n' +
    '}',

  fragmentSource: 'precision highp float;\n' +
    'varying vec2 vTexCoord;\n' +
    'uniform sampler2D uTexture;\n' +
    'void main() {\n' +
      'gl_FragColor = texture2D(uTexture, vTexCoord);\n' +
    '}',

  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  initialize: function(options) {
    if (options) {
      this.setOptions(options);
    }
  },

  /**
   * Sets filter's properties from options
   * @param {Object} [options] Options object
   */
  setOptions: function(options) {
    for (var prop in options) {
      this[prop] = options[prop];
    }
  },

  /**
   * Compile this filter's shader program.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context to use for shader compilation.
   * @param {String} fragmentSource fragmentShader source for compilation
   * @param {String} vertexSource vertexShader source for compilation
   */
  createProgram: function(gl, fragmentSource, vertexSource) {
    if (!this.vertexSource || !this.fragmentSource) {
      return;
    }
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSource || this.vertexSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      throw new Error(
        // eslint-disable-next-line prefer-template
        'Vertex shader compile error for "${this.type}": ' +
        gl.getShaderInfoLog(vertexShader)
      );
    }

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSource || this.fragmentSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      throw new Error(
        // eslint-disable-next-line prefer-template
        'Fragment shader compile error for "${this.type}": ' +
        gl.getShaderInfoLog(fragmentShader)
      );
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(
        // eslint-disable-next-line prefer-template
        'Shader link error for "${this.type}" ' +
        gl.getProgramInfoLog(program)
      );
    }

    var attributeLocations = this.getAttributeLocations(gl, program);
    var uniformLocations = this.getUniformLocations(gl, program) || { };
    uniformLocations.uStepW = gl.getUniformLocation(program, 'uStepW');
    uniformLocations.uStepH = gl.getUniformLocation(program, 'uStepH');
    return {
      program: program,
      attributeLocations: attributeLocations,
      uniformLocations: uniformLocations
    };
  },

  /**
   * Return a map of attribute names to WebGLAttributeLocation objects.
   *
   * @param {WebGLRenderingContext} gl The canvas context used to compile the shader program.
   * @param {WebGLShaderProgram} program The shader program from which to take attribute locations.
   * @returns {Object} A map of attribute names to attribute locations.
   */
  getAttributeLocations: function(gl, program) {
    return {
      aPosition: gl.getAttribLocation(program, 'aPosition'),
      aTexCoord: gl.getAttribLocation(program, 'aTexCoord'),
    };
  },

  /**
   * Return a map of uniform names to WebGLUniformLocation objects.
   *
   * Intended to be overridden by subclasses.
   *
   * @param {WebGLRenderingContext} gl The canvas context used to compile the shader program.
   * @param {WebGLShaderProgram} program The shader program from which to take uniform locations.
   * @returns {Object} A map of uniform names to uniform locations.
   */
  getUniformLocations: function (/* gl, program */) {
    // Intentionally left blank, override me in subclasses.
  },

  /**
   * Send attribute data from this filter to its shader program on the GPU.
   *
   * @param {WebGLRenderingContext} gl The canvas context used to compile the shader program.
   * @param {Object} attributeLocations A map of shader attribute names to their locations.
   */
  sendAttributeData: function(gl, attributeLocations, squareVertices) {
    ['aPosition', 'aTexCoord'].forEach(function(attribute) {
      var attributeLocation = attributeLocations[attribute];
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(attributeLocation);
      gl.vertexAttribPointer(attributeLocation, 2, gl.FLOAT, false, 0, 0);
      gl.bufferData(gl.ARRAY_BUFFER, squareVertices, gl.STATIC_DRAW);
    });
  },

  _setupFrameBuffer: function(options) {
    var gl = options.context;
    if (options.passes > 1) {
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D,
        options.targetTexture, 0);
    }
    else {
      // draw last filter on canvas and not to framebuffer.
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.finish();
    }
  },

  _swapTextures: function(options) {
    options.passes--;
    options.pass++;
    var temp = options.targetTexture;
    options.targetTexture = options.sourceTexture;
    options.sourceTexture = temp;
  },

  /**
   * Intentionally left blank, to be overridden in custom filters
   * @param {Object} options
   **/
  isNeutralState: function(/* options */) {
    return false;
  },

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
  applyTo: function(options) {
    if (options.webgl) {
      if (options.passes > 1 && this.isNeutralState(options)) {
        // avoid doing something that we do not need
        return;
      }
      this._setupFrameBuffer(options);
      this.applyToWebGL(options);
      this._swapTextures(options);
    }
    else {
      this.applyTo2d(options);
    }
  },

  /**
   * Retrieves the cached shader.
   * @param {Object} options
   * @param {WebGLRenderingContext} options.context The GL context used for rendering.
   * @param {Object} options.programCache A map of compiled shader programs, keyed by filter type.
   */
  retrieveShader: function(options) {
    if (!options.programCache.hasOwnProperty(this.type)) {
      options.programCache[this.type] = this.createProgram(options.context);
    }
    return options.programCache[this.type];
  },

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
  applyToWebGL: function(options) {
    var gl = options.context;
    var shader = this.retrieveShader(options);
    if (options.pass === 0 && options.originalTexture) {
      gl.bindTexture(gl.TEXTURE_2D, options.originalTexture);
    }
    else {
      gl.bindTexture(gl.TEXTURE_2D, options.sourceTexture);
    }
    gl.useProgram(shader.program);
    this.sendAttributeData(gl, shader.attributeLocations, options.squareVertices);

    gl.uniform1f(shader.uniformLocations.uStepW, 1 / options.sourceWidth);
    gl.uniform1f(shader.uniformLocations.uStepH, 1 / options.sourceHeight);

    this.sendUniformData(gl, shader.uniformLocations);
    gl.viewport(0, 0, options.sourceWidth, options.sourceHeight);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  },

  bindAdditionalTexture: function(gl, texture, textureUnit) {
    gl.activeTexture(textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // reset active texture to 0 as usual
    gl.activeTexture(gl.TEXTURE0);
  },

  unbindAdditionalTexture: function(gl, textureUnit) {
    gl.activeTexture(textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.activeTexture(gl.TEXTURE0);
  },

  getMainParameter: function() {
    return this[this.mainParameter];
  },

  setMainParameter: function(value) {
    this[this.mainParameter] = value;
  },

  /**
   * Send uniform data from this filter to its shader program on the GPU.
   *
   * Intended to be overridden by subclasses.
   *
   * @param {WebGLRenderingContext} gl The canvas context used to compile the shader program.
   * @param {Object} uniformLocations A map of shader uniform names to their locations.
   */
  sendUniformData: function(/* gl, uniformLocations */) {
    // Intentionally left blank.  Override me in subclasses.
  },

  /**
   * If needed by a 2d filter, this functions can create an helper canvas to be used
   * remember that options.targetCanvas is available for use till end of chain.
   */
  createHelpLayer: function(options) {
    if (!options.helpLayer) {
      var helpLayer = document.createElement('canvas');
      helpLayer.width = options.sourceWidth;
      helpLayer.height = options.sourceHeight;
      options.helpLayer = helpLayer;
    }
  },

  /**
   * Returns object representation of an instance
   * @return {Object} Object representation of an instance
   */
  toObject: function() {
    var object = { type: this.type }, mainP = this.mainParameter;
    if (mainP) {
      object[mainP] = this[mainP];
    }
    return object;
  },

  /**
   * Returns a JSON representation of an instance
   * @return {Object} JSON
   */
  toJSON: function() {
    // delegate, not alias
    return this.toObject();
  }
});

fabric.Image.filters.BaseFilter.fromObject = function(object, callback) {
  var filter = new fabric.Image.filters[object.type](object);
  callback && callback(filter);
  return filter;
};
