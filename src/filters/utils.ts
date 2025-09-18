import { getFabricWindow } from '../env';
import { createCanvasElement, createCanvasElementFor } from '../util/misc/dom';
import { WebGLFilterBackend } from './WebGLFilterBackend';
import type { TWebGLPipelineState, T2DPipelineState } from './typedefs';

export const isWebGLPipelineState = (
  options: TWebGLPipelineState | T2DPipelineState,
): options is TWebGLPipelineState => {
  return (options as TWebGLPipelineState).webgl !== undefined;
};

/**
 * Pick a method to copy data from GL context to 2d canvas.  In some browsers using
 * drawImage should be faster, but is also bugged for a small combination of old hardware
 * and drivers.
 * putImageData is faster than drawImage for that specific operation.
 */
export const isPutImageFaster = (width: number, height: number): boolean => {
  const targetCanvas = createCanvasElementFor({ width, height });
  const sourceCanvas = createCanvasElement();
  const gl = sourceCanvas.getContext('webgl')!;
  // eslint-disable-next-line no-undef
  const imageBuffer = new ArrayBuffer(width * height * 4);

  const testContext = {
    imageBuffer: imageBuffer,
  } as unknown as Required<WebGLFilterBackend>;
  const testPipelineState = {
    destinationWidth: width,
    destinationHeight: height,
    targetCanvas: targetCanvas,
  } as unknown as TWebGLPipelineState;
  let startTime;

  startTime = getFabricWindow().performance.now();
  WebGLFilterBackend.prototype.copyGLTo2D.call(
    testContext,
    gl,
    testPipelineState,
  );
  const drawImageTime = getFabricWindow().performance.now() - startTime;

  startTime = getFabricWindow().performance.now();
  WebGLFilterBackend.prototype.copyGLTo2DPutImageData.call(
    testContext,
    gl,
    testPipelineState,
  );
  const putImageDataTime = getFabricWindow().performance.now() - startTime;

  return drawImageTime > putImageDataTime;
};
