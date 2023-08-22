/* eslint-disable @typescript-eslint/no-namespace */
import { expect } from '@jest/globals';
import { toMatchSnapshot } from 'jest-snapshot';
import { cloneDeep } from './src/util/internals/cloneDeep';

// https://github.com/jestjs/jest/blob/70b17d2e3d2bf40dd27fecdcdd06c159d26a7c6c/website/versioned_docs/version-25.x/ExpectAPI.md?plain=1#L241-L262

function roundDeep(received: any, key: string | number) {
  const value = received[key];
  Array.isArray(value)
    ? value.forEach((entry, index, array) => roundDeep(array, index))
    : typeof value === 'object'
    ? Object.keys(value).forEach((key) => roundDeep(value, key))
    : typeof value === 'number' && (received[key] = Math.round(value));
}

expect.extend({
  toMatchRoundedSnapshot(
    { version, ...received }: Record<string, unknown>,
    keys?: string[],
    ...propertiesOrHint
  ) {
    const clone = cloneDeep(received);
    (keys ?? Object.keys(clone)).forEach((key) => {
      roundDeep(clone, key);
    });
    return toMatchSnapshot.call(this, clone, ...propertiesOrHint);
  },
});

// // written in official docs but DOESN'T work
// declare module 'expect' {
//   interface AsymmetricMatchers {
//     toMatchRoundedSnapshot(
//       keys?: string[],
//       propertiesOrHint?: object | string,
//       hint?: string
//     ): void;
//   }
//   interface Matchers<R, T> {
//     toMatchRoundedSnapshot(
//       keys?: (keyof T)[],
//       propertiesOrHint?: object | string,
//       hint?: string
//     ): R;
//   }
// }
// not written in official docs but DOES work
declare global {
  namespace jest {
    interface AsymmetricMatchers {
      toMatchRoundedSnapshot(
        keys?: string[],
        propertiesOrHint?: object | string,
        hint?: string
      ): void;
    }
    interface Matchers<R, T> {
      toMatchRoundedSnapshot(
        keys?: (keyof T)[],
        propertiesOrHint?: object | string,
        hint?: string
      ): R;
    }
  }
}
