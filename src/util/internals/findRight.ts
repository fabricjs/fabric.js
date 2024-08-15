export const findIndexRight = <T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean,
) => {
  for (let index = array.length - 1; index >= 0; index--) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
};
