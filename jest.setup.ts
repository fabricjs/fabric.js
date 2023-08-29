import './jest.extend';
import { getEnv, setEnv } from './src/env';

// set custom env
beforeAll(() => setEnv({ ...getEnv(), window, document }));
