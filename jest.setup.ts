import { setEnv, getEnv } from './src/env';

// set custom env
beforeAll(() => setEnv({ ...getEnv(), window, document }));
