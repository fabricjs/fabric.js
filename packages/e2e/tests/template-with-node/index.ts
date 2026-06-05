/**
 * Runs in the **BROWSER**
 */

import * as fabric from 'fabric';
import { beforeAll } from '../test';
import { render } from './common';

beforeAll((canvas) => render(canvas, fabric), { enableRetinaScaling: false });
