const canvas = new fabric.Canvas(canvasEl, {
  backgroundColor: '#f5f5f5',
});

//   import { enterCropMode } from 'fabric/extensions';
const { enterCropMode } = extensions;

// Note: read the size from the canvas, not from `canvasEl.width` — fabric
// rescales the element by the device pixel ratio when it takes it over.
const center = { x: canvas.getWidth() / 2, y: canvas.getHeight() / 2 };

canvas.add(
  new fabric.FabricText('Double-click the dragon to enter or exit crop mode', {
    left: center.x,
    top: 16,
    fontSize: 14,
    fontFamily: 'sans-serif',
    fill: '#334155',
    originX: 'center',
    selectable: false,
    evented: false,
  }),
);

fabric.FabricImage.fromURL('/assets/dragon.jpg').then((image) => {
  image.set({
    // A 500x500 window centred in the 1920x1200 source, so the ghost of the
    // full image renders centred on the object once crop mode is entered.
    cropX: 710,
    cropY: 350,
    width: 500,
    height: 500,
    left: center.x,
    top: center.y + 10,
    originX: 'center',
    originY: 'center',
    scaleX: 0.35,
    scaleY: 0.35,
    cornerColor: '#ffffff',
    cornerStrokeColor: '#7c3aed',
    borderColor: '#7c3aed',
    borderScaleFactor: 2,
    transparentCorners: false,
    cornerStyle: 'circle',
    padding: 0,
  });

  // enterCropMode installs its own dblclick handler to leave crop mode again,
  // so registering it once is enough to toggle back and forth.
  image.once('mousedblclick', enterCropMode);

  canvas.add(image);
  canvas.setActiveObject(image);
  canvas.requestRenderAll();
});
