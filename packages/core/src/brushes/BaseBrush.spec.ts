import { describe, expect, it } from 'vitest';
import { BaseBrush } from './BaseBrush';

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
});
