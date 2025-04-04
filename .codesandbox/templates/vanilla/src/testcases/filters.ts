import * as fabric from 'fabric';

export async function testCase(canvas: fabric.Canvas) {
  const canvasImage = new fabric.StaticCanvas(undefined, {
    width: 200,
    height: 200,
  });
  canvasImage.add(
    new fabric.Rect({ fill: 'red', width: 100, height: 100, top: 0, left: 0 }),
  );
  canvasImage.add(
    new fabric.Rect({
      fill: 'blue',
      width: 100,
      height: 100,
      top: 0,
      left: 100,
    }),
  );
  canvasImage.add(
    new fabric.Rect({
      fill: 'green',
      width: 100,
      height: 100,
      top: 100,
      left: 0,
    }),
  );
  canvasImage.add(
    new fabric.Rect({
      fill: 'purple',
      width: 100,
      height: 100,
      top: 100,
      left: 100,
    }),
  );
  canvasImage.renderAll();
  const image = new fabric.Image(canvasImage.lowerCanvasEl);
  image.filters = [
    new fabric.filters.Noise({ noise: 0.2 }),
    new fabric.filters.Vibrance({ vibrance: 0.3 }),
    new fabric.filters.Vintage(),
    new fabric.filters.Grayscale(),
  ];
  image.applyFilters();
  canvas.add(image);
}
