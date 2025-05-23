import * as fabric from 'fabric';
import { initAligningGuidelines } from 'fabric/extensions';

export async function testCase(canvas: fabric.Canvas) {
  initAligningGuidelines(
    canvas,
    {
      width: 2,
      margin: 60,
    },
    // Filter predicate to exclude red filled objects from snapping
    (potentialSnappingTarget: fabric.FabricObject) =>
      potentialSnappingTarget.fill === 'red',
  );

  const rect = new fabric.Rect({
    width: 50,
    height: 50,
    fill: 'blue',
    top: 10,
    left: 10,
  });
  const rect2 = new fabric.Rect({
    width: 50,
    height: 50,
    top: 100,
    left: 100,
    fill: 'blue',
  });
  const rect3 = new fabric.Rect({
    width: 50,
    height: 50,
    top: 175,
    left: 75,
    fill: 'red',
  });
  const rect4 = new fabric.Rect({
    width: 50,
    height: 50,
    top: 75,
    left: 350,
    fill: 'red',
  });

  canvas.add(rect, rect2, rect3, rect4);
}
