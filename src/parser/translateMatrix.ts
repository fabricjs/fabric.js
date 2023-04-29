import { TMat2D } from '../typedefs';

/**
 * A translation matrix in the form of
 * [ 1 0 x ]
 * [ 0 1 y ]
 * [ 0 0 1 ]
 * See @link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#translate for more details
 */
type TMatTranslate = [x: number] | [x: number, y: number];

/**
 * Force the translation to be this
 * @param matrix
 * @param args
 */
export function translateMatrix(
  matrix: TMat2D,
  args: TMatTranslate | number[]
): void {
  matrix[4] = args[0];
  if (args.length === 2) {
    matrix[5] = args[1];
  }
}
