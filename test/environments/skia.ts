import { createRequire } from 'node:module';
import type { Environment } from 'vitest/runtime';
import { populateGlobal } from 'vitest/runtime';

// Resolve the optional backend's dependencies, not the root's Cairo/jsdom 26.
const requireSkia = createRequire(
  new URL('../../packages/skia/package.json', import.meta.url),
);

export default {
  name: 'skia',
  viteEnvironment: 'ssr',
  async setup(global, options) {
    const { JSDOM } = requireSkia('jsdom-skia');
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      pretendToBeVisual: true,
      ...options.jsdom,
    });
    // File URLs are required by existing image fixtures. Copying the storage
    // getters at that opaque origin throws; they are not canvas dependencies.
    for (const key of ['localStorage', 'sessionStorage']) {
      Object.defineProperty(dom.window, key, { value: undefined, configurable: true });
    }
    const { keys, originals } = populateGlobal(global, dom.window, {
      bindFunctions: true,
    });
    global.jsdom = dom;
    return {
      teardown(global) {
        dom.window.close();
        delete global.jsdom;
        keys.forEach((key) => delete global[key]);
        originals.forEach((descriptor, key) =>
          Object.defineProperty(global, key, descriptor),
        );
      },
    };
  },
} satisfies Environment;
