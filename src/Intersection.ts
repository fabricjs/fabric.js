import { Point } from './Point';
import { createVector } from './util/misc/vectors';

/* Adaptation of work of Kevin Lindsey (kevin@kevlindev.com) */

export type IntersectionType = 'Intersection' | 'Coincident' | 'Parallel';

export type LineType = 'line' | 'ray' | 'segment';

export class Intersection {
  declare points: Point[];

  declare status?: IntersectionType;

  constructor(status?: IntersectionType) {
    this.status = status;
    this.points = [];
  }

  /**
   * Used to verify if a point is already in the collection
   * @param {Point} point
   * @returns {boolean}
   */
  private includes(point: Point): boolean {
    return this.points.some((p) => p.eq(point));
  }

  /**
   * Appends points of intersection
   * @param {...Point[]} points
   * @return {Intersection} thisArg
   * @chainable
   */
  private append(...points: Point[]): Intersection {
    this.points = this.points.concat(
      points.filter((point) => {
        return !this.includes(point);
      })
    );
    return this;
  }

  /**
   * check if point T is on the segment or line defined between A and B
   *
   * @param {Point} T the point we are checking for
   * @param {Point} A one extremity of the segment
   * @param {Point} B the other extremity of the segment
   * @param [infinite] if true checks if `T` is on the line defined by `A` and `B`
   * @returns true if `T` is contained
   */
  static isPointContained(T: Point, A: Point, B: Point, type: LineType) {
    if (A.eq(B)) {
      // Edge case: the segment is a point, we check for coincidence,
      // infinite param has no meaning because there are infinite lines to consider
      return T.eq(A);
    } else if (A.x === B.x) {
      // Edge case: horizontal line.
      // we first check if T.x has the same value, and then if T.y is contained between A.y and B.y
      return (
        T.x === A.x &&
        (type === 'line' ||
          (type === 'ray' && (B.y > A.y ? T.y >= A.y : T.y <= A.y)) ||
          (type === 'segment' &&
            T.y >= Math.min(A.y, B.y) &&
            T.y <= Math.max(A.y, B.y)))
      );
    } else if (A.y === B.y) {
      // Edge case: vertical line.
      // we first check if T.y has the same value, and then if T.x is contained between A.x and B.x
      return (
        T.y === A.y &&
        (type === 'line' ||
          (type === 'ray' && (B.x > A.x ? T.x >= A.x : T.x <= A.x)) ||
          (type === 'segment' &&
            T.x >= Math.min(A.x, B.x) &&
            T.x <= Math.max(A.x, B.x)))
      );
    } else {
      // Generic case: sloped line.
      // we check that AT has the same slope as AB
      // for the segment case we need both the vectors to have the same direction and for AT to be lte AB in size
      // for the infinite case we check the absolute value of the slope, since direction is meaningless
      const AB = createVector(A, B);
      const AT = createVector(A, T);
      const s = AT.divide(AB);
      return type === 'line'
        ? Math.abs(s.x) === Math.abs(s.y)
        : s.x === s.y && s.x >= 0 && (type === 'ray' || s.x <= 1);
    }
  }

  /**
   * Use the ray casting algorithm to determine if {@link point} is in the polygon defined by {@link points}
   * @see https://en.wikipedia.org/wiki/Point_in_polygon
   * @param point
   * @param points polygon points
   * @returns
   */
  static isPointInPolygon(point: Point, points: Point[]) {
    let hits = 0;
    const other = point.add(new Point(1, 0));
    for (let index = 0; index < points.length; index++) {
      const inter = this.intersectLineLine(
        // polygon side
        points[index],
        points[(index + 1) % points.length],
        // ray
        point,
        other,
        'segment',
        'ray'
      );
      if (inter.includes(point)) {
        // point is on the polygon side so we return
        // the ray casting algorithm is used to determine if a point is inside a polygon
        // but not if it is on the one of the sides
        // in this case the point will be considered as a hit, making the number of hits even
        // the same as casting the ray from outside through this point
        return true;
      }
      hits += Number(inter.status === 'Intersection');
    }
    return hits % 2 === 1;
  }

