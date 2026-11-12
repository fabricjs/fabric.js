import type { Canvas as SkiaCanvas } from '@napi-rs/canvas';
import { JSDOM } from 'jsdom-skia';
// @ts-expect-error jsdom's internal bridge has no public type declarations.
import utils from 'jsdom-skia/lib/generated/idl/utils.js';
import type { TFabricEnv, TFabricWindow } from '@fabricjs/core';
import { SkiaGLProbe } from './SkiaGLProbe';

const { implForWrapper } = utils;
const { window } = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  resources: 'usable',
  pretendToBeVisual: true,
});

export const getNodeCanvas = (element: HTMLCanvasElement): SkiaCanvas =>
  implForWrapper(element)?._canvas;

export const dispose = (element: Element) => {
  const impl = implForWrapper(element);
  if (!impl) {
    return;
  }
  if (element.localName === 'img') {
    // Removing src aborts jsdom's pending request/decode before dropping its image.
    element.removeAttribute('src');
    impl._image = null;
    impl._currentSrc = null;
  }
  if (impl._canvas) {
    impl._canvas.width = 0;
    impl._canvas.height = 0;
    impl._context = null;
    impl._canvas = null;
  }
};

const env: TFabricEnv = {
  document: window.document,
  window: window as unknown as TFabricWindow,
  isTouchSupported: false,
  WebGLProbe: new SkiaGLProbe(),
  dispose,
  copyPasteData: {},
};

export const getEnv = (): TFabricEnv => env;
