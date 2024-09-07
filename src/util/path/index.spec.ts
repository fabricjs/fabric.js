import { getPathSegmentsInfo, parsePath, makePathSimpler } from '.';

describe('Path Utils', () => {
  describe('parsePath', () => {
    const path =
      'M 2 5 l 2 -2 L 4 4 h 3 H 9 C 8 3 10 3 10 3 c 1 -1 2 0 1 1 S 8 5 9 7 v 1 s 2 -1 1 2 Q 9 10 10 11 T 12 11 t -1 -1 v 2 T 10 12 S 9 12 7 11 c 0 -1 0 -1 -2 -2 z m 0 2 l 1 0 l 0 1 l -1 0 z M 1 1 a 1 1 30 1 0 2 2 A 2 2 30 1 0 6 6';
    const expectedParse = [
      ['M', 2, 5],
      ['l', 2, -2],
      ['L', 4, 4],
      ['h', 3],
      ['H', 9],
      ['C', 8, 3, 10, 3, 10, 3],
      ['c', 1, -1, 2, 0, 1, 1],
      ['S', 8, 5, 9, 7],
      ['v', 1],
      ['s', 2, -1, 1, 2],
      ['Q', 9, 10, 10, 11],
      ['T', 12, 11],
      ['t', -1, -1],
      ['v', 2],
      ['T', 10, 12],
      ['S', 9, 12, 7, 11],
      ['c', 0, -1, 0, -1, -2, -2],
      ['z'],
      ['m', 0, 2],
      ['l', 1, 0],
      ['l', 0, 1],
      ['l', -1, 0],
      ['z'],
      ['M', 1, 1],
      ['a', 1, 1, 30, 1, 0, 2, 2],
      ['A', 2, 2, 30, 1, 0, 6, 6],
    ];
    const expectedSimplified = [
      ['M', 2, 5],
      ['L', 4, 3],
      ['L', 4, 4],
      ['L', 7, 4],
      ['L', 9, 4],
      ['C', 8, 3, 10, 3, 10, 3],
      ['C', 11, 2, 12, 3, 11, 4],
      ['C', 10, 5, 8, 5, 9, 7],
      ['L', 9, 8],
      ['C', 9, 8, 11, 7, 10, 10],
      ['Q', 9, 10, 10, 11],
      ['Q', 11, 12, 12, 11],
      ['Q', 13, 10, 11, 10],
      ['L', 11, 12],
      ['Q', 11, 12, 10, 12],
      ['C', 10, 12, 9, 12, 7, 11],
      ['C', 7, 10, 7, 10, 5, 9],
      ['Z'],
      ['M', 2, 7],
      ['L', 3, 7],
      ['L', 3, 8],
      ['L', 2, 8],
      ['Z'],
      ['M', 1, 1],
      [
        'C',
        0.4477152501692063,
        1.5522847498307932,
        0.44771525016920666,
        2.4477152501692068,
        1,
        3,
      ],
      [
        'C',
        1.5522847498307937,
        3.5522847498307932,
        2.4477152501692063,
        3.5522847498307932,
        3,
        3,
      ],
      [
        'C',
        2.1715728752538093,
        3.82842712474619,
        2.1715728752538097,
        5.17157287525381,
        3,
        6,
      ],
      [
        'C',
        3.82842712474619,
        6.82842712474619,
        5.17157287525381,
        6.828427124746191,
        6,
        6,
      ],
    ];

    test('can parse path string', () => {
      const parsed = parsePath(path);
      parsed.forEach((command, index) => {
        expect(command).toEqual(expectedParse[index]);
      });
      const simplified = makePathSimpler(parsed);
      simplified.forEach((command, index) => {
        expect(command.map((v) => (isNaN(v) ? v : v.toFixed(8)))).toEqual(
          expectedSimplified[index].map((v) => (isNaN(v) ? v : v.toFixed(8))),
        );
      });
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
