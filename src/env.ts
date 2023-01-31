/* eslint-disable no-restricted-globals */
import { config } from './config';
import type { Canvas } from 'canvas';

type TFabricEnv = {
  document: Document;
  window: Window;
  isTouchSupported: boolean;
  isLikelyNode: boolean;
  nodeCanvas: Canvas;
  jsdomImplForWrapper: any;
};

let initialized = false;
let fabricDocument: Document;
let fabricWindow: Window;
let isTouchSupported: boolean;
let isLikelyNode: boolean;
let nodeCanvas: Canvas;
let jsdomImplForWrapper: any;

function setupEnv() {
  initialized = true;
  if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    if (
      document instanceof
      (typeof HTMLDocument !== 'undefined' ? HTMLDocument : Document)
    ) {
      fabricDocument = document;
    } else {
      fabricDocument = document.implementation.createHTMLDocument('');
    }
    fabricWindow = window;
    isLikelyNode = false;
  } else {
    // assume we're running under node.js when document/window are not present
    const jsdom = require('jsdom');
    const virtualWindow = new jsdom.JSDOM(
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
    fabricDocument = virtualWindow.document;
    jsdomImplForWrapper =
      require('jsdom/lib/jsdom/living/generated/utils').implForWrapper;
    nodeCanvas = require('jsdom/lib/jsdom/utils').Canvas;
    isLikelyNode = true;
    fabricWindow = virtualWindow;
    global.DOMParser = (fabricWindow as any).DOMParser;
  }
  isTouchSupported =
    'ontouchstart' in fabricWindow ||
    'ontouchstart' in fabricDocument ||
    (fabricWindow &&
      fabricWindow.navigator &&
      fabricWindow.navigator.maxTouchPoints > 0);
  config.configure({
    devicePixelRatio: fabricWindow.devicePixelRatio || 1,
  });
}

export const getEnv = (): TFabricEnv => {
  !initialized && setupEnv();
  return {
    document: fabricDocument,
    window: fabricWindow,
    isTouchSupported,
    isLikelyNode,
    nodeCanvas,
    jsdomImplForWrapper,
  };
};

export const getDocument = (): Document => fabricDocument;
export const getWindow = (): Window => fabricWindow;
export const setEnvForTests = (window: Window) => {
  fabricDocument = window.document;
  fabricWindow = window;
};
