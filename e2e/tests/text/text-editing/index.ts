/**
 * Runs in the **BROWSER**
 * Use absolute imports defined in 'e2e/imports.ts'
 */

import { Textbox } from 'fabric';
import { beforeAll } from '../../test';

beforeAll((canvas) => {
  const textbox = new Textbox('initial text', { width: 200, left: 50 });
  canvas.add(textbox);

  return { textbox };
});
