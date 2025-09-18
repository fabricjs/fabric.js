import type { StaticCanvas } from '../../canvas/StaticCanvas';

/**
 * Set the transform of the passed context to the same of a specific Canvas or StaticCanvas.
 * setTransform is used since this utility will RESET the ctx transform to the basic value
 * of retina scaling and viewport transform
 * It is not meant to be added to other transforms, it is used internally to preapre canvases to draw
 * @param ctx
 * @param canvas
 */
export const applyCanvasTransform = (
  ctx: CanvasRenderingContext2D,
  canvas: StaticCanvas,
) => {
  const scale = canvas.getRetinaScaling();
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  const v = canvas.viewportTransform;
  ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
};
