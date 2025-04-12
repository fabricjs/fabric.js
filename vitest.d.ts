import 'vitest';
import type { TMat2D } from './src/typedefs';
import type { CloneDeepWithCustomizer } from 'lodash';

type ObjectOptions<T = unknown> = ExtendedOptions<T> & {
  includeDefaultValues?: boolean;
};

type ExtendedOptions<T = unknown> = {
  cloneDeepWith?: CloneDeepWithCustomizer<T>;
} & object;

interface CustomMatchers<R = unknown, T = unknown> {
  toMatchSnapshot(propertiesOrHint?: ExtendedOptions<T>, hint?: string): R;

  toMatchObjectSnapshot(propertiesOrHint?: ObjectOptions<T>, hint?: string): R;

  toEqualRoundedMatrix(expected: TMat2D, precision?: number): R;

  toEqualSVG(expected: string): void;
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
