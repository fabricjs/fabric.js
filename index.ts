import { setEnvFactory } from './packages/core/src/env';
import { getEnv } from './packages/browser/src/env';

setEnvFactory(getEnv);

export * from './fabric';
