import * as fabric from 'fabric';
import * as extensions from 'fabric/extensions';

export async function testCase(canvas: fabric.Canvas) {
  canvas.setDimensions({ width: 900, height: 700 });

  const image = await fabric.FabricImage.fromURL(
    'https://fabricjs.com/assets/dragon.jpg',
  );

  // Remove original controls and apply cropping controls
  image.once('mousedblclick', extensions.enterCropMode);

  // Set some initial crop to demonstrate the controls
  image.set({
    scaleX: 4,
    scaleY: 4,
    angle: 10,
    cropX: 80,
    cropY: 80,
    width: 40,
    height: 40,
    cornerStrokeColor: 'blue',
    cornerColor: 'white',
    borderScaleFactor: 2,
    transparentCorners: false,
  });

  canvas.add(image);
  canvas.centerObject(image);
  canvas.setActiveObject(image);
}
