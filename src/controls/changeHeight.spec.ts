import type { FabricObject } from '../../fabric';
import type { Transform } from '../EventTypeDefs';
import { Point } from '../Point';
import { Canvas } from '../canvas/Canvas';
import { Rect } from '../shapes/Rect';
import { changeHeight } from './changeWidth';

import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';

describe('changeHeight', () => {
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
    transform = prepareTransform(target, 'mb');
  });

  afterEach(() => {
    canvas.off();
    canvas.clear();
  });

  test('changeHeight changes the height', () => {
    expect(target.height).toBe(100);
    const changed = changeHeight(eventData, transform, 300, 200);
    expect(changed).toBe(true);
    expect(target.height).toBe(199.5);
    expect(target.top).toBe(99.75);
    expect(target.left).toBe(50);
  });

  test('changeHeight changes the height with decimals', () => {
    expect(target.height).toBe(100);
    const changed = changeHeight(eventData, transform, 300, 200.2);
    expect(changed).toBe(true);
    expect(target.height).toBe(199.7);
    expect(target.top).toBe(99.85);
    expect(target.left).toBe(50);
  });

  test('changeHeight does not change the height', () => {
    const target = new Rect({ width: 100, height: 100, canvas });
    vi.spyOn(target, '_set').mockImplementation(function _set(this: Rect) {
      return this;
    });
    expect(target.height).toBe(100);
    const changed = changeHeight(eventData, { ...transform, target }, 300, 200);
    expect(changed).toBe(false);
    expect(target.height).toBe(100);
    expect(target.left).toBe(0);
    expect(target.top).toBe(0);
  });

  test("changeHeight does not change the height of target's other side", () => {
    expect(target.height).toBe(100);
    const changed = changeHeight(
      eventData,
      prepareTransform(target, 'mt'),
      300,
      200,
    );
    expect(changed).toBe(false);
    expect(target.height).toBe(100);
    const changed2 = changeHeight(
      eventData,
      prepareTransform(target, 'mb'),
      300,
      -200,
    );
    expect(changed2).toBe(false);
    expect(target.height).toBe(100);
    expect(target.left).toBe(50);
    expect(target.top).toBe(50);
  });

  test('changeHeight changes the height with centered transform', () => {
    transform.originX = 'center';
    transform.originY = 'center';
    expect(target.height).toBe(100);
    changeHeight(eventData, transform, 300, 200);
    expect(target.height).toBe(299);
    expect(target.left).toBe(50);
    expect(target.top).toBe(50);
  });

  test('changeHeight changes the height with big strokeWidth', () => {
    transform.target.strokeWidth = 15;
    changeHeight(eventData, transform, 300, 200);
    expect(target.height).toBe(192.5);
  });

  test('changeHeight changes the height with big strokeWidth and strokeUniform', () => {
    transform.target.strokeWidth = 15;
    transform.target.strokeUniform = true;
    changeHeight(eventData, transform, 300, 200);
    expect(target.height).toBe(192.5);
  });

  test('changeHeight changes the height with big strokeWidth and strokeUniform + scaling', () => {
    transform.target.strokeWidth = 15;
    transform.target.strokeUniform = true;
    transform.target.scaleY = 3;
    changeHeight(eventData, transform, 300, 200);
    expect(Math.ceil(target.height)).toBe(98);
  });

  test('changeHeight changes the height with big strokeWidth + scaling', () => {
    transform.target.strokeWidth = 15;
    transform.target.scaleY = 3;
    changeHeight(eventData, transform, 300, 200);
    expect(Math.ceil(target.height)).toBe(93);
  });

  test('changeHeight will fire events on canvas and target resizing', () => {
    target.canvas?.on('object:resizing', (options) => {
      expect(options.target).toBe(target);
    });
    const resizePromise = new Promise<void>((resolve) => {
      target.on('resizing', (options) => {
        expect(options).toEqual({
          e: eventData,
          transform,
          pointer: new Point(300, 200),
        });
        resolve();
      });
    });
    changeHeight(eventData, transform, 300, 200);
    return resizePromise;
  });
});
