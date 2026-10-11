import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import { getBoundsOfCurve } from '.';
import type { XY } from '../../Point';

const coordinate = fc.integer({ min: -1000, max: 1000 });
const point = fc.record({ x: coordinate, y: coordinate });
const curve = fc.oneof(
  fc.tuple(point, point, point, point),
  point.map((p) => [p, p, p, p] as const),
  fc
    .tuple(point, point)
    .map(([start, end]) => [start, start, end, end] as const),
);
const options = { numRuns: 1000 };

const boundsOf = ([start, first, second, end]: readonly XY[]) =>
  getBoundsOfCurve(
    start.x,
    start.y,
    first.x,
    first.y,
    second.x,
    second.y,
    end.x,
    end.y,
  );

// De Casteljau interpolation is independent of the derivative-based bounds code.
const interpolate = (a: XY, b: XY, t: number): XY => ({
  x: (1 - t) * a.x + t * b.x,
  y: (1 - t) * a.y + t * b.y,
});
const pointOnCurve = ([a, b, c, d]: readonly XY[], t: number) => {
  const ab = interpolate(a, b, t),
    bc = interpolate(b, c, t),
    cd = interpolate(c, d, t);
  return interpolate(interpolate(ab, bc, t), interpolate(bc, cd, t), t);
};

describe('Curve bounds property tests', () => {
  test('contains endpoints and sampled points, including tiny and degenerate curves', () => {
    fc.assert(
      fc.property(
        curve,
        fc.constantFrom(1, 1e-6),
        fc.integer({ min: 0, max: 1024 }),
        (controlPoints, scale, sample) => {
          const scaled = controlPoints.map(({ x, y }) => ({
            x: x * scale,
            y: y * scale,
          }));
          const [min, max] = boundsOf(scaled);
          expect([min.x, min.y, max.x, max.y].every(Number.isFinite)).toBe(
            true,
          );
          const tolerance = 1e-9;
          for (const t of [0, sample / 1024, 1]) {
            const { x, y } = pointOnCurve(scaled, t);
            expect(x).toBeGreaterThanOrEqual(min.x - tolerance);
            expect(x).toBeLessThanOrEqual(max.x + tolerance);
            expect(y).toBeGreaterThanOrEqual(min.y - tolerance);
            expect(y).toBeLessThanOrEqual(max.y + tolerance);
          }
        },
      ),
      options,
    );
  });

  test('captures extrema close to either endpoint', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 16 }),
        fc.boolean(),
        fc.integer({ min: 1, max: 1000 }),
        coordinate,
        (distance, nearEnd, scale, y) => {
          const vertex = nearEnd ? 1 - distance / 1024 : distance / 1024;
          // Elevate x(t) = scale * (t - vertex)^2 to a cubic Bezier.
          const start = vertex ** 2;
          const end = (1 - vertex) ** 2;
          const controlPoints = [
            start,
            start - (2 * vertex) / 3,
            start - (4 * vertex) / 3 + 1 / 3,
            end,
          ].map((x) => ({ x: x * scale, y }));
          const [min, max] = boundsOf(controlPoints);
          expect(min.x).toBeCloseTo(0, 8);
          expect(max.x).toBeCloseTo(Math.max(start, end) * scale, 8);
          expect(min.y).toBeCloseTo(y, 8);
          expect(max.y).toBeCloseTo(y, 8);
        },
      ),
      options,
    );
  });

  test('reversing a curve preserves its bounds', () => {
    fc.assert(
      fc.property(curve, (controlPoints) => {
        const original = boundsOf(controlPoints);
        boundsOf([...controlPoints].reverse()).forEach((p, index) => {
          expect(p.x).toBeCloseTo(original[index].x, 8);
          expect(p.y).toBeCloseTo(original[index].y, 8);
        });
      }),
      options,
    );
  });

  test('translating a curve translates its bounds', () => {
    fc.assert(
      fc.property(curve, point, (controlPoints, offset) => {
        const original = boundsOf(controlPoints);
        const translated = controlPoints.map(({ x, y }) => ({
          x: x + offset.x,
          y: y + offset.y,
        }));
        boundsOf(translated).forEach((p, index) => {
          expect(p.x).toBeCloseTo(original[index].x + offset.x, 8);
          expect(p.y).toBeCloseTo(original[index].y + offset.y, 8);
        });
      }),
      options,
    );
  });

  test('straight curves have the bounds of their endpoints', () => {
    fc.assert(
      fc.property(point, point, (start, step) => {
        const controlPoints = [0, 1, 2, 3].map((n) => ({
          x: start.x + n * step.x,
          y: start.y + n * step.y,
        }));
        const end = controlPoints[3];
        const [min, max] = boundsOf(controlPoints);
        expect(min.x).toBe(Math.min(start.x, end.x));
        expect(min.y).toBe(Math.min(start.y, end.y));
        expect(max.x).toBe(Math.max(start.x, end.x));
        expect(max.y).toBe(Math.max(start.y, end.y));
      }),
      options,
    );
  });
});
