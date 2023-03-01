export const mapValues = <T, K extends string, R>(
  collection: Record<K, T>,
  callbackfn: (value: T, key: K, collection: Record<K, T>) => R
) => {
  const out = {} as Record<K, R>;
  for (const key in collection) {
    out[key] = callbackfn(collection[key], key, collection);
  }
  return out;
};
