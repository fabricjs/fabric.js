import { describe, test, expect } from 'vitest';
import { Control } from 'fabric';
import { createImageCroppingControls } from './croppingControls';
import {
  changeCropHeight,
  changeCropWidth,
  changeCropX,
  changeCropY,
} from './croppingHandlers';

describe('createImageCroppingControls', () => {
  test('returns an object with 8 control properties', () => {
    const controls = createImageCroppingControls();
    expect(typeof controls).toBe('object');
    expect(Object.keys(controls)).toEqual(
      expect.arrayContaining(['ml', 'mr', 'mb', 'mt', 'tl', 'tr', 'bl', 'br']),
    );
  });

  test('all values are instances of Control', () => {
    const controls = createImageCroppingControls();

    Object.values(controls).forEach((control) => {
      expect(control).toBeInstanceOf(Control);
    });
  });

  test('ml control uses changeCropX as actionHandler', () => {
    const controls = createImageCroppingControls();
    expect(controls.ml.actionHandler).toBe(changeCropX);
  });

  test('mr control uses changeCropWidth as actionHandler', () => {
    const controls = createImageCroppingControls();
    expect(controls.mr.actionHandler).toBe(changeCropWidth);
  });

  test('mb control uses changeCropHeight as actionHandler', () => {
    const controls = createImageCroppingControls();
    expect(controls.mb.actionHandler).toBe(changeCropHeight);
  });

  test('mt control uses changeCropY as actionHandler', () => {
    const controls = createImageCroppingControls();
    expect(controls.mt.actionHandler).toBe(changeCropY);
  });

  test('tl control combines changeCropX and changeCropY', () => {
    const controls = createImageCroppingControls();
    // tl uses a custom function, so we verify it's a function
    expect(typeof controls.tl.actionHandler).toBe('function');
    // The handler is not directly equal to either function since it's a wrapper
    expect(controls.tl.actionHandler).not.toBe(changeCropX);
    expect(controls.tl.actionHandler).not.toBe(changeCropY);
  });

  test('tr control combines changeCropWidth and changeCropY', () => {
    const controls = createImageCroppingControls();
    expect(typeof controls.tr.actionHandler).toBe('function');
    expect(controls.tr.actionHandler).not.toBe(changeCropWidth);
    expect(controls.tr.actionHandler).not.toBe(changeCropY);
  });

  test('bl control combines changeCropHeight and changeCropX', () => {
    const controls = createImageCroppingControls();
    expect(typeof controls.bl.actionHandler).toBe('function');
    expect(controls.bl.actionHandler).not.toBe(changeCropHeight);
    expect(controls.bl.actionHandler).not.toBe(changeCropX);
  });

  test('br control combines changeCropHeight and changeCropWidth', () => {
    const controls = createImageCroppingControls();
    expect(typeof controls.br.actionHandler).toBe('function');
    expect(controls.br.actionHandler).not.toBe(changeCropHeight);
    expect(controls.br.actionHandler).not.toBe(changeCropWidth);
  });
});
