import { describe, expect, it } from 'vitest';
import { getFabricDocument } from '../../env';
import { setStyle } from './dom_style';

/**
 * Running this test in browser mode since jsdom doesn't implement `cssText` properly
 */
describe('dom_style', () => {
  describe('setStyle', () => {
    it('applies styles to DOM elements from strings and objects', () => {
      const el = getFabricDocument().createElement('div');
      setStyle(el, { color: 'yellow', width: '45px' });
      expect(el.style.color).toBe('yellow');
      expect(el.style.width).toBe('45px');
    });
  });
});
