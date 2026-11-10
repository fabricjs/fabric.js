import { setEnvFactory } from '@fabricjs/core';
import { getEnv } from './env';

// Keep browser imports SSR-safe: window/document are read only when Fabric
// first needs the environment.
setEnvFactory(getEnv);

export * from '@fabricjs/core';
