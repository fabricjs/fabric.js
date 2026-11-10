/**
 * Populates an object with properties of another object
 * @param {Object} source Source object
 * @param keys Property names to include
 * @returns object populated with the picked keys
 */
export const pick = <T extends object, K extends keyof T = keyof T>(
  source: T,
  keys: readonly K[] = [],
) => {
  return keys.reduce(
    (o, key) => {
      if (key in source) {
        o[key] = source[key];
      }
      return o;
    },
    {} as Partial<Pick<T, K>>,
  );
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
