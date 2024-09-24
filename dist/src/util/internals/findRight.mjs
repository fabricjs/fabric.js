const findIndexRight = (array, predicate) => {
  for (let index = array.length - 1; index >= 0; index--) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
};

export { findIndexRight };
//# sourceMappingURL=findRight.mjs.map
