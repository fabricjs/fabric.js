import type { TSize } from '../../typedefs';

export const initRetinaScaling = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  { width, height }: TSize,
  retinaScaling: number
) => {
  canvas.setAttribute('width', (width * retinaScaling).toString());
  canvas.setAttribute('height', (height * retinaScaling).toString());
  context.scale(retinaScaling, retinaScaling);
};

export const setCanvasDimensions = (
  el: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  size: TSize,
  retinaScaling = 1
) => {
  el.width = size.width;
  el.height = size.height;
  retinaScaling > 1 && initRetinaScaling(el, ctx, size, retinaScaling);
};
