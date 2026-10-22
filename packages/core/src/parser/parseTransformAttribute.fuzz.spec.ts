import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import { Point } from '../Point';
import type { XY } from '../Point';
import { parseTransformAttribute } from './parseTransformAttribute';

type Transform = {
  name: 'translate' | 'scale' | 'rotate' | 'skewX' | 'skewY' | 'matrix';
  args: number[];
};

const coordinate = fc.integer({ min: -8000, max: 8000 }).map((n) => n / 8);
const angle = fc.oneof(
  fc.constantFrom(-180, -90, 0, 90, 180),
  fc.integer({ min: -360, max: 360 }),
);
const scale = fc.integer({ min: -32, max: 32 }).map((n) => n / 8);
const pivot = fc.oneof(
  fc.tuple(coordinate, coordinate),
  fc.tuple(fc.constant(0), coordinate),
  fc.tuple(coordinate, fc.constant(0)),
);
const transform = fc.oneof<fc.Arbitrary<Transform>[]>(
  fc.tuple(coordinate, coordinate).map((args) => ({ name: 'translate', args })),
  coordinate.map((x) => ({ name: 'translate', args: [x] })),
  fc.tuple(scale, scale).map((args) => ({ name: 'scale', args })),
  scale.map((x) => ({ name: 'scale', args: [x] })),
  fc
    .tuple(angle, pivot)
    .map(([angle, [x, y]]) => ({ name: 'rotate', args: [angle, x, y] })),
  angle.map((angle) => ({ name: 'rotate', args: [angle] })),
  fc
    .tuple(fc.constantFrom('skewX', 'skewY'), fc.integer({ min: -45, max: 45 }))
    .map(([name, angle]) => ({ name, args: [angle] })),
  fc
    .tuple(scale, scale, scale, scale, coordinate, coordinate)
    .map((args) => ({ name: 'matrix', args })),
);
const options = { numRuns: 1000 };

// Apply each operation directly, without Fabric's matrix constructors or multiplication.
const apply = ({ name, args }: Transform, { x, y }: XY): XY => {
  const [a, b, c, d, e, f] = args;
  switch (name) {
    case 'translate':
      return { x: x + a, y: y + (b ?? 0) };
    case 'scale':
      return { x: x * a, y: y * (b ?? a) };
    case 'rotate': {
      const radians = (a * Math.PI) / 180,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        cx = b ?? 0,
        cy = c ?? 0;
      return {
        x: cx + (x - cx) * cos - (y - cy) * sin,
        y: cy + (x - cx) * sin + (y - cy) * cos,
      };
    }
    case 'skewX':
      return { x: x + y * Math.tan((a * Math.PI) / 180), y };
    case 'skewY':
      return { x, y: y + x * Math.tan((a * Math.PI) / 180) };
    case 'matrix':
      return { x: a * x + c * y + e, y: b * x + d * y + f };
  }
};

describe('SVG transform property tests', () => {
  test('parsed sequences match independently applied operations across numeric spellings', () => {
    fc.assert(
      fc.property(
        fc.array(transform, { maxLength: 6 }),
        pivot,
        fc.constantFrom(' ', ',', '\t', ',\n'),
        fc.constantFrom('decimal', 'exponent', 'signed'),
        (operations, [x, y], separator, notation) => {
          const input = operations
            .map(({ name, args }) => {
              const values = args.map((n) => {
                if (notation === 'exponent') {
                  return n.toExponential();
                }
                return notation === 'signed' && n >= 0 ? `+${n}` : String(n);
              });
              return `${name} ( ${values.join(separator)} )`;
            })
            .join(separator);
          const matrix = parseTransformAttribute(input);
          const actual = new Point(x, y).transform(matrix);
          const expected = operations.reduceRight(
            (p, operation) => apply(operation, p),
            { x, y },
          );
          expect(matrix.every(Number.isFinite)).toBe(true);
          expect(actual.x).toBeCloseTo(expected.x, 7);
          expect(actual.y).toBeCloseTo(expected.y, 7);
        },
      ),
      options,
    );
  });

  test('rotation keeps its pivot fixed, including pivots on either axis', () => {
    fc.assert(
      fc.property(angle, pivot, (angle, [x, y]) => {
        const rotated = new Point(x, y).transform(
          parseTransformAttribute(`rotate(${angle} ${x} ${y})`),
        );
        expect(rotated.x).toBeCloseTo(x, 8);
        expect(rotated.y).toBeCloseTo(y, 8);
      }),
      {
        ...options,
        examples: [
          [1, [0, 0.125]],
          [1, [0.125, 0]],
        ],
      },
    );
  });

  test('omitted arguments match their explicit defaults', () => {
    fc.assert(
      fc.property(coordinate, scale, angle, (x, scale, angle) => {
        const shorthand = parseTransformAttribute(
          `translate(${x}) scale(${scale}) rotate(${angle})`,
        );
        const explicit = parseTransformAttribute(
          `translate(${x} 0) scale(${scale} ${scale}) rotate(${angle} 0 0)`,
        );
        shorthand.forEach((value, index) => {
          expect(value).toBeCloseTo(explicit[index], 8);
        });
      }),
      options,
    );
  });
});
