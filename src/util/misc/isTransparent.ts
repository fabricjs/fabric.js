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
  const { data } = ctx.getImageData(
    Math.max(x - tolerance, 0),
    Math.max(y - tolerance, 0),
    Math.min(x + tolerance, ctx.canvas.width),
    Math.min(y + tolerance, ctx.canvas.height)
  );
  for (let i = 3; i < data.length; i += 4) {
    const alphaChannel = data[i];
    if (alphaChannel > 0) {
      return false;
    }
  }

  return true;
};
