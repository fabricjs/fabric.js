import { getDistance, getDistanceList } from './basic';
import { Point } from '../../../src/Point';

describe('getDistance', () => {
  it('returns the distabnce between the 2 numbers', () => {
    expect(getDistance(4, 6)).toBe(2);
    expect(getDistance(6, 4)).toBe(2);
    expect(getDistance(-6, -4)).toBe(2);
    expect(getDistance(6, -4)).toBe(10);
  });
});

describe('getDistanceList', () => {
  it('returns the distabnce between the 2 numbers', () => {
    // getDistanceList point: Point, list: Point[], type: 'x' | 'y'
    const point = new Point(0, 0);
    const list = [
      new Point(2, 3),
      new Point(-2, -3),
      new Point(3, 3),
      new Point(4, 4),
    ];
    const xList = getDistanceList(point, list, 'x');
    expect(xList.dis).toBe(2);
    expect(xList.arr).toEqual([list[0], list[1]]);

    const yList = getDistanceList(point, list, 'y');
    expect(yList.dis).toBe(3);
    expect(yList.arr).toEqual(list.slice(0, 3));
  });
});
