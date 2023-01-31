import { TFabricEnv } from './types';

let env: TFabricEnv;

export const setEnv = (value: TFabricEnv) => {
  env = value;
};

export const getEnv = () => env;

export const getDocument = (): Document => env.document;

export const getWindow = (): Window => env.window;

export const setEnvForTests = (window: Window) => {
  env.document = window.document;
  env.window = window;
};
