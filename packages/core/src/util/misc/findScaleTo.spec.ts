import { describe, expect, it } from 'vitest';
import { findScaleToCover, findScaleToFit } from './findScaleTo';

describe('findScaleTo', () => {
  describe('findScaleToFit', () => {
    it('calculates correct scale factors to fit dimensions', () => {
      expect(typeof findScaleToFit === 'function').toBeTruthy();

      const scale1 = findScaleToFit(
        {
          width: 100,
          height: 200,
        },
        {
          width: 50,
          height: 50,
        },
      );

      expect(scale1, 'findScaleToFit is 0.25').toBe(0.25);

      const scale2 = findScaleToFit(
        {
          width: 10,
          height: 25,
        },
        {
          width: 50,
          height: 50,
        },
      );

      expect(scale2, 'findScaleToFit is 2').toBe(2);
    });
  });

  describe('findScaleToCover', () => {
    it('calculates correct scale factors to cover dimensions', () => {
      expect(typeof findScaleToCover === 'function').toBeTruthy();

      const scale1 = findScaleToCover(
        {
          width: 100,
          height: 200,
        },
        {
          width: 50,
          height: 50,
        },
      );

      expect(scale1, 'scaleToCover is 0.5').toBe(0.5);

      const scale2 = findScaleToCover(
        {
          width: 10,
          height: 25,
        },
        {
          width: 50,
          height: 50,
        },
      );

      expect(scale2, 'scaleToCover is 5').toBe(5);
    });
  });
});
