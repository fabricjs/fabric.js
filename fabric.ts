import { setEnvFactory } from './packages/core/src';
import { getEnv } from './packages/browser/src/env';

// Keep browser imports SSR-safe: window/document are read only when Fabric
// first needs the environment.
setEnvFactory(getEnv);

export * from './packages/core/src';
