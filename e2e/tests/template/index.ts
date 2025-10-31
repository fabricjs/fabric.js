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
  textbox.setPositionByOrigin(new fabric.Point(0, 20), 'left', 'top');
  canvas.centerObjectH(textbox);

  // playwright will be able to access the passed objects by their keys
  // make sure to pass unique keys across the entire app
  return { textbox };
});
