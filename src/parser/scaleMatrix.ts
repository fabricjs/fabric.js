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

/**
 * Generate a scale matrix around the point 0,0
 * @param {number} x scale on X axis
 * @param {number} [y] scale on Y axis
 * @returns {TMat2D} matrix
 */
export const scaleMatrix = (x: number, y: number = x): TMat2D => [
  x,
  0,
  0,
  y,
  0,
  0,
];
