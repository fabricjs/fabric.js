import { describe, it, expect } from 'vitest';
import { util } from '../../fabric';

/**
 * This test makes sure that the contract for util namespace is respected and it contains all of the expected exports
 */
describe('util', () => {
  it('exports expected utility functions', () => {
    const utilShape: Record<PropertyKey, any> = {};

    Object.entries(util).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        utilShape[key] = {};
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          utilShape[key][nestedKey] = typeof nestedValue;
        });
      } else {
        utilShape[key] = typeof value;
      }
    });

    expect(utilShape).toMatchSnapshot();
  });
});
