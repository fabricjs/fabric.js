/* eslint-disable no-restricted-globals */
import { Canvas } from '../canvas/Canvas';
import { Path } from '../shapes/Path';
import { createPathControls } from './pathControl';

describe('pathControls', () => {
  it('should fire events', () => {
    const path = new Path('M 50 50 C 150 100, 50 100, 50 150');
    path.controls = createPathControls(path);
    expect(Object.keys(path.controls)).toEqual([
      'c_0_M',
      'c_1_C',
      'c_1_C_CP_1',
      'c_1_C_CP_2',
    ]);
    const canvas = new Canvas();
    canvas.add(path);
    canvas.setActiveObject(path);
    const spyModifyPath = jest.fn();
    const spyModified = jest.fn();
    path.on('modifyPath', spyModifyPath);
    path.on('modified', spyModified);
    canvas
      .getSelectionElement()
      .dispatchEvent(new MouseEvent('mousedown', { clientX: 50, clientY: 50 }));
    canvas._setupCurrentTransform(
      new MouseEvent('mousedown', { clientX: 50, clientY: 50 }),
      path,
      true,
    );
    document.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 55, clientY: 55 }),
    );
    document.dispatchEvent(
      new MouseEvent('mouseup', { clientX: 55, clientY: 55 }),
    );

    expect(spyModifyPath).toHaveBeenCalledWith(
      expect.objectContaining({
        commandIndex: 0,
        pointIndex: 1,
        transform: expect.objectContaining({
          action: 'modifyPath',
        }),
      }),
    );

    canvas
      .getSelectionElement()
      .dispatchEvent(
        new MouseEvent('mousedown', { clientX: 50, clientY: 150 }),
      );
    canvas._setupCurrentTransform(
      new MouseEvent('mousedown', { clientX: 50, clientY: 150 }),
      path,
      true,
    );
    document.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 55, clientY: 155 }),
    );
    document.dispatchEvent(
      new MouseEvent('mouseup', { clientX: 55, clientY: 155 }),
    );

    expect(spyModifyPath).toHaveBeenCalledWith(
      expect.objectContaining({
        commandIndex: 1,
        pointIndex: 5,
        transform: expect.objectContaining({
          action: 'modifyPath',
        }),
      }),
    );
  });
});
