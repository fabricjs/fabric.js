/**
 * Populates an object with properties of another object
 * @param {Object} source Source object
 * @param {string[]} properties Properties names to include
 * @returns object populated with the picked keys
 */
const pick = function (source) {
  let keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return keys.reduce((o, key) => {
    if (key in source) {
      o[key] = source[key];
    }
    return o;
  }, {});
};
const pickBy = (source, predicate) => {
  return Object.keys(source).reduce((o, key) => {
    if (predicate(source[key], key, source)) {
      o[key] = source[key];
    }
    return o;
  }, {});
};

export { pick, pickBy };
//# sourceMappingURL=pick.mjs.map
