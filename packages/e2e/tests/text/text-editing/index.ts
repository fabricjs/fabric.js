import { Textbox, Point } from 'fabric';
import { beforeAll } from '../../test';

beforeAll((canvas) => {
  const textbox = new Textbox('initial text', { width: 200 });
  textbox.positionByLeftTop(new Point(50, 0));
  canvas.add(textbox);

  return { textbox };
});
