import './vitest.extend';
import { getEnv, setEnv } from './src/env';
import { beforeAll } from 'vitest';
import { isJSDOM } from './vitest.extend';

// set custom env
beforeAll(() => {
  if (isJSDOM()) {
    setEnv({ ...getEnv(), window, document });
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
