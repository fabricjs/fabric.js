import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import { Color } from './Color';

const byte = fc.oneof(
  fc.constantFrom(0, 1, 254, 255),
  fc.integer({ min: 0, max: 255 }),
);
const rgb = fc.tuple(byte, byte, byte);
const alpha = fc.integer({ min: 0, max: 1024 }).map((n) => n / 1024);
const nibble = fc.integer({ min: 0, max: 15 });
const options = { numRuns: 1000 };

describe('Color property tests', () => {
  test('preserves RGB channels through hex serialization and parsing', () => {
    fc.assert(
      fc.property(rgb, (channels) => {
        const color = new Color(channels);
        expect(new Color(`#${color.toHex()}`).getSource()).toEqual([
          ...channels,
          1,
        ]);
        expect(new Color(color.toRgb()).getSource()).toEqual([...channels, 1]);
      }),
      options,
    );
  });

  test('preserves RGBA with only the expected hex alpha quantization', () => {
    fc.assert(
      fc.property(rgb, alpha, (channels, alpha) => {
        const color = new Color([...channels, alpha]);
        const restored = new Color(`#${color.toHexa()}`);
        expect(restored.getSource().slice(0, 3)).toEqual(channels);
        expect(Math.abs(restored.getAlpha() - alpha)).toBeLessThanOrEqual(
          1 / 510 + 1e-12,
        );
        expect(new Color(color.toRgba()).getSource()).toEqual([
          ...channels,
          alpha,
        ]);
      }),
      options,
    );
  });

  test('expands short hex colors with optional alpha, prefix, and mixed case', () => {
    fc.assert(
      fc.property(
        fc.tuple(nibble, nibble, nibble, nibble),
        fc.boolean(),
        fc.boolean(),
        fc.constantFrom('lower', 'upper', 'mixed'),
        ([r, g, b, a], withAlpha, withPrefix, letterCase) => {
          const hex = [r, g, b, ...(withAlpha ? [a] : [])]
            .map((n, index) => {
              const digit = n.toString(16);
              return letterCase === 'upper' ||
                (letterCase === 'mixed' && index % 2 === 0)
                ? digit.toUpperCase()
                : digit;
            })
            .join('');
          const color = new Color((withPrefix ? '#' : '') + hex);
          expect(color.getSource().slice(0, 3)).toEqual([
            r * 17,
            g * 17,
            b * 17,
          ]);
          expect(color.getAlpha()).toBeCloseTo(withAlpha ? a / 15 : 1, 12);
        },
      ),
      options,
    );
  });

  test('comma and whitespace RGB syntax agree, including percentage alpha', () => {
    fc.assert(
      fc.property(
        rgb,
        fc.integer({ min: 0, max: 100 }),
        ([r, g, b], percent) => {
          const expected = [r, g, b, percent / 100];
          expect(
            new Color(`rgba(${r}, ${g}, ${b}, ${percent}%)`).getSource(),
          ).toEqual(expected);
          expect(
            new Color(`rgb(\t${r}\n${g}  ${b} / ${percent}% )`).getSource(),
          ).toEqual(expected);
        },
      ),
      options,
    );
  });

  test('HSL hue wraps after a full turn, including negative hues and grey colors', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -360, max: 360 }),
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        (hue, saturation, lightness) => {
          const source = new Color(
            `hsl(${hue}deg ${saturation}% ${lightness}%)`,
          ).getSource();
          expect(
            new Color(
              `hsl(${hue + 360}deg ${saturation}% ${lightness}%)`,
            ).getSource(),
          ).toEqual(source);
          expect(source.every(Number.isFinite)).toBe(true);
        },
      ),
      options,
    );
  });
});
