import * as fabric from 'fabric';

export async function testCase(canvas: fabric.Canvas) {
  const rect = new fabric.Rect({ width: 50, height: 50, fill: 'blue' });
  const rect2 = new fabric.Rect({ width: 50, height: 50, fill: 'blue' });

  canvas.add(rect, rect2);
  canvas.setDimensions({ width: '100%', height: 'auto' }, { cssOnly: true });
}
