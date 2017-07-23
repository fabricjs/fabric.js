(function() {

  'use strict';

  /**
   * Indicate whether this filtering backend is supported by the user's browser.
   * @param {Number} tileSize check if the tileSize is supported
   * @returns {Boolean} Whether the user's browser supports WebGL.
   */
  fabric.isWebglSupported = function(tileSize) {
    if (fabric.isLikelyNode) {
      return false;
    }
    tileSize = tileSize || fabric.WebglFilterBackend.prototype.tileSize;
    var canvas = document.createElement('canvas');
    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    var isSupported = false;
    // eslint-disable-next-line
    if (gl) {
      fabric.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      isSupported = fabric.maxTextureSize >= tileSize;
    }
    this.isSupported = isSupported;
    return isSupported;
  };

  fabric.WebglFilterBackend = WebglFilterBackend;

  /**
   * WebGL filter backend.
   */
  function WebglFilterBackend(options) {
    if (options && options.tileSize) {
      this.tileSize = options.tileSize;
    }
    this.setupGLContext(this.tileSize, this.tileSize);
    this.captureGPUInfo();
  };

  WebglFilterBackend.prototype = /** @lends fabric.WebglFilterBackend.prototype */ {

    tileSize: 2048,

    /**
     * Experimental. This object is a sort of repository of help layers used to avoid
     * of recreating them during frequent filtering. If you are previewing a filter with
     * a slider you problably do not want to create help layers every filter step.
     * in this object there will be appended some canvases, created once, resized sometimes
     * cleared never. Clearing is left to the developer.
     **/
    resources: {

    },

    /**
     * Setup a WebGL context suitable for filtering, and bind any needed event handlers.
     */
    setupGLContext: function(width, height) {
      this.dispose();
      this.createWebGLCanvas(width, height);
      // eslint-disable-next-line
      this.squareVertices = new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]);
    },

    /**
     * Create a canvas element and associated WebGL context and attaches them as
     * class properties to the GLFilterBackend class.
     */
    createWebGLCanvas: function(width, height) {
      var canvas = fabric.util.createCanvasElement();
      canvas.width = width;
      canvas.height = height;
      var glOptions = { premultipliedAlpha: false },
          gl = canvas.getContext('webgl', glOptions);
      if (!gl) {
        gl = canvas.getContext('experimental-webgl', glOptions);
      }
      if (!gl) {
        return;
      }
      gl.clearColor(0, 0, 0, 0);
      // this canvas can fire webglcontextlost and webglcontextrestored
      this.canvas = canvas;
      this.gl = gl;
    },

    /**
     * Attempts to apply the requested filters to the source provided, drawing the filtered output
     * to the provided target canvas.
     *
     * @param {Array} filters The filters to apply.
     * @param {HTMLImageElement|HTMLCanvasElement} source The source to be filtered.
     * @param {Number} width The width of the source input.
     * @param {Number} height The height of the source input.
     * @param {HTMLCanvasElement} targetCanvas The destination for filtered output to be drawn.
     * @param {String|undefined} cacheKey A key used to cache resources related to the source. If
     * omitted, caching will be skipped.
     */
    applyFilters: function(filters, source, width, height, targetCanvas, cacheKey) {
      var gl = this.gl;
      var cachedTexture;
      if (cacheKey) {
        cachedTexture = this.getCachedTexture(cacheKey, source);
      }
      var pipelineState = {
        originalWidth: source.width || source.originalWidth,
        originalHeight: source.height || source.originalHeight,
        sourceWidth: width,
        sourceHeight: height,
        context: gl,
        sourceTexture: this.createTexture(gl, width, height, !cachedTexture && source),
        targetTexture: this.createTexture(gl, width, height),
        originalTexture: cachedTexture ||
          this.createTexture(gl, width, height, !cachedTexture && source),
        passes: filters.length,
        webgl: true,
        squareVertices: this.squareVertices,
        programCache: this.programCache,
        pass: 0,
      };
      var tempFbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, tempFbo);
      filters.forEach(function(filter) { filter && filter.applyTo(pipelineState); });
      this.copyGLTo2D(gl.canvas, targetCanvas);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.deleteTexture(pipelineState.sourceTexture);
      gl.deleteTexture(pipelineState.targetTexture);
      gl.deleteFramebuffer(tempFbo);
      targetCanvas.getContext('2d').setTransform(1, 0, 0, 1, 0, 0);
      return pipelineState;
    },

    /**
     * The same as the applyFilter method but with additional logging of WebGL
     * errors.
     */
    applyFiltersDebug: function(filters, source, width, height, targetCanvas, cacheKey) {
      // The following code is useful when debugging a specific issue but adds ~10x slowdown.
      var gl = this.gl;
      var ret = this.applyFilters(filters, source, width, height, targetCanvas, cacheKey);
      var glError = gl.getError();
      if (glError !== gl.NO_ERROR) {
        var errorString = this.glErrorToString(gl, glError);
        var error = new Error('WebGL Error ' + errorString);
        error.glErrorCode = glError;
        throw error;
      }
      return ret;
    },

    glErrorToString: function(context, errorCode) {
      if (!context) {
        return 'Context undefined for error code: ' + errorCode;
      }
      else if (typeof errorCode !== 'number') {
        return 'Error code is not a number';
      }
      switch (errorCode) {
        case context.NO_ERROR:
          return 'NO_ERROR';
        case context.INVALID_ENUM:
          return 'INVALID_ENUM';
        case context.INVALID_VALUE:
          return 'INVALID_VALUE';
        case context.INVALID_OPERATION:
          return 'INVALID_OPERATION';
        case context.INVALID_FRAMEBUFFER_OPERATION:
          return 'INVALID_FRAMEBUFFER_OPERATION';
        case context.OUT_OF_MEMORY:
          return 'OUT_OF_MEMORY';
        case context.CONTEXT_LOST_WEBGL:
          return 'CONTEXT_LOST_WEBGL';
        default:
          return 'UNKNOWN_ERROR';
      }
    },

    /**
     * Detach event listeners, remove references, and clean up caches.
     */
    dispose: function() {
      if (this.canvas) {
        this.canvas = null;
        this.gl = null;
      }
      this.clearWebGLCaches();
    },

    /**
     * Wipe out WebGL-related caches.
     */
    clearWebGLCaches: function() {
      this.programCache = {};
      this.textureCache = {};
    },

    /**
     * Create a WebGL texture object.
     *
     * Accepts specific dimensions to initialize the textuer to or a source image.
     *
     * @param {WebGLRenderingContext} gl The GL context to use for creating the texture.
     * @param {Number} width The width to initialize the texture at.
     * @param {Number} height The height to initialize the texture.
     * @param {HTMLImageElement|HTMLCanvasElement} textureImageSource A source for the texture data.
     * @returns {WebGLTexture}
     */
    createTexture: function(gl, width, height, textureImageSource) {
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      if (textureImageSource) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImageSource);
      }
      else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
      return texture;
    },

    /**
     * Can be optionally used to get a texture from the cache array
     *
     * If an existing texture is not found, a new texture is created and cached.
     *
     * @param {String} uniqueId A cache key to use to find an existing texture.
     * @param {HTMLImageElement|HTMLCanvasElement} textureImageSource A source to use to create the
     * texture cache entry if one does not already exist.
     */
    getCachedTexture: function(uniqueId, textureImageSource) {
      if (this.textureCache[uniqueId]) {
        return this.textureCache[uniqueId];
      }
      else {
        var texture = this.createTexture(
          this.gl, textureImageSource.width, textureImageSource.height, textureImageSource);
        this.textureCache[uniqueId] = texture;
        return texture;
      }
    },

    /**
     * Copy an input WebGL canvas on to an output 2D canvas.
     *
     * The WebGL canvas is assumed to be upside down, with the top-left pixel of the
     * desired output image appearing in the bottom-left corner of the WebGL canvas.
     *
     * @param {HTMLCanvasElement} sourceCanvas The WebGL source canvas to copy from.
     * @param {HTMLCanvasElement} targetCanvas The 2D target canvas to copy on to.
     */
    copyGLTo2D: function(sourceCanvas, targetCanvas) {
      var ctx = targetCanvas.getContext('2d');
      ctx.translate(0, targetCanvas.height); // move it down again
      ctx.scale(1, -1); // vertical flip
      // where is my image on the big glcanvas?
      var sourceY = sourceCanvas.height - targetCanvas.height;
      ctx.drawImage(sourceCanvas, 0, sourceY, targetCanvas.width, targetCanvas.height, 0, 0,
        targetCanvas.width, targetCanvas.height);
    },

    /**
     * Clear out cached resources related to a source image that has been
     * filtered previously.
     *
     * @param {String} cacheKey The cache key provided when the source image was filtered.
     */
    evictCachesForKey: function(cacheKey) {
      if (this.textureCache[cacheKey]) {
        this.gl.deleteTexture(this.textureCache[cacheKey]);
        delete this.textureCache[cacheKey];
      }
    },

    /**
     * Attempt to extract GPU information strings from a WebGL context.
     *
     * Useful information when debugging or blacklisting specific GPUs.
     *
     * @returns {Object} A GPU info object with renderer and vendor strings.
     */
    captureGPUInfo: function() {
      if (this.gpuInfo) {
        return this.gpuInfo;
      }
      var gl = this.gl;
      var ext = gl.getExtension('WEBGL_debug_renderer_info');
      var gpuInfo = { renderer: '', vendor: '' };
      if (ext) {
        var renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
        var vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL);
        if (renderer) {
          gpuInfo.renderer = renderer.toLowerCase();
        }
        if (vendor) {
          gpuInfo.vendor = vendor.toLowerCase();
        }
      }
      this.gpuInfo = gpuInfo;
      return gpuInfo;
    },
  };
})();
