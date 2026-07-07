import { FabricObject } from '../shapes/Object/FabricObject';
import { Point } from '../Point';
import { Canvas } from './Canvas';
import { Group } from '../shapes/Group';
import { ActiveSelection } from '../shapes/ActiveSelection';

import { describe, expect, it, test, vi } from 'vitest';

describe('Selectable Canvas', () => {
  describe('_pointIsInObjectSelectionArea', () => {
    it('points and selection area', () => {
      const object = new FabricObject({
        left: 60,
        top: 65,
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
        left: 10,
        top: 10,
        width: 10,
        height: 10,
        padding: 5,
        strokeWidth: 0,
      });

      const object2 = new FabricObject({
        left: 40,
        top: 40,
        width: 10,
        height: 10,
        padding: 5,
        strokeWidth: 0,
      });

      const canvas = new Canvas(undefined, { renderOnAddRemove: false });
      const group = new Group([object, object2], { scaleX: 2, scaleY: 2 });
      group.setPositionByOrigin(new Point(5, 5), 'left', 'top');
      canvas.add(group);

      for (let y = -1; y <= 31; y++) {
        for (let x = -1; x <= 31; x++) {
          expect(
            canvas['_pointIsInObjectSelectionArea'](object, new Point(x, y)),
          ).toBe(x >= 0 && x <= 30 && y >= 0 && y <= 30);
        }
      }
    });
  });

  describe('searchPossibleTargets', () => {
    test('the target returned will stop at the first non interactive container', () => {
      const object = new FabricObject({
        id: 'a',
        left: 0,
        top: 0,
        width: 10,
        height: 10,
        padding: 0,
        strokeWidth: 0,
      });
      const groupB = new Group([object], {
        id: 'b',
        interactive: true,
        subTargetCheck: true,
      });
      const groupC = new Group([groupB], {
        id: 'c',
        interactive: false,
        subTargetCheck: true,
      });
      const groupD = new Group([groupC], {
        id: 'd',
        interactive: true,
        subTargetCheck: true,
      });
      const canvas = new Canvas(undefined, { renderOnAddRemove: false });
      canvas.add(groupD);
      const { target, subTargets } = canvas.searchPossibleTargets(
        canvas.getObjects(),
        groupD.getCenterPoint(),
      );
      expect(target).toBe(groupC);
      expect(subTargets.map((obj) => obj.id)).toEqual(['a', 'b', 'c']);
    });
    test('a interactive group covered by a non interactive group wont be selected', () => {
      const object = new FabricObject({
        id: 'a',
        left: 0,
        top: 0,
        width: 10,
        height: 10,
        padding: 0,
        strokeWidth: 0,
      });
      const groupB = new Group([object], {
        id: 'b',
        interactive: true,
        subTargetCheck: true,
      });
      const groupC = new Group([groupB], {
        id: 'c',
        interactive: false,
        subTargetCheck: true,
      });
      const groupD = new Group([groupC], {
        id: 'd',
        interactive: true,
        subTargetCheck: true,
      });
      const groupE = new Group([groupD], {
        id: 'e',
        interactive: true,
        subTargetCheck: true,
      });
      const canvas = new Canvas(undefined, { renderOnAddRemove: false });
      canvas.add(groupE);
      const { target, subTargets } = canvas.searchPossibleTargets(
        canvas.getObjects(),
        groupD.getCenterPoint(),
      );
      expect(target).toBe(groupC);
      expect(subTargets.map((obj) => obj.id)).toEqual(['a', 'b', 'c', 'd']);
    });

    test('nested non interactive groups with subTargetCheck', () => {
      const object = new FabricObject({
        left: 0,
        top: 0,
        width: 10,
        height: 10,
        padding: 0,
        strokeWidth: 0,
      });

      const object2 = new FabricObject({
        left: 20,
        top: 0,
        width: 10,
        height: 10,
        padding: 0,
        strokeWidth: 0,
      });

      const object3 = new FabricObject({
        left: 40,
        top: 0,
        width: 10,
        height: 10,
        padding: 0,
        strokeWidth: 0,
      });

      const nestedGroup = new Group([object2, object3], {
        interactive: false,
        subTargetCheck: true,
      });

      const canvas = new Canvas(undefined, { renderOnAddRemove: false });
      const group = new Group([object, nestedGroup], {
        interactive: true,
        subTargetCheck: true,
      });
      canvas.add(group);

      const object2Position = object2.getCenterPoint();
      const { target } = canvas.searchPossibleTargets(
        canvas.getObjects(),
        object2Position,
      );
      expect(target).toBe(nestedGroup);

      nestedGroup.set({ interactive: true });
      const { target: nestedTarget } = canvas.searchPossibleTargets(
        canvas.getObjects(),
        object2Position,
      );
      expect(nestedTarget).toBe(object2);
    });
  });

  describe('setupCurrentTransform', () => {
    test.each(
      ['tl', 'mt', 'tr', 'mr', 'br', 'mb', 'bl', 'ml', 'mtr']
        .map((controlKey) => [
          { controlKey, zoom: false },
          { controlKey, zoom: true },
        ])
        .flat(),
    )('should fire before:transform event %p', ({ controlKey, zoom }) => {
      const canvas = new Canvas();
      const canvasOffset = canvas.calcOffset();
      const object = new FabricObject({
        left: 50,
        top: 50,
        width: 50,
        height: 50,
      });
      canvas.add(object);
      canvas.setActiveObject(object);
      zoom && canvas.zoomToPoint(new Point(25, 25), 2);
      expect(canvas._currentTransform).toBeFalsy();

      const spy = vi.fn();
      canvas.on('before:transform', spy);
      const setupCurrentTransformSpy = vi.spyOn(
        canvas,
        '_setupCurrentTransform',
      );

      const {
        corner: { tl, tr, bl },
      } = object.oCoords[controlKey];
      canvas.getSelectionElement().dispatchEvent(
        new MouseEvent('mousedown', {
          clientX: canvasOffset.left + (tl.x + tr.x) / 2,
          clientY: canvasOffset.top + (tl.y + bl.y) / 2,
          which: 1,
        }),
      );

      expect(setupCurrentTransformSpy).toHaveBeenCalledTimes(1);
      expect(canvas._currentTransform).toBeDefined();
      expect(canvas._currentTransform).toHaveProperty('target', object);
      expect(canvas._currentTransform).toHaveProperty('corner', controlKey);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('_discardActiveObject', () => {
    test('will clear hovered target if the target is the active selection', () => {
      const objects = [new FabricObject(), new FabricObject()];
      const canvas = new Canvas();
      canvas.add(...objects);
      const as = new ActiveSelection(objects);
      as.canvas = canvas;
      canvas._hoveredTarget = as;
      canvas.setActiveObject(as);
      expect(canvas._activeObject).toBe(as);
      expect(canvas._hoveredTarget).toBe(as);
      canvas.discardActiveObject();
      expect(canvas._activeObject).toBe(undefined);
      expect(canvas._hoveredTarget).toBe(undefined);
    });
  });
});
