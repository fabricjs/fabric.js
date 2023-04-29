import { TMat2D } from '../typedefs';

/**
 * A scale matrix
 * Takes form
 * [x 0 0]
 * [0 y 0]
 * [0 0 1]
 * For more info, see
 * @link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#scale
 */
type TMatScale = [x: number] | [x: number, y: number];

export function scaleMatrix(matrix: TMat2D, args: TMatScale | number[]) {
  const multiplierX = args[0],
    multiplierY = args.length === 2 ? args[1] : args[0];

  matrix[0] = multiplierX;
  matrix[3] = multiplierY;
}
