import { capValue } from './capValue';

/**
 * Returns true if context has transparent pixel
 * at specified location (taking tolerance into account)
 * @param {CanvasRenderingContext2D} ctx context
 * @param {Number} x x coordinate in canvasElementCoordinate, not fabric space
 * @param {Number} y y coordinate in canvasElementCoordinate, not fabric space
 * @param {Number} tolerance Tolerance pixels around the point, not alpha tolerance
 * @return {boolean} true if transparent
 */
export const isTransparent = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  tolerance: number
): boolean => {
  tolerance = Math.ceil(Math.max(tolerance, 0));
  const sx = Math.floor(Math.max(x - tolerance, 0));
  const sy = Math.floor(Math.max(y - tolerance, 0));
  const { data } = ctx.getImageData(
    sx,
    sy,
    capValue(1, tolerance * 2, ctx.canvas.width - sx),
    capValue(1, tolerance * 2, ctx.canvas.height - sy)
  );
  for (let i = 3; i < data.length; i += 4) {
    const alphaChannel = data[i];
    if (alphaChannel > 0) {
      return false;
    }
  }

  return true;
};
