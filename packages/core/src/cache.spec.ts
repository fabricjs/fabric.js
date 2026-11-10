import { afterEach, describe, beforeEach, expect, it } from 'vitest';
import { cache } from './cache';
import { config } from './config';

describe('cache', () => {
  describe('clearFontCache', () => {
    it('removes specified font cache or all caches', () => {
      expect(cache.clearFontCache).toBeTypeOf('function');

      cache.charWidthsCache.set(
        'arial',
        new Map([['some', new Map([['aa', 10]])]]),
      );
      cache.charWidthsCache.set(
        'helvetica',
        new Map([['some', new Map([['aa', 11]])]]),
      );
      cache.clearFontCache('arial');
      expect(cache.charWidthsCache.get('arial')).toBe(undefined);
      expect(
        cache.charWidthsCache.get('helvetica')?.get('some'),
      ).toBeInstanceOf(Map);

      cache.clearFontCache();
      expect(cache.charWidthsCache.size).toEqual(0);
    });

    it('handles case-insensitive font names', () => {
      cache.charWidthsCache.set(
        'arial',
        new Map([['some', new Map([['aa', 10]])]]),
      );
      cache.charWidthsCache.set(
        'helvetica',
        new Map([['some', new Map([['aa', 11]])]]),
      );
      cache.clearFontCache('ARIAL');
      expect(cache.charWidthsCache.get('arial')).toBe(undefined);
      expect(
        cache.charWidthsCache.get('helvetica')?.get('some'),
      ).toBeInstanceOf(Map);
    });
  });

  describe('limitDimsByArea', () => {
    const perfLimit = config.perfLimitSizeTotal;

    beforeEach(() => {
      config.perfLimitSizeTotal = 10000;
    });

    afterEach(() => {
      config.perfLimitSizeTotal = perfLimit;
    });

    it('limitDimsByArea provides correct dimensions for aspect ratio 1', () => {
      expect(cache.limitDimsByArea).toBeTypeOf('function');
      const [x, y] = cache.limitDimsByArea(1);
      expect(x).toBe(100);
      expect(y).toBe(100);
    });

    it('limitDimsByArea provides correct dimensions for aspect ratio > 1', () => {
      const [x, y] = cache.limitDimsByArea(3);
      expect(x).toBe(173);
      expect(y).toBe(57);
    });

    it('limitDimsByArea provides correct dimensions for aspect ratio < 1', () => {
      const [x, y] = cache.limitDimsByArea(1 / 3);
      expect(x).toBe(57);
      expect(y).toBe(173);
    });
  });
});
