import * as fabric from 'fabric';

export async function testCase(canvas: fabric.Canvas) {
  fabric.config.configure({
    enableGLFiltering: true,
  });
  const canvasImage = new fabric.StaticCanvas(undefined, {
    width: 128,
    height: 128,
  });
  canvasImage.add(
    new fabric.Rect({
      fill: 'red',
      width: 35,
      height: 35,
      top: 29,
      left: 29,
    }),
  );
  canvasImage.add(
    new fabric.Rect({
      fill: 'blue',
      width: 35,
      height: 35,
      top: 29,
      left: 64,
    }),
  );
  canvasImage.add(
    new fabric.Rect({
      fill: 'green',
      width: 35,
      height: 35,
      top: 64,
      left: 29,
    }),
  );
  canvasImage.add(
    new fabric.Rect({
      fill: 'purple',
      width: 35,
      height: 35,
      top: 64,
      left: 64,
    }),
  );
  canvasImage.renderAll();
  const image = new fabric.Image(canvasImage.lowerCanvasEl);
  image.filters = [new fabric.filters.Blur({ blur: 0.6 })];
  image.applyFilters();
  canvas.add(image);
}
