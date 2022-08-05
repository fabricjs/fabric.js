//@ts-nocheck
import { Point } from "./point.class";
import { fabric } from '../HEADER';

/* Adaptation of work of Kevin Lindsey (kevin@kevlindev.com) */

type IntersectionType = 'Intersection' | 'Coincident' | 'Parallel';

/**
 * **Assuming `T`, `A`, `B` are points on the same line**,
 * check if `T` is contained in `[A, B]` by comparing the direction of the vectors from `T` to `A` and `B`
 * @param T 
 * @param A 
 * @param B 
 * @returns 
 */
const isContainedInInterval = (T: Point, A: Point, B: Point) => {
  const TA = new Point(T).subtract(A);
  const TB = new Point(T).subtract(B);
  return Math.sign(TA.x) !== Math.sign(TB.x) || Math.sign(TA.y) !== Math.sign(TB.y);
}

export class Intersection {

  points: Point[]

  status?: IntersectionType

  constructor(status?: IntersectionType) {
    this.status = status;
    this.points = [];
  }

  /**
   * Appends a point to intersection
   * @param {Point} point
   * @return {Intersection} thisArg
   * @chainable
   */
  appendPoint(point) {
    this.points.push(point);
    return this;
  }

  /**
   * Appends points to intersection
   * @param {Array} points
   * @return {Intersection} thisArg
   * @chainable
   */
  appendPoints(points) {
    this.points = this.points.concat(points);
    return this;
  }

  /**
   * Checks if a segment intersects another\
   * As opposed to an infinite line, a segment is limited to the points that define it
   * meaning that this method checks intersection **ONLY** between the given points
   * @static
   * @param {Point} a1
   * @param {Point} a2
   * @param {Point} b1
   * @param {Point} b2
   * @return {Intersection}
   */
  static intersectSegmentSegment(a1, a2, b1, b2) { 
    return Intersection.intersectLineLine(a1, a2, b1, b2, false);
  }

  /**
   * Checks if a line intersects another
   * @static
   * @param {Point} a1
   * @param {Point} a2
   * @param {Point} b1
   * @param {Point} b2
   * @param {boolean} [infinite=true] check segment intersection by passing `false`
   * @return {Intersection}
   */
  static intersectLineLine(a1, a2, b1, b2, infinite = true) {
    let result;
    const uaT = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x),
      ubT = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x),
      uB = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
    if (uB !== 0) {
      const ua = uaT / uB,
        ub = ubT / uB;
      if (infinite || (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1)) {
        result = new Intersection('Intersection');
        result.appendPoint(new Point(a1.x + ua * (a2.x - a1.x), a1.y + ua * (a2.y - a1.y)));
      }
      else {
        result = new Intersection();
      }
    }
    else {
      if (uaT === 0 || ubT === 0) {
        const segmentsCoincide = infinite || isContainedInInterval(a1, b1, b2) || isContainedInInterval(a2, b1, b2)
          || isContainedInInterval(b1, a1, a2) || isContainedInInterval(b2, a1, a2);
        result = new Intersection(segmentsCoincide ? 'Coincident' : undefined);
      }
      else {
        result = new Intersection('Parallel');
      }
    }
    return result;
  }

  /**
   * Checks if line intersects polygon
   * fix detection of coincident
   * @static
   * @param {Point} a1
   * @param {Point} a2
   * @param {Array} points
   * @return {Intersection}
   */
  static intersectSegmentPolygon(a1, a2, points) {
    const result = new Intersection(),
      length = points.length;
    let b1, b2, inter;

    for (let i = 0; i < length; i++) {
      b1 = points[i];
      b2 = points[(i + 1) % length];
      inter = Intersection.intersectSegmentSegment(a1, a2, b1, b2);

      result.appendPoints(inter.points);
    }
    if (result.points.length > 0) {
      result.status = 'Intersection';
    }
    return result;
  }

  /**
   * Checks if polygon intersects another polygon
   * @static
   * @param {Array} points1
   * @param {Array} points2
   * @return {Intersection}
   */
  static intersectPolygonPolygon(points1, points2) {
    const result = new Intersection(),
      length = points1.length;

    for (let i = 0; i < length; i++) {
      const a1 = points1[i],
        a2 = points1[(i + 1) % length],
        inter = Intersection.intersectSegmentPolygon(a1, a2, points2);

      result.appendPoints(inter.points);
    }
    if (result.points.length > 0) {
      result.status = 'Intersection';
    }
    return result;
  }

  /**
   * Checks if polygon intersects rectangle
   * @static
   * @param {Array} points
   * @param {Point} r1
   * @param {Point} r2
   * @return {Intersection}
   */
  static intersectPolygonRectangle(points, r1, r2) {
    const min = r1.min(r2),
      max = r1.max(r2),
      topRight = new Point(max.x, min.y),
      bottomLeft = new Point(min.x, max.y),
      inter1 = Intersection.intersectSegmentPolygon(min, topRight, points),
      inter2 = Intersection.intersectSegmentPolygon(topRight, max, points),
      inter3 = Intersection.intersectSegmentPolygon(max, bottomLeft, points),
      inter4 = Intersection.intersectSegmentPolygon(bottomLeft, min, points),
      result = new Intersection();

    result.appendPoints(inter1.points);
    result.appendPoints(inter2.points);
    result.appendPoints(inter3.points);
    result.appendPoints(inter4.points);

    if (result.points.length > 0) {
      result.status = 'Intersection';
    }
    return result;
  }

}

fabric.Intersection = Intersection;