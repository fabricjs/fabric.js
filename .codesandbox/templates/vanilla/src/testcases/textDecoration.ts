import * as fabric from 'fabric';

export function testCase(canvas: fabric.Canvas) {
  const text2 = new fabric.FabricText('abcdefOOO\nfghilmOOO', {
    objectCaching: false,
    fontFamily: 'Arial',
    underline: true,
    strokeWidth: 0,
    linethrough: true,
    top: 20,
    left: 20,
    fontSize: 30,
    scaleX: 3,
    scaleY: 3,
    styles: {
      0: {
        0: { fill: 'red', textDecorationThickness: 90 },
        1: { fill: 'red', textDecorationThickness: 90 },
        2: { fill: 'blue', overline: true, textDecorationThickness: 90 },
        3: { fill: 'blue', overline: true, textDecorationThickness: 140 },
        4: { fill: 'green', overline: true, textDecorationThickness: 140 },
        5: { fill: 'green', textDecorationThickness: 190 },
        6: { fill: 'black', textDecorationThickness: 20 },
        7: { fill: 'black', textDecorationThickness: 20 },
        8: { fill: 'yellow', textDecorationThickness: 20 },
      },
      1: {
        0: { fill: 'red', textDecorationThickness: 90 },
        1: { fill: 'red', textDecorationThickness: 90 },
        2: { fill: 'blue', overline: true, textDecorationThickness: 90 },
        3: { fill: 'blue', overline: true, textDecorationThickness: 140 },
        4: { fill: 'green', overline: true, textDecorationThickness: 140 },
        5: { fill: 'purple', overline: true, textDecorationThickness: 190 },
      },
    },
  });

  canvas.add(text2);
  document.getElementById('svgout')?.innerHTML = canvas.toSVG();
}
