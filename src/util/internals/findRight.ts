export const findIndexRight = <T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean
) => {
  for (let index = array.length - 1; index >= 0; index--) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
};

export const findRight = <T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean
) => {
  const index = findIndexRight(array, predicate);
  return index > -1 ? array[index] : undefined;
};
