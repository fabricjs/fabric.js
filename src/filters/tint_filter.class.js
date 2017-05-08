(function(global) {

  'use strict';

  var fabric  = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend,
      filters = fabric.Image.filters,
      createClass = fabric.util.createClass;

  /**
   * Tint filter class
   * Adapted from <a href="https://github.com/mezzoblue/PaintbrushJS">https://github.com/mezzoblue/PaintbrushJS</a>
   * @class fabric.Image.filters.Tint
   * @memberOf fabric.Image.filters
   * @extends fabric.Image.filters.BaseFilter
   * @see {@link fabric.Image.filters.Tint#initialize} for constructor definition
   * @see {@link http://fabricjs.com/image-filters|ImageFilters demo}
   * @example <caption>Tint filter with hex color and opacity</caption>
   * var filter = new fabric.Image.filters.Tint({
   *   color: '#3513B0',
   *   opacity: 0.5
   * });
   * object.filters.push(filter);
   * object.applyFilters(canvas.renderAll.bind(canvas));
   * @example <caption>Tint filter with rgba color</caption>
   * var filter = new fabric.Image.filters.Tint({
   *   color: 'rgba(53, 21, 176, 0.5)'
   * });
   * object.filters.push(filter);
   * object.applyFilters();
   */
  filters.Tint = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.Tint.prototype */ {

    /**
     * Filter type
     * @param {String} type
     * @default
     */
    type: 'Tint',

    color: 'rgb(0, 0, 255)',

    opacity: '0.25',

    /**
     * Fragment source for the Tint program
     */
    fragmentSource: 'precision highp float;\n' +
      'uniform sampler2D uTexture;\n' +
      'uniform vec4 uColor;\n' +
      'varying vec2 vTexCoord;\n' +
      'vec3 uColorMult = uColor.rgb * uColor.a;\n' +
      'void main() {\n' +
        'vec4 color = texture2D(uTexture, vTexCoord);\n' +
        'color.rgb *= (1.0 - uColor.a);\n' +
        'color.rgb += uColorMult;\n' +
        'gl_FragColor = color;\n' +
      '}',
    /**
     * Constructor
     * @memberOf fabric.Image.filters.Tint.prototype
     * @param {Object} [options] Options object
     * @param {String} [options.color=#000000] Color to tint the image with
     * @param {Number} [options.opacity] Opacity value that controls the tint effect's transparency (0..1)
     */
    initialize: function(options) {
      this.callSuper('initialize', options);
      if (typeof options.opacity === 'undefined') {
        this.opacity = new fabric.Color(this.color).getAlpha();
      }
    },

    /**
     * Apply the Brightness operation to a Uint8ClampedArray representing the pixels of an image.
     *
     * @param {Object} options
     * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
     */
    applyTo2d: function(options) {
      var imageData = options.imageData,
          data = imageData.data, i, len = data.length,
          source = new fabric.Color(this.color).getSource(),
          tintR, tintG, tintB, opacity = this.opacity, alpha1,
          r, g, b;

      tintR = source[0] * opacity;
      tintG = source[1] * opacity;
      tintB = source[2] * opacity;

      alpha1 = 1 - this.opacity;

      for (i = 0; i < len; i += 4) {
        r = data[i];
        g = data[i + 1];
        b = data[i + 2];

        // alpha compositing
        data[i] = tintR + r * alpha1;
        data[i + 1] = tintG + g * alpha1;
        data[i + 2] = tintB + b * alpha1;
      }
      // keep the approach that is faster on higher res.
      // var ctx = options.ctx,
      //     w = options.sourceWidth, h = options.sourceHeight;
      //     console.log(w,h);
      // ctx.putImageData(options.imageData, 0, 0);
      // ctx.globalAlpha = this.opacity;
      // ctx.fillStyle = this.color;
      // ctx.fillRect(0, 0, w, h);
      // options.imageData = ctx.getImageData(0, 0, w, h);
      // ctx.globalAlpha = 1;
      // ctx.clearRect(0, 0, w, h);
    },

    /**
     * Return WebGL uniform locations for this filter's shader.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {WebGLShaderProgram} program This filter's compiled shader program.
     */
    getUniformLocations: function(gl, program) {
      return {
        uColor: gl.getUniformLocation(program, 'uColor'),
      };
    },

    /**
     * Send data from this filter to its shader program's uniforms.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
     */
    sendUniformData: function(gl, uniformLocations) {
      var source = new fabric.Color(this.color).getSource();
      source[0] /= 255;
      source[1] /= 255;
      source[2] /= 255;
      source[3] = this.opacity;
      gl.uniform4fv(uniformLocations.uColor, source);
    },

    /**
     * Returns object representation of an instance
     * @return {Object} Object representation of an instance
     */
    toObject: function() {
      return extend(this.callSuper('toObject'), {
        color: this.color,
        opacity: this.opacity
      });
    }
  });

  /**
   * Returns filter instance from an object representation
   * @static
   * @param {Object} object Object to create an instance from
   * @param {Function} [callback] to be invoked after filter creation
   * @return {fabric.Image.filters.Tint} Instance of fabric.Image.filters.Tint
   */
  fabric.Image.filters.Tint.fromObject = fabric.Image.filters.BaseFilter.fromObject;

})(typeof exports !== 'undefined' ? exports : this);
