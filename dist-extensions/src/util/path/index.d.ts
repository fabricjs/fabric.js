import type { TMat2D, TRectBounds } from '../../typedefs';
import type { TComplexPathData, TParsedAbsoluteCubicCurveCommand, TPathSegmentInfo, TPointAngle, TSimplePathData, TParsedArcCommand } from './typedefs';
import { Point } from '../../Point';
/**
 * Calculate bounding box of a cubic Bezier curve
 * Taken from http://jsbin.com/ivomiq/56/edit (no credits available)
 * TODO: can we normalize this with the starting points set at 0 and then translated the bbox?
 * @param {number} begx starting point
 * @param {number} begy
 * @param {number} cp1x first control point
 * @param {number} cp1y
 * @param {number} cp2x second control point
 * @param {number} cp2y
 * @param {number} endx end of bezier
 * @param {number} endy
 * @return {TRectBounds} the rectangular bounds
 */
export declare function getBoundsOfCurve(begx: number, begy: number, cp1x: number, cp1y: number, cp2x: number, cp2y: number, endx: number, endy: number): TRectBounds;
/**
 * Converts arc to a bunch of cubic Bezier curves
 * @param {number} fx starting point x
 * @param {number} fy starting point y
 * @param {TParsedArcCommand} coords Arc command
 */
export declare const fromArcToBeziers: (fx: number, fy: number, [_, rx, ry, rot, large, sweep, tx, ty]: TParsedArcCommand) => TParsedAbsoluteCubicCurveCommand[];
/**
 * This function takes a parsed SVG path and makes it simpler for fabricJS logic.
 * Simplification consist of:
 * - All commands converted to absolute (lowercase to uppercase)
 * - S converted to C
 * - T converted to Q
 * - A converted to C
 * @param {TComplexPathData} path the array of commands of a parsed SVG path for `Path`
 * @return {TSimplePathData} the simplified array of commands of a parsed SVG path for `Path`
 * TODO: figure out how to remove the type assertions in a nice way
 */
export declare const makePathSimpler: (path: TComplexPathData) => TSimplePathData;
/**
 * Run over a parsed and simplified path and extract some information (length of each command and starting point)
 * @param {TSimplePathData} path parsed path commands
 * @return {TPathSegmentInfo[]} path commands information
 */
export declare const getPathSegmentsInfo: (path: TSimplePathData) => TPathSegmentInfo[];
/**
 * Get the point on the path that is distance along the path
 * @param path
 * @param distance
 * @param infos
 */
export declare const getPointOnPath: (path: TSimplePathData, distance: number, infos?: TPathSegmentInfo[]) => TPointAngle | undefined;
/**
 *
 * @param {string} pathString
 * @return {TComplexPathData} An array of SVG path commands
 * @example <caption>Usage</caption>
 * parsePath('M 3 4 Q 3 5 2 1 4 0 Q 9 12 2 1 4 0') === [
 *   ['M', 3, 4],
 *   ['Q', 3, 5, 2, 1, 4, 0],
 *   ['Q', 9, 12, 2, 1, 4, 0],
 * ];
 */
export declare const parsePath: (pathString: string) => TComplexPathData;
/**
 *
 * Converts points to a smooth SVG path
 * @param {XY[]} points Array of points
 * @param {number} [correction] Apply a correction to the path (usually we use `width / 1000`). If value is undefined 0 is used as the correction value.
 * @return {(string|number)[][]} An array of SVG path commands
 */
export declare const getSmoothPathFromPoints: (points: Point[], correction?: number) => TSimplePathData;
/**
 * Transform a path by transforming each segment.
 * it has to be a simplified path or it won't work.
 * WARNING: this depends from pathOffset for correct operation
 * @param {TSimplePathData} path fabricJS parsed and simplified path commands
 * @param {TMat2D} transform matrix that represent the transformation
 * @param {Point} [pathOffset] `Path.pathOffset`
 * @returns {TSimplePathData} the transformed path
 */
export declare const transformPath: (path: TSimplePathData, transform: TMat2D, pathOffset: Point) => TSimplePathData;
/**
 * Returns an array of path commands to create a regular polygon
 * @param {number} numVertexes
 * @param {number} radius
 * @returns {TSimplePathData} An array of SVG path commands
 */
export declare const getRegularPolygonPath: (numVertexes: number, radius: number) => TSimplePathData;
/**
 * Join path commands to go back to svg format
 * @param {TSimplePathData} pathData fabricJS parsed path commands
 * @param {number} fractionDigits number of fraction digits to "leave"
 * @return {String} joined path 'M 0 0 L 20 30'
 */
export declare const joinPath: (pathData: TSimplePathData, fractionDigits?: number) => string;
//# sourceMappingURL=index.d.ts.map