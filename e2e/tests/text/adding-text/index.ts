import { Textbox, util } from 'fabric';
import { beforeAll } from '../../test';

beforeAll(
  (canvas) => {
    const textValue = 'fabric.js sandbox';
    const text = new Textbox(textValue, {
      originX: 'center',
      objectCaching: false,
      splitByGrapheme: true,
      width: 200,
      top: 20,
      styles: util.stylesFromArray(
        [
          {
            style: {
              fontWeight: 'bold',
              fontSize: 64,
            },
            start: 0,
            end: 9,
          },
        ],
        textValue
      ),
    });
    canvas.add(text);
    canvas.centerObjectH(text);
    return { text };
  },
  { width: 300, height: 700 }
);
