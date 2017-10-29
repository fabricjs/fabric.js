(function(global) {

  'use strict';

  var fabric  = global.fabric || (global.fabric = { }), pow = Math.pow, floor = Math.floor,
      sqrt = Math.sqrt, abs = Math.abs, round = Math.round, sin = Math.sin,
      ceil = Math.ceil,
      filters = fabric.Image.filters,
      createClass = fabric.util.createClass;

  /**
   * Resize image filter class
   * @class fabric.Image.filters.Resize
   * @memberOf fabric.Image.filters
   * @extends fabric.Image.filters.BaseFilter
   * @see {@link http://fabricjs.com/image-filters|ImageFilters demo}
   * @example
   * var filter = new fabric.Image.filters.Resize();
   * object.filters.push(filter);
   * object.applyFilters(canvas.renderAll.bind(canvas));
   */
  filters.Resize = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.Resize.prototype */ {

    /**
     * Filter type
     * @param {String} type
     * @default
     */
    type: 'Resize',

    /**
     * Resize type
     * @param {String} resizeType
     * @default
     */
    resizeType: 'hermite',

    /**
     * Scale factor for resizing, x axis
     * @param {Number} scaleX
     * @default
     */
    scaleX: 0,

    /**
     * Scale factor for resizing, y axis
     * @param {Number} scaleY
     * @default
     */
    scaleY: 0,

    /**
     * LanczosLobes parameter for lanczos filter
     * @param {Number} lanczosLobes
     * @default
     */
    lanczosLobes: 3,

    /**
     * Return WebGL uniform locations for this filter's shader.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {WebGLShaderProgram} program This filter's compiled shader program.
     */
    getUniformLocations: function(gl, program) {
      return {
        uStepWW: gl.getUniformLocation(program, 'uStepWW'),
        uStepHH: gl.getUniformLocation(program, 'uStepHH'),
      };
    },

    /**
     * Send data from this filter to its shader program's uniforms.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
     */
    sendUniformData: function(gl, uniformLocations) {
      gl.uniform1f(uniformLocations.uStepWW, 1 / this.width);
      gl.uniform1f(uniformLocations.uStepHH, 1 / this.height);
    },

    vertexSource: 'attribute vec2 aPosition;\n' +
      'uniform float uStepWW;\n' +
      'uniform float uStepHH;\n' +
      'varying vec2 centerTextureCoordinate;\n' +
      'varying vec2 oneStepLeftTextureCoordinateH;\n' +
      'varying vec2 twoStepsLeftTextureCoordinateH;\n' +
      'varying vec2 threeStepsLeftTextureCoordinateH;\n' +
      'varying vec2 fourStepsLeftTextureCoordinateH;\n' +
      'varying vec2 oneStepRightTextureCoordinateH;\n' +
      'varying vec2 twoStepsRightTextureCoordinateH;\n' +
      'varying vec2 threeStepsRightTextureCoordinateH;\n' +
      'varying vec2 fourStepsRightTextureCoordinateH;\n' +
      'varying vec2 oneStepLeftTextureCoordinateV;\n' +
      'varying vec2 twoStepsLeftTextureCoordinateV;\n' +
      'varying vec2 threeStepsLeftTextureCoordinateV;\n' +
      'varying vec2 fourStepsLeftTextureCoordinateV;\n' +
      'varying vec2 oneStepRightTextureCoordinateV;\n' +
      'varying vec2 twoStepsRightTextureCoordinateV;\n' +
      'varying vec2 threeStepsRightTextureCoordinateV;\n' +
      'varying vec2 fourStepsRightTextureCoordinateV;\n' +
      'void main() {\n' +
          'vec2 firstOffsetH = vec2(uStepWW, 0.0);\n' +
          'vec2 secondOffsetH = vec2(2.0 * uStepWW, 0.0);\n' +
          'vec2 thirdOffsetH = vec2(3.0 * uStepWW, 0.0);\n' +
          'vec2 fourthOffsetH = vec2(4.0 * uStepWW, 0.0);\n' +
          'vec2 firstOffsetV = vec2(0.0, uStepHH);\n' +
          'vec2 secondOffsetV = vec2(0.0, 2.0 * uStepHH);\n' +
          'vec2 thirdOffsetV = vec2(0.0, 3.0 * uStepHH);\n' +
          'vec2 fourthOffsetV = vec2(0.0, 4.0 * uStepHH);\n' +
          'centerTextureCoordinate = aPosition;\n' +
          'oneStepLeftTextureCoordinateH = aPosition - firstOffsetH;\n' +
          'twoStepsLeftTextureCoordinateH = aPosition - secondOffsetH;\n' +
          'threeStepsLeftTextureCoordinateH = aPosition - thirdOffsetH;\n' +
          'fourStepsLeftTextureCoordinateH = aPosition - fourthOffsetH;\n' +
          'oneStepRightTextureCoordinateH = aPosition + firstOffsetH;\n' +
          'twoStepsRightTextureCoordinateH = aPosition + secondOffsetH;\n' +
          'threeStepsRightTextureCoordinateH = aPosition + thirdOffsetH;\n' +
          'fourStepsRightTextureCoordinateH = aPosition + fourthOffsetH;\n' +
          'oneStepLeftTextureCoordinateV = aPosition - firstOffsetV;\n' +
          'twoStepsLeftTextureCoordinateV = aPosition - secondOffsetV;\n' +
          'threeStepsLeftTextureCoordinateV = aPosition - thirdOffsetV;\n' +
          'fourStepsLeftTextureCoordinateV = aPosition - fourthOffsetV;\n' +
          'oneStepRightTextureCoordinateV = aPosition + firstOffsetV;\n' +
          'twoStepsRightTextureCoordinateV = aPosition + secondOffsetV;\n' +
          'threeStepsRightTextureCoordinateV = aPosition + thirdOffsetV;\n' +
          'fourStepsRightTextureCoordinateV = aPosition + fourthOffsetV;\n' +
          'gl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);\n' +
      '}',

    fragmentSource: 'precision highp float;\n' +
      'varying vec2 centerTextureCoordinate;\n' +
      'varying vec2 oneStepLeftTextureCoordinateH;\n' +
      'varying vec2 twoStepsLeftTextureCoordinateH;\n' +
      'varying vec2 threeStepsLeftTextureCoordinateH;\n' +
      'varying vec2 fourStepsLeftTextureCoordinateH;\n' +
      'varying vec2 oneStepRightTextureCoordinateH;\n' +
      'varying vec2 twoStepsRightTextureCoordinateH;\n' +
      'varying vec2 threeStepsRightTextureCoordinateH;\n' +
      'varying vec2 fourStepsRightTextureCoordinateH;\n' +
      'varying vec2 oneStepLeftTextureCoordinateV;\n' +
      'varying vec2 twoStepsLeftTextureCoordinateV;\n' +
      'varying vec2 threeStepsLeftTextureCoordinateV;\n' +
      'varying vec2 fourStepsLeftTextureCoordinateV;\n' +
      'varying vec2 oneStepRightTextureCoordinateV;\n' +
      'varying vec2 twoStepsRightTextureCoordinateV;\n' +
      'varying vec2 threeStepsRightTextureCoordinateV;\n' +
      'varying vec2 fourStepsRightTextureCoordinateV;\n' +
      'uniform sampler2D uTexture;\n' +
      'void main() {\n' +
        'vec4 color = texture2D(uTexture, centerTextureCoordinate) * 0.38026;\n' +
        'color += texture2D(uTexture, centerTextureCoordinate) * 0.38026;\n' +
        'color += texture2D(uTexture, oneStepLeftTextureCoordinateH) * 0.27667;\n' +
        'color += texture2D(uTexture, oneStepRightTextureCoordinateH) * 0.27667;\n' +
        'color += texture2D(uTexture, twoStepsLeftTextureCoordinateH) * 0.08074;\n' +
        'color += texture2D(uTexture, twoStepsRightTextureCoordinateH) * 0.08074;\n' +
        'color += texture2D(uTexture, threeStepsLeftTextureCoordinateH) * -0.02612;\n' +
        'color += texture2D(uTexture, threeStepsRightTextureCoordinateH) * -0.02612;\n' +
        'color += texture2D(uTexture, fourStepsLeftTextureCoordinateH) * -0.02143;\n' +
        'color += texture2D(uTexture, fourStepsRightTextureCoordinateH) * -0.02143;\n' +
        'color += texture2D(uTexture, oneStepLeftTextureCoordinateV) * 0.27667;\n' +
        'color += texture2D(uTexture, oneStepRightTextureCoordinateV) * 0.27667;\n' +
        'color += texture2D(uTexture, twoStepsLeftTextureCoordinateV) * 0.08074;\n' +
        'color += texture2D(uTexture, twoStepsRightTextureCoordinateV) * 0.08074;\n' +
        'color += texture2D(uTexture, threeStepsLeftTextureCoordinateV) * -0.02612;\n' +
        'color += texture2D(uTexture, threeStepsRightTextureCoordinateV) * -0.02612;\n' +
        'color += texture2D(uTexture, fourStepsLeftTextureCoordinateV) * -0.02143;\n' +
        'color += texture2D(uTexture, fourStepsRightTextureCoordinateV) * -0.02143;\n' +
        'gl_FragColor = color / 2.0;\n' +
      '}',


    /**
     * Apply the resize filter to the image
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
        while (options.sourceWidth * this.scaleX < options.destinationWidth * 0.5) {
          this.width = options.destinationWidth;
          this.height = options.destinationHeight;
          options.destinationWidth = Math.floor(options.destinationWidth * 0.5);
          options.destinationHeight = Math.floor(options.destinationHeight * 0.5);
          this._setupFrameBuffer(options);
          this.applyToWebGL(options);
          this._swapTextures(options);
          // options.sourceWidth = options.destinationWidth;
          // options.sourceHeight = options.destinationHeight;
        }
        this.width = options.destinationWidth;
        this.height = options.destinationHeight;
        options.destinationWidth = Math.floor(options.sourceWidth * this.scaleX);
        options.destinationHeight = Math.floor(options.sourceHeight * this.scaleY);
        this._setupFrameBuffer(options);
        this.applyToWebGL(options);
        this._swapTextures(options);
        options.sourceWidth = options.destinationWidth;
        options.sourceHeight = options.destinationHeight;
      }
      else if (!this.isNeutralState(options)) {
        this.applyTo2d(options);
      }
    },

    isNeutralState: function(options) {
      var scaleX = options.scaleX || this.scaleX,
          scaleY = options.scaleY || this.scaleY;
      return scaleX === 1 && scaleY === 1;
    },

    /**
     * Applies filter to canvas element
     * @memberOf fabric.Image.filters.Resize.prototype
     * @param {Object} canvasEl Canvas element to apply filter to
     * @param {Number} scaleX
     * @param {Number} scaleY
     */
    applyTo2d: function(options) {
      var imageData = options.imageData,
          scaleX = options.scaleX || this.scaleX,
          scaleY = options.scaleY || this.scaleY;

      this.rcpScaleX = 1 / scaleX;
      this.rcpScaleY = 1 / scaleY;

      var oW = imageData.width, oH = imageData.height,
          dW = round(oW * scaleX), dH = round(oH * scaleY),
          newData;

      if (this.resizeType === 'sliceHack') {
        newData = this.sliceByTwo(options, oW, oH, dW, dH);
      }
      else if (this.resizeType === 'hermite') {
        newData = this.hermiteFastResize(options, oW, oH, dW, dH);
      }
      else if (this.resizeType === 'bilinear') {
        newData = this.bilinearFiltering(options, oW, oH, dW, dH);
      }
      else if (this.resizeType === 'lanczos') {
        newData = this.lanczosResize(options, oW, oH, dW, dH);
      }
      options.imageData = newData;
    },

    /**
     * Filter sliceByTwo
     * @param {Object} canvasEl Canvas element to apply filter to
     * @param {Number} oW Original Width
     * @param {Number} oH Original Height
     * @param {Number} dW Destination Width
     * @param {Number} dH Destination Height
     * @returns {ImageData}
     */
    sliceByTwo: function(options, oW, oH, dW, dH) {
      var imageData = options.imageData,
          mult = 0.5, doneW = false, doneH = false, stepW = oW * mult,
          stepH = oH * mult, resources = fabric.filterBackend.resources,
          tmpCanvas, ctx, sX = 0, sY = 0, dX = oW, dY = 0;
      if (!resources.sliceByTwo) {
        resources.sliceByTwo = document.createElement('canvas');
      }
      tmpCanvas = resources.sliceByTwo;
      if (tmpCanvas.width < oW * 1.5 || tmpCanvas.height < oH) {
        tmpCanvas.width = oW * 1.5;
        tmpCanvas.height = oH;
      }
      ctx = tmpCanvas.getContext('2d');
      ctx.clearRect(0, 0, oW * 1.5, oH);
      ctx.putImageData(imageData, 0, 0);

      dW = floor(dW);
      dH = floor(dH);

      while (!doneW || !doneH) {
        oW = stepW;
        oH = stepH;
        if (dW < floor(stepW * mult)) {
          stepW = floor(stepW * mult);
        }
        else {
          stepW = dW;
          doneW = true;
        }
        if (dH < floor(stepH * mult)) {
          stepH = floor(stepH * mult);
        }
        else {
          stepH = dH;
          doneH = true;
        }
        ctx.drawImage(tmpCanvas, sX, sY, oW, oH, dX, dY, stepW, stepH);
        sX = dX;
        sY = dY;
        dY += stepH;
      }
      return ctx.getImageData(sX, sY, dW, dH);
    },

    /**
     * Filter lanczosResize
     * @param {Object} canvasEl Canvas element to apply filter to
     * @param {Number} oW Original Width
     * @param {Number} oH Original Height
     * @param {Number} dW Destination Width
     * @param {Number} dH Destination Height
     * @returns {ImageData}
     */
    lanczosResize: function(options, oW, oH, dW, dH) {

      function lanczosCreate(lobes) {
        return function(x) {
          if (x > lobes) {
            return 0;
          }
          x *= Math.PI;
          if (abs(x) < 1e-16) {
            return 1;
          }
          var xx = x / lobes;
          return sin(x) * sin(xx) / x / xx;
        };
      }

      function process(u) {
        var v, i, weight, idx, a, red, green,
            blue, alpha, fX, fY;
        center.x = (u + 0.5) * ratioX;
        icenter.x = floor(center.x);
        for (v = 0; v < dH; v++) {
          center.y = (v + 0.5) * ratioY;
          icenter.y = floor(center.y);
          a = 0; red = 0; green = 0; blue = 0; alpha = 0;
          for (i = icenter.x - range2X; i <= icenter.x + range2X; i++) {
            if (i < 0 || i >= oW) {
              continue;
            }
            fX = floor(1000 * abs(i - center.x));
            if (!cacheLanc[fX]) {
              cacheLanc[fX] = { };
            }
            for (var j = icenter.y - range2Y; j <= icenter.y + range2Y; j++) {
              if (j < 0 || j >= oH) {
                continue;
              }
              fY = floor(1000 * abs(j - center.y));
              if (!cacheLanc[fX][fY]) {
                cacheLanc[fX][fY] = lanczos(sqrt(pow(fX * rcpRatioX, 2) + pow(fY * rcpRatioY, 2)) / 1000);
              }
              weight = cacheLanc[fX][fY];
              if (weight > 0) {
                idx = (j * oW + i) * 4;
                a += weight;
                red += weight * srcData[idx];
                green += weight * srcData[idx + 1];
                blue += weight * srcData[idx + 2];
                alpha += weight * srcData[idx + 3];
              }
            }
          }
          idx = (v * dW + u) * 4;
          destData[idx] = red / a;
          destData[idx + 1] = green / a;
          destData[idx + 2] = blue / a;
          destData[idx + 3] = alpha / a;
        }

        if (++u < dW) {
          return process(u);
        }
        else {
          return destImg;
        }
      }

      var srcData = options.imageData.data,
          destImg = options.ctx.createImageData(dW, dH),
          destData = destImg.data,
          lanczos = lanczosCreate(this.lanczosLobes),
          ratioX = this.rcpScaleX, ratioY = this.rcpScaleY,
          rcpRatioX = 2 / this.rcpScaleX, rcpRatioY = 2 / this.rcpScaleY,
          range2X = ceil(ratioX * this.lanczosLobes / 2),
          range2Y = ceil(ratioY * this.lanczosLobes / 2),
          cacheLanc = { }, center = { }, icenter = { };

      return process(0);
    },

    /**
     * bilinearFiltering
     * @param {Object} canvasEl Canvas element to apply filter to
     * @param {Number} oW Original Width
     * @param {Number} oH Original Height
     * @param {Number} dW Destination Width
     * @param {Number} dH Destination Height
     * @returns {ImageData}
     */
    bilinearFiltering: function(options, oW, oH, dW, dH) {
      var a, b, c, d, x, y, i, j, xDiff, yDiff, chnl,
          color, offset = 0, origPix, ratioX = this.rcpScaleX,
          ratioY = this.rcpScaleY,
          w4 = 4 * (oW - 1), img = options.imageData,
          pixels = img.data, destImage = options.ctx.createImageData(dW, dH),
          destPixels = destImage.data;
      for (i = 0; i < dH; i++) {
        for (j = 0; j < dW; j++) {
          x = floor(ratioX * j);
          y = floor(ratioY * i);
          xDiff = ratioX * j - x;
          yDiff = ratioY * i - y;
          origPix = 4 * (y * oW + x);

          for (chnl = 0; chnl < 4; chnl++) {
            a = pixels[origPix + chnl];
            b = pixels[origPix + 4 + chnl];
            c = pixels[origPix + w4 + chnl];
            d = pixels[origPix + w4 + 4 + chnl];
            color = a * (1 - xDiff) * (1 - yDiff) + b * xDiff * (1 - yDiff) +
                    c * yDiff * (1 - xDiff) + d * xDiff * yDiff;
            destPixels[offset++] = color;
          }
        }
      }
      return destImage;
    },

    /**
     * hermiteFastResize
     * @param {Object} canvasEl Canvas element to apply filter to
     * @param {Number} oW Original Width
     * @param {Number} oH Original Height
     * @param {Number} dW Destination Width
     * @param {Number} dH Destination Height
     * @returns {ImageData}
     */
    hermiteFastResize: function(options, oW, oH, dW, dH) {
      var ratioW = this.rcpScaleX, ratioH = this.rcpScaleY,
          ratioWHalf = ceil(ratioW / 2),
          ratioHHalf = ceil(ratioH / 2),
          img = options.imageData, data = img.data,
          img2 = options.ctx.createImageData(dW, dH), data2 = img2.data;
      for (var j = 0; j < dH; j++) {
        for (var i = 0; i < dW; i++) {
          var x2 = (i + j * dW) * 4, weight = 0, weights = 0, weightsAlpha = 0,
              gxR = 0, gxG = 0, gxB = 0, gxA = 0, centerY = (j + 0.5) * ratioH;
          for (var yy = floor(j * ratioH); yy < (j + 1) * ratioH; yy++) {
            var dy = abs(centerY - (yy + 0.5)) / ratioHHalf,
                centerX = (i + 0.5) * ratioW, w0 = dy * dy;
            for (var xx = floor(i * ratioW); xx < (i + 1) * ratioW; xx++) {
              var dx = abs(centerX - (xx + 0.5)) / ratioWHalf,
                  w = sqrt(w0 + dx * dx);
              /* eslint-disable max-depth */
              if (w > 1 && w < -1) {
                continue;
              }
              //hermite filter
              weight = 2 * w * w * w - 3 * w * w + 1;
              if (weight > 0) {
                dx = 4 * (xx + yy * oW);
                //alpha
                gxA += weight * data[dx + 3];
                weightsAlpha += weight;
                //colors
                if (data[dx + 3] < 255) {
                  weight = weight * data[dx + 3] / 250;
                }
                gxR += weight * data[dx];
                gxG += weight * data[dx + 1];
                gxB += weight * data[dx + 2];
                weights += weight;
              }
              /* eslint-enable max-depth */
            }
          }
          data2[x2] = gxR / weights;
          data2[x2 + 1] = gxG / weights;
          data2[x2 + 2] = gxB / weights;
          data2[x2 + 3] = gxA / weightsAlpha;
        }
      }
      return img2;
    },

    /**
     * Returns object representation of an instance
     * @return {Object} Object representation of an instance
     */
    toObject: function() {
      return {
        type: this.type,
        scaleX: this.scaleX,
        scaleY: this.scaleY,
        resizeType: this.resizeType,
        lanczosLobes: this.lanczosLobes
      };
    }
  });

  /**
   * Returns filter instance from an object representation
   * @static
   * @param {Object} object Object to create an instance from
   * @param {Function} [callback] to be invoked after filter creation
   * @return {fabric.Image.filters.Resize} Instance of fabric.Image.filters.Resize
   */
  fabric.Image.filters.Resize.fromObject = fabric.Image.filters.BaseFilter.fromObject;

})(typeof exports !== 'undefined' ? exports : this);
