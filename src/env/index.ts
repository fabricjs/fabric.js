/**
 * This file is consumed by fabric.
 * The `./node` and `./browser` files define the env variable that is used by this module.
 * The `./node` module sets the env at import time.
 * The `./browser` module is defined to be the default env and doesn't set the env at all.
 * This is done in order to support isomorphic usage for browser and node applications
 * since window and document aren't defined at time of import in SSR, we can't set env so we avoid it by deferring to the default env.
 */

import { TFabricEnv } from './types';
import { getEnv as getBrowserEnv } from './browser';
import type { DOMWindow } from 'jsdom';

let env: TFabricEnv;

/**
 * Sets the environment variables used by fabric.\
 * This is exposed for special cases, such as configuring a test environment, and should be used with care.
 *
 * **CAUTION**: Must be called before using the package.
 *
 * @example Testing with jest
 * // jest is commonjs (https://jestjs.io/docs/ecmascript-modules), so by default it imports the node entry point.
 * import { getEnv, setEnv } from 'fabric';
 * // we want fabric to use the `window` and `document` objects exposed by jest.
 * setEnv({ ...getEnv(), window, document });
 * // done with setup, now run tests
 */
export const setEnv = (value: TFabricEnv) => {
  env = value;
};

export const getEnv = () => env || getBrowserEnv();

export const getDocument = (): Document => getEnv().document;

export const getWindow = (): (Window & typeof globalThis) | DOMWindow =>
  getEnv().window;
