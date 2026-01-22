import * as fabric from 'fabric';
import * as extensions from 'fabric/extensions';

export async function testCase(canvas: fabric.Canvas) {
  canvas.setDimensions({ width: 900, height: 700 });
  canvas.backgroundColor = '#f5f5f5';

  const edgeControls = extensions.createImageEdgeResizeControls();

  const image = await fabric.FabricImage.fromURL(
    'https://fabricjs.com/assets/dragon.jpg',
  );
  image.once('mousedblclick', extensions.enterCropMode);
  Object.assign(image.controls, {
    ml: edgeControls.mle,
    mr: edgeControls.mre,
    mt: edgeControls.mte,
    mb: edgeControls.mbe,
  });
  image.set({
    left: 220,
    top: 200,
    scaleX: 0.4,
    scaleY: 0.4,
    angle: 10,
    cropX: 80,
    cropY: 80,
    width: 400,
    height: 400,
    cornerStrokeColor: 'blue',
    cornerColor: 'white',
    borderColor: 'blue',
    borderScaleFactor: 2,
    transparentCorners: false,
    cornerStyle: 'circle',
  });

  const flippedImage = await fabric.FabricImage.fromURL(
    'https://fabricjs.com/assets/dragon.jpg',
  );
  flippedImage.once('mousedblclick', extensions.enterCropMode);
  Object.assign(flippedImage.controls, {
    ml: edgeControls.mle,
    mr: edgeControls.mre,
    mt: edgeControls.mte,
    mb: edgeControls.mbe,
  });
  flippedImage.set({
    left: 620,
    top: 200,
    scaleX: 0.4,
    scaleY: 0.4,
    angle: 10,
    flipX: true,
    cropX: 80,
    cropY: 80,
    width: 400,
    height: 400,
    cornerStrokeColor: 'red',
    cornerColor: 'white',
    borderColor: 'red',
    borderScaleFactor: 2,
    transparentCorners: false,
    cornerStyle: 'circle',
  });

  canvas.add(image, flippedImage);
}
