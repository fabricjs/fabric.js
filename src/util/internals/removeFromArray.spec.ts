import { describe, it, expect } from 'vitest';
import { removeFromArray } from './removeFromArray';

describe('removeFromArray', () => {
  it('removes elements from arrays correctly', () => {
    let testArray: (string | number)[] = [1, 2, 3, 4, 5];

    expect(removeFromArray).toBeTypeOf('function');

    removeFromArray(testArray, 2);
    expect(testArray).toEqual([1, 3, 4, 5]);
    expect(removeFromArray(testArray, 1)).toBe(testArray);

    testArray = [1, 2, 3, 1];
    removeFromArray(testArray, 1);
    expect(testArray).toEqual([2, 3, 1]);

    testArray = [1, 2, 3];
    removeFromArray(testArray, 12);
    expect(testArray).toEqual([1, 2, 3]);

    testArray = [];
    removeFromArray(testArray, 1);
    expect(testArray).toEqual([]);

    testArray = ['0'];
    removeFromArray(testArray, 0);
    expect(testArray).toEqual(['0']);
  });
});
