/* eslint-disable no-restricted-globals */
import type { Canvas as NodeCanvas } from 'canvas';
import { JSDOM } from 'jsdom';
// @ts-expect-error internal import
import utils from 'jsdom/lib/jsdom/living/generated/utils.js';
import { NodeGLProbe } from '../filters/GLProbes/NodeGLProbe';
import type { TCopyPasteData, TFabricEnv } from './types';

const { implForWrapper: jsdomImplForWrapper } = utils;

const copyPasteData: TCopyPasteData = {};

const { window: JSDOMWindow } = new JSDOM(
  decodeURIComponent(
    '%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3C%2Fhead%3E%3Cbody%3E%3C%2Fbody%3E%3C%2Fhtml%3E',
  ),
  {
    resources: 'usable',
    // needed for `requestAnimationFrame`
    pretendToBeVisual: true,
  },
);

export const getNodeCanvas = (canvasEl: HTMLCanvasElement) => {
  const impl = jsdomImplForWrapper(canvasEl);
  return (impl._canvas || impl._image) as NodeCanvas;
};

export const dispose = (element: Element) => {
  const impl = jsdomImplForWrapper(element);
  if (impl) {
    impl._image = null;
    impl._canvas = null;
    // unsure if necessary
    impl._currentSrc = null;
    impl._attributes = null;
    impl._classList = null;
  }
};

export const getEnv = (): TFabricEnv => {
  return {
    document: JSDOMWindow.document,
    window: JSDOMWindow,
    isTouchSupported: false,
    WebGLProbe: new NodeGLProbe(),
    dispose,
    copyPasteData,
  };
};
