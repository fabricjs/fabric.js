import { getPathSegmentsInfo } from '.';

describe('Path Utils', () => {
  describe('getPathSegmentsInfo', () => {
    it('operates as expected', () => {
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
