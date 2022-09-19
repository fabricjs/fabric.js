//@ts-nocheck
import { cos } from '../util/misc/cos';
import { sin } from '../util/misc/sin';

export function rotateMatrix(matrix, args) {
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
