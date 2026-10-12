import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import { Point } from '../../Point';
import {
  composeMatrix,
  invertTransform,
  multiplyTransformMatrices,
  qrDecompose,
} from './matrix';

const coordinate = fc.integer({ min: -8000, max: 8000 }).map((n) => n / 8);
const point = fc.record({ x: coordinate, y: coordinate });
// Keep scales away from zero and skew away from 90 degrees for stable inversion.
const scale = fc
  .tuple(fc.integer({ min: 1, max: 32 }), fc.constantFrom(-1, 1))
  .map(([magnitude, sign]) => (sign * magnitude) / 8);
const matrix = fc
  .record({
    translateX: coordinate,
    translateY: coordinate,
    angle: fc.oneof(
      fc.constantFrom(-180, -90, 0, 90, 180),
      fc.integer({ min: -720, max: 720 }),
    ),
    scaleX: scale,
    scaleY: scale,
    skewX: fc.integer({ min: -60, max: 60 }),
    skewY: fc.integer({ min: -60, max: 60 }),
  })
  .map(composeMatrix);
const options = { numRuns: 1000 };

describe('Matrix property tests', () => {
  test('recovers points after applying a transform and its inverse', () => {
    fc.assert(
      fc.property(matrix, point, (transform, original) => {
        const recovered = new Point(original)
          .transform(transform)
          .transform(invertTransform(transform));
        expect(recovered.x).toBeCloseTo(original.x, 8);
        expect(recovered.y).toBeCloseTo(original.y, 8);
      }),
      options,
    );
  });

  test('preserves matrices through decomposition and recomposition', () => {
    fc.assert(
      fc.property(matrix, (original) => {
        const recomposed = composeMatrix(qrDecompose(original));
        recomposed.forEach((value, index) => {
          expect(value).toBeCloseTo(original[index], 8);
        });
      }),
      options,
    );
  });

  test('matrix multiplication matches successive point transformations', () => {
    fc.assert(
      fc.property(matrix, matrix, point, (a, b, original) => {
        const combined = new Point(original).transform(
          multiplyTransformMatrices(a, b),
        );
        const successive = new Point(original).transform(b).transform(a);
        expect(combined.x).toBeCloseTo(successive.x, 8);
        expect(combined.y).toBeCloseTo(successive.y, 8);
      }),
      options,
    );
  });
});
