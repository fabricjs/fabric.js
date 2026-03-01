import { Rect, Gradient, Point, iMatrix, Canvas } from 'fabric';
import {
  linearGradientCoordPositionHandlerGenerator,
  linearGradientColorPositionHandlerGenerator,
} from './linearGradientHandlers';
import { describe, test, expect } from 'vitest';

// function prepareTransform(target: Rect): Transform {
//   return {
//     target,
//     corner: 'xxx',
//     originX: 'center',
//     originY: 'center',
//   } as unknown as Transform;
// }

const prepareRectWithGradient = () => {
  const canvas = new Canvas(undefined, { renderOnAddRemove: false });
  canvas.viewportTransform = [0.5, 0, 0, 0.5, 100, 100];
  const gradient = new Gradient({
    type: 'linear',
    // gradientTransform: [1, 0, 0, 2, 50, 40], <-- unsupported yet
    coords: {
      x1: 20,
      x2: 380,
      y1: 20,
      y2: 230,
    },
    colorStops: [
      {
        offset: 0.2,
        color: 'red',
      },
      {
        offset: 0.4,
        color: 'green',
      },
      {
        offset: 0.6,
        color: 'blue',
      },
      {
        offset: 0.8,
        color: 'yellow',
      },
    ],
  });
  const rect = new Rect({
    width: 400,
    height: 250,
    flipY: true,
    fill: gradient,
  });
  canvas.add(rect);

  return {
    rect,
    gradient,
  };
};

describe('position generators', () => {
  let p1: Point, p2: Point, color: Point;
  describe('linearGradientCoordPositionHandlerGenerator', () => {
    test('places the controls correctly on the first coord point', () => {
      const { rect, gradient } = prepareRectWithGradient();
      const gradientCoordPositionHandler =
        linearGradientCoordPositionHandlerGenerator(gradient, 1);
      p1 = gradientCoordPositionHandler(new Point(), iMatrix, rect);
      expect(p1).toEqual({ x: 10, y: 152.5 });
    });
    test('places the controls correctly on the second coord point', () => {
      const { rect, gradient } = prepareRectWithGradient();
      const gradientCoordPositionHandler =
        linearGradientCoordPositionHandlerGenerator(gradient, 2);
      p2 = gradientCoordPositionHandler(new Point(), iMatrix, rect);
      expect(p2).toEqual({ x: 190, y: 47.5 });
    });
  });
  describe('linearGradientColorPositionHandlerGenerator', () => {
    test('places the controls correctly along the 2 coords of the gradient', () => {
      const { rect, gradient } = prepareRectWithGradient();
      const gradientColorPositionHandler =
        linearGradientColorPositionHandlerGenerator(gradient, 2);
      color = gradientColorPositionHandler(new Point(), iMatrix, rect);
      expect(color).toEqual({ x: 118, y: 89.5 });
      // CHECK RESULTS OF BEFORE TESTS
      expect(p1.lerp(p2, 0.6)).toEqual(color);
    });
  });
});
