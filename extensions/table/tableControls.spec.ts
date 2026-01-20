import { describe, test, expect } from 'vitest';
import { Control, controlsUtils } from 'fabric';
import { createTableControls } from './tableControls';
import { getBorderCursor } from './tableInteraction';

describe('createTableControls', () => {
  test('returns object with 9 control properties', () => {
    const controls = createTableControls();
    expect(typeof controls).toBe('object');
    expect(Object.keys(controls)).toEqual(
      expect.arrayContaining([
        'tl',
        'tr',
        'bl',
        'br',
        'mtr',
        'ml',
        'mr',
        'mt',
        'mb',
      ]),
    );
  });

  test('all values are instances of Control', () => {
    const controls = createTableControls();
    Object.values(controls).forEach((control) => {
      expect(control).toBeInstanceOf(Control);
    });
  });

  test('corner controls use scalingEqually actionHandler', () => {
    const controls = createTableControls();
    (['tl', 'tr', 'bl', 'br'] as const).forEach((key) => {
      expect(controls[key].actionHandler).toBe(controlsUtils.scalingEqually);
    });
  });

  test('rotation control uses rotationWithSnapping actionHandler', () => {
    const controls = createTableControls();
    expect(controls.mtr.actionHandler).toBe(
      controlsUtils.rotationWithSnapping,
    );
  });

  test('rotation control has correct offset and connection', () => {
    const controls = createTableControls();
    expect(controls.mtr.offsetY).toBe(-40);
    expect(controls.mtr.withConnection).toBe(true);
  });

  test('edge controls have custom actionHandler', () => {
    const controls = createTableControls();
    (['ml', 'mr', 'mt', 'mb'] as const).forEach((key) => {
      expect(typeof controls[key].actionHandler).toBe('function');
    });
  });

  test('vertical edge controls have correct dimensions', () => {
    const controls = createTableControls();
    expect(controls.ml.sizeX).toBe(8);
    expect(controls.ml.sizeY).toBe(16);
    expect(controls.mr.sizeX).toBe(8);
    expect(controls.mr.sizeY).toBe(16);
  });

  test('horizontal edge controls have correct dimensions', () => {
    const controls = createTableControls();
    expect(controls.mt.sizeX).toBe(16);
    expect(controls.mt.sizeY).toBe(8);
    expect(controls.mb.sizeX).toBe(16);
    expect(controls.mb.sizeY).toBe(8);
  });

  test('vertical edge controls have 90 degree angle', () => {
    const controls = createTableControls();
    expect(controls.ml.angle).toBe(90);
    expect(controls.mr.angle).toBe(90);
  });

  test('horizontal edge controls have 0 degree angle', () => {
    const controls = createTableControls();
    expect(controls.mt.angle).toBe(0);
    expect(controls.mb.angle).toBe(0);
  });

  test('all controls have custom render function', () => {
    const controls = createTableControls();
    Object.values(controls).forEach((control) => {
      expect(typeof control.render).toBe('function');
    });
  });
});

describe('getBorderCursor', () => {
  test('column border at 0° returns ew-resize', () => {
    expect(getBorderCursor(0, 'col')).toBe('ew-resize');
  });

  test('row border at 0° returns ns-resize', () => {
    expect(getBorderCursor(0, 'row')).toBe('ns-resize');
  });

  test('column border at 45° returns nwse-resize', () => {
    expect(getBorderCursor(45, 'col')).toBe('nwse-resize');
  });

  test('row border at 45° returns nesw-resize', () => {
    expect(getBorderCursor(45, 'row')).toBe('nesw-resize');
  });

  test('column border at 90° returns ns-resize', () => {
    expect(getBorderCursor(90, 'col')).toBe('ns-resize');
  });

  test('row border at 90° returns ew-resize', () => {
    expect(getBorderCursor(90, 'row')).toBe('ew-resize');
  });

  test('column border at 135° returns nesw-resize', () => {
    expect(getBorderCursor(135, 'col')).toBe('nesw-resize');
  });

  test('row border at 135° returns nwse-resize', () => {
    expect(getBorderCursor(135, 'row')).toBe('nwse-resize');
  });

  test('handles negative angles', () => {
    expect(getBorderCursor(-45, 'col')).toBe('nesw-resize');
  });

  test('handles angles > 180°', () => {
    expect(getBorderCursor(225, 'col')).toBe('nwse-resize');
  });
});
