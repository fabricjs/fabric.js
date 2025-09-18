import { describe, expect, it } from 'vitest';
import {
  getSvgAttributes,
  parsePreserveAspectRatioAttribute,
  parseUnit,
} from './svgParsing';

describe('svgParsing', () => {
  describe('getSvgAttributes', () => {
    it('returns the correct attributes for SVG elements', () => {
      expect(typeof getSvgAttributes === 'function').toBeTruthy();

      // @ts-expect-error -- intentionally passing an empty string
      expect(getSvgAttributes(''), 'common attribs').toEqual([
        'instantiated_by_use',
        'style',
        'id',
        'class',
      ]);

      expect(
        getSvgAttributes('linearGradient'),
        'linearGradient attribs',
      ).toEqual([
        'instantiated_by_use',
        'style',
        'id',
        'class',
        'x1',
        'y1',
        'x2',
        'y2',
        'gradientUnits',
        'gradientTransform',
      ]);

      expect(
        getSvgAttributes('radialGradient'),
        'radialGradient attribs',
      ).toEqual([
        'instantiated_by_use',
        'style',
        'id',
        'class',
        'gradientUnits',
        'gradientTransform',
        'cx',
        'cy',
        'r',
        'fx',
        'fy',
        'fr',
      ]);

      expect(getSvgAttributes('stop'), 'stop attribs').toEqual([
        'instantiated_by_use',
        'style',
        'id',
        'class',
        'offset',
        'stop-color',
        'stop-opacity',
      ]);
    });
  });

  describe('parseUnit', () => {
    it('converts various units to pixels', () => {
      expect(typeof parseUnit === 'function').toBeTruthy();
      expect(Math.round(parseUnit('30mm')), '30mm is pixels').toBe(113);
      expect(Math.round(parseUnit('30cm')), '30cm is pixels').toBe(1134);
      expect(Math.round(parseUnit('30in')), '30in is pixels').toBe(2880);
      expect(Math.round(parseUnit('30pt')), '30pt is pixels').toBe(40);
      expect(Math.round(parseUnit('30pc')), '30pc is pixels').toBe(480);
    });
  });

  describe('parsePreserveAspectRatioAttribute', () => {
    it('correctly parses preserveAspectRatio values', () => {
      let parsed;

      parsed = parsePreserveAspectRatioAttribute('none');
      expect(parsed.meetOrSlice).toBe('meet');
      expect(parsed.alignX).toBe('none');
      expect(parsed.alignY).toBe('none');

      parsed = parsePreserveAspectRatioAttribute('none slice');
      expect(parsed.meetOrSlice).toBe('slice');
      expect(parsed.alignX).toBe('none');
      expect(parsed.alignY).toBe('none');

      parsed = parsePreserveAspectRatioAttribute('XmidYmax meet');
      expect(parsed.meetOrSlice).toBe('meet');
      expect(parsed.alignX).toBe('mid');
      expect(parsed.alignY).toBe('max');

      parsed = parsePreserveAspectRatioAttribute('XmidYmin');
      expect(parsed.meetOrSlice).toBe('meet');
      expect(parsed.alignX).toBe('mid');
      expect(parsed.alignY).toBe('min');
    });
  });
});
