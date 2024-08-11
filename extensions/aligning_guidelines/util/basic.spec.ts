import { getDistance, setPositionDir } from './basic';
import { Rect } from '../../../src/shapes/Rect';
import { Point } from '../../../src/Point';

describe('getDistance', () => {
  it('returns the distabnce between the 2 numbers', () => {
    expect(getDistance(4, 6)).toBe(2);
    expect(getDistance(6, 4)).toBe(2);
    expect(getDistance(-6, -4)).toBe(2);
    expect(getDistance(6, -4)).toBe(10);
  });
});

describe('setPositionDir', () => {
  it('set the position of the object', () => {
    const rect = new Rect({
      width: 100,
      height: 50,
      originX: 'left',
      originY: 'top',
      left: 100,
      top: 100,
    });
    setPositionDir(rect, new Point(10, 15), 'x');
    expect(rect.left).toEqual(-40.5);
    expect(rect.top).toEqual(100);
    setPositionDir(rect, new Point(10, 15), 'y');
    expect(rect.left).toEqual(-40.5);
    expect(rect.top).toEqual(-10.5);
  });
});
