import { Point } from '../../point.class';

/**
 * Calculates bounding box (left, top, width, height) from given `points`
 * @static
 * @memberOf fabric.util
 * @param {Point[]} points
 * @return {Object} Object with left, top, width, height properties
 */
export const makeBoundingBoxFromPoints = (points: Point[]) => {
  const { min, max } = points.reduce(
    ({ min, max }, curr) => {
      return {
        min: min.min(curr),
        max: max.max(curr),
      };
    },
    { min: points[0], max: points[0] }
  );

  const size = max.subtract(min);

  return {
    left: min.x,
    top: min.y,
    width: size.x,
    height: size.y,
  };
};
