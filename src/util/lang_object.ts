/**
 * Copies all enumerable properties of one js object to another
 * this does not and cannot compete with generic utils.
 * Does not clone or extend FabricObject subclasses.
 * This is mostly for internal use and has extra handling for fabricJS objects
 * it skips the canvas and group properties in deep cloning.
 * @param {Object} destination Where to copy to
 * @param {Object} source Where to copy from
 * @param {Boolean} [deep] Whether to extend nested objects
 * @return {Object}
 * @deprecated
 */
export const extend = (destination: Record<string, unknown>, source: Record<string, unknown>, deep: boolean) => {
  // the deep clone is for internal use, is not meant to avoid
  // javascript traps or cloning html element or self referenced objects.
  if (deep) {
    console.error('merge/extend deep is not supported');
  }
  return Object.assign(destination, source);
};

/**
 * Creates an empty object and copies all enumerable properties of another object to it
 * This method is mostly for internal use, and not intended for duplicating shapes in canvas.
 * @param {Object} object Object to clone
 * @param {Boolean} [deep] Whether to clone nested objects
 * @return {Object}
 * @deprecated
 */
export const clone = <T>(object: T, deep: boolean): T =>
  deep ? JSON.parse(JSON.stringify(object)) : { ...object };
