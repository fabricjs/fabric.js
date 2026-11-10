import { config } from '../config';
import { FabricError } from '../util/internals/console';
import type { TFabricEnv, TFabricWindow } from './types';

let env: TFabricEnv;
let envFactory: (() => TFabricEnv) | undefined;

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
 * Sets the environment factory used by package entrypoints.
 *
 * **CAUTION**: Must be called before using APIs that access the environment.
 */
export const setEnvFactory = (factory: () => TFabricEnv) => {
  envFactory = factory;
};

export const getEnv = () => {
  if (env) {
    return env;
  }
  if (envFactory) {
    return (env = envFactory());
  }
  throw new FabricError(
    'Fabric env was not initialized. Import fabric, fabric/node, @fabricjs/browser, or @fabricjs/node before using environment-dependent APIs, or call setEnv/setEnvFactory.',
  );
};

export const getFabricDocument = (): Document => getEnv().document;

export const getFabricWindow = (): TFabricWindow => getEnv().window;

/**
 * @returns the config value if defined, fallbacks to the environment value
 */
export const getDevicePixelRatio = () =>
  Math.max(
    config.devicePixelRatio ?? getFabricWindow().devicePixelRatio ?? 1,
    1,
  );

export type * from './types';
