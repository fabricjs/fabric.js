import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import { graphemeSplit } from '../lang_string';
import { stylesFromArray, stylesToArray } from './textStyles';
import type {
  TextStyle,
  TextStyleDeclaration,
} from '../../shapes/Text/StyledText';

const grapheme = fc.constantFrom('a', ' ', 'é', 'e\u0301', '🙂', '👩🏽‍💻', '🇮🇹');
const line = fc
  .array(grapheme, { maxLength: 12 })
  .map((chars) => chars.join(''));
const style: fc.Arbitrary<TextStyleDeclaration> = fc.record(
  {
    fill: fc.constantFrom('red', 'blue', '#000000'),
    stroke: fc.constantFrom('green', '#ffffff'),
    strokeWidth: fc.integer({ min: 0, max: 5 }),
    fontSize: fc.integer({ min: 1, max: 100 }),
    fontWeight: fc.constantFrom('normal', 'bold'),
    fontStyle: fc.constantFrom('normal', 'italic'),
    fontFamily: fc.constantFrom('serif', 'sans-serif', 'monospace'),
    textBackgroundColor: fc.constantFrom('red', 'blue'),
    textDecorationColor: fc.constantFrom('red', 'blue'),
    textDecorationThickness: fc.integer({ min: 0, max: 100 }),
    underline: fc.boolean(),
    overline: fc.boolean(),
    linethrough: fc.boolean(),
    deltaY: fc.integer({ min: -10, max: 10 }),
  },
  { requiredKeys: [] },
);
const textCase = fc
  .array(line, { minLength: 1, maxLength: 6 })
  .chain((lines) => {
    const characters = lines.map(graphemeSplit);
    const length = characters.reduce((sum, chars) => sum + chars.length, 0);
    return fc
      .array(fc.option(style, { nil: undefined }), {
        minLength: length,
        maxLength: length,
      })
      .map((declarations) => {
        const styles: TextStyle = {};
        let index = 0;
        characters.forEach((chars, lineIndex) => {
          chars.forEach((_, charIndex) => {
            const declaration = declarations[index++];
            if (declaration && Object.keys(declaration).length > 0) {
              styles[lineIndex] ??= {};
              styles[lineIndex][charIndex] = declaration;
            }
          });
        });
        return { lines, styles };
      });
  });
const options = { numRuns: 1000 };

describe('Text style property tests', () => {
  test.each(['\n', '\r\n'])(
    'preserves sparse per-grapheme styles with %j line endings',
    (newline) => {
      fc.assert(
        fc.property(textCase, ({ lines, styles }) => {
          const text = lines.join(newline);
          const ranges = stylesToArray(styles, text);
          const restored = stylesFromArray(ranges, text);
          expect(restored).toEqual(styles);
          expect(stylesToArray(restored, text)).toEqual(ranges);
        }),
        {
          ...options,
          examples: [
            [{ lines: ['', 'a'], styles: { 1: { 0: { deltaY: 0 } } } }],
          ],
        },
      );
    },
  );

  test('serialization and restored style edits do not mutate inputs', () => {
    fc.assert(
      fc.property(textCase, ({ lines, styles }) => {
        const text = lines.join('\n');
        const original = structuredClone(styles);
        const ranges = stylesToArray(styles, text);
        const originalRanges = structuredClone(ranges);
        const restored = stylesFromArray(ranges, text);
        Object.values(restored).forEach((line) => {
          Object.values(line).forEach((style) => {
            style.fontSize = 9999;
          });
        });
        expect(styles).toEqual(original);
        expect(ranges).toEqual(originalRanges);
      }),
      options,
    );
  });
});
