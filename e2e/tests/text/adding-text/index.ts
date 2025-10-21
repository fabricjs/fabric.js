import { Textbox, util, Point } from 'fabric';
import { beforeAll } from '../../test';

beforeAll(
  (canvas) => {
    const textValue = 'fabric.js sandbox\nawesome textbox item long long long';
    const text = new Textbox(textValue, {
      objectCaching: false,
      splitByGrapheme: true,
      fontSize: 48,
      width: 210,
      top: 0,
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
          {
            style: {
              fill: 'blue',
            },
            start: 19,
            end: 26,
          },
          {
            style: {
              fill: 'red',
            },
            start: 26,
            end: 32,
          },
          {
            style: {
              fill: 'green',
            },
            start: 33,
            end: 34,
          },
          {
            style: {
              fill: 'yellow',
            },
            start: 35,
            end: 36,
          },
        ],
        textValue,
      ),
    });
    text.setPositionByOrigin(new Point(0, 0), 'left', 'top');
    canvas.add(text);
    return { text };
  },
  { width: 250, height: 600 },
);
