import { getFabricWindow } from '../env/index.mjs';
import { createCanvasElement } from '../util/misc/dom.mjs';
import { WebGLFilterBackend } from './WebGLFilterBackend.mjs';

const isWebGLPipelineState = options => {
  return options.webgl !== undefined;
};

/**
 * Pick a method to copy data from GL context to 2d canvas.  In some browsers using
 * drawImage should be faster, but is also bugged for a small combination of old hardware
 * and drivers.
 * putImageData is faster than drawImage for that specific operation.
 */
const isPutImageFaster = (width, height) => {
  const targetCanvas = createCanvasElement();
  const sourceCanvas = createCanvasElement();
  const gl = sourceCanvas.getContext('webgl');
  // eslint-disable-next-line no-undef
  const imageBuffer = new ArrayBuffer(width * height * 4);
  const testContext = {
    imageBuffer: imageBuffer
  };
  const testPipelineState = {
    destinationWidth: width,
    destinationHeight: height,
    targetCanvas: targetCanvas
  };
  let startTime;
  targetCanvas.width = width;
  targetCanvas.height = height;
  startTime = getFabricWindow().performance.now();
  WebGLFilterBackend.prototype.copyGLTo2D.call(testContext, gl, testPipelineState);
  const drawImageTime = getFabricWindow().performance.now() - startTime;
  startTime = getFabricWindow().performance.now();
  WebGLFilterBackend.prototype.copyGLTo2DPutImageData.call(testContext, gl, testPipelineState);
  const putImageDataTime = getFabricWindow().performance.now() - startTime;
  return drawImageTime > putImageDataTime;
};

export { isPutImageFaster, isWebGLPipelineState };
//# sourceMappingURL=utils.mjs.map
