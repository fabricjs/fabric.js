import './vitest.extend';
import { setEnv, setEnvFactory } from './src/env';
import { getEnv } from './packages/browser/src/env';
import { beforeAll } from 'vitest';
import { isJSDOM } from './vitest.extend';

setEnvFactory(getEnv);

// set custom env
beforeAll(() => {
  if (isJSDOM()) {
    setEnv({
      ...getEnv(),
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
    } as any;
  }
});
