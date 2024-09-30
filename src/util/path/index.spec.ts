import {
  getPathSegmentsInfo,
  parsePath,
  makePathSimpler,
  getRegularPolygonPath,
  joinPath,
} from '.';
import type { TSimplePathData } from './typedefs';

describe('Path Utils', () => {
  describe('parsePath', () => {
    const path =
      'M 2 5 l 2 -2 L 4 4 h 3 H 9 C 8 3 10 3 10 3 c 1 -1 2 0 1 1 S 8 5 9 7 v 1 s 2 -1 1 2 Q 9 10 10 11 T 12 11 t -1 -1 v 2 T 10 12 S 9 12 7 11 c 0 -1 0 -1 -2 -2 z m 0 2 l 1 0 l 0 1 l -1 0 z M 1 1 a 1 1 30 1 0 2 2 A 2 2 30 1 0 6 6';
    test('can parse path string', () => {
      const parsed = parsePath(path);
      expect(parsed).toMatchSnapshot();
      const simplified = makePathSimpler(parsed);
      expect(simplified).toMatchSnapshot();
    });
    test('Path written with uncommon scenario', () => {
      const path =
        'a10.56 10.56 0 00-1.484-.133a10.56  ,   10.56    0, 0,0-1.484-.133a10.56  ,   10.56    0, 0,0-1.484-.133a1.056e+1  ,   105.6e-1,0,0,0-1.484-.133';
      const parsed = parsePath(path);
      expect(parsed[0]).toEqual(parsed[1]);
      expect(parsed[1]).toEqual(parsed[2]);
      expect(parsed[2]).toEqual(parsed[3]);
      expect(parsed).toMatchSnapshot();
    });
    test('fabric.util.parsePath can parse arcs correctly when no spaces between flags', () => {
      const pathWithWeirdArc = 'a10.56 10.56 0 00-1.484-.133';
      const expected = ['a', 10.56, 10.56, 0, 0, 0, -1.484, -0.133];
      const parsed = parsePath(pathWithWeirdArc);
      const command = parsed[0];
      expect(command).toEqual(expected);
    });
    test('getPathSegmentsInfo', () => {
      const parsed = makePathSimpler(parsePath(path));
      const infos = getPathSegmentsInfo(parsed);
      // 'the command 0 a M has a length 0');
      expect(infos[0].length).toBe(0);
      // 'the command 1 a L has a length 2.828',
      expect(infos[1].length.toFixed(5)).toBe('2.82843');
      //  'the command 2 a L with one step on Y has a length 1',
      expect(infos[2].length).toBe(1);
      // 'the command 3 a L with 3 step on X has a length 3'
      expect(infos[3].length).toBe(3);
      // 'the command 4 a L with 2 step on X has a length 0',
      expect(infos[4].length).toBe(2);
      // 'the command 5 a C has a approximated length of 2.062',
      expect(infos[5].length.toFixed(5)).toBe('2.06242');
      // 'the command 6 a C has a approximated length of 2.828',
      expect(infos[6].length.toFixed(5)).toBe('2.82832');
      // 'the command 7 a C has a approximated length of 4.189',
      expect(infos[7].length.toFixed(5)).toBe('4.18970');
      // 'the command 8 a L with 1 step on the Y has an exact length of 1',
      expect(infos[8].length).toBe(1);
      // 'the command 9 a C has a approximated length of 3.227',
      expect(infos[9].length.toFixed(5)).toBe('3.22727');
      // 'the command 10 a Q has a approximated length of 1.540',
      expect(infos[10].length.toFixed(5)).toBe('1.54026');
      // 'the command 11 a Q has a approximated length of 2.295',
      expect(infos[11].length.toFixed(5)).toBe('2.29556');
    });
    test('fabric.util.getPathSegmentsInfo test Z command', () => {
      const parsed = makePathSimpler(parsePath('M 0 0 h 20, v 20 L 0, 20 Z'));
      const infos = getPathSegmentsInfo(parsed);
      // 'the command 0 a M has a length 0'
      expect(infos[0].length).toBe(0);
      // 'the command 1 a L has length 20'
      expect(infos[1].length).toBe(20);
      // 'the command 2 a L has length 20'
      expect(infos[2].length).toBe(20);
      // 'the command 3 a L has length 20'
      expect(infos[3].length).toBe(20);
      // 'the command 4 a Z has length 20'
      expect(infos[4].length).toBe(20);
    });
  });
  test('fabric.util.getRegularPolygonPath', () => {
    const penta = getRegularPolygonPath(5, 50);
    const hexa = getRegularPolygonPath(6, 50);
    // 'regular pentagon should match',
    expect(penta).toMatchSnapshot();
    // 'regular hexagon should match',
    expect(hexa).toMatchSnapshot();
  });

  test('fabric.util.joinPath', () => {
    const pathData: TSimplePathData = [
      ['M', 3.12345678, 2.12345678],
      ['L', 1.00001111, 2.40001111],
      ['Z'],
    ] as const;
    const digit = 2;
    const expected = 'M 3.12 2.12 L 1 2.4 Z';
    const result = joinPath(pathData, digit);
    expect(result).toBe(expected);
  });

  test('fabric.util.joinPath without rounding', () => {
    const pathData: TSimplePathData = [
      ['M', 3.12345678, 2.12345678],
      ['L', 1.00001111, 2.40001111],
      ['Z'],
    ] as const;
    const expected = 'M 3.12345678 2.12345678 L 1.00001111 2.40001111 Z';
    const result = joinPath(pathData);
    expect(result).toBe(expected);
  });
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
