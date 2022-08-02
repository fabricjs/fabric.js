//@ts-nocheck
export function pick(object, keys) {
  return keys.reduce((dest, key) => {
    key && key in object && (dest[key] = object[key]);
    return dest;
  }, {});
}
