/**
 * Runs in the **BROWSER**
 */

import * as fabric from 'fabric';
import { before } from '../test';
import { render } from './common';

before('#canvas', (el) => render(fabric, { el }));
