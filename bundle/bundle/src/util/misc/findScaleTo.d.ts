interface IWithDimensions {
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
export declare const findScaleToFit: (source: IWithDimensions, destination: IWithDimensions) => number;
/**
 * Finds the scale for the object source to cover entirely the object destination,
 * keeping aspect ratio intact.
 * respect the total allowed area for the cache.
 * @param {IWithDimensions} source
 * @param {IWithDimensions} destination
 * @return {Number} scale factor to apply to source to cover destination
 */
export declare const findScaleToCover: (source: IWithDimensions, destination: IWithDimensions) => number;
export {};
//# sourceMappingURL=findScaleTo.d.ts.map