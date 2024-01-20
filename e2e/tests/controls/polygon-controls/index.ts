import { Polygon, controlsUtils } from 'fabric';
import { beforeAll } from '../../test';

beforeAll((canvas) => {
  const starPoints = [
    { x: 100, y: 0 },
    { x: 200, y: 60 },
    { x: 140, y: 190 },
    { x: 60, y: 190 },
    { x: 0, y: 60 },
  ];

  // Create the star polygon
  const star = new Polygon(starPoints, {
    left: 100,
    top: 100,
    fill: 'yellow',
    stroke: 'black',
    strokeLineJoin: 'round',
    strokeWidth: 10,
  });

  star.controls = controlsUtils.createPolyControls(5);

  canvas.add(star);
  canvas.setActiveObject(star);

  return { star };
});
