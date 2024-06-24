import * as fabric from 'fabric';

export async function testCase(canvas: fabric.Canvas) {
  const rect = new fabric.Rect({ width: 500, height: 500, fill: 'blue' });
  rect.on('moving', function (opt) {
    if (this.fill === 'blue') {
      this.fill = 'red';
    } else {
      this.fill = 'blue';
    }
    this.dirty = true;
  });
  canvas.add(rect);
}
