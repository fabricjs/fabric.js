import { TFabricEnv } from './types';
import { getEnv as getBrowserEnv } from './browser';
import { DOMWindow } from 'jsdom';

let env: TFabricEnv;

export const setEnv = (value: TFabricEnv) => {
  env = value;
};

export const getEnv = () => env || getBrowserEnv();

export const getDocument = (): Document => getEnv().document;

export const getWindow = (): Window | DOMWindow => getEnv().window;

export const setEnvForTests = (window: Window) => {
  env.document = window.document;
  env.window = window;
};
