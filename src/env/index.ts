import { TFabricEnv } from './types';
import { getEnv as getBrowserEnv } from './browser';

let env: TFabricEnv;

export const setEnv = (value: TFabricEnv) => {
  env = value;
};

export const getEnv = () => env || getBrowserEnv();

export const getDocument = (): Document => getEnv().document;

export const getWindow = (): Window => getEnv().window;

export const setEnvForTests = (window: Window) => {
  env.document = window.document;
  env.window = window;
};
