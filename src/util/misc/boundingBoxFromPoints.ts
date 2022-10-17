import { IPoint, Point } from '../../point.class';

/**
 * Calculates bounding box (left, top, width, height) from given `points`
 * @static
 * @memberOf fabric.util
 * @param {IPoint[]} points
 * @return {Object} Object with left, top, width, height properties
 */
export const makeBoundingBoxFromPoints = (points: IPoint[]) => {
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
