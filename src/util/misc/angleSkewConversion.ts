import type { TRadian, TDegree } from '../../typedefs';
import { degreesToRadians, radiansToDegrees } from './radiansDegreesConversion';

export const angleToSkew = (angle: TDegree) =>
  Math.tan(degreesToRadians(angle));

export const skewToAngle = (value: TRadian) =>
  radiansToDegrees(Math.atan(value));
