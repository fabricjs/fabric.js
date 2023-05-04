import { degreesToRadians } from '../util/misc/radiansDegreesConversion';
import { TDegree, TMat2D } from '../typedefs';

/**
 * A matrix in the form
 * [1 x 0]
 * [0 1 0]
 * [0 0 1]
 *
 * or
 *
 * [1 0 0]
 * [y 1 0]
 * [0 0 1]
 *
 * For more info, see
 * @link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#skewx
 */
const fromAngleToSkew = (angle: TDegree) => Math.tan(degreesToRadians(angle));

/**
 * Generate a skew matrix for the X axis
 * @param {TDegree} skewValue translation on X axis
 * @returns {TMat2D} matrix
 */
export const skewXMatrix = (skewValue: TDegree): TMat2D => [
  1,
  0,
  fromAngleToSkew(skewValue),
  1,
  0,
  0,
];

/**
 * Generate a skew matrix for the Y axis
 * @param {TDegree} skewValue translation on Y axis
 * @returns {TMat2D} matrix
 */
export const skewYMatrix = (skewValue: TDegree): TMat2D => [
  1,
  fromAngleToSkew(skewValue),
  0,
  1,
  0,
  0,
];
