/**
 * Calculates bounding box (left, top, width, height) from given `points`
 * @param {XY[]} points
 * @return {Object} Object with left, top, width, height properties
 */
const makeBoundingBoxFromPoints = points => {
  let left = 0,
    top = 0,
    width = 0,
    height = 0;
  for (let i = 0, len = points.length; i < len; i++) {
    const {
      x,
      y
    } = points[i];
    if (x > width || !i) width = x;
    if (x < left || !i) left = x;
    if (y > height || !i) height = y;
    if (y < top || !i) top = y;
  }
  return {
    left,
    top,
    width: width - left,
    height: height - top
  };
};

export { makeBoundingBoxFromPoints };
//# sourceMappingURL=boundingBoxFromPoints.mjs.map
