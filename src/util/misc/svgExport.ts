import type { TMat2D } from '../../typedefs';
import { toFixed } from './toFixed';
import { config } from '../../config';

/**
 * given an array of 6 number returns something like `"matrix(...numbers)"`
 * @param {TMat2D} transform an array with 6 numbers
 * @return {String} transform matrix for svg
 */
export const matrixToSVG = (transform: TMat2D) =>
  'matrix(' +
  transform
    .map((value) => toFixed(value, config.NUM_FRACTION_DIGITS))
    .join(' ') +
  ')';
