(function(global) {

  'use strict';

  var fabric  = global.fabric || (global.fabric = { }),
      filters = fabric.Image.filters,
      createClass = fabric.util.createClass;

  /**
   * Blur filter class
   * @class fabric.Image.filters.Blur
   * @memberOf fabric.Image.filters
   * @extends fabric.Image.filters.BaseFilter
   * @see {@link fabric.Image.filters.Blur#initialize} for constructor definition
   * @see {@link http://fabricjs.com/image-filters|ImageFilters demo}
   * @example
   * var filter = new fabric.Image.filters.Blur({
   *   blur: 0.5
   * });
   * object.filters.push(filter);
   * object.applyFilters();
   * canvas.renderAll();
   */
  filters.Blur = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.Blur.prototype */ {

    type: 'Blur',

    /*
'gl_FragColor = vec4(0.0);',
'gl_FragColor += texture2D(texture, vTexCoord + -7 * uDelta)*0.0044299121055113265;',
'gl_FragColor += texture2D(texture, vTexCoord + -6 * uDelta)*0.00895781211794;',
'gl_FragColor += texture2D(texture, vTexCoord + -5 * uDelta)*0.0215963866053;',
'gl_FragColor += texture2D(texture, vTexCoord + -4 * uDelta)*0.0443683338718;',
'gl_FragColor += texture2D(texture, vTexCoord + -3 * uDelta)*0.0776744219933;',
'gl_FragColor += texture2D(texture, vTexCoord + -2 * uDelta)*0.115876621105;',
'gl_FragColor += texture2D(texture, vTexCoord + -1 * uDelta)*0.147308056121;',
'gl_FragColor += texture2D(texture, vTexCoord              )*0.159576912161;',
'gl_FragColor += texture2D(texture, vTexCoord + 1 * uDelta)*0.147308056121;',
'gl_FragColor += texture2D(texture, vTexCoord + 2 * uDelta)*0.115876621105;',
'gl_FragColor += texture2D(texture, vTexCoord + 3 * uDelta)*0.0776744219933;',
'gl_FragColor += texture2D(texture, vTexCoord + 4 * uDelta)*0.0443683338718;',
'gl_FragColor += texture2D(texture, vTexCoord + 5 * uDelta)*0.0215963866053;',
'gl_FragColor += texture2D(texture, vTexCoord + 6 * uDelta)*0.00895781211794;',
'gl_FragColor += texture2D(texture, vTexCoord + 7 * uDelta)*0.0044299121055113265;',
*/

    /* eslint-disable max-len */
    fragmentSource: 'precision highp float;\n' +
      'uniform sampler2D uTexture;\n' +
      'uniform vec2 uDelta;\n' +
      'varying vec2 vTexCoord;\n' +
      'const float nSamples = 15.0;\n' +
      'vec3 v3offset = vec3(12.9898, 78.233, 151.7182);\n' +
      'float random(vec3 scale) {\n' +
        /* use the fragment position for a different seed per-pixel */
        'return fract(sin(dot(gl_FragCoord.xyz, scale)) * 43758.5453);\n' +
      '}\n' +
      'void main() {\n' +
        'vec4 color = vec4(0.0);\n' +
        'float total = 0.0;\n' +
        'float offset = random(v3offset);\n' +
        'for (float t = -nSamples; t <= nSamples; t++) {\n' +
          'float percent = (t + offset - 0.5) / nSamples;\n' +
          'float weight = 1.0 - abs(percent);\n' +
          'color += texture2D(uTexture, vTexCoord + uDelta * percent) * weight;\n' +
          'total += weight;\n' +
        '}\n' +
        'gl_FragColor = color / total;\n' +
      '}',
    /* eslint-enable max-len */

    /**
     * blur value, in percentage of image dimensions.
     * specific to keep the image blur constant at different resolutions
     * range bewteen 0 and 1.
     */
    blur: 0,
    /**
     * Matrix for the convolute operation.
     */
    matrix: [],
    /**
     * Radius of the filter.
     */
    radius: 0,

    mainParameter: 'blur',

    applyTo: function(options) {
      if (options.webgl) {
        // this aspectRatio is used to give the same blur to vertical and horizontal
        this.aspectRatio = options.sourceWidth / options.sourceHeight;
        options.passes++;
        this._setupFrameBuffer(options);
        this.horizontal = true;
        this.applyToWebGL(options);
        this._swapTextures(options);
        this._setupFrameBuffer(options);
        this.horizontal = false;
        this.applyToWebGL(options);
        this._swapTextures(options);
      }
      else {
        this.applyTo2d(options);
      }
    },

    applyTo2d: function(options) {
      // paint canvasEl with current image data.
      //options.ctx.putImageData(options.imageData, 0, 0);
      options.imageData = this.simpleBlur(options);
    },

    simpleBlur: function(options) {
      this.radius = parseInt(100 * this.blur, 10);
      this.matrix = this.makeMatrix(this.radius);
      this.doGaussian(
        options.imageData.data,
        options.imageData.width,
        options.imageData.height
      );
      return options.imageData;
    },

    /**
     * Return WebGL uniform locations for this filter's shader.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {WebGLShaderProgram} program This filter's compiled shader program.
     */
    getUniformLocations: function(gl, program) {
      return {
        delta: gl.getUniformLocation(program, 'uDelta'),
      };
    },

    /**
     * Send data from this filter to its shader program's uniforms.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
     */
    sendUniformData: function(gl, uniformLocations) {
      var delta = this.chooseRightDelta();
      gl.uniform2fv(uniformLocations.delta, delta);
    },

    /**
     * choose right value of image percentage to blur with
     * @returns {Array} a numeric array with delta values
     */
    chooseRightDelta: function() {
      var blurScale = 1, delta = [0, 0], blur;
      if (this.horizontal) {
        if (this.aspectRatio > 1) {
          // image is wide, i want to shrink radius horizontal
          blurScale = 1 / this.aspectRatio;
        }
      }
      else {
        if (this.aspectRatio < 1) {
          // image is tall, i want to shrink radius vertical
          blurScale = this.aspectRatio;
        }
      }
      blur = blurScale * this.blur * 0.12;
      if (this.horizontal) {
        delta[0] = blur;
      }
      else {
        delta[1] = blur;
      }
      return delta;
    },

    /**
     * Creates matrix for convolute operation.
     * @param radius Radius of matrix.
     * @return {Array} a numeric array with delta values
     */
    makeMatrix: function(radius) {
      var r = Math.ceil(radius);
      var rows = r * 2 + 1;
      var matrix = [];
      var sigma = radius / 3;
      var sigma22 = 2 * sigma * sigma;
      var sigmaPi2 = 2 * Math.PI * sigma;
      var sqrtSigmaPi2 = Math.sqrt(sigmaPi2);
      var radius2 = radius * radius;
      var total = 0;
      var index = 0;
      for (var row = -r; row <= r; row++) {
        var distance = row * row;
        if (distance > radius2) matrix[index] = 0;
        else matrix[index] = Math.exp(-distance / sigma22) / sqrtSigmaPi2;
        total += matrix[index];
        index++;
      }
      for (var i = 0; i < rows; i++) {
        matrix[i] /= total;
      }

      return matrix;
    },

    /**
     * Apply gaussian filter to pixels.
     * @param pixels Pixels data array.
     * @param width Width of the image.
     * @param height Height of the image.
     * @param outPixels Array where blurred image should be populated. If not
     * passed, result will be applied directly to pixels argument.
     */
    doGaussian: function(pixels, width, height, outPixels) {
      var radius = this.radius;
      var matrix = this.matrix;
      outPixels = outPixels || pixels;
      var buff = [];
      var idx = 0;
      var k, f, idxF, alpha, r, g, b, a;
      for (var y = 0; y < height; y++) {
        var offset = y * width;
        for (var x = 0; x < width; x++, idx += 4) {
          r = 0;
          g = 0;
          b = 0;
          a = 0;
          for (var n = 0, i = -radius; i <= radius; ++i, ++n) {
            var ix = x + i;
            if (ix < 0) {
              ix = 0;
            } else if (ix >= width) {
              ix = width - 1;
            }

            f = matrix[n];
            idxF = (offset + ix) << 2;
            alpha = pixels[idxF + 3];
            k = alpha / 255;
            r += pixels[idxF] * f * k;
            g += pixels[idxF + 1] * f * k;
            b += pixels[idxF + 2] * f * k;
            a += alpha * f;
          }
          if (a === 0) {
            k = 0;
          } else {
            k = 255 / a;
          }
          buff[idx] = r * k;
          buff[idx + 1] = g * k;
          buff[idx + 2] = b * k;
          buff[idx + 3] = a;
        }
      }

      for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
          idx = (y * width + x) << 2;
          r = 0;
          g = 0;
          b = 0;
          a = 0;
          for (var n = 0, i = -radius; i <= radius; ++i, ++n) {
            var iy = y + i;
            if (iy < 0) {
              iy = 0;
            } else if (iy >= height) {
              iy = height - 1;
            }
            f = matrix[n];
            idxF = (iy * width + x) << 2;
            alpha = buff[idxF + 3];
            k = alpha / 255;
            r += buff[idxF] * f * k;
            g += buff[idxF + 1] * f * k;
            b += buff[idxF + 2] * f * k;
            a += alpha * f;
          }
          if (a === 0) {
            outPixels[idx] = outPixels[idx + 1] = outPixels[
            idx + 2
              ] = outPixels[idx + 3] = 0;
          } else {
            k = 255 / a;
            outPixels[idx] = this.clamp(r * k);
            outPixels[idx + 1] = this.clamp(g * k);
            outPixels[idx + 2] = this.clamp(b * k);
            outPixels[idx + 3] = this.clamp(a);
          }
        }
      }
    },

    /**
     * Restric value to the range 0-255.
     * @param v Value to restrict.
     * @return {number} Value between the specified range.
     */
    clamp: function(v) {
      return v < 255 ? (v > 0 ? v | 0 : 0) : 255;
    }
  });

  /**
   * Deserialize a JSON definition of a BlurFilter into a concrete instance.
   */
  filters.Blur.fromObject = fabric.Image.filters.BaseFilter.fromObject;

})(typeof exports !== 'undefined' ? exports : this);
