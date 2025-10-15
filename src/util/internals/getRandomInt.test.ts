import { getRandomInt } from './getRandomInt';
import { describe, expect, vi, it, beforeEach, afterEach } from 'vitest';

const originalMathRandom = globalThis.Math.random;

describe('getRandomInt', () => {
  beforeEach(() => {
    globalThis.Math.random = vi.fn(() => 0.1);
  });
  afterEach(() => {
    globalThis.Math.random = originalMathRandom;
  });
  it('return a number between min and max', () => {
    vi.mocked(globalThis.Math.random).mockReturnValue(0.1);
    const semiRandom = getRandomInt(0, 10);
    expect(semiRandom).toBe(1);
  });
  it('it could return min', () => {
    vi.mocked(globalThis.Math.random).mockReturnValue(0);
    const semiRandom = getRandomInt(4, 9);
    expect(semiRandom).toBe(4);
  });
  it('it can return max when approaching 1', () => {
    vi.mocked(globalThis.Math.random).mockReturnValue(0.999999999999999);
    const semiRandom = getRandomInt(4, 9);
    expect(semiRandom).toBe(9);
  });
  it('thanks to js sillyness could also go out of bounds', () => {
    // eslint-disable-next-line no-loss-of-precision
    vi.mocked(globalThis.Math.random).mockReturnValue(0.9999999999999999999);
    const semiRandom = getRandomInt(4, 9);
    expect(semiRandom).toBe(10);
  });

  it('generates random integers within specified range', () => {
    globalThis.Math.random = originalMathRandom;

    const randomInts: number[] = [];
    for (let i = 100; i--; ) {
      const randomInt = getRandomInt(100, 200);
      randomInts.push(randomInt);
      expect(randomInt).toBeGreaterThanOrEqual(100);
      expect(randomInt).toBeLessThanOrEqual(200);
    }

    const areAllTheSame = randomInts.every((value) => value === randomInts[0]);
    expect(areAllTheSame).toBeFalsy();
  });
});
