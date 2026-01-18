import { FabricImage } from 'fabric';
import { createImageEdgeResizeControls } from 'fabric/extensions';
import { beforeAll } from '../../test';

beforeAll(async (canvas) => {
  canvas.setDimensions({ width: 500, height: 500 });

  const image = await FabricImage.fromURL(
    'https://fabricjs.com/assets/dragon.jpg',
  );

  // Apply edge resize controls
  const edgeControls = createImageEdgeResizeControls();
  Object.assign(image.controls, {
    ml: edgeControls.mle,
    mr: edgeControls.mre,
    mt: edgeControls.mte,
    mb: edgeControls.mbe,
  });

  // Set initial crop to test resize within bounds
  image.set({
    scaleX: 0.4,
    scaleY: 0.4,
    cropX: 100,
    cropY: 100,
    width: 400,
    height: 400,
    cornerStrokeColor: 'blue',
    cornerColor: 'white',
    borderColor: 'blue',
    borderScaleFactor: 2,
    transparentCorners: false,
  });

  canvas.add(image);
  canvas.centerObject(image);
  canvas.setActiveObject(image);

  return { image };
});
