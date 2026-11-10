import './vitest.extend';
import { setEnv, setEnvFactory } from './packages/core/src/env';
import type { TFabricEnv } from './packages/core/src/env/types';
import { WebGLProbe } from './packages/core/src/filters/GLProbes/WebGLProbe';
import { beforeAll } from 'vitest';
import { isJSDOM } from './vitest.extend';

const getTestEnv = (): TFabricEnv => {
  const copyPasteData = {};
  const testWindow = globalThis.window;
  const testDocument = globalThis.document;

  return {
    document: testDocument,
    window: testWindow,
    isTouchSupported:
      'ontouchstart' in testWindow ||
      'ontouchstart' in testDocument ||
      (testWindow &&
        testWindow.navigator &&
        testWindow.navigator.maxTouchPoints > 0),
    WebGLProbe: new WebGLProbe(),
    dispose() {
      // noop
    },
    copyPasteData,
  };
};

setEnvFactory(getTestEnv);

// set custom env
beforeAll(() => {
  if (isJSDOM()) {
    setEnv({
      ...getTestEnv(),
      window: globalThis.window,
      document: globalThis.document,
    });
  }

  // Polyfill for jsdom
  if (typeof globalThis.Touch === 'undefined') {
    globalThis.Touch = class Touch {
      clientX: number;
      clientY: number;
      identifier: number;
      target: EventTarget;
      constructor(init: Partial<Touch>) {
        Object.assign(this, init);
      }
    } as unknown as typeof Touch;
  }
});
