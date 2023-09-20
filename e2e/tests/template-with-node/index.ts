/**
 * Runs in the **BROWSER**
 */

import * as fabric from 'fabric';
import { before } from '../test';
import { render } from './common';

before('#canvas', async (el) => {
  const canvas = new fabric.StaticCanvas(el, {
    backgroundColor: 'white',
    enableRetinaScaling: false,
  });
  const objects = await render(canvas, fabric);
  return { canvas, objects };
});
