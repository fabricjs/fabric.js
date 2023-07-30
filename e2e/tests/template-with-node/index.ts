/**
 * Runs in the **BROWSER**
 */

import * as fabric from 'fabric';
import { beforeAll } from '../test';
import { render } from './common';

beforeAll((canvas) => render(canvas, fabric), {
  width: 300,
  height: 100,
  // enableRetinaScaling: false,
});
