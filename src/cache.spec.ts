import { describe, expect, it } from 'vitest';
import { cache } from './cache';

describe('cache', () => {
  describe('clearFontCache', () => {
    it('removes specified font cache or all caches', () => {
      expect(cache.clearFontCache).toBeTypeOf('function');

      cache.charWidthsCache = {
        // @ts-expect-error -- test values
        arial: { some: 'cache' },
        // @ts-expect-error -- test values
        helvetica: { some: 'cache' },
      };
      cache.clearFontCache('arial');
      expect(cache.charWidthsCache.arial).toBe(undefined);
      expect(cache.charWidthsCache.helvetica.some).toBe('cache');

      cache.clearFontCache();
      expect(cache.charWidthsCache).toEqual({});
    });

    it('handles case-insensitive font names', () => {
      cache.charWidthsCache = {
        // @ts-expect-error -- test values
        arial: { some: 'cache' },
        // @ts-expect-error -- test values
        helvetica: { some: 'cache' },
      };
      cache.clearFontCache('ARIAL');
      expect(cache.charWidthsCache.arial).toBe(undefined);
      expect(cache.charWidthsCache.helvetica.some).toBe('cache');
    });
  });
});
