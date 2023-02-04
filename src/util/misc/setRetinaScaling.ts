import { config } from '../../config';
import { TSize } from '../../typedefs';

export function setRetinaScaling(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  { width, height }: TSize,
  dpr = config.devicePixelRatio
) {
  canvas.setAttribute('width', (width * dpr).toString());
  canvas.setAttribute('height', (height * dpr).toString());
  context.scale(dpr, dpr);
}
