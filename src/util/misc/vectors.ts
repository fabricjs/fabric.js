import { IPoint, Point } from '../../point.class';
import { TRadian } from '../../typedefs';

const unitVectorX = new Point(1, 0);
const zero = new Point();

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
export const createVector = (from: IPoint, to: IPoint): Point =>
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
export const getUnitVector = (v: Point): Point =>
  v.eq(zero) ? v : v.scalarDivide(magnitude(v));

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
