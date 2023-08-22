/**
 * Removes value from an array.
 * Presence of value (and its position in an array) is determined via `Array.prototype.indexOf`
 * @param {Array} array
 * @param {*} values
 * @return {Array} original array
 */
export const removeFromArray = <T>(array: T[], ...values: T[]): T[] => {
  values.forEach((value) => {
    const idx = array.indexOf(value);
    if (idx !== -1) {
      array.splice(idx, 1);
    }
  });
  return array;
};
