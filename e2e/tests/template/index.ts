/**
 * Runs in the **BROWSER**
 * Imports are defined in 'e2e/imports.ts'
 */

import * as fabric from 'fabric';
import { beforeAll } from '../test';

beforeAll((canvas) => {
  const textbox = new fabric.Textbox('fabric.js test', {
    width: 200,
    top: 20,
  });
  canvas.add(textbox);
  canvas.centerObjectH(textbox);

  // playwright will be able to access the passed objects by their keys
  // make sure to pass unique keys across the entire app
  return { textbox };
});
