import { Polyline } from './Polyline';
import { Point } from '../Point';

const points = [
  { x: 2, y: 2 },
  { x: 12, y: 2 },
  { x: 12, y: 7 },
];

describe('Polyline', () => {
  describe('_calcDimensions and pathOffset', () => {
    it('returns dimensions of the polyline regardless of transform or strokeWidth', () => {
      const polyline = new Polyline(points, {
        scaleX: 2,
        scaleY: 2,
        angle: 5,
        strokeWidth: 4,
      });
      const dim = polyline._calcDimensions();
      expect(dim).toEqual({
        left: 2,
        top: 2,
        width: 10,
        height: 5,
        pathOffset: new Point(7, 4.5),
        strokeDiff: new Point(0, 0),
        strokeOffset: new Point(0, 0),
      });
    });
    it('returns dimensions of the polyline regardless of transform or strokeWidth and skew', () => {
      const polyline = new Polyline(points, {
        scaleX: 2,
        scaleY: 2,
        angle: 5,
        strokeWidth: 4,
        skewX: 10,
        skewY: 5,
      });
      const dim = polyline._calcDimensions();
      expect(dim).toEqual({
        left: 2,
        top: 2,
        width: 10,
        height: 5,
        pathOffset: new Point(7, 4.5),
        strokeDiff: expect.any(Point),
        strokeOffset: expect.any(Point),
      });
    });
    it('returns dimensions of the polyline exactBounds and no strokeWidth', () => {
      const polyline = new Polyline(points, {
        scaleX: 2,
        scaleY: 2,
        angle: 5,
        strokeWidth: 0,
        exactBoundingBox: true,
      });
      const dim = polyline._calcDimensions();
      expect(dim).toEqual({
        left: 2,
        top: 2,
        width: 10,
        height: 5,
        pathOffset: new Point(7, 4.5),
        strokeDiff: new Point(0, 0),
        strokeOffset: new Point(0, 0),
      });
    });
    it('returns dimensions of the polyline exactBounds and strokeWidth', () => {
      const polyline = new Polyline(points, {
        scaleX: 2,
        scaleY: 2,
        angle: 5,
        strokeWidth: 4,
        exactBoundingBox: true,
      });
      const dim = polyline._calcDimensions();
      expect(dim).toEqual({
        left: 2,
        top: 0,
        width: 12,
        height: 7,
        pathOffset: new Point(8, 3.5),
        strokeDiff: new Point(4, 4),
        strokeOffset: new Point(0, 4),
      });
    });
    it('returns dimensions of the polyline exactBounds and strokeWidth with skew', () => {
      const polyline = new Polyline(points, {
        scaleX: 2,
        scaleY: 2,
        angle: 5,
        strokeWidth: 4,
        skewX: 10,
        exactBoundingBox: true,
      });
      const dim = polyline._calcDimensions();
      expect(dim).toEqual({
        left: 2,
        top: 0,
        width: 13.234288864959254,
        height: 7,
        pathOffset: new Point(8, 3.5),
        strokeDiff: new Point(4.70530792283386, 4),
        strokeOffset: new Point(0.7053079228338603, 4),
      });
    });
  });
  it('should safeguard passing points in options', () => {
    expect(new Polyline(points, { points: [{ x: 1, y: 1 }] })).toEqual(
      expect.objectContaining({
        points: points,
      }),
    );
  });
});
