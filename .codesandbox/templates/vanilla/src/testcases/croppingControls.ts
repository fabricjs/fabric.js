import * as fabric from 'fabric';
import * as extensions from 'fabric/extensions';

export async function testCase(canvas: fabric.Canvas) {
  canvas.setDimensions({ width: 900, height: 700 });

  const image = await fabric.FabricImage.fromURL(
    'https://fabricjs.com/assets/dragon.jpg',
  );

  // Remove original controls and apply cropping controls
  image.controls = extensions.createImageCroppingControls();

  // Set some initial crop to demonstrate the controls
  image.set({
    cropX: 50,
    cropY: 50,
    width: 300,
    height: 200,
  });

  canvas.add(image);
  canvas.centerObject(image);
  canvas.setActiveObject(image);
}
