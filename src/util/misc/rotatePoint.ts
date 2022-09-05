import type { Point } from '../../point.class';
import type { TRadian } from '../../typedefs';
/**
 * Rotates `point` around `origin` with `radians`
 * @static
 * @deprecated use the Point.rotate
 * @memberOf fabric.util
 * @param {Point} origin The origin of the rotation
 * @param {Point} origin The origin of the rotation
 * @param {TRadian} radians The radians of the angle for the rotation
 * @return {Point} The new rotated point
 */
export const rotatePoint = (point: Point, origin: Point, radians: TRadian): Point => point.rotate(radians, origin);
