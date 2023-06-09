import type { TWebGLPipelineState, T2DPipelineState } from './typedefs';

export const isWebGLPipelineState = (
  options: TWebGLPipelineState | T2DPipelineState
): options is TWebGLPipelineState => {
  return (options as TWebGLPipelineState).webgl !== undefined;
};
