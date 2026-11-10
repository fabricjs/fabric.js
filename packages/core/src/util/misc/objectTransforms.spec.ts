import { describe, expect, it } from 'vitest';
import { Rect } from '../../shapes/Rect';
import { resetObjectTransform, saveObjectTransform } from './objectTransforms';

describe('objectTransforms', () => {
  describe('saveObjectTransform', () => {
    it('it extracts object transform values', () => {
      const rect = new Rect({
        top: 1,
        width: 100,
        height: 100,
        angle: 30,
        scaleX: 2,
        scaleY: 1,
        flipX: true,
        flipY: true,
        skewX: 30,
        skewY: 30,
      });

      const transform = saveObjectTransform(rect);

      expect(transform.skewX).toBe(30);
      expect(transform.skewY).toBe(30);
      expect(transform.scaleX).toBe(2);
      expect(transform.scaleY).toBe(1);
      expect(transform.flipX).toBe(true);
      expect(transform.flipY).toBe(true);
      expect(transform.angle).toBe(30);
    });
  });

  describe('resetObjectTransform', () => {
    it('resets all transformation properties to default values', () => {
      const rect = new Rect({
        top: 1,
        width: 100,
        height: 100,
        angle: 30,
        scaleX: 2,
        scaleY: 1,
        flipX: true,
        flipY: true,
        skewX: 30,
        skewY: 30,
      });

      expect(rect.skewX).toBe(30);
      expect(rect.skewY).toBe(30);
      expect(rect.scaleX).toBe(2);
      expect(rect.scaleY).toBe(1);
      expect(rect.flipX).toBe(true);
      expect(rect.flipY).toBe(true);
      expect(rect.angle).toBe(30);

      resetObjectTransform(rect);

      expect(rect.skewX).toBe(0);
      expect(rect.skewY).toBe(0);
      expect(rect.scaleX).toBe(1);
      expect(rect.scaleY).toBe(1);
      expect(rect.flipX).toBe(false);
      expect(rect.flipY).toBe(false);
      expect(rect.angle).toBe(0);
    });
  });
});
