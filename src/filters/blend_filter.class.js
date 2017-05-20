(function(global) {
  'use strict';

  var fabric = global.fabric,
      filters = fabric.Image.filters,
      createClass = fabric.util.createClass;

  /**
   * Color Blend filter class
   * @class fabric.Image.filter.Blend
   * @memberOf fabric.Image.filters
   * @extends fabric.Image.filters.BaseFilter
   * @example
   * var filter = new fabric.Image.filters.Blend({
   *  color: '#000',
   *  mode: 'multiply'
   * });
   *
   * var filter = new fabric.Image.filters.Blend({
   *  image: fabricImageObject,
   *  mode: 'multiply',
   *  alpha: 0.5
   * });

   * object.filters.push(filter);
   * object.applyFilters();
   * canvas.renderAll();
   */

  filters.Blend = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.Blend.prototype */ {
    type: 'Blend',

    color: '#000',

    /**
     * apply the blend mode with another picture instead of a color.
     * take precedence over the color.
     * @param {Image} image
     **/
    image: false,

    /**
     * Blend mode for the filter: one of multiply, add, diff, screen, subtract,
     * darken, lighten, overlay, exclusion.
     **/
    mode: 'multiply',

    /**
     * Needed to send webgl an integer.
     **/
    modesMap: {
      multipy: 0,
      add: 1,
      diff: 2,
      difference: 2,
      screen: 3,
      subtract: 4,
      darken: 5,
      lighten: 6,
      overlay: 7,
      exclusion: 8,
    },

    alpha: 1,

    /**
     * Fragment source for the Multiply program
     */
    shaders: {
      multiply: 'precision highp float;\n' +
        'uniform sampler2D uTexture;\n' +
        'uniform vec4 uColor;\n' +
        'varying vec2 vTexCoord;\n' +
        'void main() {\n' +
          'vec4 color = texture2D(uTexture, vTexCoord);\n' +
          'color.rgb *= uColor.rgb;\n' +
          'gl_FragColor = color;\n' +
        '}',
      screen: 'precision highp float;\n' +
        'uniform sampler2D uTexture;\n' +
        'uniform vec4 uColor;\n' +
        'varying vec2 vTexCoord;\n' +
        'static vec3 one = vec3(1.0, 1.0, 1.0);\n' +
        'void main() {\n' +
          'vec4 color = texture2D(uTexture, vTexCoord);\n' +
          'color.rgb = one - (one - color.rgb) * (one - uColor.rgb);\n' +
          'gl_FragColor = color;\n' +
        '}',
      add: 'precision highp float;\n' +
        'uniform sampler2D uTexture;\n' +
        'uniform vec4 uColor;\n' +
        'varying vec2 vTexCoord;\n' +
        'void main() {\n' +
          'gl_FragColor = texture2D(uTexture, vTexCoord);\n' +
          'gl_FragColor.rgb += uColor.rgb;\n' +
        '}',
      diff: 'precision highp float;\n' +
        'uniform sampler2D uTexture;\n' +
        'uniform vec4 uColor;\n' +
        'varying vec2 vTexCoord;\n' +
        'void main() {\n' +
          'gl_FragColor = texture2D(uTexture, vTexCoord);\n' +
          'gl_FragColor.rgb = abs(gl_FragColor.rgb - uColor.rgb);\n' +
      '}',
      subtract: 'precision highp float;\n' +
        'uniform sampler2D uTexture;\n' +
        'uniform vec4 uColor;\n' +
        'varying vec2 vTexCoord;\n' +
        'void main() {\n' +
          'gl_FragColor = texture2D(uTexture, vTexCoord);\n' +
          'gl_FragColor.rgb -= uColor.rgb;\n' +
        '}',
    },


    /**
     * Retrieves the cached shader.
     * @param {Object} options
     * @param {WebGLRenderingContext} options.context The GL context used for rendering.
     * @param {Object} options.programCache A map of compiled shader programs, keyed by filter type.
     */
    retrieveShader: function(options) {
      var cacheKey = this.type + '_' + this.mode;
      var shaderSource = this.shaders[this.mode];
      if (!options.programCache.hasOwnProperty(cacheKey)) {
        options.programCache[cacheKey] = this.createProgram(options.context, shaderSource);
      }
      return options.programCache[cacheKey];
    },

    /**
     * Apply the Blend operation to a Uint8ClampedArray representing the pixels of an image.
     *
     * @param {Object} options
     * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
     */
    applyTo2d: function(options) {
      var imageData = options.imageData,
          data = imageData.data, iLen = data.length,
          tr, tg, tb,
          r, g, b,
          source,
          isImage = false;

      if (this.image) {
        // Blend images
        isImage = true;

        var _el = fabric.util.createCanvasElement();
        _el.width = this.image.width;
        _el.height = this.image.height;

        var tmpCanvas = new fabric.StaticCanvas(_el);
        tmpCanvas.add(this.image);
        var context2 =  tmpCanvas.getContext('2d');
        source = context2.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height).data;
      }
      else {
        // Blend color
        source = new fabric.Color(this.color).getSource();
        tr = source[0] * this.alpha;
        tg = source[1] * this.alpha;
        tb = source[2] * this.alpha;
      }

      for (var i = 0; i < iLen; i += 4) {

        r = data[i];
        g = data[i + 1];
        b = data[i + 2];

        if (isImage) {
          tr = source[i] * this.alpha;
          tg = source[i + 1] * this.alpha;
          tb = source[i + 2] * this.alpha;
        }

        switch (this.mode) {
          case 'multiply':
            data[i] = r * tr / 255;
            data[i + 1] = g * tg / 255;
            data[i + 2] = b * tb / 255;
            break;
          case 'screen':
            data[i] = 1 - (1 - r) * (1 - tr);
            data[i + 1] = 1 - (1 - g) * (1 - tg);
            data[i + 2] = 1 - (1 - b) * (1 - tb);
            break;
          case 'add':
            data[i] = r + tr;
            data[i + 1] = g + tg;
            data[i + 2] = b + tb;
            break;
          case 'diff':
          case 'difference':
            data[i] = Math.abs(r - tr);
            data[i + 1] = Math.abs(g - tg);
            data[i + 2] = Math.abs(b - tb);
            break;
          case 'subtract':
            data[i] = r - tr;
            data[i + 1] = g - tg;
            data[i + 2] = b - tb;
            break;
          case 'darken':
            data[i] = Math.min(r, tr);
            data[i + 1] = Math.min(g, tg);
            data[i + 2] = Math.min(b, tb);
            break;
          case 'lighten':
            data[i] = Math.max(r, tr);
            data[i + 1] = Math.max(g, tg);
            data[i + 2] = Math.max(b, tb);
            break;
          case 'overlay':
            data[i] = tr < 128 ? (2 * r * tr / 255) : (255 - 2 * (255 - r) * (255 - tr) / 255);
            data[i + 1] = tg < 128 ? (2 * g * tg / 255) : (255 - 2 * (255 - g) * (255 - tg) / 255);
            data[i + 2] = tb < 128 ? (2 * b * tb / 255) : (255 - 2 * (255 - b) * (255 - tb) / 255);
            break;
          case 'exclusion':
            data[i] = tr + r - ((2 * tr * r) / 255);
            data[i + 1] = tg + g - ((2 * tg * g) / 255);
            data[i + 2] = tb + b - ((2 * tb * b) / 255);
            break;
        }
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
        uColor: gl.getUniformLocation(program, 'uColor'),
        uMode: gl.getUniformLocation(program, 'uMode'),
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
      var mode = this.modesMap[this.mode];
      gl.uniform4fv(uniformLocations.uColor, source);
      gl.uniform1i(uniformLocations.uMode, mode);
    },

    /**
     * Returns object representation of an instance
     * @return {Object} Object representation of an instance
     */
    toObject: function() {
      return {
        color: this.color,
        image: this.image,
        mode: this.mode,
        alpha: this.alpha
      };
    }
  });

  /**
   * Returns filter instance from an object representation
   * @static
   * @param {Object} object Object to create an instance from
   * @param {function} [callback] to be invoked after filter creation
   * @return {fabric.Image.filters.Blend} Instance of fabric.Image.filters.Blend
   */
  fabric.Image.filters.Blend.fromObject = fabric.Image.filters.BaseFilter.fromObject;

})(typeof exports !== 'undefined' ? exports : this);
