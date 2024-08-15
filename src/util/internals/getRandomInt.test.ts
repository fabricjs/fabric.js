import { getRandomInt } from './getRandomInt';

const originalMathRandom = global.Math.random;

describe('getRandomInt', () => {
  beforeAll(() => {
    global.Math.random = jest.fn(() => 0.1);
  });
  afterAll(() => {
    global.Math.random = originalMathRandom;
  });
  it('return a number between min and max', () => {
    (global.Math.random as jest.Mock).mockReturnValue(0.1);
    const semiRandom = getRandomInt(0, 10);
    expect(semiRandom).toBe(1);
  });
  it('it could return min', () => {
    (global.Math.random as jest.Mock).mockReturnValue(0);
    const semiRandom = getRandomInt(4, 9);
    expect(semiRandom).toBe(4);
  });
  it('it can return max when approaching 1', () => {
    (global.Math.random as jest.Mock).mockReturnValue(0.999999999999999);
    const semiRandom = getRandomInt(4, 9);
    expect(semiRandom).toBe(9);
  });
  it('thanks to js sillyness could also go out of bounds', () => {
    // eslint-disable-next-line no-loss-of-precision
    (global.Math.random as jest.Mock).mockReturnValue(0.9999999999999999999);
    const semiRandom = getRandomInt(4, 9);
    expect(semiRandom).toBe(10);
  });
});
