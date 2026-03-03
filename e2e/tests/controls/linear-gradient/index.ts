import { beforeAll } from '../../test';
import { Rect, Gradient } from 'fabric';
import { createLinearGradientControls } from 'fabric/extensions';

beforeAll(async (canvas) => {
  canvas.setDimensions({ width: 450, height: 350 });
  canvas.viewportTransform = [0.5, 0, 0, 0.5, 100, 100];

  const rect = new Rect({
    width: 400,
    height: 250,
    left: 400,
    top: 300,
    flipY: true,
    fill: new Gradient({
      type: 'linear',
      // gradientTransform: [1, 0, 0, 2, 50, 40], <-- unsupported yet
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

  const rect2 = new Rect({
    width: 400,
    height: 250,
    left: 30,
    top: 30,
    flipX: true,
    fill: new Gradient({
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
    ...createLinearGradientControls(rect.fill as Gradient<'linear'>),
  };

  rect2.controls = {
    ...rect2.controls,
    ...createLinearGradientControls(rect2.fill as Gradient<'linear'>),
  };

  canvas.add(rect, rect2);
  canvas.setActiveObject(rect);
  return { rect, rect2 };
});
