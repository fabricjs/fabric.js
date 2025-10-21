import { Polygon, controlsUtils, Point } from 'fabric';
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
    fill: 'yellow',
    stroke: 'black',
    strokeLineJoin: 'round',
    strokeWidth: 10,
  });
  star.setPositionByOrigin(new Point(100, 100), 'left', 'top');

  star.controls = controlsUtils.createPolyControls(5);

  canvas.add(star);

  canvas.setActiveObject(star);

  return { star };
});
