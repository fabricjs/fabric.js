import { IPoint, Point } from '../../point.class';
import { TRadian } from '../../typedefs';
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
export declare const createVector: (from: IPoint, to: IPoint) => Point;
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
 * @param {Point} A
 * @param {Point} B
 * @param {Point} C
 * @returns {{ vector: Point, angle: TRadian}} vector representing the bisector of A and A's angle
 */
export declare const getBisector: (A: Point, B: Point, C: Point) => {
    vector: Point;
    angle: TRadian;
};
/**
 * @param {Point} v
 * @param {Boolean} [counterClockwise] the direction of the orthogonal vector, defaults to `true`
 * @returns {Point} the unit orthogonal vector
 */
export declare const getOrthonormalVector: (v: Point, counterClockwise?: boolean) => Point;
//# sourceMappingURL=vectors.d.ts.map