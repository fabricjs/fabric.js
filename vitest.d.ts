/* eslint-disable @typescript-eslint/no-empty-object-type -- augmenting vitest matchers */
import 'vitest';
import type { TMat2D } from './packages/core/src/typedefs';
import type { SerializedImageProps } from './packages/core/src/shapes/Image';

type ObjectOptions<T = unknown> = ExtendedOptions<T> & {
  includeDefaultValues?: boolean;
};

type ExtendedOptions<T = unknown> = {
  cloneDeepWith?: (
    value: unknown,
    key: PropertyKey | undefined,
    object: T | undefined,
    stack: Map<unknown, unknown>,
  ) => unknown;
};

interface CustomMatchers<R = unknown, T = unknown> {
  toMatchSnapshotWithOptions(options?: ExtendedOptions<T>, hint?: string): R;

  toMatchObjectSnapshot(propertiesOrHint?: ObjectOptions<T>, hint?: string): R;

  toMatchSVGSnapshot(hint?: string): R;

  toEqualRoundedMatrix(expected: TMat2D, precision?: number): R;

  toEqualSVG(expected: string): void;

  toSameImageObject(expected: SerializedImageProps): void;
}

declare module 'vitest' {
  interface Matchers<R, T> extends CustomMatchers<R, T> {}
}
