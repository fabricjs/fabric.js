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

  const rect2 = new fabric.Rect({
    width: 400,
    height: 250,
    fill: new fabric.Gradient({
      type: 'linear',
      gradientUnits: 'percentage',
      coords: {
        x1: 0.1,
        x2: 0.95,
        y1: 0.95,
        y2: 0.05,
      },
      colorStops: [
        {
          offset: 0.2,
          color: 'black',
        },
        {
          offset: 0.4,
          color: 'green',
        },
        {
          offset: 0.6,
          color: 'pink',
        },
        {
          offset: 0.8,
          color: 'white',
        },
      ],
    }),
  });
  rect.controls = {
    ...rect.controls,
    ...extensions.createGradientControls(
      rect.fill as fabric.Gradient<'linear'>,
    ),
  };

  rect2.controls = {
    ...rect2.controls,
    ...extensions.createGradientControls(
      rect2.fill as fabric.Gradient<'linear'>,
    ),
  };

  canvas.add(rect, rect2);
  canvas.centerObject(rect);
  canvas.setActiveObject(rect);
}
