import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { BaseBrush } from './BaseBrush';
import { Canvas } from '../canvas/Canvas';
import { Point } from '../Point';
import { PencilBrush } from './PencilBrush';

describe('BaseBrush', () => {
  it('initializes constructor correctly', () => {
    expect(BaseBrush).toBeTruthy();

    // @ts-expect-error -- TODO: not sure if we need this test since this is an abstract class and only derivative classes are instantiated
    const brush = new BaseBrush();

    expect(brush, 'should inherit from fabric.BaseBrush').toBeInstanceOf(
      BaseBrush,
    );
    expect(brush.color, 'default color is black').toBe('rgb(0, 0, 0)');
    expect(brush.width, 'default width is 1').toBe(1);
  });

  describe('canvas bounds', () => {
    let canvas: Canvas;

    beforeEach(() => {
      canvas = new Canvas(undefined, { width: 400, height: 200 });
    });

    afterEach(() => canvas.dispose());

    it('rejects points beyond the visible canvas when zoomed in', () => {
      canvas.setZoom(2);
      const brush = new PencilBrush(canvas);

      expect(brush['_isOutSideCanvas'](new Point(200, 100))).toBe(false);
      expect(brush['_isOutSideCanvas'](new Point(201, 50))).toBe(true);
      expect(brush['_isOutSideCanvas'](new Point(100, 101))).toBe(true);
    });

    it('accounts for pan offsets when checking zoomed canvas boundaries', () => {
      canvas.setViewportTransform([0.5, 0, 0, 0.5, 100, -50]);
      const brush = new PencilBrush(canvas);

      expect(brush['_isOutSideCanvas'](new Point(-200, 100))).toBe(false);
      expect(brush['_isOutSideCanvas'](new Point(600, 500))).toBe(false);
      expect(brush['_isOutSideCanvas'](new Point(-201, 300))).toBe(true);
      expect(brush['_isOutSideCanvas'](new Point(601, 300))).toBe(true);
      expect(brush['_isOutSideCanvas'](new Point(200, 99))).toBe(true);
      expect(brush['_isOutSideCanvas'](new Point(200, 501))).toBe(true);
    });
  });
});
