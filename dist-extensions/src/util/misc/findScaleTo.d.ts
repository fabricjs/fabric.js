import type { TSize } from '../../typedefs';
/**
 * Finds the scale for the object source to fit inside the object destination,
 * keeping aspect ratio intact.
 * respect the total allowed area for the cache.
 * @param {TSize} source natural unscaled size of the object
 * @param {TSize} destination natural unscaled size of the object
 * @return {Number} scale factor to apply to source to fit into destination
 */
export declare const findScaleToFit: (source: TSize, destination: TSize) => number;
/**
 * Finds the scale for the object source to cover entirely the object destination,
 * keeping aspect ratio intact.
 * respect the total allowed area for the cache.
 * @param {TSize} source natural unscaled size of the object
 * @param {TSize} destination natural unscaled size of the object
 * @return {Number} scale factor to apply to source to cover destination
 */
export declare const findScaleToCover: (source: TSize, destination: TSize) => number;
//# sourceMappingURL=findScaleTo.d.ts.map