/* eslint-disable no-restricted-globals */
import { WebGLProbe } from '../filters/GLProbes/WebGLProbe';
import type { TCopyPasteData, TFabricEnv } from './types';

const copyPasteData: TCopyPasteData = {};

export const getEnv = (): TFabricEnv => {
  return {
    document,
    window,
    isTouchSupported:
      'ontouchstart' in window ||
      'ontouchstart' in document ||
      (window && window.navigator && window.navigator.maxTouchPoints > 0),
    WebGLProbe: new WebGLProbe(),
    dispose() {
      // noop
    },
    copyPasteData,
  };
};
