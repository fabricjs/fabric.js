import { beforeAll } from 'vitest';
import { setEnv } from './packages/core/src/env';
import type { TFabricWindow } from './packages/core/src/env/types';
import { getEnv } from './packages/skia/src/env';

// The shared setup installs the test DOM. Preserve Skia's disposal/probe while
// using that same DOM for all core tests. Backends must use separate workers.
beforeAll(() => {
  setEnv({
    ...getEnv(),
    window: globalThis.window as unknown as TFabricWindow,
    document: globalThis.document,
  });
});
