import { expect, chai } from 'vitest';

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
  return (value.match(SVG_XLINK_HREF_RE) || []).reduce(function (final, curr) {
    return final.replace(curr, `xlink:href="assets/${basename(curr)}"`);
  }, value);
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

const rawToMatchSnapshot = (chai.Assertion.prototype as any).toMatchSnapshot;

chai.util.addMethod(
  chai.Assertion.prototype,
  'toMatchObjectSnapshot',
  function (
    this: Chai.AssertionStatic,
    {
      cloneDeepWith: customiser,
      includeDefaultValues,
      ...properties
    }: ObjectOptions = {},
    hint?: string,
  ) {
    const received = chai.util.flag(this, 'object');
    let snap: Record<string, unknown> = received;

    if (looksLikeFabricObject(received)) {
      const restore = received.includeDefaultValues;
      if (typeof includeDefaultValues === 'boolean')
        received.includeDefaultValues = includeDefaultValues;
      snap = received.toObject();
      received.includeDefaultValues = restore;
    }
    delete snap.version;

    const value = cloneDeepWith(snap, (v, k, obj, stack) => {
      const c = customiser?.(v, k, obj, stack);
      if (c !== undefined) return c;
      if (k === 'width') return Math.round(v as number);
    });

    chai.util.flag(this, 'object', value);
    return rawToMatchSnapshot.call(this, properties, hint);
  },
);

chai.util.addMethod(
  chai.Assertion.prototype,
  'toMatchSnapshot',
  function (
    this: Chai.AssertionStatic,
    propertiesOrHint?: ExtendedOptions | string,
    hint?: string,
  ) {
    const received = chai.util.flag(this, 'object');

    const { cloneDeepWith: customiser, ...rest } =
      typeof propertiesOrHint === 'object' && propertiesOrHint !== null
        ? propertiesOrHint
        : {};

    const value =
      typeof received === 'string'
        ? received
        : customiser
          ? cloneDeepWith(received, customiser)
          : received;

    chai.util.flag(this, 'object', value);

    const args: unknown[] = [];

    if (typeof propertiesOrHint === 'string') {
      args.push(propertiesOrHint);
    } else if (propertiesOrHint && Object.keys(rest).length > 0) {
      args.push(rest);
      if (hint) args.push(hint);
    } else if (hint) {
      args.push(hint);
    }

    return rawToMatchSnapshot.apply(this, args);
  },
);

chai.util.addMethod(
  chai.Assertion.prototype,
  'toMatchSVGSnapshot',
  function (
    this: Chai.AssertionStatic,
    propertiesOrHint?: ExtendedOptions | string,
    hint?: string,
  ) {
    const received = chai.util.flag(this, 'object');

    const value = sanitizeSVG(received);

    chai.util.flag(this, 'object', value);

    return rawToMatchSnapshot.call(this, propertiesOrHint, hint);
  },
);

expect.extend({
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
