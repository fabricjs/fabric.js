import { Point } from '../../Point.mjs';

const unitVectorX = new Point(1, 0);
const zero = new Point();

/**
 * Rotates `vector` with `radians`
 * @param {Point} vector The vector to rotate (x and y)
 * @param {Number} radians The radians of the angle for the rotation
 * @return {Point} The new rotated point
 */
const rotateVector = (vector, radians) => vector.rotate(radians);

/**
 * Creates a vector from points represented as a point
 *
 * @param {Point} from
 * @param {Point} to
 * @returns {Point} vector
 */
const createVector = (from, to) => new Point(to).subtract(from);

/**
 * return the magnitude of a vector
 * @return {number}
 */
const magnitude = point => point.distanceFrom(zero);

/**
 * Calculates the angle between 2 vectors
 * @param {Point} a
 * @param {Point} b
 * @returns the angle in radians from `a` to `b`
 */
const calcAngleBetweenVectors = (a, b) => Math.atan2(crossProduct(a, b), dotProduct(a, b));

/**
 * Calculates the angle between the x axis and the vector
 * @param {Point} v
 * @returns the angle in radians of `v`
 */
const calcVectorRotation = v => calcAngleBetweenVectors(unitVectorX, v);

/**
 * @param {Point} v
 * @returns {Point} vector representing the unit vector pointing to the direction of `v`
 */
const getUnitVector = v => v.eq(zero) ? v : v.scalarDivide(magnitude(v));

/**
 * @param {Point} v
 * @param {Boolean} [counterClockwise] the direction of the orthogonal vector, defaults to `true`
 * @returns {Point} the unit orthogonal vector
 */
const getOrthonormalVector = function (v) {
  let counterClockwise = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return getUnitVector(new Point(-v.y, v.x).scalarMultiply(counterClockwise ? 1 : -1));
};

/**
 * Cross product of two vectors in 2D
 * @param {Point} a
 * @param {Point} b
 * @returns {number} the magnitude of Z vector
 */
const crossProduct = (a, b) => a.x * b.y - a.y * b.x;

/**
 * Dot product of two vectors in 2D
 * @param {Point} a
 * @param {Point} b
 * @returns {number}
 */
const dotProduct = (a, b) => a.x * b.x + a.y * b.y;

/**
 * Checks if the vector is between two others. It is considered
 * to be inside when the vector to be tested is between the
 * initial vector and the final vector (included) in a counterclockwise direction.
 * @param {Point} t vector to be tested
 * @param {Point} a initial vector
 * @param {Point} b final vector
 * @returns {boolean} true if the vector is among the others
 */
const isBetweenVectors = (t, a, b) => {
  if (t.eq(a) || t.eq(b)) return true;
  const AxB = crossProduct(a, b),
    AxT = crossProduct(a, t),
    BxT = crossProduct(b, t);
  return AxB >= 0 ? AxT >= 0 && BxT <= 0 : !(AxT <= 0 && BxT >= 0);
};

export { calcAngleBetweenVectors, calcVectorRotation, createVector, crossProduct, dotProduct, getOrthonormalVector, getUnitVector, isBetweenVectors, magnitude, rotateVector };
//# sourceMappingURL=vectors.mjs.map
