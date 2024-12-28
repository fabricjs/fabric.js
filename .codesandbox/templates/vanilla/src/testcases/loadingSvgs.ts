import * as fabric from 'fabric';

export async function testCase(canvas: fabric.Canvas) {
  const rect = new fabric.Rect({
    id: 'a',
    left: 40,
    top: 20,
    width: 100,
    height: 100,
  });
  const rect2 = new fabric.Rect({
    id: 'b',
    left: 160,
    top: 10,
    width: 100,
    height: 100,
  });
  const rect3 = new fabric.Rect({
    id: 'c',
    left: 80,
    top: 80,
    width: 100,
    height: 100,
  });
  canvas.add(rect, rect2, rect3);
  canvas.on('mouse:over', (e) => {
    console.log(e.target?.type);
  }
}
