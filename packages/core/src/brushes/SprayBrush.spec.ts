import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Canvas } from '../canvas/Canvas';
import { Point } from '../Point';
import type { Group } from '../shapes/Group';
import { SprayBrush } from './SprayBrush';

describe('SprayBrush', () => {
  let canvas: Canvas;

  beforeEach(() => {
    canvas = new Canvas();
  });

  afterEach(() => {
    return canvas.dispose();
  });

  it('preserves differently sized dots at the same center while removing duplicates', () => {
    const brush = new SprayBrush(canvas);
    brush.width = 0;
    brush.density = 1;
    brush.dotWidth = 4;
    brush.dotWidthVariance = 3;

    const random = vi.spyOn(Math, 'random').mockReturnValue(0);
    brush.onMouseDown(new Point(20, 30));
    random.mockReturnValue(0.25);
    brush.onMouseMove(new Point(40, 50));
    random.mockReturnValue(0.99);
    brush.onMouseMove(new Point(17, 27));
    brush.onMouseMove(new Point(17, 27));
    brush.onMouseUp();

    const group = canvas.item(0) as Group;
    expect(
      group.getObjects().map((rect) => {
        const { x, y } = rect.getCenterPoint();
        return [x, y, rect.width, rect.height];
      }),
    ).toEqual([
      [20.5, 30.5, 1, 1],
      [41, 51, 2, 2],
      [20.5, 30.5, 7, 7],
    ]);
  });
});
