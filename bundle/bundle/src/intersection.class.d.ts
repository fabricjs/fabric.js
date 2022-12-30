import { Point } from './point.class';
export type IntersectionType = 'Intersection' | 'Coincident' | 'Parallel';
export declare class Intersection {
    points: Point[];
    status?: IntersectionType;
    constructor(status?: IntersectionType);
    /**
     *
     * @param {Point} point
     * @returns
     */
    contains(point: any): boolean;
    /**
     * Appends points of intersection
     * @param {...Point[]} points
     * @return {Intersection} thisArg
     * @chainable
     */
    private append;
    /**
     * Checks if a line intersects another
     * @static
     * @param {Point} a1
     * @param {Point} a2
     * @param {Point} b1
     * @param {Point} b2
     * @param {boolean} [aInfinite=true] check segment intersection by passing `false`
     * @param {boolean} [bInfinite=true] check segment intersection by passing `false`
     * @return {Intersection}
     */
    static intersectLineLine(a1: any, a2: any, b1: any, b2: any, aInfinite?: boolean, bInfinite?: boolean): Intersection;
    /**
     * Checks if a segment intersects a line
     * @see {@link intersectLineLine} for line intersection
     * @static
     * @param {Point} s1 boundary point of segment
     * @param {Point} s2 other boundary point of segment
     * @param {Point} l1 point on line
     * @param {Point} l2 other point on line
     * @return {Intersection}
     */
    static intersectSegmentLine(s1: any, s2: any, l1: any, l2: any): Intersection;
    /**
     * Checks if a segment intersects another
     * @see {@link intersectLineLine} for line intersection
     * @static
     * @param {Point} a1 boundary point of segment
     * @param {Point} a2 other boundary point of segment
     * @param {Point} b1 boundary point of segment
     * @param {Point} b2 other boundary point of segment
     * @return {Intersection}
     */
    static intersectSegmentSegment(a1: any, a2: any, b1: any, b2: any): Intersection;
    /**
     * Checks if line intersects polygon
     *
     * @todo account for stroke
     *
     * @static
     * @see {@link intersectSegmentPolygon} for segment intersection
     * @param {Point} a1 point on line
     * @param {Point} a2 other point on line
     * @param {Point[]} points polygon points
     * @param {boolean} [infinite=true] check segment intersection by passing `false`
     * @return {Intersection}
     */
    static intersectLinePolygon(a1: any, a2: any, points: any, infinite?: boolean): Intersection;
    /**
     * Checks if segment intersects polygon
     * @static
     * @see {@link intersectLinePolygon} for line intersection
     * @param {Point} a1 boundary point of segment
     * @param {Point} a2 other boundary point of segment
     * @param {Point[]} points polygon points
     * @return {Intersection}
     */
    static intersectSegmentPolygon(a1: any, a2: any, points: any): Intersection;
    /**
     * Checks if polygon intersects another polygon
     *
     * @todo account for stroke
     *
     * @static
     * @param {Point[]} points1
     * @param {Point[]} points2
     * @return {Intersection}
     */
    static intersectPolygonPolygon(points1: any, points2: any): Intersection;
    /**
     * Checks if polygon intersects rectangle
     * @static
     * @see {@link intersectPolygonPolygon} for polygon intersection
     * @param {Point[]} points polygon points
     * @param {Point} r1 top left point of rect
     * @param {Point} r2 bottom right point of rect
     * @return {Intersection}
     */
    static intersectPolygonRectangle(points: any, r1: any, r2: any): Intersection;
}
//# sourceMappingURL=intersection.class.d.ts.map