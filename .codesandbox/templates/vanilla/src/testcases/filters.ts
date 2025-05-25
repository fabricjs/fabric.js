import * as fabric from 'fabric';

export async function testCase(canvas: fabric.Canvas) {
  fabric.config.configure({
    enableGLFiltering: false,
  });
  const canvasImage = new fabric.StaticCanvas(undefined, {
    width: 136,
    height: 136,
  });
  canvasImage.add(
    new fabric.Circle({
      strokeWidth: 0,
      fill: 'blue',
      radius: 60,
      top: 8,
      left: 8,
    }),
  );
  canvas.backgroundColor = 'white';
  canvasImage.renderAll();
  const image = new fabric.Image(canvasImage.lowerCanvasEl);
  image.filters = [new fabric.filters.Blur({ blur: 0.6 })];
  image.applyFilters();
  canvas.add(image);
}
