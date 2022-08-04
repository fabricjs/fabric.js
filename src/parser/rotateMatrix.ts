//@ts-nocheck
import { cos, sin } from '../util';


export function rotateMatrix(matrix, args) {
    let cosValue = cos(args[0]), sinValue = sin(args[0]), x = 0, y = 0;
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
