import { describe, expect, expectTypeOf, it } from 'vitest';
import { Rect } from './shapes/Rect';

describe('CommonMethods', () => {
  it('infers the type of known properties', () => {
    const rect = new Rect({ width: 10, visible: false, fill: null });

    expectTypeOf(rect.get('width')).toEqualTypeOf<number>();
    expectTypeOf(rect.get('visible')).toEqualTypeOf<boolean>();
    expectTypeOf(rect.get('fill')).toEqualTypeOf<Rect['fill']>();
    expect(rect.get('width')).toBe(10);
    expect(rect.get('visible')).toBe(false);
    expect(rect.get('fill')).toBeNull();
  });

  it('infers the type of properties declared by subclasses', () => {
    class NamedRect extends Rect {
      label = 'example';
    }

    const rect = new NamedRect();

    expectTypeOf(rect.get('label')).toEqualTypeOf<string>();
    expect(rect.get('label')).toBe('example');
  });

  it('preserves access to dynamic properties', () => {
    const rect = new Rect();
    const property: string = 'customProperty';
    rect.set(property, 'custom value');

    expectTypeOf(rect.get(property)).toBeAny();
    expect(rect.get(property)).toBe('custom value');
    expect(rect.get('missingProperty')).toBeUndefined();
  });
});
