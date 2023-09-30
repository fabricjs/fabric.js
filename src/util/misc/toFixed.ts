/**
 * A wrapper around Number#toFixed, which contrary to native method returns number, not string.
 * @param {number|string} number number to operate on
 * @param {number} fractionDigits number of fraction digits to "leave"
 * @return {number}
 */
export const toFixed = (number: number | string, fractionDigits: number) =>
  parseFloat(Number(number).toFixed(fractionDigits));