  /**
   * Checks if a line intersects another
   * @see {@link https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection line intersection}
   * @see {@link https://en.wikipedia.org/wiki/Cramer%27s_rule Cramer's rule}
   * @static
   * @param {Point} a1
   * @param {Point} a2
   * @param {Point} b1
   * @param {Point} b2
   * @param {LineType} [aType = 'line']
   * @param {LineType} [bType = 'line']
   * @return {Intersection}
   */
  static intersectLineLine(
    a1: Point,
    a2: Point,
    b1: Point,
    b2: Point,
    aType: LineType = 'line',
    bType: LineType = 'line'
  ): Intersection {
    const a2xa1x = a2.x - a1.x,
      a2ya1y = a2.y - a1.y,
      b2xb1x = b2.x - b1.x,
      b2yb1y = b2.y - b1.y,
      a1xb1x = a1.x - b1.x,
      a1yb1y = a1.y - b1.y,
      uaT = b2xb1x * a1yb1y - b2yb1y * a1xb1x,
      ubT = a2xa1x * a1yb1y - a2ya1y * a1xb1x,
      uB = b2yb1y * a2xa1x - b2xb1x * a2ya1y;
    if (uB !== 0) {
      const ua = uaT / uB,
        ub = ubT / uB;
      if (
        (aType === 'line' || (0 <= ua && (aType === 'ray' || ua <= 1))) &&
        (bType === 'line' || (0 <= ub && (bType === 'ray' || ub <= 1)))
      ) {
        return new Intersection('Intersection').append(
          new Point(a1.x + ua * a2xa1x, a1.y + ua * a2ya1y)
        );
      } else {
        return new Intersection();
      }
    } else if (uaT === 0 || ubT === 0) {
      const segmentsCoincide =
        aType === 'line' ||
        bType === 'line' ||
        Intersection.isPointContained(a1, b1, b2, bType) ||
        Intersection.isPointContained(a2, b1, b2, bType) ||
        Intersection.isPointContained(b1, a1, a2, aType) ||
        Intersection.isPointContained(b2, a1, a2, aType);
      return new Intersection(segmentsCoincide ? 'Coincident' : undefined);
    } else {
      return new Intersection('Parallel');
    }
  }

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
  static intersectSegmentLine(
    s1: Point,
    s2: Point,
    l1: Point,
    l2: Point
  ): Intersection {
    return Intersection.intersectLineLine(s1, s2, l1, l2, 'segment', 'line');
  }

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
  static intersectSegmentSegment(
    a1: Point,
    a2: Point,
    b1: Point,
    b2: Point
  ): Intersection {
    return Intersection.intersectLineLine(a1, a2, b1, b2, 'segment', 'segment');
  }

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
   * @param {boolean} [type = 'line']
   * @return {Intersection}
   */
  static intersectLinePolygon(
    a1: Point,
    a2: Point,
    points: Point[],
    type: LineType = 'line'
  ): Intersection {
    const result = new Intersection();
    const length = points.length;

    for (let i = 0, b1, b2, inter; i < length; i++) {
      b1 = points[i];
      b2 = points[(i + 1) % length];
      inter = Intersection.intersectLineLine(a1, a2, b1, b2, type, 'segment');
      if (inter.status === 'Coincident') {
        return inter;
      }
      result.append(...inter.points);
    }

    if (result.points.length > 0) {
      result.status = 'Intersection';
    }

    return result;
  }

  /**
   * Checks if segment intersects polygon
   * @static
   * @see {@link intersectLinePolygon} for line intersection
   * @param {Point} a1 boundary point of segment
   * @param {Point} a2 other boundary point of segment
   * @param {Point[]} points polygon points
   * @return {Intersection}
   */
  static intersectSegmentPolygon(
    a1: Point,
    a2: Point,
    points: Point[]
  ): Intersection {
    return Intersection.intersectLinePolygon(a1, a2, points, 'segment');
  }

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
  static intersectPolygonPolygon(
    points1: Point[],
    points2: Point[]
  ): Intersection {
    const result = new Intersection(),
      length = points1.length;
    const coincidences: Intersection[] = [];

    for (let i = 0; i < length; i++) {
      const a1 = points1[i],
        a2 = points1[(i + 1) % length],
        inter = Intersection.intersectSegmentPolygon(a1, a2, points2);
      if (inter.status === 'Coincident') {
        coincidences.push(inter);
        result.append(a1, a2);
      } else {
        result.append(...inter.points);
      }
    }

    if (coincidences.length > 0 && coincidences.length === points1.length) {
      return new Intersection('Coincident');
    } else if (result.points.length > 0) {
      result.status = 'Intersection';
    }

    return result;
  }

  /**
   * Checks if polygon intersects rectangle
   * @static
   * @see {@link intersectPolygonPolygon} for polygon intersection
   * @param {Point[]} points polygon points
   * @param {Point} r1 top left point of rect
   * @param {Point} r2 bottom right point of rect
   * @return {Intersection}
   */
  static intersectPolygonRectangle(
    points: Point[],
    r1: Point,
    r2: Point
  ): Intersection {
    const min = r1.min(r2),
      max = r1.max(r2),
      topRight = new Point(max.x, min.y),
      bottomLeft = new Point(min.x, max.y);

    return Intersection.intersectPolygonPolygon(points, [
      min,
      topRight,
      max,
      bottomLeft,
    ]);
  }
}
