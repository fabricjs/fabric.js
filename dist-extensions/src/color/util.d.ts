import type { TRGBAColorSource } from './typedefs';
/**
 * @param {Number} p
 * @param {Number} q
 * @param {Number} t
 * @return {Number}
 */
export declare const hue2rgb: (p: number, q: number, t: number) => number;
/**
 * Adapted from {@link https://gist.github.com/mjackson/5311256 https://gist.github.com/mjackson}
 * @param {Number} r Red color value
 * @param {Number} g Green color value
 * @param {Number} b Blue color value
 * @param {Number} a Alpha color value pass through
 * @return {TRGBColorSource} Hsl color
 */
export declare const rgb2Hsl: (r: number, g: number, b: number, a: number) => TRGBAColorSource;
export declare const fromAlphaToFloat: (value?: string) => number;
/**
 * Convert a value in the inclusive range [0, 255] to hex
 */
export declare const hexify: (value: number) => string;
/**
 * Calculate the grey average value for rgb and pass through alpha
 */
export declare const greyAverage: ([r, g, b, a,]: TRGBAColorSource) => TRGBAColorSource;
//# sourceMappingURL=util.d.ts.map