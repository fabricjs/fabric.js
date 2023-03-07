import { IPoint, Point } from '../../Point';
import { TRadian } from '../../typedefs';
import { Vector } from '../../Vector';

/**
 * Rotates `vector` with `radians`
 * @deprecated use {@link Vector}
 * @param {Point} vector The vector to rotate (x and y)
 * @param {Number} radians The radians of the angle for the rotation
 * @return {Point} The new rotated point
 */
export const rotateVector = (vector: Point, radians: TRadian) =>
  new Vector(vector).rotate(radians);

/**
 * Creates a vector from points represented as a point
 *
 * @deprecated use {@link Vector}
 * @param {Point} from
 * @param {Point} to
 * @returns {Point} vector
 */
export const createVector = (from: IPoint, to: IPoint): Point =>
  Vector.create(from, to);
