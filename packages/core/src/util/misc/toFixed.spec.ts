import { describe, expect, it } from 'vitest';
import { toFixed } from './toFixed';

describe('toFixed', () => {
  it('correctly formats numbers with specified decimal precision', () => {
    function testValue(what: number | string) {
      expect(toFixed(what, 2)).toBe(166.67);
      expect(toFixed(what, 5)).toBe(166.66667);
      expect(toFixed(what, 0)).toBe(167);

      const fractionless =
        typeof what === 'number'
          ? parseInt(String(what))
          : what.substring(0, what.indexOf('.'));

      expect(toFixed(fractionless, 2)).toBe(166);
    }

    // Test with string input
    testValue('166.66666666666666666666');

    // Test with number input
    // eslint-disable-next-line no-loss-of-precision -- just a test
    testValue(166.66666666666666666666);
  });
});
