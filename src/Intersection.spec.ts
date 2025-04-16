import { Intersection } from './Intersection';
import type { IntersectionType } from './Intersection';
import { Point } from './Point';

import { describe, expect, test, it } from 'vitest';

const polygonPoints = [
  new Point(4, 1),
  new Point(6, 2),
  new Point(4, 5),
  new Point(6, 6),
  new Point(10, 3),
  new Point(11, 4),
  new Point(7, 9),
  new Point(1, 5),
];

describe('Intersection', () => {
  describe('isPointInPolygon normal cases', () => {
    describe('testing non coincident points', () => {
      /**
       * To visualize this test for easy understanding paste this svg in an online editor
       <svg width="200" height="200" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
       <polygon points="4,1 6,2 4,5 6,6 10,3 11,4 7,9 1,5" />
       <!-- failing red, passing green points -->
       <circle fill="red" r="0.1" cx="0.5" cy="0.5" />
       <circle fill="red" r="0.1" cx="4.5" cy="0.5" />
       <circle fill="red" r="0.1" cx="9.5" cy="0.5" />
       <circle fill="red" r="0.1" cx="0.5" cy="2.5" />
       <circle fill="green" r="0.1" cx="4.5" cy="2.5" />
       <circle fill="red" r="0.1" cx="9.5" cy="2.5" />
       <circle fill="red" r="0.1" cx="0.5" cy="5.5" />
       <circle fill="green" r="0.1" cx="4.5" cy="5.5" />
       <circle fill="green" r="0.1" cx="8.5" cy="5.5" />
       <circle fill="green" r="0.1" cx="9.5" cy="5.5" />
       <circle fill="red" r="0.1" cx="10.5" cy="5.5" />
       <circle fill="red" r="0.1" cx="0.5" cy="8.5" />
       <circle fill="red" r="0.1" cx="4.5" cy="8.5" />
       <circle fill="green" r="0.1" cx="6.5" cy="8.5" />
       <circle fill="red" r="0.1" cx="9.5" cy="8.5" />
       </svg>
       * sample: https://editsvgcode.com/
       */
      test.each([
        [new Point(0.5, 0.5), false],
        [new Point(4.5, 0.5), false],
        [new Point(9.5, 0.5), false],
        [new Point(0.5, 2.5), false],
        [new Point(4.5, 2.5), true],
        [new Point(9.5, 2.5), false],
        [new Point(0.5, 5.5), false],
        [new Point(4.5, 5.5), true],
        [new Point(8.5, 5.5), true],
        [new Point(9.5, 5.5), true],
        [new Point(10.5, 5.5), false],
        [new Point(0.5, 8.5), false],
        [new Point(4.5, 8.5), false],
        [new Point(6.5, 8.5), true],
        [new Point(9.5, 8.5), false],
      ])('%p is in polygon %p, case index %#', (point, result) => {
        expect(Intersection.isPointInPolygon(point, polygonPoints)).toBe(
          result,
        );
      });
    });
    describe('testing coincident points', () => {
      test.each([
        [new Point(4, 1), true],
        [new Point(6, 2), true],
      ])('%p is in polygon %p, case index %#', (point, result) => {
        expect(Intersection.isPointInPolygon(point, polygonPoints)).toBe(
          result,
        );
      });
    });
  });

  it('constructor & properties', () => {
    expect(typeof Intersection).toBe('function');

    const intersection = new Intersection();

    expect(intersection).toBeTruthy();
    expect(intersection).toBeInstanceOf(Intersection);
    expect(intersection.constructor).toBe(Intersection);
    expect(typeof intersection.constructor).toBe('function');
    expect(intersection.points).toEqual([]);
    expect('status' in intersection).toBeTruthy();
    expect(intersection.status).toBeUndefined();

    const status = 'status';
    const intersectionWithStatus = new Intersection(status as IntersectionType);
    expect(intersectionWithStatus.status).toBe(status);
  });

  it('append', () => {
    const point = new Point(1, 1);
    const intersection = new Intersection();
    // @ts-expect-error -- private property
    expect(typeof intersection.append).toBe('function');
    // @ts-expect-error -- private property
    const returned = intersection.append(point, point);
    expect(returned).toBeInstanceOf(Intersection);
    expect(returned).toBe(intersection);
    expect(intersection.points.indexOf(point)).toBe(0);
    expect(intersection.points.length).toBe(2);
  });

  describe('isPointContained', () => {
    function checkIsPointContained(
      T: Point,
      A: Point,
      B: Point,
      infinite: boolean,
      expected: boolean,
      message: string,
    ) {
      const actual = Intersection.isPointContained(T, A, B, infinite);
      const reversed = Intersection.isPointContained(T, B, A, infinite);

      expect(actual, message).toBe(expected);
      expect(reversed, `${message} (reversed point order)`).toBe(expected);

      if (!infinite && expected) {
        const actualInfinite = Intersection.isPointContained(T, A, B, true);
        const reversedInfinite = Intersection.isPointContained(T, B, A, true);

        expect(actualInfinite, `${message} (infinite)`).toBe(expected);
        expect(
          reversedInfinite,
          `${message} (reversed point order, infinite)`,
        ).toBe(expected);
      }
    }

    it('contained in point', () => {
      checkIsPointContained(
        new Point(10, 0),
        new Point(10, 0),
        new Point(10, 0),
        false,
        true,
        'same point',
      );
      checkIsPointContained(
        new Point(10, 1),
        new Point(10, 0),
        new Point(10, 0),
        false,
        false,
        'not same point',
      );
      checkIsPointContained(
        new Point(10, 1),
        new Point(10, 0),
        new Point(10, 0),
        true,
        false,
        'not same point, infinite check',
      );
    });

    it('x axis', () => {
      checkIsPointContained(
        new Point(5, 0),
        new Point(5, 0),
        new Point(10, 0),
        false,
        true,
        'on edge',
      );
      checkIsPointContained(
        new Point(10, 0),
        new Point(5, 0),
        new Point(10, 0),
        false,
        true,
        'on edge',
      );
      checkIsPointContained(
        new Point(7, 0),
        new Point(5, 0),
        new Point(10, 0),
        false,
        true,
        'inside',
      );
      checkIsPointContained(
        new Point(4.9, 0),
        new Point(5, 0),
        new Point(10, 0),
        false,
        false,
        'on line but not in segment',
      );
      checkIsPointContained(
        new Point(10.1, 0),
        new Point(5, 0),
        new Point(10, 0),
        false,
        false,
        'on line but not in segment',
      );
      checkIsPointContained(
        new Point(4.9, 0),
        new Point(5, 0),
        new Point(10, 0),
        true,
        true,
        'on line',
      );
      checkIsPointContained(
        new Point(10.1, 0),
        new Point(5, 0),
        new Point(10, 0),
        true,
        true,
        'on line',
      );
      checkIsPointContained(
        new Point(1, 1),
        new Point(5, 0),
        new Point(10, 0),
        false,
        false,
        'not inside',
      );
      checkIsPointContained(
        new Point(1, 1),
        new Point(5, 0),
        new Point(10, 0),
        true,
        false,
        'not on line',
      );
    });

    it('y axis', () => {
      checkIsPointContained(
        new Point(0, 5),
        new Point(0, 5),
        new Point(0, 10),
        false,
        true,
        'on edge',
      );
      checkIsPointContained(
        new Point(0, 10),
        new Point(0, 5),
        new Point(0, 10),
        false,
        true,
        'on edge',
      );
      checkIsPointContained(
        new Point(0, 7),
        new Point(0, 5),
        new Point(0, 10),
        false,
        true,
        'inside',
      );
      checkIsPointContained(
        new Point(0, 4.9),
        new Point(0, 5),
        new Point(0, 10),
        false,
        false,
        'on line but not in segment',
      );
      checkIsPointContained(
        new Point(0, 10.1),
        new Point(0, 5),
        new Point(0, 10),
        false,
        false,
        'on line but not in segment',
      );
      checkIsPointContained(
        new Point(0, 4.9),
        new Point(0, 5),
        new Point(0, 10),
        true,
        true,
        'on line',
      );
      checkIsPointContained(
        new Point(0, 10.1),
        new Point(0, 5),
        new Point(0, 10),
        true,
        true,
        'on line',
      );
      checkIsPointContained(
        new Point(1, 1),
        new Point(0, 5),
        new Point(0, 10),
        false,
        false,
        'not inside',
      );
      checkIsPointContained(
        new Point(1, 1),
        new Point(0, 5),
        new Point(0, 10),
        true,
        false,
        'not on line',
      );
    });

    it('sloped', () => {
      checkIsPointContained(
        new Point(2, 1),
        new Point(2, 1),
        new Point(4, 2),
        false,
        true,
        'on edge',
      );
      checkIsPointContained(
        new Point(4, 2),
        new Point(2, 1),
        new Point(4, 2),
        false,
        true,
        'on edge',
      );
      checkIsPointContained(
        new Point(3, 1.5),
        new Point(2, 1),
        new Point(4, 2),
        false,
        true,
        'inside',
      );
      checkIsPointContained(
        new Point(0, 0),
        new Point(2, 1),
        new Point(4, 2),
        false,
        false,
        'on line but not in segment',
      );
      checkIsPointContained(
        new Point(6, 3),
        new Point(2, 1),
        new Point(4, 2),
        false,
        false,
        'on line but not in segment',
      );
      checkIsPointContained(
        new Point(0, 0),
        new Point(2, 1),
        new Point(4, 2),
        true,
        true,
        'on line',
      );
      checkIsPointContained(
        new Point(6, 3),
        new Point(2, 1),
        new Point(4, 2),
        true,
        true,
        'on line',
      );
      checkIsPointContained(
        new Point(1, 1),
        new Point(2, 1),
        new Point(4, 2),
        false,
        false,
        'not inside',
      );
      checkIsPointContained(
        new Point(1, 1),
        new Point(2, 1),
        new Point(4, 2),
        true,
        false,
        'not on line',
      );
    });
  });

  describe('Line Intersection Methods', () => {
    it('intersectLineLine intersection', () => {
      const p1 = new Point(0, 0),
        p2 = new Point(-10, -10),
        p3 = new Point(0, 10),
        p4 = new Point(10, 0),
        intersection = Intersection.intersectLineLine(p1, p2, p3, p4);
      expect(intersection).toBeInstanceOf(Intersection);
      expect(intersection.status).toBe('Intersection');
      expect(intersection.points[0]).toEqual(new Point(5, 5));
    });

    it('intersectSegmentLine intersection', () => {
      const p1 = new Point(0, 0),
        p2 = new Point(-10, -10),
        p3 = new Point(0, 10),
        p4 = new Point(10, 0),
        intersection1 = Intersection.intersectSegmentLine(p1, p2, p3, p4),
        intersection2 = Intersection.intersectSegmentLine(p4, p3, p2, p1);
      expect(intersection1).toBeInstanceOf(Intersection);
      expect(intersection1.status).toBeUndefined();
      expect(intersection1.points.length).toBe(0);
      expect(intersection2).toBeInstanceOf(Intersection);
      expect(intersection2.status).toBe('Intersection');
      expect(intersection2.points.length).toBe(1);
      expect(intersection2.points[0]).toEqual(new Point(5, 5));
    });

    it('intersectSegmentSegment simple intersection', () => {
      const p1 = new Point(0, 0),
        p2 = new Point(10, 10),
        p3 = new Point(0, 10),
        p4 = new Point(10, 0),
        intersection = Intersection.intersectSegmentSegment(p1, p2, p3, p4);
      expect(typeof Intersection.intersectSegmentSegment).toBe('function');
      expect(intersection).toBeInstanceOf(Intersection);
      expect(intersection.status).toBe('Intersection');
      expect(intersection.points[0]).toEqual(new Point(5, 5));
    });

    it('intersectSegmentSegment parallel', () => {
      const p1 = new Point(0, 0),
        p2 = new Point(0, 10),
        p3 = new Point(10, 0),
        p4 = new Point(10, 10),
        intersection = Intersection.intersectSegmentSegment(p1, p2, p3, p4);
      expect(intersection).toBeInstanceOf(Intersection);
      expect(intersection.status).toBe('Parallel');
      expect(intersection.points).toEqual([]);
    });

    it('intersectSegmentSegment coincident', () => {
      const p1 = new Point(0, 0),
        p2 = new Point(0, 10),
        p3 = new Point(0, 0),
        p4 = new Point(0, 10),
        intersection = Intersection.intersectSegmentSegment(p1, p2, p3, p4);
      expect(intersection).toBeInstanceOf(Intersection);
      expect(intersection.status).toBe('Coincident');
      expect(intersection.points).toEqual([]);
    });

    it('intersectSegmentSegment coincident but different', () => {
      const a = new Point(0, 0),
        b = new Point(0, 1),
        c = new Point(0, 9),
        d = new Point(0, 10);
      [
        Intersection.intersectSegmentSegment(a, d, b, c),
        Intersection.intersectSegmentSegment(a, d, c, b),
        Intersection.intersectSegmentSegment(d, a, b, c),
        Intersection.intersectSegmentSegment(d, a, c, b),

        Intersection.intersectSegmentSegment(a, c, b, d),
        Intersection.intersectSegmentSegment(a, c, d, b),
        Intersection.intersectSegmentSegment(c, a, b, d),
        Intersection.intersectSegmentSegment(c, a, d, b),
      ].forEach((intersection) => {
        expect(intersection).toBeInstanceOf(Intersection);
        expect(intersection.status).toBe('Coincident');
        expect(intersection.points).toEqual([]);
      });
    });

    it('intersectSegmentSegment no coincident, intersectLineLine coincident', () => {
      const p1 = new Point(0, 0),
        p2 = new Point(0, 10),
        p3 = new Point(0, 20),
        p4 = new Point(0, 15),
        segmentIntersection = Intersection.intersectSegmentSegment(
          p1,
          p2,
          p3,
          p4,
        ),
        segLineIntersection = Intersection.intersectSegmentLine(p1, p2, p3, p4),
        infiniteIntersection = Intersection.intersectLineLine(p1, p2, p3, p4);
      expect(segmentIntersection).toBeInstanceOf(Intersection);
      expect(segmentIntersection.status).toBeUndefined();
      expect(segmentIntersection.points).toEqual([]);
      expect(segLineIntersection).toBeInstanceOf(Intersection);
      expect(segLineIntersection.status).toBe('Coincident');
      expect(segLineIntersection.points).toEqual([]);
      expect(infiniteIntersection).toBeInstanceOf(Intersection);
      expect(infiniteIntersection.status).toBe('Coincident');
      expect(infiniteIntersection.points).toEqual([]);
    });

    it('intersectSegmentSegment no intersect', () => {
      const p1 = new Point(0, 0),
        p2 = new Point(0, 10),
        p3 = new Point(10, 0),
        p4 = new Point(1, 10),
        intersection = Intersection.intersectSegmentSegment(p1, p2, p3, p4);
      expect(intersection).toBeInstanceOf(Intersection);
      expect(intersection.status).toBeUndefined();
      expect(intersection.points).toEqual([]);
    });
  });

  describe('Polygon Intersection Methods', () => {
    it('intersectSegmentPolygon', () => {
      const p1 = new Point(0, 5),
        p2 = new Point(10, 5),
        p3 = new Point(5, 0),
        p4 = new Point(2, 10),
        p5 = new Point(8, 10),
        points = [p3, p4, p5],
        intersection = Intersection.intersectSegmentPolygon(p1, p2, points);
      expect(intersection).toBeInstanceOf(Intersection);
      expect(typeof Intersection.intersectSegmentPolygon).toBe('function');
      expect(intersection.status).toBe('Intersection');
      expect(intersection.points.length).toBe(2);
      expect(intersection.points[0]).toEqual(new Point(3.5, 5));
      expect(intersection.points[1]).toEqual(new Point(6.5, 5));
    });

    it('intersectSegmentPolygon in one point', () => {
      const p1 = new Point(0, 5),
        p2 = new Point(5, 5),
        p3 = new Point(5, 0),
        p4 = new Point(2, 10),
        p5 = new Point(8, 10),
        points = [p3, p4, p5],
        intersection = Intersection.intersectSegmentPolygon(p1, p2, points);
      expect(intersection).toBeInstanceOf(Intersection);
      expect(intersection.status).toBe('Intersection');
      expect(intersection.points.length).toBe(1);
      expect(intersection.points[0]).toEqual(new Point(3.5, 5));
    });

    it('intersectSegmentPolygon no intersection', () => {
      const p1 = new Point(0, 5),
        p2 = new Point(3, 5),
        p3 = new Point(5, 0),
        p4 = new Point(2, 10),
        p5 = new Point(8, 10),
        points = [p3, p4, p5],
        intersection = Intersection.intersectSegmentPolygon(p1, p2, points);
      expect(intersection).toBeInstanceOf(Intersection);
      expect(intersection.status).toBeUndefined();
      expect(intersection.points.length).toBe(0);
    });

    it('intersectSegmentPolygon on a polygon segment', () => {
      const p1 = new Point(1, 10),
        p2 = new Point(9, 10),
        p3 = new Point(5, 0),
        p4 = new Point(2, 10),
        p5 = new Point(8, 10),
        points = [p3, p4, p5],
        intersection = Intersection.intersectSegmentPolygon(p1, p2, points);
      expect(intersection).toBeInstanceOf(Intersection);
      expect(intersection.status).toBe('Coincident');
      expect(intersection.points.length).toBe(0);
    });

    it('intersectLinePolygon one point', () => {
      const p1 = new Point(1, 0),
        p2 = new Point(0, 0),
        p3 = new Point(5, 0),
        p4 = new Point(2, 10),
        p5 = new Point(8, 10),
        points = [p3, p4, p5],
        intersection = Intersection.intersectLinePolygon(p1, p2, points);
      expect(intersection).toBeInstanceOf(Intersection);
      expect(intersection.status).toBe('Intersection');
      expect(intersection.points.length).toBe(1);
      expect(intersection.points).toEqual([new Point(5, 0)]);
    });

    it('intersectLinePolygon', () => {
      const p1 = new Point(0, 5),
        p2 = new Point(3, 5),
        p3 = new Point(5, 0),
        p4 = new Point(2, 10),
        p5 = new Point(8, 10),
        points = [p3, p4, p5],
        intersection = Intersection.intersectLinePolygon(p1, p2, points);
      expect(intersection).toBeInstanceOf(Intersection);
      expect(intersection.status).toBe('Intersection');
      expect(intersection.points.length).toBe(2);
      expect(intersection.points).toEqual([
        new Point(3.5, 5),
        new Point(6.5, 5),
      ]);
    });

    it('intersectLinePolygon on a polygon segment', () => {
      const p1 = new Point(1, 10),
        p2 = new Point(9, 10),
        p3 = new Point(5, 0),
        p4 = new Point(2, 10),
        p5 = new Point(8, 10),
        points = [p3, p4, p5],
        intersection = Intersection.intersectLinePolygon(p1, p2, points);
      expect(intersection).toBeInstanceOf(Intersection);
      expect(intersection.status).toBe('Coincident');
      expect(intersection.points.length).toBe(0);
    });

    it('intersectPolygonPolygon not intersecting', () => {
      const p3b = new Point(50, 0),
        p4b = new Point(20, 100),
        p5b = new Point(80, 100),
        pointsb = [p3b, p4b, p5b],
        p3 = new Point(5, 0),
        p4 = new Point(2, 10),
        p5 = new Point(8, 10),
        points = [p3, p4, p5],
        intersection = Intersection.intersectPolygonPolygon(pointsb, points);
      expect(typeof Intersection.intersectPolygonPolygon).toBe('function');
      expect(intersection).toBeInstanceOf(Intersection);
      expect(intersection.status).toBeUndefined();
      expect(intersection.points.length).toBe(0);
    });

    it('intersectPolygonPolygon intersecting', () => {
      const p3b = new Point(1, 1),
        p4b = new Point(3, 1),
        p5b = new Point(3, 3),
        p6b = new Point(1, 3),
        pointsb = [p3b, p4b, p5b, p6b],
        p3 = new Point(2, 2),
        p4 = new Point(4, 2),
        p5 = new Point(4, 4),
        p6 = new Point(2, 4),
        points = [p3, p4, p5, p6],
        intersection = Intersection.intersectPolygonPolygon(pointsb, points);
      expect(typeof Intersection.intersectPolygonPolygon).toBe('function');
      expect(intersection).toBeInstanceOf(Intersection);
      expect(intersection.status).toBe('Intersection');
      expect(intersection.points.length).toBe(2);
      expect(intersection.points[0]).toEqual(new Point(3, 2));
      expect(intersection.points[1]).toEqual(new Point(2, 3));
    });

    it('intersectPolygonRectangle intersecting', () => {
      const p3b = new Point(1, 1),
        p5b = new Point(3, 3),
        p3 = new Point(2, 2),
        p4 = new Point(4, 2),
        p5 = new Point(4, 4),
        p6 = new Point(2, 4),
        points = [p3, p4, p5, p6],
        intersection = Intersection.intersectPolygonRectangle(points, p3b, p5b);
      expect(typeof Intersection.intersectPolygonRectangle).toBe('function');
      expect(intersection).toBeInstanceOf(Intersection);
      expect(intersection.status).toBe('Intersection');
      expect(intersection.points.length).toBe(2);
      expect(intersection.points[0]).toEqual(new Point(3, 2));
      expect(intersection.points[1]).toEqual(new Point(2, 3));
    });

    it('intersectPolygonRectangle not intersecting', () => {
      const p3b = new Point(10, 10),
        p5b = new Point(30, 30),
        p3 = new Point(2, 2),
        p4 = new Point(4, 2),
        p5 = new Point(4, 4),
        p6 = new Point(2, 4),
        points = [p3, p4, p5, p6],
        intersection = Intersection.intersectPolygonRectangle(points, p3b, p5b);
      expect(typeof Intersection.intersectPolygonRectangle).toBe('function');
      expect(intersection).toBeInstanceOf(Intersection);
      expect(intersection.status).toBeUndefined();
      expect(intersection.points.length).toBe(0);
    });

    it('intersectPolygonRectangle line edge case', () => {
      const points = [
        new Point(2, 2),
        new Point(4, 2),
        new Point(4, 4),
        new Point(2, 4),
      ];
      [
        [new Point(10, 3), new Point(30, 3)],
        [new Point(3, 10), new Point(3, 30)],
      ].forEach(([a, b]) => {
        const intersection = Intersection.intersectPolygonRectangle(
          points,
          a,
          b,
        );
        expect(typeof Intersection.intersectPolygonRectangle).toBe('function');
        expect(intersection).toBeInstanceOf(Intersection);
        expect(intersection.status).toBeUndefined();
        expect(intersection.points.length).toBe(0);
      });
    });

    it('intersectPolygonPolygon coincident', () => {
      const points = [
        new Point(0, 0),
        new Point(10, 0),
        new Point(15, 5),
        new Point(10, 10),
        new Point(-5, 5),
      ];
      expect(typeof Intersection.intersectPolygonRectangle).toBe('function');

      let intersection = Intersection.intersectPolygonPolygon(
        points,
        points.concat(),
      );
      expect(intersection).toBeInstanceOf(Intersection);
      expect(intersection.status).toBe('Coincident');
      expect(intersection.points.length).toBe(0);
      expect(intersection.points).toEqual([]);

      intersection = Intersection.intersectPolygonPolygon(
        points,
        points.concat(points[0].clone()),
      );
      expect(intersection.status).toBe('Coincident');
      expect(intersection.points.length).toBe(0);
      expect(intersection.points).toEqual([]);

      intersection = Intersection.intersectPolygonPolygon(
        points,
        points.concat(points[points.length - 1].clone()),
      );
      expect(intersection.status).toBe('Coincident');
      expect(intersection.points.length).toBe(0);
      expect(intersection.points).toEqual([]);

      intersection = Intersection.intersectPolygonPolygon(
        points,
        points.concat(points[1].clone()),
      );
      expect(intersection.status).toBe('Intersection');
      expect(intersection.points.length).toBe(points.length);
      expect(intersection.points).toEqual(points);

      intersection = Intersection.intersectPolygonPolygon(
        points,
        points.slice(0, -1),
      );
      expect(intersection.status).toBe('Intersection');
      expect(intersection.points.length).toBe(points.length - 1);
      expect(intersection.points).toEqual(points.slice(0, -1));
    });
  });
});
