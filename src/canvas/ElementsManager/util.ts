import type { TSize } from '../../typedefs';
import type { CanvasItem, TCanvasSizeOptions } from './types';

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
  { el, ctx }: CanvasItem,
  { width, height }: TSize,
  {
    cssOnly = false,
    backstoreOnly = false,
    retinaScaling = 1,
  }: TCanvasSizeOptions = {}
) => {
  if (!cssOnly) {
    el.width = width;
    el.height = height;
  }
  if (!backstoreOnly) {
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
  }
  retinaScaling > 1 &&
    initRetinaScaling(el, ctx, { width, height }, retinaScaling);
};
