/* eslint-disable no-restricted-globals */
import { config } from '../config';
import { WebGLProbe } from '../filters/GLProbes/WebGLProbe';
import type { TCopyPasteData, TFabricEnv } from './types';

const copyPasteData: TCopyPasteData = {};

let initialized = false;
let isTouchSupported: boolean;

export const getEnv = (): TFabricEnv => {
  if (!initialized) {
    try {
      config.configure({
        devicePixelRatio: window.devicePixelRatio || 1,
      });
    } catch (error) {
      console.error(error);
      throw new Error('Did you mean to import `fabric/node`?');
    }
    isTouchSupported =
      'ontouchstart' in window ||
      'ontouchstart' in document ||
      (window && window.navigator && window.navigator.maxTouchPoints > 0);
    initialized = true;
  }
  return {
    document,
    window,
    isTouchSupported,
    WebGLProbe: new WebGLProbe(),
    dispose() {
      // noop
    },
    copyPasteData,
  };
};
