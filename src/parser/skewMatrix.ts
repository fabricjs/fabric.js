import { degreesToRadians } from '../util/misc/radiansDegreesConversion';
import { TMat2D } from '../typedefs';

/**
 * A matrix in the form
 * [0 x 0]
 * [y 0 0]
 * [0 0 1]
 * For more info, see
 * @link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#skewx
 */
type TMatSkew = [xy: number];

export function skewMatrix(
  matrix: TMat2D,
  args: TMatSkew | number[],
  pos: 2 | 1
) {
  matrix[pos] = Math.tan(degreesToRadians(args[0]));
}
