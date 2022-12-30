import { Point } from '../point.class';
import type { PathData, TMat2D } from '../typedefs';
type PathSegmentInfoCommon = {
    x: number;
    y: number;
    command: string;
    length: number;
};
type CurveInfo = PathSegmentInfoCommon & {
    iterator: (pct: number) => Point;
    angleFinder: (pct: number) => number;
    length: number;
};
export type PathSegmentInfo = {
    M: PathSegmentInfoCommon;
    L: PathSegmentInfoCommon;
    C: CurveInfo;
    Q: CurveInfo;
    Z: PathSegmentInfoCommon & {
        destX: number;
        destY: number;
    };
};
export type TPathSegmentsInfo = PathSegmentInfo[keyof PathSegmentInfo];
/**
 * Calculate bounding box of a beziercurve
 * @param {Number} x0 starting point
 * @param {Number} y0
 * @param {Number} x1 first control point
 * @param {Number} y1
 * @param {Number} x2 secondo control point
 * @param {Number} y2
 * @param {Number} x3 end of bezier
 * @param {Number} y3
 */
export declare function getBoundsOfCurve(x0: any, y0: any, x1: any, y1: any, x2: any, y2: any, x3: any, y3: any): any;
/**
 * Converts arc to a bunch of bezier curves
 * @param {Number} fx starting point x
 * @param {Number} fy starting point y
 * @param {Array} coords Arc command
 */
export declare const fromArcToBeziers: (fx: any, fy: any, [_, rx, ry, rot, large, sweep, tx, ty]?: [any?, any?, any?, any?, any?, any?, any?, any?]) => any[];
/**
 * This function take a parsed SVG path and make it simpler for fabricJS logic.
 * simplification consist of: only UPPERCASE absolute commands ( relative converted to absolute )
 * S converted in C, T converted in Q, A converted in C.
 * @param {PathData} path the array of commands of a parsed svg path for `Path`
 * @return {PathData} the simplified array of commands of a parsed svg path for `Path`
 */
export declare const makePathSimpler: (path: PathData) => PathData;
/**
 * Run over a parsed and simplified path and extract some information (length of each command and starting point)
 * @param {PathData} path parsed path commands
 * @return {Array} path commands information
 */
export declare const getPathSegmentsInfo: (path: PathData) => TPathSegmentsInfo[];
export declare const getPointOnPath: (path: PathData, distance: number, infos?: ReturnType<typeof getPathSegmentsInfo>) => Point | {
    x: number;
    y: number;
    angle: number;
} | undefined;
/**
 *
 * @param {string} pathString
 * @return {(string|number)[][]} An array of SVG path commands
 * @example <caption>Usage</caption>
 * parsePath('M 3 4 Q 3 5 2 1 4 0 Q 9 12 2 1 4 0') === [
 *   ['M', 3, 4],
 *   ['Q', 3, 5, 2, 1, 4, 0],
 *   ['Q', 9, 12, 2, 1, 4, 0],
 * ];
 *
 */
export declare const parsePath: (pathString: any) => any[];
/**
 *
 * Converts points to a smooth SVG path
 * @param {{ x: number,y: number }[]} points Array of points
 * @param {number} [correction] Apply a correction to the path (usually we use `width / 1000`). If value is undefined 0 is used as the correction value.
 * @return {(string|number)[][]} An array of SVG path commands
 */
export declare const getSmoothPathFromPoints: (points: any, correction?: number) => (string | number)[][];
/**
 * Transform a path by transforming each segment.
 * it has to be a simplified path or it won't work.
 * WARNING: this depends from pathOffset for correct operation
 * @param {PathData} path fabricJS parsed and simplified path commands
 * @param {TMat2D} transform matrix that represent the transformation
 * @param {Point} [pathOffset] `Path.pathOffset`
 * @returns {Array} the transformed path
 */
export declare const transformPath: (path: PathData, transform: TMat2D, pathOffset: Point) => (string | number)[][];
/**
 * Returns an array of path commands to create a regular polygon
 * @param {number} radius
 * @param {number} numVertexes
 * @returns {(string|number)[][]} An array of SVG path commands
 */
export declare const getRegularPolygonPath: (numVertexes: any, radius: any) => any[];
/**
 * Join path commands to go back to svg format
 * @param {Array} pathData fabricJS parsed path commands
 * @return {String} joined path 'M 0 0 L 20 30'
 */
export declare const joinPath: (pathData: any) => any;
export {};
//# sourceMappingURL=path.d.ts.map