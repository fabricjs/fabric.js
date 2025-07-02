import * as fabric from 'fabric';

export function testCase(canvas: fabric.Canvas, objectCaching = true) {
  const rect1 = new fabric.Rect({
    width: 100,
    height: 100,
    fill: 'red',
    flipX: true,
  });
  const rect2 = new fabric.Rect({
    width: 100,
    height: 100,
    fill: 'yellow',
    left: 200,
  });
  const group = new fabric.Group([rect1, rect2], {
    interactive: true,
    subTargetCheck: true,
  });
  canvas.add(group);
}
