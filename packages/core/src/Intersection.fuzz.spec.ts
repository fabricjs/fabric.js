import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import { Intersection } from './Intersection';
import { Point } from './Point';

const coordinate = fc.integer({ min: -1000, max: 1000 });
const point = fc.tuple(coordinate, coordinate).map(([x, y]) => new Point(x, y));
const direction = point.filter(({ x, y }) => x !== 0 || y !== 0);
const options = { numRuns: 1000 };

describe('Intersection property tests', () => {
  test('swapping segments and reversing endpoints preserves intersections', () => {
    fc.assert(
      fc.property(point, point, point, point, (a1, a2, b1, b2) => {
        const original = Intersection.intersectSegmentSegment(a1, a2, b1, b2);
        for (const [a, b, c, d] of [
          [b1, b2, a1, a2],
          [a2, a1, b1, b2],
          [a1, a2, b2, b1],
        ]) {
          const result = Intersection.intersectSegmentSegment(a, b, c, d);
          expect(result.status).toBe(original.status);
          expect(result.points).toHaveLength(original.points.length);
          result.points.forEach((p, index) => {
            expect(p.x).toBeCloseTo(original.points[index].x, 8);
            expect(p.y).toBeCloseTo(original.points[index].y, 8);
          });
        }
      }),
      options,
    );
  });

  test('nonparallel segments intersect at their shared endpoint', () => {
    fc.assert(
      fc.property(point, direction, (shared, step) => {
        const normal = new Point(-step.y, step.x);
        const result = Intersection.intersectSegmentSegment(
          shared.subtract(step),
          shared,
          shared,
          shared.add(normal),
        );
        expect(result.status).toBe('Intersection');
        expect(result.points).toHaveLength(1);
        expect(result.points[0].x).toBeCloseTo(shared.x, 8);
        expect(result.points[0].y).toBeCloseTo(shared.y, 8);
      }),
      options,
    );
  });

  test('distinct parallel segments do not intersect', () => {
    fc.assert(
      fc.property(point, direction, (start, step) => {
        const offset = new Point(-step.y, step.x);
        const result = Intersection.intersectSegmentSegment(
          start,
          start.add(step),
          start.add(offset),
          start.add(offset).add(step),
        );
        expect(result.status).toBe('Parallel');
        expect(result.points).toEqual([]);
      }),
      options,
    );
  });

  test('overlapping collinear segments are coincident', () => {
    fc.assert(
      fc.property(point, direction, (start, step) => {
        const result = Intersection.intersectSegmentSegment(
          start,
          start.add(step.scalarMultiply(4)),
          start.add(step),
          start.add(step.scalarMultiply(3)),
        );
        expect(result.status).toBe('Coincident');
      }),
      options,
    );
  });

  test('contains endpoints and midpoints, including zero-length segments', () => {
    fc.assert(
      fc.property(point, point, (start, end) => {
        for (const candidate of [start, end, start.midPointFrom(end)]) {
          expect(Intersection.isPointContained(candidate, start, end)).toBe(
            true,
          );
          expect(Intersection.isPointContained(candidate, end, start)).toBe(
            true,
          );
        }
        expect(Intersection.isPointContained(start, start, start)).toBe(true);
        expect(
          Intersection.isPointContained(
            start.add(new Point(1, 0)),
            start,
            start,
          ),
        ).toBe(false);
      }),
      options,
    );
  });

  test('rectangle containment is independent of polygon winding and start vertex', () => {
    fc.assert(
      fc.property(
        point,
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 1, max: 100 }),
        fc.constantFrom('inside', 'outside', 'edge', 'corner'),
        (start, width, height, location) => {
          const polygon = [
            start,
            start.add(new Point(width, 0)),
            start.add(new Point(width, height)),
            start.add(new Point(0, height)),
          ];
          const candidates = {
            inside: start.add(new Point(width / 2, height / 2)),
            outside: start.subtract(new Point(width / 2, 0)),
            edge: start.add(new Point(0, height / 2)),
            corner: start,
          };
          for (const vertices of [
            polygon,
            [...polygon].reverse(),
            [...polygon.slice(1), polygon[0]],
          ]) {
            expect(
              Intersection.isPointInPolygon(candidates[location], vertices),
            ).toBe(location !== 'outside');
          }
        },
      ),
      options,
    );
  });
});
