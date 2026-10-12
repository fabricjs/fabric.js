import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import { getPathSegmentsInfo, joinPath, makePathSimpler, parsePath } from '.';
import type { TComplexParsedCommand, TSimplePathData } from './typedefs';

// Binary fractions keep equivalent decimal and exponent spellings exact.
const coordinate = fc.integer({ min: -8000, max: 8000 }).map((n) => n / 8);
const radius = fc.integer({ min: 0, max: 8000 }).map((n) => n / 8);
const point = fc.tuple(coordinate, coordinate);
const move = fc.tuple(fc.constantFrom('M', 'm'), coordinate, coordinate);
const arc = fc.tuple(
  fc.constantFrom('A', 'a'),
  radius,
  radius,
  coordinate,
  fc.constantFrom<0 | 1>(0, 1),
  fc.constantFrom<0 | 1>(0, 1),
  coordinate,
  coordinate,
);
const command: fc.Arbitrary<TComplexParsedCommand> = fc.oneof(
  move,
  fc.tuple(fc.constantFrom('L', 'l', 'T', 't'), coordinate, coordinate),
  fc.tuple(fc.constantFrom('H', 'h', 'V', 'v'), coordinate),
  fc.tuple(
    fc.constantFrom('C', 'c'),
    coordinate,
    coordinate,
    coordinate,
    coordinate,
    coordinate,
    coordinate,
  ),
  fc.tuple(
    fc.constantFrom('S', 's', 'Q', 'q'),
    coordinate,
    coordinate,
    coordinate,
    coordinate,
  ),
  arc,
  fc.tuple(fc.constantFrom('Z', 'z')),
);
const path = fc
  .tuple(move, fc.array(command, { maxLength: 30 }))
  .map(([first, rest]) => [first, ...rest]);
const separator = fc.constantFrom(' ', ',', '\t', '\n', ',\n');
// fast-check reports the seed and shrink path on failure for reproduction.
const options = { numRuns: 1000 };

describe('SVG path property tests', () => {
  test('parses equivalent numeric spellings and separators', () => {
    fc.assert(
      fc.property(
        path,
        separator,
        fc.constantFrom('decimal', 'exponent', 'signed'),
        (commands, sep, notation) => {
          const input = commands
            .map(([letter, ...args]) => {
              const numbers = args.map((n, index) => {
                // Arc flags must remain literal 0 or 1 in SVG syntax.
                if (
                  (letter === 'A' || letter === 'a') &&
                  (index === 3 || index === 4)
                ) {
                  return String(n);
                }
                if (notation === 'exponent') {
                  return n.toExponential();
                }
                return notation === 'signed' && n >= 0 ? `+${n}` : String(n);
              });
              return letter + numbers.join(sep);
            })
            .join('');

          expect(parsePath(input)).toEqual(commands);
        },
      ),
      options,
    );
  });

  test('treats repeated move coordinates as line commands', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('M', 'm'),
        fc.array(point, { minLength: 2, maxLength: 30 }),
        separator,
        (letter, points, sep) => {
          const input = letter + points.flat().join(sep);
          expect(parsePath(input)).toEqual(
            points.map(([x, y], index) => [
              index === 0 ? letter : letter === 'M' ? 'L' : 'l',
              x,
              y,
            ]),
          );
        },
      ),
      options,
    );
  });

  test('parses adjacent arc flags and coordinates', () => {
    fc.assert(
      fc.property(arc, (command) => {
        const [letter, rx, ry, rotation, large, sweep, x, y] = command;
        // A positive coordinate needs a separator; a negative sign separates itself.
        const endX = x < 0 ? String(x) : ` ${x}`;
        const input = `M0 0${letter}${rx} ${ry} ${rotation} ${large}${sweep}${endX} ${y}`;
        expect(parsePath(input)).toEqual([['M', 0, 0], command]);
      }),
      options,
    );
  });

  test('resets relative coordinates to the subpath start after closing', () => {
    fc.assert(
      fc.property(
        point,
        fc.array(point, { maxLength: 30 }),
        point,
        ([startX, startY], offsets, [dx, dy]) => {
          let x = startX,
            y = startY;
          const expected: TSimplePathData = [
            ['M', startX, startY],
            ...offsets.map(([dx, dy]): ['L', number, number] => {
              x += dx;
              y += dy;
              return ['L', x, y];
            }),
            ['Z'],
            ['L', startX + dx, startY + dy],
          ];
          const input = `M${startX} ${startY}${offsets
            .map(([dx, dy]) => `l${dx} ${dy}`)
            .join('')}zl${dx} ${dy}`;
          expect(makePathSimpler(parsePath(input))).toEqual(expected);
        },
      ),
      options,
    );
  });

  test('preserves simplified paths through serialization and parsing', () => {
    fc.assert(
      fc.property(path, (commands) => {
        const simplified = makePathSimpler(commands);
        expect(makePathSimpler(parsePath(joinPath(simplified)))).toEqual(
          simplified,
        );
      }),
      options,
    );
  });

  test('produces finite coordinates and nonnegative lengths for bounded paths', () => {
    fc.assert(
      fc.property(path, (commands) => {
        const simplified = makePathSimpler(commands);
        simplified.forEach(([, ...args]) => {
          expect(args.every(Number.isFinite)).toBe(true);
        });
        getPathSegmentsInfo(simplified).forEach(({ x, y, length }) => {
          expect([x, y, length].every(Number.isFinite)).toBe(true);
          expect(length).toBeGreaterThanOrEqual(0);
        });
      }),
      options,
    );
  });
});
