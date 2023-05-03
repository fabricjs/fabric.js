import { cos } from '../util/misc/cos';
import { sin } from '../util/misc/sin';
import { TMat2D } from '../typedefs';

/**
 * A rotation matrix
 * In the form of
 * [cos(a) -sin(a) -xcos(a)+ysin(a)+x]
 * [sin(a)  cos(a) -xsin(a)-ycos(a)+y]
 * [0       0      1                 ]
 */
type TMatRotate = [a: number] | [a: number, x: number, y: number];

export function rotateMatrix(
  matrix: TMat2D,
  args: TMatRotate | number[]
): void {
  const cosValue = cos(args[0]),
    sinValue = sin(args[0]);
  let x = 0,
    y = 0;
  if (args.length === 3) {
    x = args[1];
    y = args[2];
  }

  matrix[0] = cosValue;
  matrix[1] = sinValue;
  matrix[2] = -sinValue;
  matrix[3] = cosValue;
  matrix[4] = x - (cosValue * x - sinValue * y);
  matrix[5] = y - (sinValue * x + cosValue * y);
}
