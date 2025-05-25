/* eslint-disable no-restricted-globals */
import { Point } from '../Point';
import { Canvas } from '../canvas/Canvas';
import { Polygon } from '../shapes/Polygon';
import { createPolyControls } from './polyControl';

import { describe, expect, it, vi } from 'vitest';

describe('polyControl', () => {
  it('should fire events', () => {
    const poly = new Polygon(
      [new Point(), new Point(50, 0), new Point(50, 50), new Point(0, 50)],
      { controls: createPolyControls(4) },
    );
    vi.spyOn(poly, 'set');
    const canvas = new Canvas();
    canvas.add(poly);
    canvas.setActiveObject(poly);
    const spy = vi.fn();
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
    expect(
      poly.set,
      'call set method with dirty for cache invalidation of point changes that do not change polygon size',
    ).toHaveBeenCalledWith('dirty', true);
  });
});
