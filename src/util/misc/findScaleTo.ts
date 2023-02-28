export interface IWithDimensions {
  /**
   * natural unscaled width of the object
   */
  width: number;
  /**
   * natural unscaled height of the object
   */
  height: number;
}

/**
 * Finds the scale for the object source to fit inside the object destination,
 * keeping aspect ratio intact.
 * respect the total allowed area for the cache.
 * @param {IWithDimensions} source
 * @param {IWithDimensions} destination
 * @return {Number} scale factor to apply to source to fit into destination
 */
export const findScaleToFit = (
  source: IWithDimensions,
  destination: IWithDimensions
) =>
  Math.min(
    destination.width / source.width,
    destination.height / source.height
  );

/**
 * Finds the scale for the object source to cover entirely the object destination,
 * keeping aspect ratio intact.
 * respect the total allowed area for the cache.
 * @param {IWithDimensions} source
 * @param {IWithDimensions} destination
 * @return {Number} scale factor to apply to source to cover destination
 */
export const findScaleToCover = (
  source: IWithDimensions,
  destination: IWithDimensions
) =>
  Math.max(
    destination.width / source.width,
    destination.height / source.height
  );
