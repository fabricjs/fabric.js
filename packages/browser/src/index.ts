import { setEnvFactory } from '@fabricjs/core';
import { getEnv } from './env';

setEnvFactory(getEnv);

export * from '@fabricjs/core';
