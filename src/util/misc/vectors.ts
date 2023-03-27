import { XY, Point } from '../../Point';
import { TRadian } from '../../typedefs';

const unitVectorX = new Point(1, 0);

/**
 * Rotates `vector` with `radians`
 * @param {Point} vector The vector to rotate (x and y)
 * @param {Number} radians The radians of the angle for the rotation
 * @return {Point} The new rotated point
 */
export const rotateVector = (vector: Point, radians: TRadian) =>
  vector.rotate(radians);

/**
 * Creates a vector from points represented as a point
 *
 * @param {Point} from
 * @param {Point} to
 * @returns {Point} vector
 */
export const createVector = (from: XY, to: XY): Point =>
  new Point(to).subtract(from);

/**
 * return the magnitude of a vector
 * @return {number}
 */
export const magnitude = (point: Point) => point.distanceFrom(new Point());

/**
 * Calculates the angle between 2 vectors
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
 * Calculates the angle between the x axis and the vector
 * @param {Point} v
 * @returns the angle in radians of `v`
 */
export const calcVectorRotation = (v: Point) =>
  calcAngleBetweenVectors(unitVectorX, v);

/**
 * @param {Point} v
 * @returns {Point} vector representing the unit vector pointing to the direction of `v`
 */
export const getUnitVector = (v: Point): Point => v.scalarDivide(magnitude(v));

/**
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
    vector: getUnitVector(rotateVector(AB, alpha / 2)),
    angle: alpha,
  };
};

/**
 * @param {Point} v
 * @param {Boolean} [counterClockwise] the direction of the orthogonal vector, defaults to `true`
 * @returns {Point} the unit orthogonal vector
 */
export const getOrthonormalVector = (
  v: Point,
  counterClockwise = true
): Point =>
  getUnitVector(new Point(-v.y, v.x).scalarMultiply(counterClockwise ? 1 : -1));
