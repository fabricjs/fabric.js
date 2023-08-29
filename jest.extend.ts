import { expect } from '@jest/globals';
import { toMatchSnapshot } from 'jest-snapshot';
import type { CloneDeepWithCustomizer } from 'lodash';
import { cloneDeepWith } from 'lodash';
import { FabricObject } from './src/shapes/Object/Object';

type ExtendedOptions<T = unknown> =
  | {
      cloneDeepWith?: CloneDeepWithCustomizer<T>;
    } & object;

type ObjectOptions<T = unknown> = ExtendedOptions<T> & {
  includeDefaultValues?: boolean;
};

const extractOptions = (propertiesOrHint?: ObjectOptions | string) => {
  if (typeof propertiesOrHint === 'object') {
    const {
      cloneDeepWith: customizer,
      includeDefaultValues,
      ...rest
    } = propertiesOrHint;
    return {
      propertiesOrHint: rest,
      customizer,
      includeDefaultValues,
    };
  }
  return { propertiesOrHint };
};

export const roundSnapshotOptions = {
  cloneDeepWith: (value) => {
    if (typeof value === 'number') {
      return Math.round(value);
    }
  },
};

expect.extend({
  toMatchSnapshot(
    received: any,
    propertiesOrHint?: ExtendedOptions,
    hint?: string
  ) {
    const { propertiesOrHint: options = {}, customizer } =
      extractOptions(propertiesOrHint);
    return toMatchSnapshot.call(
      this,
      customizer ? cloneDeepWith(received, customizer) : received,
      options,
      hint
    );
  },
  toMatchObjectSnapshot(
    received: FabricObject | Record<string, any>,
    propertiesOrHint?: ObjectOptions | string,
    hint?: string
  ) {
    const {
      propertiesOrHint: options = {},
      customizer,
      includeDefaultValues,
    } = extractOptions(propertiesOrHint);
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
      options,
      hint
    );
  },
});

// // written in official docs but DOESN'T work
// declare module 'expect' {
//   interface AsymmetricMatchers {
//     toMatchSnapshot(propertiesOrHint?: ExtendedOptions, hint?: string): void;
//   }
//   interface Matchers<R, T> {
//     toMatchSnapshot(propertiesOrHint?: ExtendedOptions<T>, hint?: string): R;
//   }
// }

// not written in official docs but DOES work
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface AsymmetricMatchers {
      toMatchSnapshot(
        propertiesOrHint?: ExtendedOptions | string,
        hint?: string
      ): void;
      toMatchObjectSnapshot(
        propertiesOrHint?: ObjectOptions | string,
        hint?: string
      ): void;
    }
    interface Matchers<R, T> {
      toMatchSnapshot<U extends { [P in keyof T]: any }>(
        propertyMatchers: Partial<
          U & { cloneDeepWith: CloneDeepWithCustomizer<T> }
        >,
        snapshotName?: string
      ): R;
      toMatchObjectSnapshot<U extends { [P in keyof T]: any }>(
        propertyMatchers?: Partial<
          U & {
            cloneDeepWith: CloneDeepWithCustomizer<T>;
            includeDefaultValues?: boolean;
          }
        >,
        snapshotName?: string
      ): R;
    }
  }
}
