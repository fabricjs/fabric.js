import * as fabric from 'fabric';

export async function testCase(canvas: fabric.Canvas) {
  fabric.config.configure({
    enableGLFiltering: false,
  });
  const canvasImage = new fabric.StaticCanvas(undefined, {
    width: 128,
    height: 128,
  });
  canvasImage.add(
    new fabric.Circle({
      strokeWidth: 0,
      fill: 'red',
      radius: 60,
      top: 4,
      left: 4,
    }),
  );
  canvas.backgroundColor = 'white';
  canvasImage.renderAll();
  const image = new fabric.Image(canvasImage.lowerCanvasEl);
  image.filters = [new fabric.filters.Blur({ blur: 0.6 })];
  image.applyFilters();
  canvas.add(image);
}
