(function(global) {

  'use strict';

  var fabric  = global.fabric || (global.fabric = { }),
      filters = fabric.Image.filters,
      createClass = fabric.util.createClass;

  /**
   * Colorscale image filter class
   * Takes a greyscale image and swap the scale with another scale of colors
   * @class fabric.Image.filters.Colorscale
   * @memberOf fabric.Image.filters
   * @extends fabric.Image.filters.BaseFilter
   * @see {@link http://fabricjs.com/image-filters|ImageFilters demo}
   * @example
   * var filter = new fabric.Image.filters.Colorscale({ color1: 'red', color2: 'blue' });
   * object.filters.push(filter);
   * object.applyFilters();
   */
  filters.Colorscale = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.Grayscale.prototype */ {

    /**
     * Filter type
     * @param {String} type
     * @default
     */
    type: 'Colorscale',

    fragmentSource:
      'precision highp float;\n' +
      'uniform sampler2D uTexture;\n' +
      'varying vec2 vTexCoord;\n' +
      'void main() {\n' +
        'vec4 value = texture2D(uTexture, vTexCoord).r;\n' +
        'gl_FragColor = vec4(average, average, average, color.a);\n' +
      '}',


    /**
     * Grayscale mode, between 'average', 'lightness', 'luminosity'
     * @param {String} type
     * @default
     */
    color1: 'red',

    color2: 'blue',

    /**
     * Apply the Grayscale operation to a Uint8Array representing the pixels of an image.
     *
     * @param {Object} options
     * @param {ImageData} options.imageData The Uint8Array to be filtered.
     */
    applyTo2d: function(options) {
      var imageData = options.imageData,
          data = imageData.data, i,
          len = data.length, value,
          mode = this.mode;
      for (i = 0; i < len; i += 4) {
        if (mode === 'average') {
          value = (data[i] + data[i + 1] + data[i + 2]) / 3;
        }
        else if (mode === 'lightness') {
          value = (Math.min(data[i], data[i + 1], data[i + 2]) +
            Math.max(data[i], data[i + 1], data[i + 2])) / 2;
        }
        else if (mode === 'luminosity') {
          value = 0.21 * data[i] + 0.72 * data[i + 1] + 0.07 * data[i + 2];
        }
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
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
        uColors: gl.getUniformLocation(program, 'uMode'),
      };
    },

    /**
     * Send data from this filter to its shader program's uniforms.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
     */
    sendUniformData: function(gl, uniformLocations) {
      // default average mode.
      var mode = 1;
      gl.uniform1i(uniformLocations.uMode, mode);
    },

    /**
     * Grayscale filter isNeutralState implementation
     * The filter is never neutral
     * on the image
     **/
    isNeutralState: function() {
      return false;
    },
  });

  /**
   * Returns filter instance from an object representation
   * @static
   * @param {Object} object Object to create an instance from
   * @param {function} [callback] to be invoked after filter creation
   * @return {fabric.Image.filters.Grayscale} Instance of fabric.Image.filters.Grayscale
   */
  fabric.Image.filters.Grayscale.fromObject = fabric.Image.filters.BaseFilter.fromObject;

})(typeof exports !== 'undefined' ? exports : this);
