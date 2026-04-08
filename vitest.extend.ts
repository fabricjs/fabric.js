import { expect, Snapshots } from 'vitest';

import { cloneDeepWith } from 'es-toolkit/compat';
import type { FabricObject } from './src/shapes/Object/Object';
import type { TMat2D } from './src/typedefs';
import type { ExtendedOptions, ObjectOptions } from './vitest';
import type { FabricImage } from './dist-extensions';

const SVG_RE = /(SVGID|CLIPPATH|imageCrop)_[0-9]+/gm;
const SVG_XLINK_HREF_RE = /xlink:href="([^"]*)"/gm;

function basename(link: string) {
  return link.split(/[\\/]/).pop()?.replace(/"/gm, '') || '';
}

function replaceLinks(value: string) {
  return (value.match(SVG_XLINK_HREF_RE) ?? []).reduce(
    (acc, match) =>
      acc.replace(match, `xlink:href="assets/${basename(match)}"`),
    value,
  );
}

export function sanitizeSVG(value: string) {
  return replaceLinks(value).replace(SVG_RE, 'SVGID');
}

function looksLikeFabricObject(val: unknown): val is FabricObject {
  return (
    !!val &&
    typeof val === 'object' &&
    // all FabricObjects implement these three members
    typeof (val as any).toObject === 'function' &&
    typeof (val as any).render === 'function' &&
    typeof (val as any).constructor?.type === 'string'
  );
}

export function isJSDOM(): boolean {
  return 'jsdom' in globalThis;
}

export const roundSnapshotOptions = {
  cloneDeepWith: (value: unknown) => {
    if (typeof value === 'number') {
      return Math.round(value);
    }
  },
};

const { toMatchSnapshot } = Snapshots;

expect.extend({
  toMatchObjectSnapshot(
    received: unknown,
    {
      cloneDeepWith: customiser,
      includeDefaultValues,
      ...properties
    }: ObjectOptions = {},
    hint?: string,
  ) {
    let snap = received as Record<string, unknown>;

    if (looksLikeFabricObject(received)) {
      const restore = received.includeDefaultValues;
      received.includeDefaultValues = includeDefaultValues ?? restore;
      snap = received.toObject();
      received.includeDefaultValues = restore;
    }
    delete snap.version;

    const value = cloneDeepWith(snap, (v, k, obj, stack) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const c = (customiser as any)?.(v, k, obj, stack);
      if (c !== undefined) return c;
      if ((k === 'width' || k === 'height') && typeof v === 'number')
        return Math.round(v * 100) / 100;
      // Normalize uid-based ids which vary by test execution order
      if (k === 'id' && typeof v === 'number') return 0;
    });

    return toMatchSnapshot.call(this, value, properties, hint);
  },

  toMatchSnapshot(
    received: unknown,
    { cloneDeepWith: customiser, ...rest }: ExtendedOptions = {},
    hint?: string,
  ) {
    const value = customiser ? cloneDeepWith(received, customiser) : received;
    return Object.keys(rest).length > 0
      ? toMatchSnapshot.call(this, value, rest, hint)
      : toMatchSnapshot.call(this, value, hint);
  },

  toMatchSVGSnapshot(received: string, hint?: string) {
    return toMatchSnapshot.call(this, sanitizeSVG(received), hint);
  },

  toSameImageObject(actual: FabricImage, expected: FabricImage) {
    const normalizedActual = {
      ...actual,
      // @ts-expect-error -- src is protected in FabricImage class
      src: basename(actual.src),
    };

    const normalizedExpected = {
      ...expected,
      // @ts-expect-error -- src is protected in FabricImage class
      src: basename(expected.src),
    };

    const pass = this.equals(normalizedActual, normalizedExpected);

    return {
      pass,
      message: () =>
        pass
          ? `Expected image object to not equal the reference`
          : `Expected image object to equal the reference\nReceived: ${JSON.stringify(normalizedActual)}\nExpected: ${JSON.stringify(normalizedExpected)}`,
    };
  },

  toEqualSVG(actual: string, expected: string) {
    const sanitizedActual = sanitizeSVG(actual);
    const sanitizedExpected = sanitizeSVG(expected);
    const pass = sanitizedActual === sanitizedExpected;

    return {
      pass,
      message: () =>
        pass
          ? `Expected SVG to not equal the normalized reference`
          : `Expected SVG to equal the normalized reference\nReceived: ${sanitizedActual}\nExpected: ${sanitizedExpected}`,
    };
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
