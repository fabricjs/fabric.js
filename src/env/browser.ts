/* eslint-disable no-restricted-globals */
import { WebGLProbe } from '../filters/GLProbes/WebGLProbe';
import type { TCopyPasteData, TFabricEnv } from './types';

const copyPasteData: TCopyPasteData = {};

let initialized = false;
let isTouchSupported: boolean;

export const getEnv = (): TFabricEnv => {

  if (!initialized && typeof window !== 'undefined') {
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
