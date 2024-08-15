import { Intersection } from './Intersection';
import { Point } from './Point';

const polygonPoints = [
  new Point(4, 1),
  new Point(6, 2),
  new Point(4, 5),
  new Point(6, 6),
  new Point(10, 3),
  new Point(11, 4),
  new Point(7, 9),
  new Point(1, 5),
];

describe('Intersection', () => {
  describe('isPointInPolygon normal cases', () => {
    describe('testing non coincident points', () => {
      /**
       * To visualize this test for easy understanding paste this svg in an online editor
        <svg width="200" height="200" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
          <polygon points="4,1 6,2 4,5 6,6 10,3 11,4 7,9 1,5" />
          <!-- failing red, passing green points -->
          <circle fill="red" r="0.1" cx="0.5" cy="0.5" />
          <circle fill="red" r="0.1" cx="4.5" cy="0.5" />
          <circle fill="red" r="0.1" cx="9.5" cy="0.5" />
          <circle fill="red" r="0.1" cx="0.5" cy="2.5" />
          <circle fill="green" r="0.1" cx="4.5" cy="2.5" />
          <circle fill="red" r="0.1" cx="9.5" cy="2.5" />
          <circle fill="red" r="0.1" cx="0.5" cy="5.5" />
          <circle fill="green" r="0.1" cx="4.5" cy="5.5" />
          <circle fill="green" r="0.1" cx="8.5" cy="5.5" />
          <circle fill="green" r="0.1" cx="9.5" cy="5.5" />
          <circle fill="red" r="0.1" cx="10.5" cy="5.5" />
          <circle fill="red" r="0.1" cx="0.5" cy="8.5" />
          <circle fill="red" r="0.1" cx="4.5" cy="8.5" />
          <circle fill="green" r="0.1" cx="6.5" cy="8.5" />
          <circle fill="red" r="0.1" cx="9.5" cy="8.5" />
        </svg>
      * sample: https://editsvgcode.com/
      */
      test.each([
        [new Point(0.5, 0.5), false],
        [new Point(4.5, 0.5), false],
        [new Point(9.5, 0.5), false],
        [new Point(0.5, 2.5), false],
        [new Point(4.5, 2.5), true],
        [new Point(9.5, 2.5), false],
        [new Point(0.5, 5.5), false],
        [new Point(4.5, 5.5), true],
        [new Point(8.5, 5.5), true],
        [new Point(9.5, 5.5), true],
        [new Point(10.5, 5.5), false],
        [new Point(0.5, 8.5), false],
        [new Point(4.5, 8.5), false],
        [new Point(6.5, 8.5), true],
        [new Point(9.5, 8.5), false],
      ])('%p is in polygon %p, case index %#', (point, result) => {
        expect(Intersection.isPointInPolygon(point, polygonPoints)).toBe(
          result,
        );
      });
    });
    describe('testing coincident points', () => {
      test.each([
        [new Point(4, 1), true],
        [new Point(6, 2), true],
      ])('%p is in polygon %p, case index %#', (point, result) => {
        expect(Intersection.isPointInPolygon(point, polygonPoints)).toBe(
          result,
        );
      });
    });
  });
});
