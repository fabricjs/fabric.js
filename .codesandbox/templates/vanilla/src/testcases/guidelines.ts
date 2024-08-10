import * as fabric from 'fabric';
import { initAligningGuidelines } from 'fabric/extensions';

export async function testCase(canvas: fabric.Canvas) {
  initAligningGuidelines(canvas);

  const rect = new fabric.Rect({ width: 50, height: 50, fill: 'blue' });
  const rect2 = new fabric.Rect({ width: 50, height: 50, fill: 'blue' });

  canvas.add(rect, rect2);
}
