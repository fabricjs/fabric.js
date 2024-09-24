import type { XY } from '../../Point';
import { Point } from '../../Point';
import type { TRadian } from '../../typedefs';
/**
 * Rotates `vector` with `radians`
 * @param {Point} vector The vector to rotate (x and y)
 * @param {Number} radians The radians of the angle for the rotation
 * @return {Point} The new rotated point
 */
export declare const rotateVector: (vector: Point, radians: TRadian) => Point;
/**
 * Creates a vector from points represented as a point
 *
 * @param {Point} from
 * @param {Point} to
 * @returns {Point} vector
 */
export declare const createVector: (from: XY, to: XY) => Point;
/**
 * return the magnitude of a vector
 * @return {number}
 */
export declare const magnitude: (point: Point) => number;
/**
 * Calculates the angle between 2 vectors
 * @param {Point} a
 * @param {Point} b
 * @returns the angle in radians from `a` to `b`
 */
export declare const calcAngleBetweenVectors: (a: Point, b: Point) => TRadian;
/**
 * Calculates the angle between the x axis and the vector
 * @param {Point} v
 * @returns the angle in radians of `v`
 */
export declare const calcVectorRotation: (v: Point) => TRadian;
/**
 * @param {Point} v
 * @returns {Point} vector representing the unit vector pointing to the direction of `v`
 */
export declare const getUnitVector: (v: Point) => Point;
/**
 * @param {Point} v
 * @param {Boolean} [counterClockwise] the direction of the orthogonal vector, defaults to `true`
 * @returns {Point} the unit orthogonal vector
 */
export declare const getOrthonormalVector: (v: Point, counterClockwise?: boolean) => Point;
/**
 * Cross product of two vectors in 2D
 * @param {Point} a
 * @param {Point} b
 * @returns {number} the magnitude of Z vector
 */
export declare const crossProduct: (a: Point, b: Point) => number;
/**
 * Dot product of two vectors in 2D
 * @param {Point} a
 * @param {Point} b
 * @returns {number}
 */
export declare const dotProduct: (a: Point, b: Point) => number;
/**
 * Checks if the vector is between two others. It is considered
 * to be inside when the vector to be tested is between the
 * initial vector and the final vector (included) in a counterclockwise direction.
 * @param {Point} t vector to be tested
 * @param {Point} a initial vector
 * @param {Point} b final vector
 * @returns {boolean} true if the vector is among the others
 */
export declare const isBetweenVectors: (t: Point, a: Point, b: Point) => boolean;
//# sourceMappingURL=vectors.d.ts.map