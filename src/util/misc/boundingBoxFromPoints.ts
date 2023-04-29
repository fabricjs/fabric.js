import { XY, Point } from '../../Point';
import { TBBox } from '../../typedefs';

/**
 * Calculates bounding box (left, top, width, height) from given `points`
 * @param {XY[]} points
 * @return {Object} Object with left, top, width, height properties
 */
export const makeBoundingBoxFromPoints = (points: XY[]): TBBox => {
  if (points.length === 0) {
    return {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    };
  }

  const { min, max } = points.reduce(
    ({ min, max }, curr) => {
      return {
        min: min.min(curr),
        max: max.max(curr),
      };
    },
    { min: new Point(points[0]), max: new Point(points[0]) }
  );

  const size = max.subtract(min);

  return {
    left: min.x,
    top: min.y,
    width: size.x,
    height: size.y,
  };
};
