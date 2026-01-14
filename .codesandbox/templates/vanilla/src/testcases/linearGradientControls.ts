import * as fabric from 'fabric';
import * as extensions from 'fabric/extensions';

export async function testCase(canvas: fabric.Canvas) {
  canvas.setDimensions({ width: 900, height: 700 });

  const rect = new fabric.Rect({
    width: 400,
    height: 250,
    fill: new fabric.Gradient({
      type: 'linear',
      coords: {
        x1: 20,
        x2: 380,
        y1: 20,
        y2: 230,
      },
      colorStops: [
        {
          offset: 0.2,
          color: 'red',
        },
        {
          offset: 0.4,
          color: 'green',
        },
        {
          offset: 0.6,
          color: 'blue',
        },
        {
          offset: 0.8,
          color: 'yellow',
        },
      ],
    }),
  });
  rect.controls = extensions.createGradientControls(
    rect.fill as fabric.Gradient<'linear'>,
  );

  canvas.add(rect);
  canvas.centerObject(rect);
  canvas.setActiveObject(rect);
}
