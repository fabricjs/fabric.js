/**
 * This file is consumed by fabric.
 * The `./node` and `./browser` files define the environment object that is used by this module.
 * The `./node` module sets the env at import time.
 * The `./browser` module doesn't set the env and is defined to be the default env.
 * This is done in order to support SSR, where at time of import setting env will be wrong since window and document aren't defined.
 */

import { TFabricEnv } from './types';
import { getEnv as getBrowserEnv } from './browser';

let env: TFabricEnv;

export const setEnv = (value: TFabricEnv) => {
  env = value;
};

export const getEnv = () => env || getBrowserEnv();

export const getDocument = (): Document => getEnv().document;

export const getWindow = (): Window => getEnv().window;
