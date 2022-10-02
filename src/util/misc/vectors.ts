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
 * Creates a vetor from points represented as a point
 * @static
 * @memberOf fabric.util
 *
 * @param {Point} from
 * @param {Point} to
 * @returns {Point} vector
 */
export const createVector = (from: Point | IPoint, to: Point): Point =>
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
  var dot = a.x * b.x + a.y * b.y, 
    det = a.x * b.y - a.y * b.x;
  return Math.atan2(det, dot) as TRadian;
}

/**
 * @static
 * @memberOf fabric.util
 * @param {Point} v
 * @returns {Point} vector representing the unit vector of pointing to the direction of `v`
 */
export const getHatVector = (v: Point): Point =>
  v.scalarMultiply(1 / Math.hypot(v.x, v.y));

/**
 * @static
 * @memberOf fabric.util
 * @param {Point} A
 * @param {Point} B
 * @param {Point} C
 * @returns {{ vector: Point, angle: TRadian}} vector representing the bisector of A and A's angle
 */
export const getBisector = (A: Point, B: Point, C: Point) => {
  let AB = createVector(A, B), 
    AC = createVector(A, C),
    alpha = calcAngleBetweenVectors(AB, AC);
  return {
      vector: getHatVector(rotateVector(AB, alpha / 2 as TRadian)),
      angle: alpha as TRadian
  };
};

/**
 * @static
 * @memberOf fabric.util
 * @param {Point} v         
 * @param {Boolean} [counterClockwise] the direction of the orthogonal vector, defaults to `true`
 * @returns {Point} the unit orthogonal vector
 */
export const getOrthogonalUnitVector = (v: Point, counterClockwise: boolean = true): Point =>
  getHatVector(new Point(counterClockwise ? -v.y : v.y, counterClockwise ? v.x : -v.x));
