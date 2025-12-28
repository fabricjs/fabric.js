import { Canvas } from '../canvas/Canvas';
import { Intersection } from '../Intersection';
import { Point } from '../Point';
import { FabricObject } from '../shapes/Object/FabricObject';
import { Control } from './Control';

import { describe, expect, test, vi } from 'vitest';

describe('Controls', () => {
  test('method binding', () => {
    const actionHandler = vi.fn();
    const mouseDownHandler = vi.fn();
    const mouseUpHandler = vi.fn();

    const control = new Control({
      actionHandler,
      mouseDownHandler,
      mouseUpHandler,
    });

    const target = new FabricObject({
      controls: { test: control, test2: control },
      canvas: new Canvas(),
    });

    target.setCoords();

    vi.spyOn(target, 'findControl').mockImplementation(function (
      this: FabricObject,
    ) {
      this.__corner = 'test';

      return { key: 'test', control };
    });

    const canvas = new Canvas();
    canvas.setActiveObject(target);

    const downEvent = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    const moveEvent = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
    const upEvent = new MouseEvent('mouseup', { clientX: 0, clientY: 0 });

    canvas.getSelectionElement().dispatchEvent(downEvent);
    // eslint-disable-next-line no-restricted-globals
    const doc = document;
    doc.dispatchEvent(moveEvent);
    canvas._currentTransform!.corner = 'test2';
    doc.dispatchEvent(upEvent);

    expect(mouseDownHandler.mock.contexts).toEqual([control]);
    expect(actionHandler.mock.contexts).toEqual([control]);
    expect(mouseUpHandler.mock.contexts).toEqual([control, control]);
  });

  test('corners coords definition order', () => {
    const control = new Control({ sizeX: 20, sizeY: 20 });
    const coords = control.calcCornerCoords(
      0,
      0,
      10,
      10,
      false,
      new FabricObject(),
    );

    expect(
      Intersection.isPointInPolygon(new Point(15, 10), Object.values(coords)),
    ).toBe(true);
  });

  describe('commonRenderProps', () => {
    const createMockContext = () =>
      ({
        fillStyle: '',
        strokeStyle: '',
        translate: vi.fn(),
        rotate: vi.fn(),
      }) as unknown as CanvasRenderingContext2D;

    test('returns default values from fabricObject', () => {
      const control = new Control();
      const ctx = createMockContext();
      const fabricObject = new FabricObject({
        cornerSize: 13,
        cornerColor: 'blue',
        transparentCorners: false,
        cornerStrokeColor: 'red',
      });

      const result = control.commonRenderProps(ctx, 10, 20, fabricObject);

      expect(result).toEqual({
        stroke: true,
        xSize: 13,
        ySize: 13,
        transparentCorners: false,
        opName: 'fill',
      });
      expect(ctx.fillStyle).toBe('blue');
      expect(ctx.strokeStyle).toBe('red');
      expect(ctx.translate).toHaveBeenCalledWith(10, 20);
      expect(ctx.rotate).toHaveBeenCalled();
    });

    test('uses control sizeX and sizeY when set', () => {
      const control = new Control({ sizeX: 20, sizeY: 30 });
      const ctx = createMockContext();
      const fabricObject = new FabricObject({ cornerSize: 13 });

      const result = control.commonRenderProps(ctx, 0, 0, fabricObject);

      expect(result.xSize).toBe(20);
      expect(result.ySize).toBe(30);
    });

    test('styleOverride takes precedence over fabricObject properties', () => {
      const control = new Control();
      const ctx = createMockContext();
      const fabricObject = new FabricObject({
        cornerSize: 13,
        cornerColor: 'blue',
        transparentCorners: false,
        cornerStrokeColor: 'red',
      });

      const result = control.commonRenderProps(ctx, 0, 0, fabricObject, {
        cornerSize: 25,
        cornerColor: 'green',
        transparentCorners: true,
        cornerStrokeColor: 'yellow',
      });

      expect(result).toEqual({
        stroke: false,
        xSize: 25,
        ySize: 25,
        transparentCorners: true,
        opName: 'stroke',
      });
      expect(ctx.fillStyle).toBe('green');
      expect(ctx.strokeStyle).toBe('yellow');
    });

    test('returns stroke false when transparentCorners is true', () => {
      const control = new Control();
      const ctx = createMockContext();
      const fabricObject = new FabricObject({
        transparentCorners: true,
        cornerStrokeColor: 'red',
      });

      const result = control.commonRenderProps(ctx, 0, 0, fabricObject);

      expect(result.stroke).toBe(false);
      expect(result.opName).toBe('stroke');
    });

    test('returns stroke false when no cornerStrokeColor is set', () => {
      const control = new Control();
      const ctx = createMockContext();
      const fabricObject = new FabricObject({
        transparentCorners: false,
        cornerStrokeColor: '',
      });

      const result = control.commonRenderProps(ctx, 0, 0, fabricObject);

      expect(result.stroke).toBe(false);
      expect(result.opName).toBe('fill');
    });
  });
});
