import { cos } from '../util/misc/cos';
import { sin } from '../util/misc/sin';
import { TDegree, TMat2D } from '../typedefs';
import { degreesToRadians } from '../util';

/**
 * A rotation matrix
 * In the form of
 * [cos(a) -sin(a) -xcos(a)+ysin(a)+x]
 * [sin(a)  cos(a) -xsin(a)-ycos(a)+y]
 * [0       0      1                 ]
 */

export function rotateMatrix(angle: TDegree, x = 0, y = 0): TMat2D {
  const angleRadiant = degreesToRadians(angle),
    cosValue = cos(angleRadiant),
    sinValue = sin(angleRadiant);
  return [
    cosValue,
    sinValue,
    -sinValue,
    cosValue,
    x - (cosValue * x - sinValue * y),
    y - (sinValue * x + cosValue * y),
  ];
}
