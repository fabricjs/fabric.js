import type { TRadian, TDegree } from '../../typedefs';
import { PiBy180 } from '../../constants';

/**
 * Transforms degrees to radians.
 * @param {TDegree} degrees value in degrees
 * @return {TRadian} value in radians
 */
export const degreesToRadians = (degrees: TDegree): TRadian =>
  (degrees * PiBy180) as TRadian;

/**
 * Transforms radians to degrees.
 * @param {TRadian} radians value in radians
 * @return {TDegree} value in degrees
 */
export const radiansToDegrees = (radians: TRadian): TDegree =>
  (radians / PiBy180) as TDegree;
