import './vitest.extend';
import { getEnv, setEnv } from './src/env';
import { beforeAll } from 'vitest';

// set custom env
beforeAll(() => setEnv({ ...getEnv(), window, document }));
