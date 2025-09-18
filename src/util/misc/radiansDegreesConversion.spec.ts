import { describe, it, expect } from 'vitest';
import { degreesToRadians, radiansToDegrees } from './radiansDegreesConversion';

describe('radiansDegreesConversion', () => {
  describe('degreesToRadians', () => {
    it('converts degrees to radians correctly', () => {
      expect(degreesToRadians(0)).toBe(0);
      expect(degreesToRadians(90)).toBe(Math.PI / 2);
      expect(degreesToRadians(180)).toBe(Math.PI);

      // @ts-expect-error -- no args
      expect(degreesToRadians()).toBeNaN();
    });
  });

  describe('radiansToDegrees', () => {
    it('converts radians to degrees correctly', () => {
      expect(radiansToDegrees).toBeTypeOf('function');
      expect(radiansToDegrees(0)).toBe(0);
      expect(radiansToDegrees(Math.PI / 2)).toBe(90);
      expect(radiansToDegrees(Math.PI)).toBe(180);

      // @ts-expect-error -- no args
      expect(radiansToDegrees()).toBeNaN();
    });
  });
});
