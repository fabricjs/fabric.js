/* eslint-disable no-restricted-globals */
import { JSDOM } from 'jsdom';
import utils from 'jsdom/lib/jsdom/living/generated/utils.js';
import { config } from '../config';
import { setEnv } from './index';
import { TCopyPasteData, TFabricEnv } from './types';

const { implForWrapper: jsdomImplForWrapper } = utils;

const copyPasteData: TCopyPasteData = {};

const { window: virtualWindow } = new JSDOM(
  decodeURIComponent(
    '%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3C%2Fhead%3E%3Cbody%3E%3C%2Fbody%3E%3C%2Fhtml%3E'
  ),
  {
    features: {
      FetchExternalResources: ['img'],
    },
    resources: 'usable',
  }
);

const fabricDocument = virtualWindow.document;
const fabricWindow = virtualWindow;

config.configure({
  devicePixelRatio: fabricWindow.devicePixelRatio || 1,
});

export const getEnv = (): TFabricEnv => {
  return {
    document: fabricDocument,
    window: fabricWindow,
    isTouchSupported: false,
    isLikelyNode: true,
    dispose(element) {
      const impl = jsdomImplForWrapper(element);
      if (impl) {
        impl._image = null;
        impl._canvas = null;
        // unsure if necessary
        impl._currentSrc = null;
        impl._attributes = null;
        impl._classList = null;
      }
    },
    copyPasteData,
  };
};

setEnv(getEnv());
