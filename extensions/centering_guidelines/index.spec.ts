import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Canvas } from '../../src/canvas/Canvas';
import { Rect } from '../../src/shapes/Rect';
import { CenteringGuidelines } from './index';

describe('CenteringGuidelines', () => {
  let canvas: Canvas;

  beforeEach(() => {
    canvas = new Canvas();
    canvas.setDimensions({ width: 800, height: 600 });
  });

  it('creates with default options', () => {
    const guidelines = new CenteringGuidelines(canvas);
    expect(guidelines.margin).toBe(4);
    expect(guidelines.color).toBe('rgba(255,0,241,0.5)');
    expect(guidelines.width).toBe(1);
    guidelines.dispose();
  });

  it('accepts custom options', () => {
    const guidelines = new CenteringGuidelines(canvas, {
      margin: 10,
      color: 'red',
      width: 2,
    });
    expect(guidelines.margin).toBe(10);
    expect(guidelines.color).toBe('red');
    expect(guidelines.width).toBe(2);
    guidelines.dispose();
  });

  it('snaps object to horizontal center', () => {
    const guidelines = new CenteringGuidelines(canvas);
    const rect = new Rect({ width: 100, height: 100, left: 100, top: 299 });
    canvas.add(rect);

    rect.set({ top: 299 });
    rect.setCoords();
    (canvas as any).fire('object:moving', { target: rect });

    const center = rect.getCenterPoint();
    expect(center.y).toBe(300);
    guidelines.dispose();
  });

  it('snaps object to vertical center', () => {
    const guidelines = new CenteringGuidelines(canvas);
    const rect = new Rect({ width: 100, height: 100, left: 399, top: 100 });
    canvas.add(rect);

    rect.set({ left: 399 });
    rect.setCoords();
    (canvas as any).fire('object:moving', { target: rect });

    const center = rect.getCenterPoint();
    expect(center.x).toBe(400);
    guidelines.dispose();
  });

  it('disposes event listeners', () => {
    const guidelines = new CenteringGuidelines(canvas);
    const offSpy = vi.spyOn(canvas, 'off');

    guidelines.dispose();

    expect(offSpy).toHaveBeenCalledWith('mouse:down', expect.any(Function));
    expect(offSpy).toHaveBeenCalledWith('mouse:up', expect.any(Function));
    expect(offSpy).toHaveBeenCalledWith('object:moving', expect.any(Function));
    expect(offSpy).toHaveBeenCalledWith('before:render', expect.any(Function));
    expect(offSpy).toHaveBeenCalledWith('after:render', expect.any(Function));
  });
});
