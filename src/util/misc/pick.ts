/**
 * Populates an object with properties of another object
 * @param {Object} source Source object
 * @param {string[]} properties Properties names to include
 * @returns object populated with the picked keys
 */
export const pick = <T extends Record<string, any>>(
  source: T,
  keys: (keyof T)[] = [],
) => {
  return keys.reduce((o, key) => {
    if (key in source) {
      o[key] = source[key];
    }
    return o;
  }, {} as Partial<T>);
};

export const pickBy = <T extends Record<string, any>>(
  source: T,
  predicate: <K extends keyof T>(value: T[K], key: K, collection: T) => boolean,
) => {
  return (Object.keys(source) as (keyof T)[]).reduce((o, key) => {
    if (predicate(source[key], key, source)) {
      o[key] = source[key];
    }
    return o;
  }, {} as Partial<T>);
};
