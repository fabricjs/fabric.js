//@ts-nocheck

/**
 * Copies all enumerable properties of one js object to another
 * this does not and cannot compete with generic utils.
 * Does not clone or extend fabric.Object subclasses.
 * This is mostly for internal use and has extra handling for fabricJS objects
 * it skips the canvas and group properties in deep cloning.
 * @memberOf fabric.util.object
 * @param {Object} destination Where to copy to
 * @param {Object} source Where to copy from
 * @param {Boolean} [deep] Whether to extend nested objects
 * @return {Object}
 */

export const extend = (destination, source, deep) => {
  // the deep clone is for internal use, is not meant to avoid
  // javascript traps or cloning html element or self referenced objects.
  if (deep) {
    if (!fabric.isLikelyNode && source instanceof Element) {
      // avoid cloning deep images, canvases,
      destination = source;
    }
    else if (Array.isArray(source)) {
      destination = [];
      for (let i = 0, len = source.length; i < len; i++) {
        destination[i] = extend({ }, source[i], deep);
      }
    }
    else if (source && typeof source === 'object') {
      for (const property in source) {
        if (property === 'canvas' || property === 'group') {
          // we do not want to clone this props at all.
          // we want to keep the keys in the copy
          destination[property] = null;
        }
        else if (Object.prototype.hasOwnProperty.call(source, property)) {
          destination[property] = extend({ }, source[property], deep);
        }
      }
    }
    else {
      // this sounds odd for an extend but is ok for recursive use
      destination = source;
    }
  }
  else {
    for (const property in source) {
      destination[property] = source[property];
    }
  }
  return destination;
}

/**
 * Creates an empty object and copies all enumerable properties of another object to it
 * This method is mostly for internal use, and not intended for duplicating shapes in canvas.
 * @memberOf fabric.util.object
 * @param {Object} object Object to clone
 * @param {Boolean} [deep] Whether to clone nested objects
 * @return {Object}
 */

//TODO: this function return an empty object if you try to clone null
export const clone = (object: any, deep: boolean) => deep ? extend({ }, object, deep) : { ...object };
