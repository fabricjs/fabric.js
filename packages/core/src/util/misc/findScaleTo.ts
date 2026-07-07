import type { TSize } from '../../typedefs';

/**
 * Finds the scale for the object source to fit inside the object destination,
 * keeping aspect ratio intact.
 * respect the total allowed area for the cache.
 * @param {TSize} source natural unscaled size of the object
 * @param {TSize} destination natural unscaled size of the object
 * @return {Number} scale factor to apply to source to fit into destination
 */
export const findScaleToFit = (source: TSize, destination: TSize) =>
  Math.min(
    destination.width / source.width,
    destination.height / source.height,
  );

/**
 * Finds the scale for the object source to cover entirely the object destination,
 * keeping aspect ratio intact.
 * respect the total allowed area for the cache.
 * @param {TSize} source natural unscaled size of the object
 * @param {TSize} destination natural unscaled size of the object
 * @return {Number} scale factor to apply to source to cover destination
 */
export const findScaleToCover = (source: TSize, destination: TSize) =>
  Math.max(
    destination.width / source.width,
    destination.height / source.height,
  );
