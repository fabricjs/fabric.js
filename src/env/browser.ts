/* eslint-disable no-restricted-globals */
import { setEnv } from '.';
import { config } from '../config';
import { TCopyPasteData, TFabricEnv } from './types';

const copyPasteData: TCopyPasteData = {};

const fabricDocument =
  document instanceof
  (typeof HTMLDocument !== 'undefined' ? HTMLDocument : Document)
    ? document
    : document.implementation.createHTMLDocument('');

config.configure({
  devicePixelRatio: window.devicePixelRatio || 1,
});

export const getEnv = (): TFabricEnv => {
  return {
    document: fabricDocument,
    window,
    isTouchSupported:
      'ontouchstart' in window ||
      'ontouchstart' in fabricDocument ||
      (window && window.navigator && window.navigator.maxTouchPoints > 0),
    isLikelyNode: false,
    copyPasteData,
  };
};

setEnv(getEnv());
