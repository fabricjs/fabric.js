/* eslint-disable no-restricted-globals */
import { JSDOM } from 'jsdom';
import { implForWrapper as jsdomImplForWrapper } from 'jsdom/lib/jsdom/living/generated/utils';
import { Canvas as nodeCanvas } from 'jsdom/lib/jsdom/utils';
import { config } from '../config';
import { setEnv } from './index';
import { TCopyPasteData, TFabricEnv } from './types';

const copyPasteData: TCopyPasteData = {};

const virtualWindow = new JSDOM(
  decodeURIComponent(
    '%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3C%2Fhead%3E%3Cbody%3E%3C%2Fbody%3E%3C%2Fhtml%3E'
  ),
  {
    features: {
      FetchExternalResources: ['img'],
    },
    resources: 'usable',
  }
).window;

const fabricDocument = virtualWindow.document;
const fabricWindow = virtualWindow;

const isTouchSupported =
  'ontouchstart' in fabricWindow ||
  'ontouchstart' in fabricDocument ||
  (fabricWindow &&
    fabricWindow.navigator &&
    fabricWindow.navigator.maxTouchPoints > 0);

config.configure({
  devicePixelRatio: fabricWindow.devicePixelRatio || 1,
});

export const getEnv = (): TFabricEnv => {
  return {
    document: fabricDocument,
    window: fabricWindow,
    isTouchSupported,
    isLikelyNode: true,
    nodeCanvas,
    jsdomImplForWrapper,
    copyPasteData,
  };
};

setEnv(getEnv());
