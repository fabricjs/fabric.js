const canvas = new fabric.Canvas(canvasEl, {
  backgroundColor: '#f5f5f5',
});

//   import { enterCropMode } from 'fabric/extensions';
const { enterCropMode } = extensions;

fabric.FabricImage.fromURL('/assets/dragon.jpg').then((image) => {
  image.set({
    cropX: 710,
    cropY: 350,
    width: 500,
    height: 500,
    left: canvas.getWidth() / 2,
    top: canvas.getHeight() / 2,
    originX: 'center',
    originY: 'center',
    scaleX: 0.3,
    scaleY: 0.3,
    padding: 0,
  });

  image.once('mousedblclick', enterCropMode);

  canvas.add(image);
  canvas.setActiveObject(image);
});
