//@ts-nocheck
import { Point } from "./point.class";
import { fabric } from '../HEADER';

/* Adaptation of work of Kevin Lindsey (kevin@kevlindev.com) */

type IntersectionType = 'Intersection' | 'Coincident' | 'Parallel';

export class Intersection {

  points: Point[]

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
    let result,
      uaT = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x),
      ubT = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x),
      uB = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
    if (uB !== 0) {
      const ua = uaT / uB,
        ub = ubT / uB;
      if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
        result = new Intersection('Intersection');
        result.appendPoint(new Point(a1.x + ua * (a2.x - a1.x), a1.y + ua * (a2.y - a1.y)));
      }
      else {
        result = new Intersection();
      }
    }
    else {
      if (uaT === 0 || ubT === 0) {
        result = new Intersection('Coincident');
      }
      else {
        result = new Intersection('Parallel');
      }
    }
    return result;
  }

  /**
   * Checks if line intersects polygon
   * TODO: rename in intersectSegmentPolygon
   * fix detection of coincident
   * @static
   * @param {Point} a1
   * @param {Point} a2
   * @param {Array} points
   * @return {Intersection}
   */
  static intersectLinePolygon(a1, a2, points) {
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
        inter = Intersection.intersectLinePolygon(a1, a2, points2);

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
      inter1 = Intersection.intersectLinePolygon(min, topRight, points),
      inter2 = Intersection.intersectLinePolygon(topRight, max, points),
      inter3 = Intersection.intersectLinePolygon(max, bottomLeft, points),
      inter4 = Intersection.intersectLinePolygon(bottomLeft, min, points),
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