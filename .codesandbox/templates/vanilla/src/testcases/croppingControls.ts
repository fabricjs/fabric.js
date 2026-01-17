import * as fabric from 'fabric';
import * as extensions from 'fabric/extensions';

export async function testCase(canvas: fabric.Canvas) {
  canvas.setDimensions({ width: 900, height: 700 });

  const image = await fabric.FabricImage.fromURL(
    'https://fabricjs.com/assets/dragon.jpg',
  );

  // Remove original controls and apply cropping controls
  image.once('mousedblclick', extensions.enterCropMode);

  // Apply edge resize controls to replace default ml, mr, mt, mb
  // These resize within crop bounds, then switch to uniform scaling
  const edgeControls = extensions.createImageEdgeResizeControls();
  Object.assign(image.controls, {
    ml: edgeControls.mle,
    mr: edgeControls.mre,
    mt: edgeControls.mte,
    mb: edgeControls.mbe,
  });

  // Set some initial crop to demonstrate the controls
  image.set({
    scaleX: 0.5,
    scaleY: 0.5,
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

  image.controls.tl.sizeX = 30;
  image.controls.br.sizeY = 30;
  canvas.add(image);
  canvas.centerObject(image);
  canvas.setActiveObject(image);
}
