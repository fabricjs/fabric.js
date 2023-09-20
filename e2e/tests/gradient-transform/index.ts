/**
 * Runs in the **BROWSER**
 */

import * as fabric from 'fabric';
import { before } from '../test';
import { render } from './common';

before('#canvas', async (el) =>
  render(fabric, { ...(await testConfig()), el })
);
