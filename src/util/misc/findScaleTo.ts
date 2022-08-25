interface IWithDimensions {
  width: number;
  height: number;
}

/**
 * Finds the scale for the object source to fit inside the object destination,
 * keeping aspect ratio intact.
 * respect the total allowed area for the cache.
 * @memberOf fabric.util
 * @param {Object | fabric.Object} source
 * @param {Number} source.height natural unscaled height of the object
 * @param {Number} source.width natural unscaled width of the object
 * @param {Object | fabric.Object} destination
 * @param {Number} destination.height natural unscaled height of the object
 * @param {Number} destination.width natural unscaled width of the object
 * @return {Number} scale factor to apply to source to fit into destination
 */
export const findScaleToFit = (source: IWithDimensions, destination: IWithDimensions) =>
  Math.min(destination.width / source.width, destination.height / source.height);

/**
 * Finds the scale for the object source to cover entirely the object destination,
 * keeping aspect ratio intact.
 * respect the total allowed area for the cache.
 * @memberOf fabric.util
 * @param {Object | fabric.Object} source
 * @param {Number} source.height natural unscaled height of the object
 * @param {Number} source.width natural unscaled width of the object
 * @param {Object | fabric.Object} destination
 * @param {Number} destination.height natural unscaled height of the object
 * @param {Number} destination.width natural unscaled width of the object
 * @return {Number} scale factor to apply to source to cover destination
 */
export const findScaleToCover = (source: IWithDimensions, destination: IWithDimensions) =>
  Math.max(destination.width / source.width, destination.height / source.height);
