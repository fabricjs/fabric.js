import { FabricImage } from 'fabric';
import { enterCropMode } from 'fabric/extensions';
import { beforeAll } from '../../test';

beforeAll(async (canvas) => {
  canvas.setDimensions({ width: 900, height: 700 });

  const image = await FabricImage.fromURL(
    'https://fabricjs.com/assets/dragon.jpg',
  );

  // Remove original controls and apply cropping controls
  image.once('mousedblclick', enterCropMode);

  // Set some initial crop to demonstrate the controls
  image.set({
    scaleX: 0.3,
    scaleY: 0.3,
    angle: 10,
    cropX: 90,
    cropY: 150,
    width: 600,
    height: 600,
    cornerStrokeColor: 'blue',
    cornerColor: 'white',
    borderScaleFactor: 2,
    transparentCorners: false,
    cornerStyle: 'circle',
  });

  canvas.add(image);
  canvas.centerObject(image);
  canvas.setActiveObject(image);

  return { image };
});
