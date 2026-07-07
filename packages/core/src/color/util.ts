import type { TRGBAColorSource } from './typedefs';

/**
 * @param {Number} p
 * @param {Number} q
 * @param {Number} t
 * @return {Number}
 */
export const hue2rgb = (p: number, q: number, t: number): number => {
  if (t < 0) {
    t += 1;
  }
  if (t > 1) {
    t -= 1;
  }
  if (t < 1 / 6) {
    return p + (q - p) * 6 * t;
  }
  if (t < 1 / 2) {
    return q;
  }
  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }
  return p;
};

/**
 * Adapted from {@link https://gist.github.com/mjackson/5311256 https://gist.github.com/mjackson}
 * @param {Number} r Red color value
 * @param {Number} g Green color value
 * @param {Number} b Blue color value
 * @param {Number} a Alpha color value pass through
 * @return {TRGBColorSource} Hsl color
 */
export const rgb2Hsl = (
  r: number,
  g: number,
  b: number,
  a: number,
): TRGBAColorSource => {
  r /= 255;
  g /= 255;
  b /= 255;
  const maxValue = Math.max(r, g, b),
    minValue = Math.min(r, g, b);

  let h!: number, s: number;
  const l = (maxValue + minValue) / 2;

  if (maxValue === minValue) {
    h = s = 0; // achromatic
  } else {
    const d = maxValue - minValue;
    s = l > 0.5 ? d / (2 - maxValue - minValue) : d / (maxValue + minValue);
    switch (maxValue) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100), a];
};

export const fromAlphaToFloat = (value = '1') =>
  parseFloat(value) / (value.endsWith('%') ? 100 : 1);

/**
 * Convert a value in the inclusive range [0, 255] to hex
 */
export const hexify = (value: number) =>
  Math.min(Math.round(value), 255).toString(16).toUpperCase().padStart(2, '0');

/**
 * Calculate the grey average value for rgb and pass through alpha
 */
export const greyAverage = ([
  r,
  g,
  b,
  a = 1,
]: TRGBAColorSource): TRGBAColorSource => {
  const avg = Math.round(r * 0.3 + g * 0.59 + b * 0.11);
  return [avg, avg, avg, a];
};
