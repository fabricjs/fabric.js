import type { FabricObject } from '../../fabric';
import type { Transform } from '../EventTypeDefs';
import { Point } from '../Point';
import { Canvas } from '../canvas/Canvas';
import { Rect } from '../shapes/Rect';
import { changeWidth } from './changeWidth';

import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';

describe('changeWidth', () => {
  let canvas: Canvas;
  let target: Rect;
  let transform: any;
  let eventData: any;

  function prepareTransform(target: FabricObject, corner: string): Transform {
    const origin = canvas._getOriginFromCorner(target, corner);
    return {
      target,
      corner,
      originX: origin.x,
      originY: origin.y,
    } as Transform;
  }

  beforeEach(() => {
    canvas = new Canvas();
    target = new Rect({ left: 50, top: 50, width: 100, height: 100 });
    canvas.add(target);
    eventData = {};
    transform = prepareTransform(target, 'mr');
  });

  afterEach(() => {
    canvas.off();
    canvas.clear();
  });

  test('changeWidth changes the width', () => {
    expect(target.width).toBe(100);
    const changed = changeWidth(eventData, transform, 200, 300);
    expect(changed).toBe(true);
    expect(target.width).toBe(199.5);
    expect(target.left).toBe(99.75);
    expect(target.top).toBe(50);
  });

  test('changeWidth changes the width with decimals', () => {
    expect(target.width).toBe(100);
    const changed = changeWidth(eventData, transform, 200.2, 300);
    expect(changed).toBe(true);
    expect(target.width).toBe(199.7);
    expect(target.left).toBe(99.85);
    expect(target.top).toBe(50);
  });

  test('changeWidth does not change the width', () => {
    const target = new Rect({ width: 100, height: 100, canvas });
    vi.spyOn(target, '_set').mockImplementation(function _set(this: Rect) {
      return this;
    });
    expect(target.width).toBe(100);
    const changed = changeWidth(eventData, { ...transform, target }, 200, 300);
    expect(changed).toBe(false);
    expect(target.width).toBe(100);
    expect(target.left).toBe(0);
    expect(target.top).toBe(0);
  });

  test("changeWidth does not change the width of target's other side", () => {
    expect(target.width).toBe(100);
    const changed = changeWidth(
      eventData,
      prepareTransform(target, 'ml'),
      200,
      300,
    );
    expect(changed).toBe(false);
    expect(target.width).toBe(100);
    const changed2 = changeWidth(
      eventData,
      prepareTransform(target, 'mr'),
      -200,
      300,
    );
    expect(changed2).toBe(false);
    expect(target.width).toBe(100);
    expect(target.left).toBe(50);
    expect(target.top).toBe(50);
  });

  test('changeWidth changes the width with centered transform', () => {
    transform.originX = 'center';
    transform.originY = 'center';
    expect(target.width).toBe(100);
    changeWidth(eventData, transform, 200, 300);
    expect(target.width).toBe(299);
    expect(target.left).toBe(50);
    expect(target.top).toBe(50);
  });

  test('changeWidth changes the width with big strokeWidth', () => {
    transform.target.strokeWidth = 15;
    changeWidth(eventData, transform, 200, 300);
    expect(target.width).toBe(192.5);
  });

  test('changeWidth changes the width with big strokeWidth and strokeUniform', () => {
    transform.target.strokeWidth = 15;
    transform.target.strokeUniform = true;
    changeWidth(eventData, transform, 200, 300);
    expect(target.width).toBe(192.5);
  });

  test('changeWidth changes the width with big strokeWidth and strokeUniform + scaling', () => {
    transform.target.strokeWidth = 15;
    transform.target.strokeUniform = true;
    transform.target.scaleX = 3;
    changeWidth(eventData, transform, 200, 300);
    expect(Math.ceil(target.width)).toBe(98);
  });

  test('changeWidth changes the width with big strokeWidth + scaling', () => {
    transform.target.strokeWidth = 15;
    transform.target.scaleX = 3;
    changeWidth(eventData, transform, 200, 300);
    expect(Math.ceil(target.width)).toBe(93);
  });

  test('changeWidth will fire events on canvas and target resizing', () => {
    target.canvas?.on('object:resizing', (options) => {
      expect(options.target).toBe(target);
    });
    const resizePromise = new Promise<void>((resolve) => {
      target.on('resizing', (options) => {
        expect(options).toEqual({
          e: eventData,
          transform,
          pointer: new Point(200, 300),
        });
        resolve();
      });
    });
    changeWidth(eventData, transform, 200, 300);
    return resizePromise;
  });
});
