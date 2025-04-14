import { describe, expect, it } from 'vitest';
import { Point } from '../../Point';
import { makeBoundingBoxFromPoints } from './boundingBoxFromPoints';

describe('boundingBoxFromPoints', () => {
  it('creates correct bounding box from array of points', () => {
    expect(
      makeBoundingBoxFromPoints([
        new Point(50, 50),
        new Point(-50, 50),
        new Point(50, -50),
        new Point(-50, -50),
        new Point(50, 50),
        new Point(80, -30),
        new Point(100, 50),
      ]),
      'bbox should match',
    ).toEqual({
      left: -50,
      top: -50,
      width: 150,
      height: 100,
    });
  });
});
