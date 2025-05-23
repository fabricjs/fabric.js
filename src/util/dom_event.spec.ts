import { describe, expect, it } from 'vitest';
import { isTouchEvent } from './dom_event';
import type { TPointerEvent } from '../EventTypeDefs';

describe('dom_event', () => {
  describe('isTouchEvent', () => {
    it('identifies touch events correctly', () => {
      expect(typeof isTouchEvent === 'function').toBeTruthy();
      expect(
        isTouchEvent({ type: 'touchstart' } as TPointerEvent),
      ).toBeTruthy();
      expect(isTouchEvent({ type: 'touchend' } as TPointerEvent)).toBeTruthy();
      expect(isTouchEvent({ type: 'touchmove' } as TPointerEvent)).toBeTruthy();
      expect(
        isTouchEvent({ pointerType: 'touch' } as TPointerEvent),
      ).toBeTruthy();
      expect(isTouchEvent({ type: 'mousedown' } as TPointerEvent)).toBeFalsy();
      expect(
        isTouchEvent({ pointerType: 'mouse' } as TPointerEvent),
      ).toBeFalsy();
    });
  });
});
