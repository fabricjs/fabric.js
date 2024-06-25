import * as fabric from 'fabric';

export async function testCase(canvas: fabric.Canvas) {
  const utahCommonDefaults = {
    originX: 'center' as const,
    originY: 'center' as const,
  };

  fabric.ActiveSelection.ownDefaults = {
    ...fabric.ActiveSelection.ownDefaults,
    ...utahCommonDefaults,
  };

  fabric.Rect.ownDefaults = {
    ...fabric.Rect.ownDefaults,
    ...utahCommonDefaults,
  };

  const rect = new fabric.Rect({ width: 500, height: 500, fill: 'blue' });
  const rect2 = new fabric.Rect({ width: 500, height: 500, fill: 'blue' });

  canvas.add(rect, rect2);
}
