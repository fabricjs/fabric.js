/**
 * Runs in the **BROWSER**
 */

import * as fabric from 'fabric';
import { before } from '../test';
import { render } from './common';

before('#canvas', async (el) => {
  const canvas = new fabric.StaticCanvas(el, {
    width: 1000,
    height: 400,
    backgroundColor: 'white',
    enableRetinaScaling: false,
  });
  await render(canvas, fabric, await testConfig());
  return canvas;
});
