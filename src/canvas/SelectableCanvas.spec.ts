import { FabricObject } from '../shapes/Object/FabricObject';
import { Point } from '../Point';
import { Canvas } from './Canvas';

describe('Selectable Canvas', () => {
  describe('_pointIsInObjectSelectionArea', () => {
    it('points are correct, including padding', () => {
      const object = new FabricObject({
        left: 40,
        top: 40,
        width: 40,
        height: 50,
        angle: 160,
        padding: 5,
      });
      const point1 = new Point(30, 30);
      const point2 = new Point(10, 20);
      const point3 = new Point(65, 30);
      const point4 = new Point(45, 75);
      const point5 = new Point(10, 40);
      const point6 = new Point(30, 5);

      object.set({ originX: 'center', originY: 'center' }).setCoords();

      const canvas = new Canvas(undefined, { renderOnAddRemove: false });
      canvas.add(object);

      // TODO: rework the test with a public method
      // point1 is contained in object
      expect(canvas._pointIsInObjectSelectionArea(object, point1)).toBe(true);
      // point2 is contained in object (padding area)
      expect(canvas._pointIsInObjectSelectionArea(object, point2)).toBe(true);
      // point3 is outside of object (bottom)
      expect(canvas._pointIsInObjectSelectionArea(object, point3)).toBe(false);
      // point4 is outside of object (left)
      expect(canvas._pointIsInObjectSelectionArea(object, point4)).toBe(false);
      // point5 is outside of object (top)
      expect(canvas._pointIsInObjectSelectionArea(object, point5)).toBe(false);
      expect(canvas._pointIsInObjectSelectionArea(object, point6)).toBe(false);
    });
  });
});
