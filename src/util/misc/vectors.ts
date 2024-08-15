import type { XY } from '../../Point';
import { Point } from '../../Point';
import type { TRadian } from '../../typedefs';

const unitVectorX = new Point(1, 0);
const zero = new Point();

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
export const magnitude = (point: Point) => point.distanceFrom(zero);

/**
 * Calculates the angle between 2 vectors
 * @param {Point} a
 * @param {Point} b
 * @returns the angle in radians from `a` to `b`
 */
export const calcAngleBetweenVectors = (a: Point, b: Point): TRadian =>
  Math.atan2(crossProduct(a, b), dotProduct(a, b)) as TRadian;

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
export const getUnitVector = (v: Point): Point =>
  v.eq(zero) ? v : v.scalarDivide(magnitude(v));

/**
 * @param {Point} v
 * @param {Boolean} [counterClockwise] the direction of the orthogonal vector, defaults to `true`
 * @returns {Point} the unit orthogonal vector
 */
export const getOrthonormalVector = (
  v: Point,
  counterClockwise = true,
): Point =>
  getUnitVector(new Point(-v.y, v.x).scalarMultiply(counterClockwise ? 1 : -1));

/**
 * Cross product of two vectors in 2D
 * @param {Point} a
 * @param {Point} b
 * @returns {number} the magnitude of Z vector
 */
export const crossProduct = (a: Point, b: Point): number =>
  a.x * b.y - a.y * b.x;

/**
 * Dot product of two vectors in 2D
 * @param {Point} a
 * @param {Point} b
 * @returns {number}
 */
export const dotProduct = (a: Point, b: Point): number => a.x * b.x + a.y * b.y;

/**
 * Checks if the vector is between two others. It is considered
 * to be inside when the vector to be tested is between the
 * initial vector and the final vector (included) in a counterclockwise direction.
 * @param {Point} t vector to be tested
 * @param {Point} a initial vector
 * @param {Point} b final vector
 * @returns {boolean} true if the vector is among the others
 */
export const isBetweenVectors = (t: Point, a: Point, b: Point): boolean => {
  if (t.eq(a) || t.eq(b)) return true;
  const AxB = crossProduct(a, b),
    AxT = crossProduct(a, t),
    BxT = crossProduct(b, t);
  return AxB >= 0 ? AxT >= 0 && BxT <= 0 : !(AxT <= 0 && BxT >= 0);
};
