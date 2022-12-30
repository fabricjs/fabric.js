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
 */
export declare const extend: (destination: any, source: any, deep: any) => any;
/**
 * Creates an empty object and copies all enumerable properties of another object to it
 * This method is mostly for internal use, and not intended for duplicating shapes in canvas.
 * @param {Object} object Object to clone
 * @param {Boolean} [deep] Whether to clone nested objects
 * @return {Object}
 */
export declare const clone: <T>(object: T, deep: boolean) => T;
//# sourceMappingURL=lang_object.d.ts.map