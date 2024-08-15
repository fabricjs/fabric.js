/* eslint-disable no-restricted-globals */
import { Point } from '../Point';
import { Canvas } from '../canvas/Canvas';
import { Polygon } from '../shapes/Polygon';
import { createPolyControls } from './polyControl';

describe('polyControl', () => {
  it('should fire events', () => {
    const poly = new Polygon(
      [new Point(), new Point(50, 0), new Point(50, 50), new Point(0, 50)],
      { controls: createPolyControls(4) },
    );
    const canvas = new Canvas();
    canvas.add(poly);
    canvas.setActiveObject(poly);
    const spy = jest.fn();
    poly.on('modifyPoly', spy);
    poly.on('modified', spy);
    canvas
      .getSelectionElement()
      .dispatchEvent(new MouseEvent('mousedown', { clientX: 50, clientY: 50 }));
    canvas._setupCurrentTransform(
      new MouseEvent('mousedown', { clientX: 50, clientY: 50 }),
      poly,
      true,
    );
    document.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 55, clientY: 55 }),
    );
    document.dispatchEvent(
      new MouseEvent('mouseup', { clientX: 55, clientY: 55 }),
    );

    expect(
      spy.mock.calls.map(
        ([
          {
            transform: { action },
          },
        ]) => action,
      ),
    ).toMatchObject(['modifyPoly', 'modifyPoly']);
  });
});
