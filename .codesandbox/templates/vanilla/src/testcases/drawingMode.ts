import * as fabric from 'fabric';

export async function testCase(canvas: fabric.Canvas) {
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.isDrawingMode = true;
}
