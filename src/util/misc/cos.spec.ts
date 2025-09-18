import { describe, expect, it } from 'vitest';
import { cos } from './cos';

describe('cos', () => {
  it('calculates cosine values correctly', () => {
    expect(typeof cos === 'function').toBeTruthy();
    expect(cos(0), 'cos 0 correct').toBe(1);
    expect(cos(Math.PI / 2), 'cos 90 correct').toBe(0);
    expect(cos(Math.PI), 'cos 180 correct').toBe(-1);
    expect(cos((3 * Math.PI) / 2), 'cos 270 correct').toBe(0);
  });
});
