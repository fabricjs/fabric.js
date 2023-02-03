/* eslint-disable no-restricted-globals */
import { config } from '../config';
import { TCopyPasteData, TFabricEnv } from './types';

const copyPasteData: TCopyPasteData = {};

let initialized = false;
let isTouchSupported: boolean;

export const getEnv = (): TFabricEnv => {
  if (!initialized) {
    config.configure({
      devicePixelRatio: window.devicePixelRatio || 1,
    });
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
    isLikelyNode: false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispose(element) {
      // noop
    },
    copyPasteData,
  };
};
