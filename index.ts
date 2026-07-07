import { setEnvFactory } from './src/env';
import { getEnv } from './packages/browser/src/env';

setEnvFactory(getEnv);

export * from './fabric';
