import { describe, it, expect } from 'vitest';
import { StaticCanvas } from '../../canvas/StaticCanvas';
import { FabricObject } from './FabricObject';
import { Point } from '../../Point';
import { Rect } from '../Rect';
import { LEFT, TOP } from '../../constants';

describe('fabric.ObjectGeometry', () => {
  const canvas = new StaticCanvas(undefined, { enableRetinaScaling: false });

  it('intersectsWithRectangle without zoom', () => {
    const cObj = new FabricObject({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
    });
    cObj.setCoords();
    expect(cObj.intersectsWithRect).toBeTypeOf('function');

    const point1 = new Point(110, 100),
      point2 = new Point(210, 200),
      point3 = new Point(0, 0),
      point4 = new Point(10, 10);

    expect(cObj.intersectsWithRect(point1, point2)).toBeTruthy();
    expect(cObj.intersectsWithRect(point3, point4)).toBeFalsy();
  });

  it('intersectsWithRectangle with zoom', () => {
    const cObj = new Rect({ left: 20, top: 20, width: 20, height: 20 });
    canvas.add(cObj);
    canvas.viewportTransform = [2, 0, 0, 2, 0, 0];
    cObj.setCoords();
    canvas.calcViewportBoundaries();

    const point1 = new Point(5, 5),
      point2 = new Point(15, 15),
      point3 = new Point(25, 25),
      point4 = new Point(35, 35);

    expect(
      cObj.intersectsWithRect(point1, point2),
      'Does intersect also with a 2x zoom',
    ).toBeTruthy();
    expect(
      cObj.intersectsWithRect(point3, point4),
      'Does intersect also with a 2x zoom',
    ).toBeTruthy();
  });

  it('intersectsWithObject', () => {
    const cObj = new FabricObject({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
    });
    cObj.setCoords();
    expect(cObj.intersectsWithObject).toBeTypeOf('function');

    const cObj2 = new FabricObject({
      left: -50,
      top: -50,
      width: 200,
      height: 200,
    });
    cObj2.setCoords();
    expect(
      cObj.intersectsWithObject(cObj2),
      'cobj2 does intersect with cobj',
    ).toBeTruthy();
    expect(
      cObj2.intersectsWithObject(cObj),
      'cobj2 does intersect with cobj',
    ).toBeTruthy();

    const cObj3 = new FabricObject({
      left: 399,
      top: 356,
      width: 13,
      height: 33,
    });
    cObj3.setCoords();
    expect(
      cObj.intersectsWithObject(cObj3),
      'cobj3 does not intersect with cobj (external)',
    ).toBeFalsy();
    expect(
      cObj3.intersectsWithObject(cObj),
      'cobj3 does not intersect with cobj (external)',
    ).toBeFalsy();

    const cObj4 = new FabricObject({
      left: 100,
      top: 100,
      width: 200,
      height: 200,
    });
    cObj4.setCoords();
    expect(
      cObj4.intersectsWithObject(cObj),
      'overlapping objects are considered intersecting',
    ).toBeTruthy();
    expect(
      cObj.intersectsWithObject(cObj4),
      'overlapping objects are considered intersecting',
    ).toBeTruthy();
  });

  it('isContainedWithinRect', () => {
    const cObj = new FabricObject({ left: 25, top: 25, width: 10, height: 10 });
    cObj.setCoords();
    expect(cObj.isContainedWithinRect).toBeTypeOf('function');

    // fully contained
    expect(
      cObj.isContainedWithinRect(new Point(10, 10), new Point(100, 100)),
    ).toBeTruthy();
    // only intersects
    expect(
      cObj.isContainedWithinRect(new Point(10, 10), new Point(25, 25)),
    ).toBeFalsy();
    // doesn't intersect
    expect(
      cObj.isContainedWithinRect(new Point(100, 100), new Point(110, 110)),
    ).toBeFalsy();
  });

  it('isContainedWithinRect with zoom', () => {
    const cObj = new Rect({ left: 25, top: 25, width: 10, height: 10 });
    canvas.add(cObj);
    canvas.viewportTransform = [2, 0, 0, 2, 0, 0];
    cObj.setCoords();
    canvas.calcViewportBoundaries();
    expect(cObj.isContainedWithinRect).toBeTypeOf('function');

    // fully contained
    expect(
      cObj.isContainedWithinRect(new Point(10, 10), new Point(100, 100)),
    ).toBeTruthy();
    // only intersects
    expect(
      cObj.isContainedWithinRect(new Point(10, 10), new Point(25, 25)),
    ).toBeFalsy();
    // doesn't intersect
    expect(
      cObj.isContainedWithinRect(new Point(100, 100), new Point(110, 110)),
    ).toBeFalsy();
  });

  it('intersectsWithRect', () => {
    const object = new FabricObject({
      left: 20,
      top: 25,
      width: 40,
      height: 50,
      angle: 160,
    });
    const point1 = new Point(-10, -10);
    const point2 = new Point(20, 30);
    const point3 = new Point(10, 15);
    const point4 = new Point(30, 35);
    const point5 = new Point(50, 60);
    const point6 = new Point(70, 80);

    object.setCoords();

    // object and area intersects
    expect(object.intersectsWithRect(point1, point2)).toBe(true);
    // area is contained in object (no intersection)
    expect(object.intersectsWithRect(point3, point4)).toBe(false);
    // area is outside of object (no intersection)
    expect(object.intersectsWithRect(point5, point6)).toBe(false);
  });

  it('intersectsWithObject', () => {
    const object = new FabricObject({
      left: 20,
      top: 30,
      width: 40,
      height: 50,
      angle: 230,
      strokeWidth: 0,
    });
    const object1 = new FabricObject({
      left: 20,
      top: 30,
      width: 60,
      height: 30,
      angle: 10,
      strokeWidth: 0,
    });
    const object2 = new FabricObject({
      left: 25,
      top: 35,
      width: 20,
      height: 20,
      angle: 50,
      strokeWidth: 0,
    });
    const object3 = new FabricObject({
      left: 50,
      top: 50,
      width: 20,
      height: 20,
      angle: 0,
      strokeWidth: 0,
    });

    object.set({ originX: 'center', originY: 'center' }).setCoords();
    object1.set({ originX: 'center', originY: 'center' }).setCoords();
    object2.set({ originX: 'center', originY: 'center' }).setCoords();
    object3.set({ originX: 'center', originY: 'center' }).setCoords();

    expect(
      object.intersectsWithObject(object1),
      'object and object1 intersects',
    ).toBe(true);
    expect(
      object.intersectsWithObject(object2),
      'object2 is contained in object',
    ).toBe(true);
    expect(
      object.intersectsWithObject(object3),
      'object3 is outside of object (no intersection)',
    ).toBe(false);
  });

  it('isContainedWithinObject', () => {
    const object = new FabricObject({
      left: 0,
      top: 0,
      width: 40,
      height: 40,
      angle: 0,
    });
    const object1 = new FabricObject({
      left: 1,
      top: 1,
      width: 38,
      height: 38,
      angle: 0,
    });
    const object2 = new FabricObject({
      left: 20,
      top: 20,
      width: 40,
      height: 40,
      angle: 0,
    });
    const object3 = new FabricObject({
      left: 50,
      top: 50,
      width: 40,
      height: 40,
      angle: 0,
    });

    object.setCoords();
    object1.setCoords();
    object2.setCoords();
    object3.setCoords();

    expect(
      object1.isContainedWithinObject(object),
      'object1 is fully contained within object',
    ).toBe(true);
    expect(
      object2.isContainedWithinObject(object),
      'object2 intersects object (not fully contained)',
    ).toBe(false);
    expect(
      object3.isContainedWithinObject(object),
      'object3 is outside of object (not fully contained)',
    ).toBe(false);
    object1.angle = 45;
    object1.setCoords();
    expect(
      object1.isContainedWithinObject(object),
      'object1 rotated is not contained within object',
    ).toBe(false);

    const rect1 = new Rect({
      width: 50,
      height: 50,
      left: 50,
      top: 50,
    });

    const rect2 = new Rect({
      width: 100,
      height: 100,
      left: 100,
      top: 0,
      angle: 45,
    });
    rect1.setCoords();
    rect2.setCoords();
    expect(
      rect1.isContainedWithinObject(rect2),
      'rect1 rotated is not contained within rect2',
    ).toBe(false);
  });

  it('isContainedWithinRect', () => {
    const object = new FabricObject({
      left: 40,
      top: 40,
      width: 40,
      height: 50,
      angle: 160,
    });
    const point1 = new Point(0, 0);
    const point2 = new Point(80, 80);
    const point3 = new Point(0, 0);
    const point4 = new Point(80, 60);
    const point5 = new Point(80, 80);
    const point6 = new Point(90, 90);

    object.set({ originX: 'center', originY: 'center' }).setCoords();

    // area is contained in object (no intersection)
    expect(object.isContainedWithinRect(point1, point2)).toBe(true);
    // object and area intersects
    expect(object.isContainedWithinRect(point3, point4)).toBe(false);
    // area is outside of object (no intersection)
    expect(object.isContainedWithinRect(point5, point6)).toBe(false);
  });

  it('containsPoint', () => {
    const object = new FabricObject({
      left: 40,
      top: 40,
      width: 40,
      height: 50,
      angle: 160,
      strokeWidth: 0,
    });
    const point1 = new Point(30, 30);
    const point2 = new Point(60, 30);
    const point3 = new Point(45, 65);
    const point4 = new Point(15, 40);
    const point5 = new Point(30, 15);

    object.set({ originX: 'center', originY: 'center' }).setCoords();

    // point1 is contained in object
    expect(object.containsPoint(point1)).toBe(true);
    // point2 is outside of object (right)
    expect(object.containsPoint(point2)).toBe(false);
    // point3 is outside of object (bottom)
    expect(object.containsPoint(point3)).toBe(false);
    // point4 is outside of object (left)
    expect(object.containsPoint(point4)).toBe(false);
    // point5 is outside of object (top)
    expect(object.containsPoint(point5)).toBe(false);
  });

  it('setCoords', () => {
    const cObj = new FabricObject({
      left: 200,
      top: 200,
      width: 100,
      height: 100,
      strokeWidth: 0,
      // @ts-expect-error -- fake canvas
      canvas: {},
    });
    expect(cObj.setCoords).toBeTypeOf('function');
    cObj.setCoords();
    expect(cObj.oCoords.tl.x).toBe(150);
    expect(cObj.oCoords.tl.y).toBe(150);
    expect(cObj.oCoords.tr.x).toBe(250);
    expect(cObj.oCoords.tr.y).toBe(150);
    expect(cObj.oCoords.bl.x).toBe(150);
    expect(cObj.oCoords.bl.y).toBe(250);
    expect(cObj.oCoords.br.x).toBe(250);
    expect(cObj.oCoords.br.y).toBe(250);
    expect(cObj.oCoords.mtr.x).toBe(200);
    expect(cObj.oCoords.mtr.y).toBe(110);

    cObj.set('left', 300).set('top', 300);

    // coords should still correspond to initial one, even after invoking `set`
    expect(cObj.oCoords.tl.x).toBe(150);
    expect(cObj.oCoords.tl.y).toBe(150);
    expect(cObj.oCoords.tr.x).toBe(250);
    expect(cObj.oCoords.tr.y).toBe(150);
    expect(cObj.oCoords.bl.x).toBe(150);
    expect(cObj.oCoords.bl.y).toBe(250);
    expect(cObj.oCoords.br.x).toBe(250);
    expect(cObj.oCoords.br.y).toBe(250);
    expect(cObj.oCoords.mtr.x).toBe(200);
    expect(cObj.oCoords.mtr.y).toBe(110);

    // recalculate coords
    cObj.setCoords();

    // check that coords are now updated
    expect(cObj.oCoords.tl.x).toBe(250);
    expect(cObj.oCoords.tl.y).toBe(250);
    expect(cObj.oCoords.tr.x).toBe(350);
    expect(cObj.oCoords.tr.y).toBe(250);
    expect(cObj.oCoords.bl.x).toBe(250);
    expect(cObj.oCoords.bl.y).toBe(350);
    expect(cObj.oCoords.br.x).toBe(350);
    expect(cObj.oCoords.br.y).toBe(350);
    expect(cObj.oCoords.mtr.x).toBe(300);
    expect(cObj.oCoords.mtr.y).toBe(210);

    cObj.set('padding', 25);
    cObj.setCoords();
    // coords should still correspond to initial one, even after invoking `set`
    expect(cObj.oCoords.tl.x, 'setCoords tl.x padding').toBe(225);
    expect(cObj.oCoords.tl.y, 'setCoords tl.y padding').toBe(225);
    expect(cObj.oCoords.tr.x, 'setCoords tr.x padding').toBe(375);
    expect(cObj.oCoords.tr.y, 'setCoords tr.y padding').toBe(225);
    expect(cObj.oCoords.bl.x, 'setCoords bl.x padding').toBe(225);
    expect(cObj.oCoords.bl.y, 'setCoords bl.y padding').toBe(375);
    expect(cObj.oCoords.br.x, 'setCoords br.x padding').toBe(375);
    expect(cObj.oCoords.br.y, 'setCoords br.y padding').toBe(375);
    expect(cObj.oCoords.mtr.x, 'setCoords mtr.x padding').toBe(300);
    expect(cObj.oCoords.mtr.y, 'setCoords mtr.y padding').toBe(185);
  });

  it('setCoords and aCoords', () => {
    const cObj = new FabricObject({
      left: 200,
      top: 200,
      width: 100,
      height: 100,
      strokeWidth: 0,
    });
    // @ts-expect-error -- partial canvas
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 0, 0],
    };
    cObj.setCoords();

    expect(
      cObj.oCoords.tl.x,
      'oCoords are modified by viewportTransform tl.x',
    ).toBe(300);
    expect(
      cObj.oCoords.tl.y,
      'oCoords are modified by viewportTransform tl.y',
    ).toBe(300);
    expect(
      cObj.oCoords.tr.x,
      'oCoords are modified by viewportTransform tr.x',
    ).toBe(500);
    expect(
      cObj.oCoords.tr.y,
      'oCoords are modified by viewportTransform tr.y',
    ).toBe(300);
    expect(
      cObj.oCoords.bl.x,
      'oCoords are modified by viewportTransform bl.x',
    ).toBe(300);
    expect(
      cObj.oCoords.bl.y,
      'oCoords are modified by viewportTransform bl.y',
    ).toBe(500);
    expect(
      cObj.oCoords.br.x,
      'oCoords are modified by viewportTransform br.x',
    ).toBe(500);
    expect(
      cObj.oCoords.br.y,
      'oCoords are modified by viewportTransform br.y',
    ).toBe(500);
    expect(
      cObj.oCoords.mtr.x,
      'oCoords are modified by viewportTransform mtr.x',
    ).toBe(400);
    expect(
      cObj.oCoords.mtr.y,
      'oCoords are modified by viewportTransform mtr.y',
    ).toBe(260);

    expect(
      cObj.aCoords.tl.x,
      'aCoords do not interfere with viewportTransform',
    ).toBe(150);
    expect(
      cObj.aCoords.tl.y,
      'aCoords do not interfere with viewportTransform',
    ).toBe(150);
    expect(
      cObj.aCoords.tr.x,
      'aCoords do not interfere with viewportTransform',
    ).toBe(250);
    expect(
      cObj.aCoords.tr.y,
      'aCoords do not interfere with viewportTransform',
    ).toBe(150);
    expect(
      cObj.aCoords.bl.x,
      'aCoords do not interfere with viewportTransform',
    ).toBe(150);
    expect(
      cObj.aCoords.bl.y,
      'aCoords do not interfere with viewportTransform',
    ).toBe(250);
    expect(
      cObj.aCoords.br.x,
      'aCoords do not interfere with viewportTransform',
    ).toBe(250);
    expect(
      cObj.aCoords.br.y,
      'aCoords do not interfere with viewportTransform',
    ).toBe(250);
  });

  it('isOnScreen', () => {
    const cObj = new FabricObject({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      strokeWidth: 0,
    });
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    canvas.calcViewportBoundaries();
    // @ts-expect-error -- expects Canvas but we are setting StaticCanvas
    cObj.canvas = canvas;
    cObj.setCoords();
    expect(cObj.isOnScreen()).toBeTruthy();
    cObj.top = 1000;
    expect(cObj.isOnScreen()).toBeTruthy();
    cObj.setCoords();
    expect(cObj.isOnScreen()).toBeFalsy();
    canvas.setZoom(0.1);
    cObj.setCoords();
    expect(cObj.isOnScreen()).toBeTruthy();
  });

  it('isOnScreen flipped vpt', () => {
    const cObj = new FabricObject({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      strokeWidth: 0,
    });
    canvas.viewportTransform = [-1, 0, 0, -1, 0, 0];
    canvas.calcViewportBoundaries();
    // @ts-expect-error -- expects Canvas but we are setting StaticCanvas
    cObj.canvas = canvas;
    cObj.setCoords();
    expect(cObj.isOnScreen()).toBeTruthy();
    cObj.top = 1000;
    expect(cObj.isOnScreen()).toBeTruthy();
    cObj.setCoords();
    expect(cObj.isOnScreen()).toBeFalsy();
    canvas.setZoom(0.1);
    cObj.setCoords();
    expect(cObj.isOnScreen()).toBeTruthy();
  });

  it('transformMatrixKey depends from properties', () => {
    const cObj = new FabricObject({
      left: -10,
      top: -10,
      width: 30,
      height: 40,
      strokeWidth: 0,
    });
    const key1 = cObj.transformMatrixKey();
    cObj.left = 5;
    const key2 = cObj.transformMatrixKey();
    cObj.left = -10;
    const key3 = cObj.transformMatrixKey();
    cObj.width = 5;
    const key4 = cObj.transformMatrixKey();
    expect(key1).not.toEqual(key2);
    expect(key1).toEqual(key3);
    expect(key4).not.toEqual(key2);
    expect(key4).not.toEqual(key1);
    expect(key4).not.toEqual(key3);
  });

  it('transformMatrixKey depends from originX/originY', () => {
    const cObj = new FabricObject({
      left: -10,
      top: -10,
      width: 30,
      height: 40,
      strokeWidth: 0,
      originX: 'left',
      originY: 'top',
    });
    const key1 = cObj.transformMatrixKey();
    cObj.originX = 'center';
    const key2 = cObj.transformMatrixKey();
    cObj.originY = 'center';
    const key3 = cObj.transformMatrixKey();
    expect(key1).not.toEqual(key2);
    expect(key1).not.toEqual(key3);
    expect(key2).not.toEqual(key3);
  });

  it('isOnScreen with object that include canvas', () => {
    const cObj = new FabricObject({
      left: -10,
      top: -10,
      width: canvas.getWidth() + 100,
      height: canvas.getHeight(),
      strokeWidth: 0,
    });
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    canvas.calcViewportBoundaries();
    // @ts-expect-error -- expects Canvas but we are setting StaticCanvas
    cObj.canvas = canvas;
    cObj.setCoords();
    expect(cObj.isOnScreen()).toBe(true);
    cObj.top = -1000;
    cObj.left = -1000;
    cObj.setCoords();
    expect(cObj.isOnScreen()).toBe(false);
  });

  it('isOnScreen with object that is in top left corner of canvas', () => {
    const cObj = new Rect({
      left: -21.56,
      top: 14.23,
      width: 50,
      height: 50,
      angle: 314.57,
    });
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    canvas.calcViewportBoundaries();
    // @ts-expect-error -- expects Canvas but we are setting StaticCanvas
    cObj.canvas = canvas;
    cObj.setCoords();
    expect(cObj.isOnScreen()).toBeTruthy();
    cObj.top -= 20;
    cObj.left -= 20;
    cObj.setCoords();
    expect(cObj.isOnScreen()).toBeFalsy();
  });

  it('calcTransformMatrix with no group', () => {
    const cObj = new FabricObject({ width: 10, height: 15, strokeWidth: 0 });
    expect(cObj.calcTransformMatrix).toBeTypeOf('function');
    cObj.top = 0;
    cObj.left = 0;
    cObj.scaleX = 2;
    cObj.scaleY = 3;
    expect(cObj.calcTransformMatrix()).toEqual(cObj.calcOwnMatrix());
  });

  it('calcOwnMatrix', () => {
    const cObj = new FabricObject({
      width: 10,
      height: 15,
      strokeWidth: 0,
      originX: LEFT,
      originY: TOP,
    });
    expect(cObj.calcOwnMatrix).toBeTypeOf('function');
    cObj.top = 0;
    cObj.left = 0;
    expect(cObj.calcOwnMatrix()).toEqual([1, 0, 0, 1, 5, 7.5]);
    cObj.scaleX = 2;
    cObj.scaleY = 3;
    expect(cObj.calcOwnMatrix()).toEqual([2, 0, 0, 3, 10, 22.5]);
    cObj.skewX = 45;
    expect(cObj.calcOwnMatrix()).toEqual([
      2, 0, 1.9999999999999998, 3, 25, 22.5,
    ]);
    cObj.skewY = 30;
    expect(cObj.calcOwnMatrix()).toEqual([
      3.1547005383792515, 1.7320508075688772, 1.9999999999999998, 3,
      30.773502691896255, 31.160254037844386,
    ]);
    cObj.angle = 38;
    expect(cObj.calcOwnMatrix()).toEqual([
      1.4195809931249126, 3.3071022498267006, -0.2709629187635314,
      3.595355211471482, 5.065683074898075, 43.50067533516962,
    ]);
    cObj.flipX = true;
    expect(cObj.calcOwnMatrix()).toEqual([
      -3.552294904178618, -0.5773529255117364, -3.4230059331904186,
      1.1327093101688495, 5.065683074898075, 43.50067533516962,
    ]);
    cObj.flipY = true;
    expect(cObj.calcOwnMatrix()).toEqual([
      -1.4195809931249126, -3.3071022498267006, 0.2709629187635314,
      -3.595355211471482, 5.065683074898075, 43.50067533516962,
    ]);
  });

  it('scaleToWidth', () => {
    const cObj = new FabricObject({ width: 560, strokeWidth: 0 });
    expect(cObj.scaleToWidth).toBeTypeOf('function');
    cObj.scaleToWidth(100);
    expect(cObj.getScaledWidth()).toBe(100);
    expect(cObj.get('scaleX')).toBe(100 / 560);
  });

  it('scaleToWidth with zoom', () => {
    const cObj = new FabricObject({ width: 560, strokeWidth: 0 });
    // @ts-expect-error -- partial canvas
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 0, 0],
    };
    cObj.scaleToWidth(100);
    expect(cObj.getScaledWidth(), 'is not influenced by zoom - width').toBe(
      100,
    );
    expect(cObj.get('scaleX')).toBe(100 / 560);
  });

  it('scaleToHeight', () => {
    const cObj = new FabricObject({ height: 560, strokeWidth: 0 });
    expect(cObj.scaleToHeight).toBeTypeOf('function');
    cObj.scaleToHeight(100);
    expect(cObj.getScaledHeight()).toBe(100);
    expect(cObj.get('scaleY')).toBe(100 / 560);
  });

  it('scaleToHeight with zoom', () => {
    const cObj = new FabricObject({ height: 560, strokeWidth: 0 });
    // @ts-expect-error -- partial canvas
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 0, 0],
    };
    cObj.scaleToHeight(100);
    expect(cObj.getScaledHeight(), 'is not influenced by zoom - height').toBe(
      100,
    );
    expect(cObj.get('scaleY')).toBe(100 / 560);
  });

  it('scaleToWidth on rotated object', () => {
    const obj = new FabricObject({ height: 100, width: 100, strokeWidth: 0 });
    obj.rotate(45);
    obj.scaleToWidth(200);
    expect(Math.round(obj.getBoundingRect().width)).toBe(200);
  });

  it('scaleToHeight on rotated object', () => {
    const obj = new FabricObject({ height: 100, width: 100, strokeWidth: 0 });
    obj.rotate(45);
    obj.scaleToHeight(300);
    expect(Math.round(obj.getBoundingRect().height)).toBe(300);
  });

  it('getBoundingRect with absolute coords', () => {
    const cObj = new FabricObject({
      strokeWidth: 0,
      width: 10,
      height: 10,
      top: 11,
      left: 10,
    });
    let boundingRect;

    cObj.setCoords();
    boundingRect = cObj.getBoundingRect();
    expect(
      boundingRect.left,
      'gives the bounding rect left with absolute coords',
    ).toBe(5);
    expect(
      boundingRect.width,
      'gives the bounding rect width with absolute coords',
    ).toBe(10);
    expect(
      boundingRect.height,
      'gives the bounding rect height with absolute coords',
    ).toBe(10);
    // @ts-expect-error -- partial canvas
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 0, 0],
    };
    cObj.setCoords();
    boundingRect = cObj.getBoundingRect();
    expect(
      boundingRect.left,
      'gives the bounding rect left with absolute coords, regardless of vpt',
    ).toBe(5);
    expect(
      boundingRect.width,
      'gives the bounding rect width with absolute coords, regardless of vpt',
    ).toBe(10);
    expect(
      boundingRect.height,
      'gives the bounding rect height with absolute coords, regardless of vpt',
    ).toBe(10);
  });

  it('getBoundingRect', () => {
    const cObj = new FabricObject({ strokeWidth: 0 });
    let boundingRect;
    expect(cObj.getBoundingRect).toBeTypeOf('function');

    cObj.setCoords();
    boundingRect = cObj.getBoundingRect();
    expect(boundingRect.left).toBe(0);
    expect(boundingRect.top).toBe(0);
    expect(boundingRect.width).toBe(0);
    expect(boundingRect.height).toBe(0);
    cObj.set('width', 123).setCoords();
    boundingRect = cObj.getBoundingRect();
    expect(boundingRect.left).toBe(-61.5);
    expect(boundingRect.top).toBe(0);
    expect(boundingRect.width).toBe(123);
    expect(boundingRect.height).toBe(0);

    cObj.set('height', 167);
    cObj.setCoords();
    boundingRect = cObj.getBoundingRect();
    expect(boundingRect.left).toBe(-61.5);
    expect(boundingRect.top).toBe(-83.5);
    expect(boundingRect.width).toBe(123);
    expect(boundingRect.height).toBe(167);

    cObj.scale(2);
    cObj.setCoords();
    boundingRect = cObj.getBoundingRect();
    expect(boundingRect.left).toBe(-123);
    expect(boundingRect.top).toBe(-167);
    expect(boundingRect.width).toBe(246);
    expect(boundingRect.height).toBe(334);
  });

  it('getBoundingRect with stroke', () => {
    const cObj = new FabricObject();
    let boundingRect;
    expect(cObj.getBoundingRect).toBeTypeOf('function');

    cObj.setCoords();
    boundingRect = cObj.getBoundingRect();
    expect(Number(boundingRect.left.toFixed(2))).toBe(-0.5);
    expect(Number(boundingRect.top.toFixed(2))).toBe(-0.5);
    expect(Number(boundingRect.width.toFixed(2))).toBe(1);
    expect(Number(boundingRect.height.toFixed(2))).toBe(1);

    cObj.set('width', 123);
    cObj.setCoords();
    boundingRect = cObj.getBoundingRect();
    expect(Number(boundingRect.left.toFixed(2))).toBe(-62);
    expect(Number(boundingRect.top.toFixed(2))).toBe(-0.5);
    expect(Number(boundingRect.width.toFixed(2))).toBe(124);
    expect(Number(boundingRect.height.toFixed(2))).toBe(1);

    cObj.set('height', 167);
    cObj.setCoords();
    boundingRect = cObj.getBoundingRect();
    expect(Number(boundingRect.left.toFixed(2))).toBe(-62);
    expect(Number(boundingRect.top.toFixed(2))).toBe(-84);
    expect(Number(boundingRect.width.toFixed(2))).toBe(124);
    expect(Number(boundingRect.height.toFixed(2))).toBe(168);

    cObj.scale(2);
    cObj.setCoords();
    boundingRect = cObj.getBoundingRect();
    expect(Number(boundingRect.left.toFixed(2))).toBe(-124);
    expect(Number(boundingRect.top.toFixed(2))).toBe(-168);
    expect(Number(boundingRect.width.toFixed(2))).toBe(248);
    expect(Number(boundingRect.height.toFixed(2))).toBe(336);
  });

  it('getScaledWidth', () => {
    const cObj = new FabricObject();
    expect(cObj.getScaledWidth).toBeTypeOf('function');
    expect(cObj.getScaledWidth()).toBe(0 + cObj.strokeWidth);
    cObj.set('width', 123);
    expect(cObj.getScaledWidth()).toBe(123 + cObj.strokeWidth);
    cObj.set('scaleX', 2);
    expect(cObj.getScaledWidth()).toBe(246 + cObj.strokeWidth * 2);
  });

  it('getScaledHeight', () => {
    const cObj = new FabricObject({ strokeWidth: 0 });
    expect(cObj.getScaledHeight()).toBe(0);
    cObj.set('height', 123);
    expect(cObj.getScaledHeight()).toBe(123);
    cObj.set('scaleY', 2);
    expect(cObj.getScaledHeight()).toBe(246);
  });

  it('scale', () => {
    const cObj = new FabricObject({ width: 10, height: 15, strokeWidth: 0 });
    expect(cObj.scale).toBeTypeOf('function');
  });

  it('_constrainScale', () => {
    const cObj = new FabricObject({ width: 10, height: 15, strokeWidth: 0 });
    expect(cObj._constrainScale).toBeTypeOf('function');
    cObj.set('scaleX', 0);
    expect(cObj.scaleX).toBe(0.0001);
    cObj.set('scaleY', 0);
    expect(cObj.scaleY).toBe(0.0001);
    cObj.minScaleLimit = 3;
    cObj.set('scaleY', 0);
    expect(cObj.scaleY).toBe(3);
  });

  it('getCoords return coordinate of object in scene coordinate.', () => {
    const cObj = new FabricObject({
      width: 10,
      height: 15,
      strokeWidth: 2,
      top: 38.5,
      left: 46,
    });
    const coords = cObj.getCoords();
    expect(coords[0]).toEqual(new Point(40, 30));
    expect(coords[1]).toEqual(new Point(52, 30));
    expect(coords[2]).toEqual(new Point(52, 47));
    expect(coords[3]).toEqual(new Point(40, 47));

    cObj.left += 5;
    const newCoords = cObj.getCoords();
    expect(newCoords[0]).toEqual(new Point(40, 30));
    expect(newCoords[1]).toEqual(new Point(52, 30));
    expect(newCoords[2]).toEqual(new Point(52, 47));
    expect(newCoords[3]).toEqual(new Point(40, 47));

    cObj.setCoords();
    const updatedCoords = cObj.getCoords();
    expect(updatedCoords[0]).toEqual(new Point(45, 30));
    expect(updatedCoords[1]).toEqual(new Point(57, 30));
    expect(updatedCoords[2]).toEqual(new Point(57, 47));
    expect(updatedCoords[3]).toEqual(new Point(45, 47));
  });

  it('getCoords return coordinate of object in scene coordinates and is not affected by viewport', () => {
    const cObj = new FabricObject({
      width: 10,
      height: 15,
      strokeWidth: 2,
      top: 38.5,
      left: 46,
    });
    // @ts-expect-error -- partial canvas
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 35, 35],
    };
    const coords = cObj.getCoords();
    expect(coords[0]).toEqual(new Point(40, 30));
    expect(coords[1]).toEqual(new Point(52, 30));
    expect(coords[2]).toEqual(new Point(52, 47));
    expect(coords[3]).toEqual(new Point(40, 47));
  });

  it('getCoords with angle', () => {
    const cObj = new FabricObject({
      width: 10,
      height: 15,
      strokeWidth: 2,
      top: 30,
      left: 40,
      angle: 20,
    });
    // the viewport is non influent.
    // @ts-expect-error -- partial canvas
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 35, 25],
    };
    const coords = cObj.getCoords();
    expect(coords).toMatchSnapshot();
  });

  it('getCoords with skewX', () => {
    const cObj = new FabricObject({
      width: 10,
      height: 15,
      strokeWidth: 2,
      top: 30,
      left: 49,
      skewX: 45,
    });
    // the viewport is non influent.
    // @ts-expect-error -- partial canvas
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 35, 25],
    };
    const coords = cObj.getCoords();
    expect(coords).toMatchInlineSnapshot(`
      [
        Point {
          "x": 34.5,
          "y": 21.5,
        },
        Point {
          "x": 63.5,
          "y": 21.5,
        },
        Point {
          "x": 63.5,
          "y": 38.5,
        },
        Point {
          "x": 34.5,
          "y": 38.5,
        },
      ]
    `);
  });

  it('getCoords with skewY', () => {
    const cObj = new FabricObject({
      width: 10,
      height: 15,
      strokeWidth: 2,
      top: 30,
      left: 40,
      skewY: 45,
    });
    // the viewport is non influent.
    // @ts-expect-error -- partial canvas
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 35, 25],
    };
    const coords = cObj.getCoords();
    expect(coords).toMatchInlineSnapshot(`
      [
        Point {
          "x": 34,
          "y": 15.5,
        },
        Point {
          "x": 46,
          "y": 15.5,
        },
        Point {
          "x": 46,
          "y": 44.5,
        },
        Point {
          "x": 34,
          "y": 44.5,
        },
      ]
    `);
  });

  it('getCoords with skewY skewX angle', () => {
    const cObj = new FabricObject({
      width: 10,
      height: 15,
      strokeWidth: 2,
      top: 30,
      left: 40,
      skewY: 45,
      skewX: 30,
      angle: 90,
    });
    // the viewport is non influent.
    // @ts-expect-error -- partial canvas
    cObj.canvas = {
      viewportTransform: [2, 0, 0, 2, 35, 25],
    };
    const coords = cObj.getCoords();
    expect(coords).toMatchInlineSnapshot(`
      [
        Point {
          "x": 54.5,
          "y": 15.628421096750428,
        },
        Point {
          "x": 54.5,
          "y": 44.37157890324957,
        },
        Point {
          "x": 25.5,
          "y": 44.37157890324957,
        },
        Point {
          "x": 25.5,
          "y": 15.628421096750428,
        },
      ]
    `);
  });

  it('isPartiallyOnScreen', () => {
    const cObj = new FabricObject({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      strokeWidth: 0,
    });
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    canvas.calcViewportBoundaries();
    // @ts-expect-error -- expects Canvas but we are setting StaticCanvas
    cObj.canvas = canvas;
    cObj.left = -10;
    cObj.top = -10;
    cObj.setCoords();
    expect(cObj.isPartiallyOnScreen(), 'object is partially onScreen').toBe(
      true,
    );
    cObj.left = -60;
    cObj.top = -60;
    cObj.setCoords();
    expect(
      cObj.isPartiallyOnScreen(),
      'object is completely offScreen and not partial',
    ).toBe(false);
    cObj.left = 95;
    cObj.top = 95;
    cObj.setCoords();
    expect(
      cObj.isPartiallyOnScreen(),
      'object is completely on screen and not partial',
    ).toBe(false);
    canvas.setZoom(2);
    expect(
      cObj.isPartiallyOnScreen(),
      'after zooming object is partially onScreen and offScreen',
    ).toBe(true);
  });

  it('isPartiallyOnScreen with object inside and outside of canvas', () => {
    const cObj = new FabricObject({
      left: 55,
      top: 55,
      width: 100,
      height: 100,
      strokeWidth: 0,
    });
    // @ts-expect-error -- expects Canvas but we are setting StaticCanvas
    cObj.canvas = new StaticCanvas(undefined, {
      width: 120,
      height: 120,
      enableRetinaScaling: false,
    });
    cObj.canvas!.calcViewportBoundaries();
    expect(cObj.isPartiallyOnScreen(), 'object is completely onScreen').toBe(
      false,
    );
    cObj.left = 60;
    cObj.top = 60;
    cObj.scaleX = 2;
    cObj.scaleY = 2;
    cObj.setCoords();
    expect(
      cObj.isPartiallyOnScreen(),
      'object has all corners outside screen but contains canvas',
    ).toBe(true);
  });
});
