import * as fabric from 'fabric';

export async function testCase(canvas: fabric.Canvas) {
  const rect = new fabric.Rect({ width: 50, height: 50, fill: 'blue' });
  const rect2 = new fabric.Rect({ width: 50, height: 50, fill: 'blue' });
  canvas.allowTouchScrolling = true;
  canvas.add(rect, rect2);
  canvas.setDimensions({ height: 4000 }, { backstoreOnly: true });
  canvas.setDimensions({ width: '100%', height: 'auto' }, { cssOnly: true });
}
