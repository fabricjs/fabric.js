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
  // If tolerance is > 0 adjust start coords to take into account.
  // If moves off Canvas fix to 0
  if (tolerance > 0) {
    if (x > tolerance) {
      x -= tolerance;
    } else {
      x = 0;
    }
    if (y > tolerance) {
      y -= tolerance;
    } else {
      y = 0;
    }
  }

  let _isTransparent = true;
  const { data } = ctx.getImageData(
    x,
    y,
    tolerance * 2 || 1,
    tolerance * 2 || 1
  );
  const l = data.length;

  // Split image data - for tolerance > 1, pixelDataSize = 4;
  for (let i = 3; i < l; i += 4) {
    const alphaChannel = data[i];
    if (alphaChannel > 0) {
      // Stop if colour found
      _isTransparent = false;
      break;
    }
  }

  return _isTransparent;
};
