import * as fabric from 'fabric';

export function testCase(canvas: fabric.Canvas) {
  const text2 = new fabric.FabricText('abcdefOOO\nfghilmOOO', {
    objectCaching: false,
    fontFamily: 'Arial',
    underline: true,
    strokeWidth: 1,
    stroke: 'orange',
    linethrough: true,
    fontSize: 30,
    scaleX: 3,
    scaleY: 3,
    styles: {
      0: {
        0: { fill: 'red', textDecorationTickness: 90 },
        1: { fill: 'red', textDecorationTickness: 90 },
        2: { fill: 'blue', overline: true, textDecorationTickness: 90 },
        3: { fill: 'blue', overline: true, textDecorationTickness: 140 },
        4: { fill: 'green', overline: true, textDecorationTickness: 140 },
        5: { fill: 'green', textDecorationTickness: 190 },
        6: { fill: 'black', textDecorationTickness: 20 },
        7: { fill: 'black', textDecorationTickness: 20 },
        8: { fill: 'yellow', textDecorationTickness: 20 },
      },
      1: {
        0: { fill: 'red', textDecorationTickness: 90 },
        1: { fill: 'red', textDecorationTickness: 90 },
        2: { fill: 'blue', overline: true, textDecorationTickness: 90 },
        3: { fill: 'blue', overline: true, textDecorationTickness: 140 },
        4: { fill: 'green', overline: true, textDecorationTickness: 140 },
        5: { fill: 'purple', overline: true, textDecorationTickness: 190 },
      },
    },
  });

  canvas.add(text2);
}
