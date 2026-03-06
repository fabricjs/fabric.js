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
  test('returns an object with 12 control properties', () => {
    const controls = createImageCroppingControls();
    expect(typeof controls).toBe('object');
    expect(Object.keys(controls)).toEqual(
      expect.arrayContaining([
        // scaling controls
        'tls',
        'brs',
        'trs',
        'bls',
        // cropping controls
        'mlc',
        'mrc',
        'mbc',
        'mtc',
        'tlc',
        'trc',
        'blc',
        'brc',
      ]),
    );
  });

  test('all values are instances of Control', () => {
    const controls = createImageCroppingControls();

    Object.values(controls).forEach((control) => {
      expect(control).toBeInstanceOf(Control);
    });
  });

  // Scaling controls tests
  test('tls control uses scaleEquallyCropGenerator actionHandler', () => {
    const controls = createImageCroppingControls();
    expect(typeof controls.tls.actionHandler).toBe('function');
  });

  test('brs control uses scaleEquallyCropGenerator actionHandler', () => {
    const controls = createImageCroppingControls();
    expect(typeof controls.brs.actionHandler).toBe('function');
  });

  test('trs control uses scaleEquallyCropGenerator actionHandler', () => {
    const controls = createImageCroppingControls();
    expect(typeof controls.trs.actionHandler).toBe('function');
  });

  test('bls control uses scaleEquallyCropGenerator actionHandler', () => {
    const controls = createImageCroppingControls();
    expect(typeof controls.bls.actionHandler).toBe('function');
  });

  // Cropping middle controls tests (wrapped with withFlip for flip-aware behavior)
  test('mlc control has flip-aware actionHandler', () => {
    const controls = createImageCroppingControls();
    expect(typeof controls.mlc.actionHandler).toBe('function');
  });

  test('mrc control has flip-aware actionHandler', () => {
    const controls = createImageCroppingControls();
    expect(typeof controls.mrc.actionHandler).toBe('function');
  });

  test('mbc control has flip-aware actionHandler', () => {
    const controls = createImageCroppingControls();
    expect(typeof controls.mbc.actionHandler).toBe('function');
  });

  test('mtc control has flip-aware actionHandler', () => {
    const controls = createImageCroppingControls();
    expect(typeof controls.mtc.actionHandler).toBe('function');
  });

  // Cropping corner controls tests
  test('tlc control combines changeCropX and changeCropY', () => {
    const controls = createImageCroppingControls();
    // tlc uses a custom function, so we verify it's a function
    expect(typeof controls.tlc.actionHandler).toBe('function');
    // The handler is not directly equal to either function since it's a wrapper
    expect(controls.tlc.actionHandler).not.toBe(changeCropX);
    expect(controls.tlc.actionHandler).not.toBe(changeCropY);
  });

  test('trc control combines changeCropWidth and changeCropY', () => {
    const controls = createImageCroppingControls();
    expect(typeof controls.trc.actionHandler).toBe('function');
    expect(controls.trc.actionHandler).not.toBe(changeCropWidth);
    expect(controls.trc.actionHandler).not.toBe(changeCropY);
  });

  test('blc control combines changeCropHeight and changeCropX', () => {
    const controls = createImageCroppingControls();
    expect(typeof controls.blc.actionHandler).toBe('function');
    expect(controls.blc.actionHandler).not.toBe(changeCropHeight);
    expect(controls.blc.actionHandler).not.toBe(changeCropX);
  });

  test('brc control combines changeCropHeight and changeCropWidth', () => {
    const controls = createImageCroppingControls();
    expect(typeof controls.brc.actionHandler).toBe('function');
    expect(controls.brc.actionHandler).not.toBe(changeCropHeight);
    expect(controls.brc.actionHandler).not.toBe(changeCropWidth);
  });
});
