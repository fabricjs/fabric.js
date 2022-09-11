import { Point } from '../../point.class';
import { TMat2D } from '../../typedefs';

/**
 * Returns coordinates of points's bounding rectangle (left, top, width, height)
 * This function does not make sense.
 * - it mutates the input in case transform is present
 * - is used in 2 instances of the app one with the transform one without
 * @static
 * @memberOf fabric.util
 * @param {Point[]} points
 * @param {TMat2D} [transform] 
 * @return {Object} Object with left, top, width, height properties
 */
export const makeBoundingBoxFromPoints = (points: Point[], transform: TMat2D) => {
  const start = transform ? points[0].transform(transform) : points[0];
  const { min, max } = points.reduce(({ min, max }, curr) => {
    const point = transform ? curr.transform(transform) : curr;
    return {
      min: min.min(point),
      max: max.max(point)
    }
  }, { min: start, max: start });
  const size = max.subtract(min);

  return {
    left: min.x,
    top: min.y,
    width: size.x,
    height: size.y,
  };
};
