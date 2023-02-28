/**
 * @param {Number} p
 * @param {Number} q
 * @param {Number} t
 * @return {Number}
 */
export function hue2rgb(p: number, q: number, t: number): number {
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
}

/**
 * Convert a value ∈ [0, 255] to hex
 */
export function hexify(value: number) {
  const hexValue = value.toString(16).toUpperCase();
  return hexValue.length === 1 ? `0${hexValue}` : hexValue;
}
