import { Point } from '../../point.class';
import { TMat2D } from '../../typedefs';
import { transformPoint } from './matrix';

/**
 * Returns coordinates of points's bounding rectangle (left, top, width, height)
 * This function does not make sense.
 * - it mutates the input in case transform is present
 * - is used in 2 instances of the app one with the transform one without
 * @static
 * @memberOf fabric.util
 * @param {Point[]} points 4 points array
 * @param {TMat2D} [transform] an array of 6 numbers representing a 2x3 transform matrix
 * @return {Object} Object with left, top, width, height properties
 */
export const makeBoundingBoxFromPoints = (points: Point[], transform: TMat2D) => {
  if (transform) {
    for (let i = 0; i < points.length; i++) {
      points[i] = transformPoint(points[i], transform);
    }
  }
  const left = Math.min(points[0].x, points[1].x, points[2].x, points[3].x),
        right = Math.max(points[0].x, points[1].x, points[2].x, points[3].x),
        width = right - left,
        top = Math.min(points[0].y, points[1].y, points[2].y, points[3].y),
        bottom = Math.max(points[0].y, points[1].y, points[2].y, points[3].y),
        height = bottom - top;

  return {
    left,
    top,
    width,
    height,
  };
};
