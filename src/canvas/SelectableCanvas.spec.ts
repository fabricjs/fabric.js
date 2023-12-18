import { FabricObject } from '../shapes/Object/FabricObject';
import { Point } from '../Point';
import { Canvas } from './Canvas';
import { Group } from '../shapes/Group';

describe('Selectable Canvas', () => {
  describe('_pointIsInObjectSelectionArea', () => {
    it('points and selection area', () => {
      const object = new FabricObject({
        left: 40,
        top: 40,
        width: 40,
        height: 50,
        angle: 0,
        padding: 0,
      });

      const canvas = new Canvas(undefined, { renderOnAddRemove: false });
      canvas.add(object);

      // point1 is outside object because object starts at 40,40
      const point1 = new Point(30, 30);
      expect(canvas._pointIsInObjectSelectionArea(object, point1)).toBe(false);
      // point2 is contained in object
      const point2 = new Point(40, 40);
      expect(canvas._pointIsInObjectSelectionArea(object, point2)).toBe(true);
      // point3 is contained of object
      const point3 = new Point(65, 50);
      expect(canvas._pointIsInObjectSelectionArea(object, point3)).toBe(true);
      // point4 is outside of object (bottom)
      const point4 = new Point(45, 95);
      expect(canvas._pointIsInObjectSelectionArea(object, point4)).toBe(false);
      // point5 is outside of object (top)
      const point5 = new Point(50, 30);
      expect(canvas._pointIsInObjectSelectionArea(object, point5)).toBe(false);
      // point6 is outside of object (right)
      const point6 = new Point(90, 45);
      expect(canvas._pointIsInObjectSelectionArea(object, point6)).toBe(false);
    });
    it('points and selection area, with rotation', () => {
      const object = new FabricObject({
        left: 25,
        top: 20,
        width: 40,
        height: 50,
        angle: 90,
        padding: 0,
        originX: 'center',
        originY: 'center',
      });

      const canvas = new Canvas(undefined, { renderOnAddRemove: false });
      canvas.add(object);

      // point1 is contained in object top left
      const point1 = new Point(0, 0);
      expect(canvas._pointIsInObjectSelectionArea(object, point1)).toBe(true);
      // point2 is contained in object bottom right
      const point2 = new Point(50, 40);
      expect(canvas._pointIsInObjectSelectionArea(object, point2)).toBe(true);
      // point3 is outside of object (bottom) because object is rotate
      const point3 = new Point(20, 41);
      expect(canvas._pointIsInObjectSelectionArea(object, point3)).toBe(false);
      // point4 is outside of object (right)
      const point4 = new Point(51, 25);
      expect(canvas._pointIsInObjectSelectionArea(object, point4)).toBe(false);
      // point5 is outside of object (top left)
      const point5 = new Point(-1, -1);
      expect(canvas._pointIsInObjectSelectionArea(object, point5)).toBe(false);
    });
    it('points and selection area, with rotation and scaling', () => {
      const object = new FabricObject({
        left: 50,
        top: 40,
        width: 40,
        height: 50,
        angle: 90,
        padding: 0,
        scaleX: 2,
        scaleY: 2,
        originX: 'center',
        originY: 'center',
      });

      const canvas = new Canvas(undefined, { renderOnAddRemove: false });
      canvas.add(object);

      // point1 is contained in object top left
      const point1 = new Point(0, 0);
      expect(canvas._pointIsInObjectSelectionArea(object, point1)).toBe(true);
      // point2 is contained in object bottom right
      const point2 = new Point(100, 80);
      expect(canvas._pointIsInObjectSelectionArea(object, point2)).toBe(true);
      // point3 is outside of object (bottom) because object is rotate
      const point3 = new Point(40, 82);
      expect(canvas._pointIsInObjectSelectionArea(object, point3)).toBe(false);
      // point4 is outside of object (right)
      const point4 = new Point(102, 50);
      expect(canvas._pointIsInObjectSelectionArea(object, point4)).toBe(false);
      // point5 is outside of object (top left)
      const point5 = new Point(-2, -2);
      expect(canvas._pointIsInObjectSelectionArea(object, point5)).toBe(false);
    });
    it('points and selection area, with rotation and scaling and the strokeWidth', () => {
      const object = new FabricObject({
        left: 50,
        top: 40,
        width: 40,
        height: 50,
        angle: 90,
        padding: 0,
        scaleX: 2,
        scaleY: 2,
        strokeWidth: 2,
        originX: 'center',
        originY: 'center',
      });

      const canvas = new Canvas(undefined, { renderOnAddRemove: false });
      canvas.add(object);

      // point1 is contained in object top left
      const point1 = new Point(-2, -2);
      expect(canvas._pointIsInObjectSelectionArea(object, point1)).toBe(true);
      // point2 is contained in object bottom right
      const point2 = new Point(102, 82);
      expect(canvas._pointIsInObjectSelectionArea(object, point2)).toBe(true);
      // point3 is outside of object (bottom) because object is rotate
      const point3 = new Point(40, 83);
      expect(canvas._pointIsInObjectSelectionArea(object, point3)).toBe(false);
      // point4 is outside of object (right)
      const point4 = new Point(103, 50);
      expect(canvas._pointIsInObjectSelectionArea(object, point4)).toBe(false);
      // point5 is outside of object (top left)
      const point5 = new Point(-3, -3);
      expect(canvas._pointIsInObjectSelectionArea(object, point5)).toBe(false);
    });
    it('points and selection area, with rotation and scaling and the strokeWidth and strokeUniform', () => {
      const object = new FabricObject({
        left: 50,
        top: 40,
        width: 40,
        height: 50,
        angle: 90,
        padding: 0,
        scaleX: 2,
        scaleY: 2,
        strokeWidth: 2,
        strokeUniform: true,
        originX: 'center',
        originY: 'center',
      });

      const canvas = new Canvas(undefined, { renderOnAddRemove: false });
      canvas.add(object);

      // point1 is contained in object top left
      const point1 = new Point(-1, -1);
      expect(canvas._pointIsInObjectSelectionArea(object, point1)).toBe(true);
      // point2 is contained in object bottom right
      const point2 = new Point(101, 81);
      expect(canvas._pointIsInObjectSelectionArea(object, point2)).toBe(true);
      // point3 is outside of object (bottom) because object is rotate
      const point3 = new Point(40, 82);
      expect(canvas._pointIsInObjectSelectionArea(object, point3)).toBe(false);
      // point4 is outside of object (right)
      const point4 = new Point(102, 50);
      expect(canvas._pointIsInObjectSelectionArea(object, point4)).toBe(false);
      // point5 is outside of object (top left)
      const point5 = new Point(-2, -2);
      expect(canvas._pointIsInObjectSelectionArea(object, point5)).toBe(false);
    });
    it('points and selection area, with rotation and scaling and the strokeWidth and strokeUniform and padding', () => {
      const object = new FabricObject({
        left: 50,
        top: 40,
        width: 40,
        height: 50,
        angle: 90,
        padding: 5,
        scaleX: 2,
        scaleY: 2,
        strokeWidth: 2,
        strokeUniform: true,
        originX: 'center',
        originY: 'center',
      });

      const canvas = new Canvas(undefined, { renderOnAddRemove: false });
      canvas.add(object);

      // point1 is contained in object top left
      const point1 = new Point(-6, -6);
      expect(canvas._pointIsInObjectSelectionArea(object, point1)).toBe(true);
      // point2 is contained in object bottom right padding area
      const point2 = new Point(106, 86);
      expect(canvas._pointIsInObjectSelectionArea(object, point2)).toBe(true);
      // point3 is outside of object (bottom) because object is rotate
      const point3 = new Point(40, 88);
      expect(canvas._pointIsInObjectSelectionArea(object, point3)).toBe(false);
      // point4 is outside of object (right)
      const point4 = new Point(108, 50);
      expect(canvas._pointIsInObjectSelectionArea(object, point4)).toBe(false);
      // point5 is outside of object (top left)
      const point5 = new Point(-7, -7);
      expect(canvas._pointIsInObjectSelectionArea(object, point5)).toBe(false);
    });
    it('points and selection area, with rotation and scaling and the strokeWidth and padding', () => {
      const object = new FabricObject({
        left: 50,
        top: 40,
        width: 40,
        height: 50,
        angle: 90,
        padding: 5,
        scaleX: 2,
        scaleY: 2,
        strokeWidth: 2,
        originX: 'center',
        originY: 'center',
      });

      const canvas = new Canvas(undefined, { renderOnAddRemove: false });
      canvas.add(object);

      // point1 is contained in object top left
      const point1 = new Point(-7, -7);
      expect(canvas._pointIsInObjectSelectionArea(object, point1)).toBe(true);
      // point2 is contained in object bottom right padding area
      const point2 = new Point(107, 87);
      expect(canvas._pointIsInObjectSelectionArea(object, point2)).toBe(true);
      // point3 is outside of object (bottom) because object is rotate
      const point3 = new Point(40, 88);
      expect(canvas._pointIsInObjectSelectionArea(object, point3)).toBe(false);
      // point4 is outside of object (right)
      const point4 = new Point(107, 50);
      expect(canvas._pointIsInObjectSelectionArea(object, point4)).toBe(false);
      // point5 is outside of object (top left)
      const point5 = new Point(-8, -8);
      expect(canvas._pointIsInObjectSelectionArea(object, point5)).toBe(false);
    });
    it('points and selection area, with the strokeWidth and padding', () => {
      const object = new FabricObject({
        left: 20,
        top: 25,
        width: 40,
        height: 50,
        padding: 5,
        strokeWidth: 2,
        originX: 'center',
        originY: 'center',
      });

      const canvas = new Canvas(undefined, { renderOnAddRemove: false });
      canvas.add(object);

      // point1 is contained in object top left
      const point1 = new Point(-6, -6);
      expect(canvas._pointIsInObjectSelectionArea(object, point1)).toBe(true);
      // point2 is contained in object bottom right padding area
      const point2 = new Point(46, 56);
      expect(canvas._pointIsInObjectSelectionArea(object, point2)).toBe(true);
      // point3 is outside of object (bottom) because object is rotate
      const point3 = new Point(20, 57);
      expect(canvas._pointIsInObjectSelectionArea(object, point3)).toBe(false);
      // point4 is outside of object (right)
      const point4 = new Point(47, 20);
      expect(canvas._pointIsInObjectSelectionArea(object, point4)).toBe(false);
      // point5 is outside of object (top left)
      const point5 = new Point(-7, -7);
      expect(canvas._pointIsInObjectSelectionArea(object, point5)).toBe(false);
    });
    it('points and selection area, group transformation and padding', () => {
      const object = new FabricObject({
        left: 5,
        top: 5,
        width: 10,
        height: 10,
        padding: 5,
        strokeWidth: 0,
      });

      const object2 = new FabricObject({
        left: 35,
        top: 35,
        width: 10,
        height: 10,
        padding: 5,
        strokeWidth: 0,
      });

      const canvas = new Canvas(undefined, { renderOnAddRemove: false });
      const group = new Group([object, object2], { scaleX: 2, scaleY: 2 });
      canvas.add(group);

      for (let y = -1; y <= 31; y++) {
        for (let x = -1; x <= 31; x++) {
          expect(
            canvas['_pointIsInObjectSelectionArea'](object, new Point(x, y))
          ).toBe(x >= 0 && x <= 30 && y >= 0 && y <= 30);
        }
      }
    });
  });
});
