import { Point } from '../../point.class';
import { createVector, getBisector } from './vectors';
import { StrokeLineJoin } from '../../typedefs';
/**
 * Project stroke width on points returning 2 projections for each point as follows:
 * - `miter`: 2 points corresponding to the outer boundary and the inner boundary of stroke.
 * - `bevel`: 2 points corresponding to the bevel boundaries, tangent to the bisector.
 * - `round`: same as `bevel`
 * Used to calculate object's bounding box
 * @static
 * @memberOf fabric.util
 * @param {Point[]} points
 * @param {Object} options
 * @param {number} options.strokeWidth
 * @param {'miter'|'bevel'|'round'} options.strokeLineJoin
 * @param {number} options.strokeMiterLimit https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-miterlimit
 * @param {boolean} options.strokeUniform
 * @param {number} options.scaleX
 * @param {number} options.scaleY
 * @param {boolean} [openPath] whether the shape is open or not, affects the calculations of the first and last points
 * @returns {Point[]} array of size 2n/4n of all suspected points
 */

type projectStrokeOnPointsOptions = {
  strokeWidth: number;
  strokeLineJoin: StrokeLineJoin;
  strokeMiterLimit: number; // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-miterlimit
  strokeUniform: boolean;
  scaleX: number;
  scaleY: number;
};

export const projectStrokeOnPoints = (
  points: Point[],
  {
    strokeWidth,
    strokeLineJoin,
    strokeMiterLimit, // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-miterlimit
    strokeUniform,
    scaleX,
    scaleY,
  }: projectStrokeOnPointsOptions,
  openPath: boolean
): Point[] => {
  const coords: Point[] = [],
    s = strokeWidth / 2,
    strokeUniformScalar = strokeUniform
      ? new Point(1 / scaleX, 1 / scaleY)
      : new Point(1, 1),
    getStrokeHatVector = (v: Point) => {
      const scalar = s / Math.hypot(v.x, v.y);
      return new Point(
        v.x * scalar * strokeUniformScalar.x,
        v.y * scalar * strokeUniformScalar.y
      );
    };
  if (points.length <= 1) {
    return coords;
  }
  points.forEach(function (p, index) {
    const A = new Point(p.x, p.y);
    let B, C;
    if (index === 0) {
      C = points[index + 1];
      B = openPath
        ? getStrokeHatVector(createVector(C, A)).add(A)
        : points[points.length - 1];
    } else if (index === points.length - 1) {
      B = points[index - 1];
      C = openPath ? getStrokeHatVector(createVector(B, A)).add(A) : points[0];
    } else {
      B = points[index - 1];
      C = points[index + 1];
    }
    const bisector = getBisector(A, B, C),
      bisectorVector = bisector.vector,
      alpha = bisector.angle;
    let scalar, miterVector;
    if (strokeLineJoin === StrokeLineJoin.miter) {
      scalar = -s / Math.sin(alpha / 2);
      miterVector = new Point(
        bisectorVector.x * scalar * strokeUniformScalar.x,
        bisectorVector.y * scalar * strokeUniformScalar.y
      );
      if (Math.hypot(miterVector.x, miterVector.y) / s <= strokeMiterLimit) {
        coords.push(A.add(miterVector));
        coords.push(A.subtract(miterVector));
        return;
      }
    }
    scalar = -s * Math.SQRT2;
    miterVector = new Point(
      bisectorVector.x * scalar * strokeUniformScalar.x,
      bisectorVector.y * scalar * strokeUniformScalar.y
    );
    coords.push(A.add(miterVector));
    coords.push(A.subtract(miterVector));
  });
  return coords;
};
