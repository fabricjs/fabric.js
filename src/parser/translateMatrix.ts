import { TMat2D } from '../typedefs';

/**
 * A translation matrix in the form of
 * [ 1 0 x ]
 * [ 0 1 y ]
 * [ 0 0 1 ]
 * See @link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#translate for more details
 */

/**
 * Generate a translation matrix
 * @param {number} x translation on X axis
 * @param {number} [y] translation on Y axis
 * @returns {TMat2D} matrix
 */
export const translateMatrix = (x: number, y = 0): TMat2D => [1, 0, 0, 1, x, y];
