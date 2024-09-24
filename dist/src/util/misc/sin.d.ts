import type { TRadian } from '../../typedefs';
/**
 * Calculate the cos of an angle, avoiding returning floats for known results
 * This function is here just to avoid getting 0.999999999999999 when dealing
 * with numbers that are really 1 or 0.
 * @param {TRadian} angle the angle
 * @return {Number} the sin value for angle.
 */
export declare const sin: (angle: TRadian) => number;
//# sourceMappingURL=sin.d.ts.map