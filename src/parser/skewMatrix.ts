//@ts-nocheck
import { degreesToRadians } from '../util';


export function skewMatrix(matrix, args, pos) {
    matrix[pos] = Math.tan(degreesToRadians(args[0]));
}
