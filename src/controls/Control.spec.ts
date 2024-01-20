import { Canvas } from '../canvas/Canvas';
import { FabricObject } from '../shapes/Object/FabricObject';
import { Control } from './Control';

describe('Controls', () => {
  test('method binding', () => {
    const actionHandler = jest.fn();
    const mouseDownHandler = jest.fn();
    const mouseUpHandler = jest.fn();

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

    jest
      .spyOn(target, '_findTargetCorner')
      .mockImplementation(function (this: FabricObject) {
        return (this.__corner = 'test');
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
});
