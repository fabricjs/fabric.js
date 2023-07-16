import { Textbox } from 'fabric';
import { beforeAll } from 'init';

beforeAll((canvas) => {
  const textbox = new Textbox('initial text', { width: 200, left: 50 });
  canvas.add(textbox);

  return { textbox };
});
