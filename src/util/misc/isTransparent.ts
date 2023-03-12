import { Point } from '../../Point';

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
  const point = new Point(x, y);
  const start = point.scalarSubtract(tolerance).floor();
  const end = point
    .scalarAdd(Math.max(tolerance, 1))
    .ceil()
    .min(new Point(ctx.canvas.width - 1, ctx.canvas.height - 1));
  const boundStart = start.max(new Point());
  const size = end.subtract(boundStart);
  if (size.x <= 0 || size.y <= 0) {
    // out of bounds
    return true;
  }

  const { data } = ctx.getImageData(boundStart.x, boundStart.y, size.x, size.y);
  for (let i = 3; i < data.length; i += 4) {
    const alphaChannel = data[i];
    if (alphaChannel > 0) {
      return false;
    }
  }
  return true;
};
