import { Path, controlsUtils } from 'fabric';
import { beforeAll } from '../../test';

beforeAll((canvas) => {
  const path =
    'M 50 50 L 150 50 C 150 100, 50 100, 50 150 Q 100 200, 150 150 Z';

  // Create the star polygon
  const testPath = new Path(path, {
    left: 100,
    top: 100,
    fill: 'yellow',
    stroke: 'black',
    strokeLineJoin: 'round',
    strokeWidth: 3,
    scaleX: 3,
    scaleY: 3,
  });

  testPath.controls = controlsUtils.createPathControls(testPath, {
    controlPointStyle: {
      controlFill: 'blue',
    },
    pointStyle: {
      controlFill: 'red',
    },
  });

  canvas.add(testPath);
  canvas.setActiveObject(testPath);

  return { testPath };
});
