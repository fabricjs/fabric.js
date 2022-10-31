import { config } from '../config';
import { createCanvasElement } from '../util/misc/dom';
import { webGLProbe } from './WebGLProbe';


function initFilterBackend() {
  if (
    config.enableGLFiltering &&
    webGLProbe.isSupported(config.textureSize)
  ) {
    return new WebglFilterBackend({ tileSize: config.textureSize });
  } else {
    return new Canvas2dFilterBackend();
  }
};

export type TPipelineState = {

}

export type TApplyFilterArgs = {

}

class WebglFilterBackend {

  tileSize: number = config.textureSize;

  /**
   * Define ...
   **/
  aPosition: Float32Array = new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]);

  /**
   * If GLPut data is the fastest operation, or if forced, this buffer will be used
   * to transfer the data back in the 2d logic
   **/
  imageBuffer?: ArrayBuffer

  canvas: HTMLCanvasElement | null;

  /**
   * The Webgl context that will execute the operations for filtering
   **/
  gl: WebGLRenderingContext | null;

  /**
   * Keyed map for shader cache
   **/
  programCache: any;

  /**
   * Keyed map for texture cache
   **/
  textureCache: any;

  /**
   * Contains GPU info for debug
   **/
  gpuInfo: any

  /**
   * Experimental. This object is a sort of repository of help layers used to avoid
   * of recreating them during frequent filtering. If you are previewing a filter with
   * a slider you probably do not want to create help layers every filter step.
   * in this object there will be appended some canvases, created once, resized sometimes
   * cleared never. Clearing is left to the developer.
   **/
  resources = {}

  constructor({ tileSize } = {}) {
    if (tileSize) {
      this.tileSize = tileSize;
    }
    this.setupGLContext(this.tileSize, this.tileSize);
    this.captureGPUInfo();
  }

  /**
   * Setup a WebGL context suitable for filtering, and bind any needed event handlers.
   */
  setupGLContext(width: number, height: number): void {
    this.dispose();
    this.createWebGLCanvas(width, height);
    // eslint-disable-next-line
    this.chooseFastestCopyGLTo2DMethod(width, height);
  }

  /**
   * Pick a method to copy data from GL context to 2d canvas.  In some browsers using
   * drawImage should be faster, but is also bugged for a small combination of old hardware
   * and drivers.
   * putImageData is faster than drawImage for that specific operation.
   */
  chooseFastestCopyGLTo2DMethod(width: number, height: number): void {

    const targetCanvas = createCanvasElement();
    // eslint-disable-next-line no-undef
    const imageBuffer = new ArrayBuffer(width * height * 4);
    if (config.forceGLPutImageData) {
      this.imageBuffer = imageBuffer;
      this.copyGLTo2D = copyGLTo2DPutImageData;
      return;
    }

    const testContext = {
      imageBuffer: imageBuffer,
      destinationWidth: width,
      destinationHeight: height,
      targetCanvas: targetCanvas,
    };
    let startTime;
    targetCanvas.width = width;
    targetCanvas.height = height;

    startTime = window.performance.now();
    this.copyGLTo2D.call(testContext, this.gl, testContext);
    const drawImageTime = window.performance.now() - startTime;

    startTime = window.performance.now();
    copyGLTo2DPutImageData.call(testContext, this.gl, testContext);
    const putImageDataTime = window.performance.now() - startTime;

    if (drawImageTime > putImageDataTime) {
      this.imageBuffer = imageBuffer;
      this.copyGLTo2D = copyGLTo2DPutImageData;
    }
  }

  /**
   * Create a canvas element and associated WebGL context and attaches them as
   * class properties to the GLFilterBackend class.
   */
  createWebGLCanvas(width: number, height: number): void {
    const canvas = createCanvasElement();
    canvas.width = width;
    canvas.height = height;
    const glOptions = {
        alpha: true,
        premultipliedAlpha: false,
        depth: false,
        stencil: false,
        antialias: false,
      },
      gl = canvas.getContext('webgl', glOptions) as WebGLRenderingContext;

    if (!gl) {
      return;
    }
    gl.clearColor(0, 0, 0, 0);
    // this canvas can fire webglcontextlost and webglcontextrestored
    this.canvas = canvas;
    this.gl = gl;
  }

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
  applyFilters(
    filters,
    source,
    width,
    height,
    targetCanvas,
    cacheKey
  ): TPipelineState | undefined {
    const gl = this.gl;
    if (!gl) {
      return;
    }
    let cachedTexture;
    if (cacheKey) {
      cachedTexture = this.getCachedTexture(cacheKey, source);
    }
    const pipelineState = {
      originalWidth: source.width || source.originalWidth,
      originalHeight: source.height || source.originalHeight,
      sourceWidth: width,
      sourceHeight: height,
      destinationWidth: width,
      destinationHeight: height,
      context: gl,
      sourceTexture: this.createTexture(
        gl,
        width,
        height,
        !cachedTexture && source
      ),
      targetTexture: this.createTexture(gl, width, height),
      originalTexture:
        cachedTexture ||
        this.createTexture(gl, width, height, !cachedTexture && source),
      passes: filters.length,
      webgl: true,
      aPosition: this.aPosition,
      programCache: this.programCache,
      pass: 0,
      filterBackend: this,
      targetCanvas: targetCanvas,
    };
    const tempFbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, tempFbo);
    filters.forEach((filter: any) => {
      filter && filter.applyTo(pipelineState);
    });
    resizeCanvasIfNeeded(pipelineState);
    this.copyGLTo2D(gl, pipelineState);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.deleteTexture(pipelineState.sourceTexture);
    gl.deleteTexture(pipelineState.targetTexture);
    gl.deleteFramebuffer(tempFbo);
    targetCanvas.getContext('2d').setTransform(1, 0, 0, 1, 0, 0);
    return pipelineState;
  }

  /**
   * Detach event listeners, remove references, and clean up caches.
   */
  dispose() {
    if (this.canvas) {
      this.canvas = null;
      this.gl = null;
    }
    this.clearWebGLCaches();
  }

  /**
   * Wipe out WebGL-related caches.
   */
  clearWebGLCaches() {
    this.programCache = {};
    this.textureCache = {};
  }

  /**
   * Create a WebGL texture object.
   *
   * Accepts specific dimensions to initialize the texture to or a source image.
   *
   * @param {WebGLRenderingContext} gl The GL context to use for creating the texture.
   * @param {Number} width The width to initialize the texture at.
   * @param {Number} height The height to initialize the texture.
   * @param {HTMLImageElement|HTMLCanvasElement} textureImageSource A source for the texture data.
   * @returns {WebGLTexture}
   */
  createTexture(gl: WebGLRenderingContext, width: number, height: number, textureImageSource?: TexImageSource) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (textureImageSource) {
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        textureImageSource
      );
    } else {
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        width,
        height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null
      );
    }
    return texture;
  }

  /**
   * Can be optionally used to get a texture from the cache array
   *
   * If an existing texture is not found, a new texture is created and cached.
   *
   * @param {String} uniqueId A cache key to use to find an existing texture.
   * @param {HTMLImageElement|HTMLCanvasElement} textureImageSource A source to use to create the
   * texture cache entry if one does not already exist.
   */
  getCachedTexture(uniqueId: string, textureImageSource: TexImageSource) {
    if (this.textureCache[uniqueId]) {
      return this.textureCache[uniqueId];
    } else {
      var texture = this.createTexture(
        this.gl,
        textureImageSource.width,
        textureImageSource.height,
        textureImageSource
      );
      this.textureCache[uniqueId] = texture;
      return texture;
    }
  }

  /**
   * Clear out cached resources related to a source image that has been
   * filtered previously.
   *
   * @param {String} cacheKey The cache key provided when the source image was filtered.
   */
  evictCachesForKey(cacheKey: string) {
    if (this.textureCache[cacheKey]) {
      this.gl.deleteTexture(this.textureCache[cacheKey]);
      delete this.textureCache[cacheKey];
    }
  }

  /**
   * Copy an input WebGL canvas on to an output 2D canvas.
   *
   * The WebGL canvas is assumed to be upside down, with the top-left pixel of the
   * desired output image appearing in the bottom-left corner of the WebGL canvas.
   *
   * @param {WebGLRenderingContext} sourceContext The WebGL context to copy from.
   * @param {Object} pipelineState The 2D target canvas to copy on to.
   */
  copyGLTo2D(gl: WebGLRenderingContext, pipelineState: TPipelineState) {
    const glCanvas = gl.canvas,
    targetCanvas = pipelineState.targetCanvas,
    ctx = targetCanvas.getContext('2d');
    ctx.translate(0, targetCanvas.height); // move it down again
    ctx.scale(1, -1); // vertical flip
    // where is my image on the big glcanvas?
    const sourceY = glCanvas.height - targetCanvas.height;
    ctx.drawImage(
      glCanvas,
      0,
      sourceY,
      targetCanvas.width,
      targetCanvas.height,
      0,
      0,
      targetCanvas.width,
      targetCanvas.height
    );
  }

  /**
   * Attempt to extract GPU information strings from a WebGL context.
   *
   * Useful information when debugging or blacklisting specific GPUs.
   *
   * @returns {Object} A GPU info object with renderer and vendor strings.
   */
  captureGPUInfo() {
    if (this.gpuInfo) {
      return this.gpuInfo;
    }
    var gl = this.gl,
      gpuInfo = { renderer: '', vendor: '' };
    if (!gl) {
      return gpuInfo;
    }
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (ext) {
      const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
      const vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL);
      if (renderer) {
        gpuInfo.renderer = renderer.toLowerCase();
      }
      if (vendor) {
        gpuInfo.vendor = vendor.toLowerCase();
      }
    }
    this.gpuInfo = gpuInfo;
    return gpuInfo;
  }
}

