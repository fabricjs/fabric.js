import { describe, expect, it } from 'vitest';
import { getFabricDocument } from '../env';
import { setStyle } from './dom_style';

/**
 * Running this test in browser mode since jsdom doesn't implement `cssText` properly
 */
describe('dom_style', () => {
  describe('setStyle', () => {
    it('applies styles to DOM elements from strings and objects', () => {
      const el = getFabricDocument().createElement('div');

      // TODO: skipping these because jsdom doesn't implement
      // style invalidation via mutation of the cssText property
      // setStyle(el, 'color:red');
      // expect(el.style.color).toBe('red');
      //
      // setStyle(el, 'color:blue;border-radius:3px');
      // expect(el.style.color).toBe('blue');
      // expect(el.style.borderRadius).toBe('3px');

      setStyle(el, { color: 'yellow', width: '45px' });
      expect(el.style.color).toBe('yellow');
      expect(el.style.width).toBe('45px');
    });
  });
});
