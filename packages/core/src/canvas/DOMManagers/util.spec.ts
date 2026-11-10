import { makeElementUnselectable } from './util';
import { getFabricDocument } from '../../env';
import { NONE } from '../../constants';

import { describe, expect, it } from 'vitest';

describe('DOMManagers utils', () => {
  describe('makeElementUnselectable', () => {
    it('makes element not selectable', () => {
      const el = getFabricDocument().createElement('p');
      el.appendChild(getFabricDocument().createTextNode('foo'));
      const returnedEl = makeElementUnselectable(el);
      expect(returnedEl).toBe(el);
      expect(el.style.userSelect).toBe(NONE);
    });
    it('replace onselectstart if exists', () => {
      const el = getFabricDocument().createElement('p');
      el.appendChild(getFabricDocument().createTextNode('foo'));
      el.onselectstart = () => 'fail';
      expect(el.onselectstart({} as Event)).toBe('fail');
      makeElementUnselectable(el);
      expect(el.onselectstart).toBeTruthy();
      if (el.onselectstart) {
        expect(el.onselectstart({} as Event)).toBe(false);
      }
    });
  });
});
