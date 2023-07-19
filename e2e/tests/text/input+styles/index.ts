import * as fabric from 'fabric';
import { beforeAll } from 'test';

beforeAll(
  (canvas) => {
    const textValue = 'fabric.js sandbox';
    const text = new fabric.Textbox(textValue, {
      originX: 'center',
      splitByGrapheme: true,
      width: 200,
      top: 20,
      styles: fabric.util.stylesFromArray(
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
  },
  { width: 500, height: 700 }
);
