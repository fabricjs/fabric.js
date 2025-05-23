import { describe, expect, it } from 'vitest';
import { capValue } from './capValue';

describe('capValue', () => {
  it('returns uncapped value when within range', () => {
    expect(typeof capValue === 'function').toBeTruthy();
    const val = capValue(3, 10, 70);
    expect(val, 'value is not capped').toBe(10);
  });

  it('applies minimum cap when value is too low', () => {
    expect(typeof capValue === 'function').toBeTruthy();
    const val = capValue(3, 1, 70);
    expect(val, 'min cap').toBe(3);
  });

  it('applies maximum cap when value is too high', () => {
    expect(typeof capValue === 'function').toBeTruthy();
    const val = capValue(3, 80, 70);
    expect(val, 'max cap').toBe(70);
  });
});
