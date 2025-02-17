import { expect } from 'vitest';

import { toMatchSnapshot } from 'jest-snapshot';
import { cloneDeepWith } from 'lodash';
import { FabricObject } from './src/shapes/Object/Object';
import type { TMat2D } from './src/typedefs';
import type { ExtendedOptions, ObjectOptions } from './vitest';

export const roundSnapshotOptions = {
  cloneDeepWith: (value: any) => {
    if (typeof value === 'number') {
      return Math.round(value);
    }
  },
};

expect.extend({
  toMatchSnapshot(
    this: any,
    received: any,
    propertiesOrHint?: ExtendedOptions,
    hint?: string,
  ) {
    if (typeof received === 'string') {
      return toMatchSnapshot.call(
        this,
        received,
        propertiesOrHint || hint || '',
      );
    }
    const { cloneDeepWith: customizer, ...properties } = propertiesOrHint || {};
    return toMatchSnapshot.call(
      this,
      customizer ? cloneDeepWith(received, customizer) : received,
      properties,
      hint,
    );
  },
  toMatchObjectSnapshot(
    this: any,
    received: FabricObject | Record<string, any>,
    {
      cloneDeepWith: customizer,
      includeDefaultValues,
      ...properties
    }: ObjectOptions = {},
    hint?: string,
  ) {
    let snapshot: Record<string, any>;
    if (received instanceof FabricObject) {
      const restore = received.includeDefaultValues;
      typeof includeDefaultValues === 'boolean' &&
        (received.includeDefaultValues = includeDefaultValues);
      snapshot = received.toObject();
      received.includeDefaultValues = restore;
    } else {
      snapshot = received;
    }
    delete snapshot.version;
    return toMatchSnapshot.call(
      this,
      cloneDeepWith(snapshot, (value, key, object, stack) => {
        const clone = customizer?.(value, key, object, stack);
        if (clone) {
          return clone;
        } else if (key === 'width') {
          return Math.round(value);
        }
      }),
      properties,
      hint,
    );
  },
  toEqualRoundedMatrix(actual: TMat2D, expected: TMat2D, precision = 10) {
    const error = Math.pow(10, -precision);
    return {
      message: () => {
        return `expected ${this.utils.printReceived(
          actual,
        )} to be rounded to ${this.utils.printExpected(
          expected.map((x) => Math.round(x / error) * error),
        )}`;
      },
      pass: actual.every((x, i) => Math.abs(x - expected[i]) < error),
    };
  },
});
