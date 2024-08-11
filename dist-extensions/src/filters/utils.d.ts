import type { TWebGLPipelineState, T2DPipelineState } from './typedefs';
export declare const isWebGLPipelineState: (options: TWebGLPipelineState | T2DPipelineState) => options is TWebGLPipelineState;
/**
 * Pick a method to copy data from GL context to 2d canvas.  In some browsers using
 * drawImage should be faster, but is also bugged for a small combination of old hardware
 * and drivers.
 * putImageData is faster than drawImage for that specific operation.
 */
export declare const isPutImageFaster: (width: number, height: number) => boolean;
//# sourceMappingURL=utils.d.ts.map