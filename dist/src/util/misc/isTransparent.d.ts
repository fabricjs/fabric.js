/**
 * Returns true if context has transparent pixel
 * at specified location (taking tolerance into account)
 * @param {CanvasRenderingContext2D} ctx context
 * @param {Number} x x coordinate in canvasElementCoordinate, not fabric space. integer
 * @param {Number} y y coordinate in canvasElementCoordinate, not fabric space. integer
 * @param {Number} tolerance Tolerance pixels around the point, not alpha tolerance, integer
 * @return {boolean} true if transparent
 */
export declare const isTransparent: (ctx: CanvasRenderingContext2D, x: number, y: number, tolerance: number) => boolean;
//# sourceMappingURL=isTransparent.d.ts.map