import { IPoint, Point } from '../../point.class';
import { TRadian } from '../../typedefs';

/**
 * Rotates `vector` with `radians`
 * @static
 * @memberOf fabric.util
 * @param {Point} vector The vector to rotate (x and y)
 * @param {Number} radians The radians of the angle for the rotation
 * @return {Point} The new rotated point
 */
export const rotateVector = (vector: Point, radians: TRadian) =>
  vector.rotate(radians);

/**
 * Creates a vector from points represented as a point
 * @static
 * @memberOf fabric.util
 *
 * @param {Point} from
 * @param {Point} to
 * @returns {Point} vector
 */
export const createVector = (from: Point | IPoint, to: Point | IPoint): Point =>
  new Point(to).subtract(from);

/**
 * Calculates angle between 2 vectors
 * @static
 * @memberOf fabric.util
 * @param {Point} a
 * @param {Point} b
 * @returns the angle in radians from `a` to `b`
 */
export const calcAngleBetweenVectors = (a: Point, b: Point): TRadian => {
  const dot = a.x * b.x + a.y * b.y,
    det = a.x * b.y - a.y * b.x;
  return Math.atan2(det, dot) as TRadian;
};

/**
 * @static
 * @memberOf fabric.util
 * @param {Point} v
 * @returns {Point} vector representing the unit vector pointing to the direction of `v`
 */
export const getHatVector = (v: Point): Point => v.scalarDivide(v.magnitude());

/**
 * @static
 * @memberOf fabric.util
 * @param {Point} A
 * @param {Point} B
 * @param {Point} C
 * @returns {{ vector: Point, angle: TRadian}} vector representing the bisector of A and A's angle
 */
export const getBisector = (A: Point, B: Point, C: Point) => {
  const AB = createVector(A, B),
    AC = createVector(A, C),
    alpha = calcAngleBetweenVectors(AB, AC);
  return {
    vector: getHatVector(rotateVector(AB, alpha / 2)),
    angle: alpha,
  };
};

/**
 * @static
 * @memberOf fabric.util
 * @param {Point} v
 * @param {Boolean} [counterClockwise] the direction of the orthogonal vector, defaults to `true`
 * @returns {Point} the unit orthogonal vector
 */
export const getOrthogonalUnitVector = (
  v: Point,
  counterClockwise = true
): Point =>
  getHatVector(new Point(-v.y, v.x).scalarMultiply(counterClockwise ? 1 : -1));
