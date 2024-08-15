import { getPathSegmentsInfo, parsePath, makePathSimpler } from '.';

describe('Path Utils', () => {
  describe('makePathSimpler', () => {
    test('can parse paths that return NaN segments', () => {
      expect(
        makePathSimpler(
          parsePath(
            'M22,6.58a1.21,1.21,0,0,1-.38-.12c0-.2.12-.2.09-.5l0-.06c0,.09,0,.1-.06,0s-.1-.29-.07-.44.18.19.14-.18c-.07,0-.21-.2-.21,0h.05v.45c0-.16-.07.11-.12-.15,0-.05.06-.05.08-.09s-.11,0-.15-.07l.06.09a.35.35,0,0,1-.16.24h-.06c0-.1-.11-.11-.1-.29s.07.07.05,0c0-.24-.06,0-.11-.21,0,.15-.05.24,0,.41-.05-.1-.07.15-.14,0a.32.32,0,0,1,0,.12s-.05,0-.07.06l0,0s0,0,0,0,0-.21.06-.35h0s.06,0,0,0l0-.1c0-.27.07-.54.09-.66v.14c0-.34.13,0,.14-.27,0,0,0,.07,0,.08s0-.44.14-.23l0,.16a1.17,1.17,0,0,0,0-.32c0,.06,0,.13-.1.1a1.13,1.13,0,0,1,0-.23l0,0v0l0,0a.11.11,0,0,0,0,0,.11.11,0,0,1,0-.06',
          ),
        ),
      ).toMatchSnapshot();
    });
  });
  describe('getPathSegmentsInfo', () => {
    test('operates as expected', () => {
      const data = getPathSegmentsInfo([
        ['M', 50, 50],
        ['Q', 50, 50, 75, 75],
        ['Q', 100, 100, 75, 150],
        ['Q', 50, 200, 225, 175],
        ['Q', 400, 150, 450, 325],
        ['L', 500, 500],
      ]);
      expect(data).toMatchSnapshot();
    });
  });
});
