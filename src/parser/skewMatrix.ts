import { degreesToRadians } from '../util/misc/radiansDegreesConversion';
import { TDegree, TMat2D } from '../typedefs';

/**
 * A matrix in the form
 * [0 x 0]
 * [y 0 0]
 * [0 0 1]
 * For more info, see
 * @link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#skewx
 */

const fromAngleToSkew = (angle: TDegree) => Math.tan(degreesToRadians(angle));,

export const skewXMatrix = (skewValue: TDegree): TMat2D => [
  1,
  0,
  fromAngleToSkew(skewValue),
  1,
  0,
  0,
];

export const skewYMatrix = (skewValue: TDegree): TMat2D => [
  1,
  fromAngleToSkew(skewValue),
  0,
  1,
  0,
  0,
];
