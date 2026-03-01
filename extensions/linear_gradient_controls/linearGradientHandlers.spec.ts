import { Rect, Gradient, Point, iMatrix, Canvas, type Transform } from 'fabric';
import {
  linearGradientCoordPositionHandlerGenerator,
  linearGradientColorPositionHandlerGenerator,
  linearGradientColorActionHandlerGenerator,
  linearGradientCoordsActionHandlerGenerator,
} from './linearGradientHandlers';
import { describe, test, expect } from 'vitest';

function prepareTransform(target: Rect): Transform {
  return {
    target,
    corner: 'xxx',
    originX: 'center',
    originY: 'center',
  } as unknown as Transform;
}

const prepareRectWithGradient = () => {
  const canvas = new Canvas(undefined, { renderOnAddRemove: false });

  canvas.setDimensions({ width: 900, height: 700 });
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
    left: 200,
    top: 200,
  });
  canvas.add(rect);
  canvas.centerObject(rect);

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
      expect(p1).toEqual({ x: 235, y: 327.5 });
    });
    test('places the controls correctly on the second coord point', () => {
      const { rect, gradient } = prepareRectWithGradient();
      const gradientCoordPositionHandler =
        linearGradientCoordPositionHandlerGenerator(gradient, 2);
      p2 = gradientCoordPositionHandler(new Point(), iMatrix, rect);
      expect(p2).toEqual({ x: 415, y: 222.5 });
    });
  });
  describe('linearGradientColorPositionHandlerGenerator', () => {
    test('places the controls correctly along the 2 coords of the gradient', () => {
      const { rect, gradient } = prepareRectWithGradient();
      const gradientColorPositionHandler =
        linearGradientColorPositionHandlerGenerator(gradient, 2);
      color = gradientColorPositionHandler(new Point(), iMatrix, rect);
      expect(color).toEqual({ x: 343, y: 264.5 });
      // CHECK RESULTS OF BEFORE TESTS
      expect(p1.lerp(p2, 0.6)).toEqual(color);
    });
  });
});

describe('action generator', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventData = {} as any;
  describe('color handling', () => {
    test('moves the color point data', () => {
      const { rect, gradient } = prepareRectWithGradient();
      const transform = prepareTransform(rect);
      const actionHandler = linearGradientColorActionHandlerGenerator(
        gradient,
        0,
      );
      rect.dirty = false;
      expect(rect.dirty).toBe(false);
      expect(gradient.colorStops[0].offset).toBe(0.2);
      const returned = actionHandler(eventData, transform, 289, 441);
      expect(rect.dirty).toBe(true);
      expect(returned).toBe(true);
      expect(gradient.colorStops[0].offset).toBeLessThan(0.06);
    });
    test('moves the color point data caps to 0', () => {
      const { rect, gradient } = prepareRectWithGradient();
      const transform = prepareTransform(rect);
      const actionHandler = linearGradientColorActionHandlerGenerator(
        gradient,
        0,
      );
      rect.dirty = false;
      expect(rect.dirty).toBe(false);
      expect(gradient.colorStops[0].offset).toBe(0.2);
      const returned = actionHandler(eventData, transform, 197, 507);
      expect(rect.dirty).toBe(true);
      expect(returned).toBe(true);
      expect(gradient.colorStops[0].offset).toBe(0);
    });
    test('moves the color point data caps to 1', () => {
      const { rect, gradient } = prepareRectWithGradient();
      const transform = prepareTransform(rect);
      const actionHandler = linearGradientColorActionHandlerGenerator(
        gradient,
        0,
      );
      rect.dirty = false;
      expect(rect.dirty).toBe(false);
      expect(gradient.colorStops[0].offset).toBe(0.2);
      const returned = actionHandler(eventData, transform, 719, 204);
      expect(rect.dirty).toBe(true);
      expect(returned).toBe(true);
      expect(gradient.colorStops[0].offset).toBe(1);
    });
  });
  describe('linearGradientCoordsActionHandlerGenerator', () => {
    test('can reloacate x1 and y1', () => {
      const { rect, gradient } = prepareRectWithGradient();
      const transform = prepareTransform(rect);
      const coordActionHandler = linearGradientCoordsActionHandlerGenerator(
        gradient,
        1,
      );
      rect.dirty = false;
      expect(rect.dirty).toBe(false);
      expect(gradient.coords.x1).toBe(20);
      expect(gradient.coords.y1).toBe(20);
      const returned = coordActionHandler(eventData, transform, 600, 400);
      expect(rect.dirty).toBe(true);
      expect(returned).toBe(true);
      expect(gradient.coords.x1).toBe(350);
      expect(gradient.coords.y1).toBe(75);
    });
    test('can reloacate x2 and y2', () => {
      const { rect, gradient } = prepareRectWithGradient();
      const transform = prepareTransform(rect);
      const coordActionHandler = linearGradientCoordsActionHandlerGenerator(
        gradient,
        2,
      );
      rect.dirty = false;
      expect(rect.dirty).toBe(false);
      expect(gradient.coords.x2).toBe(380);
      expect(gradient.coords.y2).toBe(230);
      const returned = coordActionHandler(eventData, transform, 600, 400);
      expect(rect.dirty).toBe(true);
      expect(returned).toBe(true);
      expect(gradient.coords.x2).toBe(350);
      expect(gradient.coords.y2).toBe(75);
    });
  });
});
