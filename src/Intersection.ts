import { Point } from './Point';

/* Adaptation of work of Kevin Lindsey (kevin@kevlindev.com) */

export type IntersectionType = 'Intersection' | 'Coincident' | 'Parallel';

/**
 * **Assuming `T`, `A`, `B` are points on the same line**,
 * check if `T` is contained in `[A, B]` by comparing the direction of the vectors from `T` to `A` and `B`
 * @param T
 * @param A
 * @param B
 * @returns true if `T` is contained
 */
const isContainedInInterval = (T: Point, A: Point, B: Point) => {
  const TA = new Point(T).subtract(A);
  const TB = new Point(T).subtract(B);
  return (
    Math.sign(TA.x) !== Math.sign(TB.x) || Math.sign(TA.y) !== Math.sign(TB.y)
  );
};

export class Intersection {
  declare points: Point[];

  declare status?: IntersectionType;

  constructor(status?: IntersectionType) {
    this.status = status;
    this.points = [];
  }

  /**
   * Used to verify if a point is alredy in the collection
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
  static intersectLineLine(
    a1: Point,
    a2: Point,
    b1: Point,
    b2: Point,
    aInfinite = true,
    bInfinite = true
  ): Intersection {
    const b2xb1x = b2.x - b1.x,
      a1yb1y = a1.y - b1.y,
      b2yb1y = b2.y - b1.y,
      a1xb1x = a1.x - b1.x,
      a2ya1y = a2.y - a1.y,
      a2xa1x = a2.x - a1.x,
      uaT = b2xb1x * a1yb1y - b2yb1y * a1xb1x,
      ubT = a2xa1x * a1yb1y - a2ya1y * a1xb1x,
      uB = b2yb1y * a2xa1x - b2xb1x * a2ya1y;
    if (uB !== 0) {
      const ua = uaT / uB,
        ub = ubT / uB;
      if (
        (aInfinite || (0 <= ua && ua <= 1)) &&
        (bInfinite || (0 <= ub && ub <= 1))
      ) {
        return new Intersection('Intersection').append(
          new Point(a1.x + ua * a2xa1x, a1.y + ua * a2ya1y)
        );
      } else {
        return new Intersection();
      }
    } else {
      if (uaT === 0 || ubT === 0) {
        const segmentsCoincide =
          aInfinite ||
          bInfinite ||
          isContainedInInterval(a1, b1, b2) ||
          isContainedInInterval(a2, b1, b2) ||
          isContainedInInterval(b1, a1, a2) ||
          isContainedInInterval(b2, a1, a2);
        return new Intersection(segmentsCoincide ? 'Coincident' : undefined);
      } else {
        return new Intersection('Parallel');
      }
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
    return Intersection.intersectLineLine(s1, s2, l1, l2, false, true);
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
    return Intersection.intersectLineLine(a1, a2, b1, b2, false, false);
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
   * @param {boolean} [infinite=true] check segment intersection by passing `false`
   * @return {Intersection}
   */
  static intersectLinePolygon(
    a1: Point,
    a2: Point,
    points: Point[],
    infinite = true
  ): Intersection {
    const result = new Intersection();
    const length = points.length;

    for (let i = 0, b1, b2, inter; i < length; i++) {
      b1 = points[i];
      b2 = points[(i + 1) % length];
      inter = Intersection.intersectLineLine(a1, a2, b1, b2, infinite, false);
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
    return Intersection.intersectLinePolygon(a1, a2, points, false);
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
    const coincidences = [];

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
