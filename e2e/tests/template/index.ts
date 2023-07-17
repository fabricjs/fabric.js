/**
 * Runs in the **BROWSER**
 * Use absolute imports defined in 'e2e/imports.ts'
 */

import * as fabric from 'fabric';
import { beforeAll } from 'test';

beforeAll((canvas) => {
  const textbox = new fabric.Textbox('fabric.js test', {
    width: 200,
    top: 20,
  });
  canvas.add(textbox);
  canvas.centerObjectH(textbox);

  return { textbox };
});
