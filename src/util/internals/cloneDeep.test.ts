import { cloneDeep } from './cloneDeep';
import { expect, it, describe } from 'vitest';

describe('cloneDeep', () => {
  it('clones an object deeply', () => {
    const testObject = {
      a: {
        b: 3,
      },
      array: [1, 2, 3, 4],
      test: '123',
    };
    const cloned = cloneDeep(testObject);
    expect(cloned).toEqual(testObject);
    expect(cloned).not.toBe(testObject);
  });
});
