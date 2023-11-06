/**
 * This file is consumed by fabric.
 * The `./node` and `./browser` files define the env variable that is used by this module.
 * The `./browser` module is defined to be the default env and doesn't set the env at all.
 * This is done in order to support isomorphic usage for browser and node applications
 * since window and document aren't defined at time of import in SSR, we can't set env so we avoid it by deferring to the default env.
 */

import { config } from '../config';
import { getEnv as getBrowserEnv } from './browser';
import type { TFabricEnv } from './types';
import type { DOMWindow } from 'jsdom';

let env: TFabricEnv;

/**
 * Sets the environment variables used by fabric.\
 * This is exposed for special cases, such as configuring a test environment, and should be used with care.
 *
 * **CAUTION**: Must be called before using the package.
 *
 * @example
 * <caption>Passing `window` and `document` objects to fabric (in case they are mocked or something)</caption>
 * import { getEnv, setEnv } from 'fabric';
 * // we want fabric to use the `window` and `document` objects exposed by the environment we are running in.
 * setEnv({ ...getEnv(), window, document });
 * // done with setup, using fabric is now safe
 */
export const setEnv = (value: TFabricEnv) => {
  env = value;
};

/**
 * In order to support SSR we **MUST** access the browser env only after the window has loaded
 */
export const getEnv = () => env || (env = getBrowserEnv());

export const getFabricDocument = (): Document => getEnv().document;

export const getFabricWindow = (): (Window & typeof globalThis) | DOMWindow =>
  getEnv().window;

/**
 * @returns the config value if defined, fallbacks to the environment value
 */
export const getDevicePixelRatio = () =>
  Math.max(config.devicePixelRatio ?? getFabricWindow().devicePixelRatio, 1);
