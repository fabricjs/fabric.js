import { TMat2D } from '../typedefs';

/**
 * A translation matrix in the form of
 * [ 1 0 x ]
 * [ 0 1 y ]
 * [ 0 0 1 ]
 * See @link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#translate for more details
 */

/**
 * Force the translation to be this
 * @param matrix
 * @param args
 */
export const translateMatrix = (x: number, y = 0): TMat2D => [1, 0, 0, 1, x, y];
