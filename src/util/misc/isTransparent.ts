/**
 * Returns true if context has transparent pixel
 * at specified location (taking tolerance into account)
 * @param {CanvasRenderingContext2D} ctx context
 * @param {Number} x x coordinate in canvasElementCoordinate, not fabric space. integer
 * @param {Number} y y coordinate in canvasElementCoordinate, not fabric space. integer
 * @param {Number} tolerance Tolerance pixels around the point, not alpha tolerance, integer
 * @return {boolean} true if transparent
 */
export const isTransparent = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  tolerance: number,
): boolean => {
  tolerance = Math.round(tolerance);
  const size = tolerance * 2 + 1;
  const { data } = ctx.getImageData(x - tolerance, y - tolerance, size, size);

  // Split image data - for tolerance > 1, pixelDataSize = 4;
  for (let i = 3; i < data.length; i += 4) {
    const alphaChannel = data[i];
    if (alphaChannel > 0) {
      return false;
    }
  }
  return true;
};
