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
});
