import * as fabric from 'fabric';

export async function testCase(canvas: fabric.Canvas) {
  const canvasImage = new fabric.StaticCanvas(undefined, {
    width: 500,
    height: 500,
  });
  canvasImage.add(
    new fabric.Rect({
      fill: 'red',
      width: 100,
      height: 100,
      top: 200,
      left: 200,
    }),
  );
  canvasImage.add(
    new fabric.Rect({
      fill: 'blue',
      width: 100,
      height: 100,
      top: 200,
      left: 300,
    }),
  );
  canvasImage.add(
    new fabric.Rect({
      fill: 'green',
      width: 100,
      height: 100,
      top: 300,
      left: 200,
    }),
  );
  canvasImage.add(
    new fabric.Rect({
      fill: 'purple',
      width: 100,
      height: 100,
      top: 300,
      left: 300,
    }),
  );
  canvasImage.renderAll();
  const image = new fabric.Image(canvasImage.lowerCanvasEl);
  image.filters = [new fabric.filters.Blur({ blur: 1 })];
  image.applyFilters();
  image.scaleX = 0.5;
  image.scaleY = 0.5;
  canvas.add(image);
}
