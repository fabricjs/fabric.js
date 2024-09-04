import type { XY } from '../../Point';
import type { TBBox } from '../../typedefs';

/**
 * Calculates bounding box (left, top, width, height) from given `points`
 * @param {XY[]} points
 * @return {Object} Object with left, top, width, height properties
 */
export const makeBoundingBoxFromPoints = (points: XY[]): TBBox => {
  let left = 0,
    top = 0,
    width = 0,
    height = 0;

  for (let i = 0, len = points.length; i < len; i++) {
    const p = points[i];
    if (p.x > width || i === 0) width = p.x;
    if (p.x < left || i === 0) left = p.x;
    if (p.y > height || i === 0) height = p.y;
    if (p.y < top || i === 0) top = p.y;
  }

  return {
    left,
    top,
    width: width - left,
    height: height - top,
  };
};