function resizeCanvasIfNeeded(pipelineState: TPipelineState) {
  var targetCanvas = pipelineState.targetCanvas,
    width = targetCanvas.width,
    height = targetCanvas.height,
    dWidth = pipelineState.destinationWidth,
    dHeight = pipelineState.destinationHeight;

  if (width !== dWidth || height !== dHeight) {
    targetCanvas.width = dWidth;
    targetCanvas.height = dHeight;
  }
}

/**
 * Copy an input WebGL canvas on to an output 2D canvas using 2d canvas' putImageData
 * API. Measurably faster than using ctx.drawImage in Firefox (version 54 on OSX Sierra).
 *
 * @param {WebGLRenderingContext} sourceContext The WebGL context to copy from.
 * @param {HTMLCanvasElement} targetCanvas The 2D target canvas to copy on to.
 * @param {Object} pipelineState The 2D target canvas to copy on to.
 */
function copyGLTo2DPutImageData(gl: WebGLRenderingContext, pipelineState: TPipelineState) {
  var targetCanvas = pipelineState.targetCanvas,
    ctx = targetCanvas.getContext('2d'),
    dWidth = pipelineState.destinationWidth,
    dHeight = pipelineState.destinationHeight,
    numBytes = dWidth * dHeight * 4;

  // eslint-disable-next-line no-undef
  var u8 = new Uint8Array(this.imageBuffer, 0, numBytes);
  // eslint-disable-next-line no-undef
  var u8Clamped = new Uint8ClampedArray(this.imageBuffer, 0, numBytes);

  gl.readPixels(0, 0, dWidth, dHeight, gl.RGBA, gl.UNSIGNED_BYTE, u8);
  var imgData = new ImageData(u8Clamped, dWidth, dHeight);
  ctx.putImageData(imgData, 0, 0);
}
