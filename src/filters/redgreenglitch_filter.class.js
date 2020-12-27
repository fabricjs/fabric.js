(function(global) {
  'use strict';

  var fabric = global.fabric,
      filters = fabric.Image.filters,
      createClass = fabric.util.createClass;

  /**
   * Image Red and Green glitch filter
   * @class fabric.Image.filter.RedGreenGlitch
   * @memberOf fabric.Image.filters
   * @extends fabric.Image.filters.BaseFilter
   * @example
   * var filter = new fabric.Image.filters.RedGreenGlitch({
   *  offsetX: 0.01,
   *  offsetY: -0.01,
   * });
   *
   * object.filters.push(filter);
   * object.applyFilters();
   * canvas.renderAll();
   */

  filters.RedGreenGlitch = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.BlendImage.prototype */ {
    type: 'RedGreenGlitch',

    /**
     * Color offsets for red and green, in % of the image.
     **/
    offsetX: 0.01,
    offsetY: 0.01,

    vertexSource: 'attribute vec2 aPosition;\n' +
      'varying vec2 vTexCoord;\n' +
      'varying vec2 vTexCoordRed;\n' +
      'varying vec2 vTexCoordGreen;\n' +
      'uniform vec2 uOffset;\n' +
      'void main() {\n' +
        'vTexCoord = aPosition;\n' +
        'vTexCoordRed = (aPosition + uOffset);\n' +
        'vTexCoordGreen = (aPosition - uOffset);\n' +
        'gl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);\n' +
      '}',

    fragmentSource: 'precision highp float;\n' +
      'uniform sampler2D uTexture;\n' +
      'varying vec2 vTexCoord;\n' +
      'varying vec2 vTexCoordRed;\n' +
      'varying vec2 vTexCoordGreen;\n' +
      'void main() {\n' +
        'vec4 color = texture2D(uTexture, vTexCoord);\n' +
        'vec4 red = texture2D(uTexture, vTexCoordRed);\n' +
        'vec4 green = texture2D(uTexture, vTexCoordGreen);\n' +
        'color.g = green.g;\n' +
        'color.r = red.r;\n' +
        'gl_FragColor = color;\n' +
      '}',

    /**
     * Apply the Blend operation to a Uint8ClampedArray representing the pixels of an image.
     *
     * @param {Object} options
     * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
     */
    applyTo2d: function(options) {
      var imageData = options.imageData,
          data = imageData.data, iLen = data.length,
          width = imageData.width, r, g,
          height = imageData.height, redIndex, greenIndex,
          offsetX = Math.round(this.offsetX * width) * 4,
          offsetY = Math.round(this.offsetX * height) * 4,
          displacement = offsetX + offsetY * width,
          imageCopy = new Uint8Array(iLen);
      // we leave the BLUE ( + 2) where it is, and we move green/red.
      for (var i = 0; i < iLen; i += 4) {
        // make a copy of data, while we get over it, since we are going to change it
        // when j and k are higher than i, we read from data, when is lower from imageCopy
        imageCopy[i] = data[i];
        redIndex = i + displacement;
        if (redIndex < 0 || redIndex > iLen) {
          r = 0;
        }
        else if (redIndex < i) {
          r = imageCopy[i];
        }
        else {
          r = data[i];
        }
        greenIndex = i - displacement;
        if (greenIndex < 0 || greenIndex > iLen) {
          g = 0;
        }
        else if (greenIndex < i) {
          g = imageCopy[i + 1];
        }
        else {
          g = data[i + 1];
        }
        data[i] = r;
        data[i + 1] = g;
      }
    },

    /**
     * Return WebGL uniform locations for this filter's shader.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {WebGLShaderProgram} program This filter's compiled shader program.
     */
    getUniformLocations: function(gl, program) {
      return {
        uOffset: gl.getUniformLocation(program, 'uOffset'),
      };
    },

    /**
     * Send data from this filter to its shader program's uniforms.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
     */
    sendUniformData: function(gl, uniformLocations) {
      gl.uniform2fv(uniformLocations.uOffset, [this.offsetX, this.offsetY]);
    },

    /**
     * Returns object representation of an instance
     * @return {Object} Object representation of an instance
     */
    toObject: function() {
      return {
        type: this.type,
        offsetX: this.offsetX,
        offsetY: this.offsetY
      };
    }
  });

  /**
   * Returns filter instance from an object representation
   * @static
   * @param {Object} object Object to create an instance from
   * @param {Function} [callback] to be invoked after filter creation
   * @return {fabric.Image.filters.RedGreenGlitch} Instance of fabric.Image.filters.RedGreenGlitch
   */
  filters.RedGreenGlitch.fromObject = filters.BaseFilter.fromObject;

})(typeof exports !== 'undefined' ? exports : this);
