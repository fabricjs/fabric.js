import type { Point } from '../../Point';
import type { TRadian } from '../../typedefs';
/**
 * Rotates `point` around `origin` with `radians`
 * @deprecated use the Point.rotate
 * @param {Point} origin The origin of the rotation
 * @param {Point} origin The origin of the rotation
 * @param {TRadian} radians The radians of the angle for the rotation
 * @return {Point} The new rotated point
 */
export const rotatePoint = (
  point: Point,
  origin: Point,
  radians: TRadian,
): Point => point.rotate(radians, origin);
