import { PiBy180 } from '../../constants.mjs';

/**
 * Transforms degrees to radians.
 * @param {TDegree} degrees value in degrees
 * @return {TRadian} value in radians
 */
const degreesToRadians = degrees => degrees * PiBy180;

/**
 * Transforms radians to degrees.
 * @param {TRadian} radians value in radians
 * @return {TDegree} value in degrees
 */
const radiansToDegrees = radians => radians / PiBy180;

export { degreesToRadians, radiansToDegrees };
//# sourceMappingURL=radiansDegreesConversion.mjs.map
