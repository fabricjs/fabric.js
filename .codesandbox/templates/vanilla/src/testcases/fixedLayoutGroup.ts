import * as fabric from 'fabric';

export async function testCase(canvas: fabric.Canvas) {
  const fixedRects = [
    new fabric.Rect({
      width: 100,
      height: 100,
      fill: 'blu',
      opacity: 0.5,
    }),
    new fabric.Rect({
      width: 100,
      height: 100,
      left: 100,
      opacity: 0.5,
      fill: 'red',
    }),
    new fabric.Rect({
      width: 100,
      height: 100,
      top: 100,
      opacity: 0.5,
      fill: 'yellow',
    }),
    new fabric.Rect({
      width: 100,
      top: 100,
      left: 100,
      height: 100,
      opacity: 0.5,
      fill: 'green',
    }),
  ];

  const fitRects = await Promise.all(fixedRects.map((rect) => rect.clone()));

  const purpleRect = new fabric.Rect({
    width: 100,
    height: 100,
    top: 105,
    left: 110,
    opacity: 0.5,
    fill: 'purple',
  });

  const orangeRect = new fabric.Rect({
    width: 100,
    height: 100,
    top: 120,
    left: 120,
    opacity: 0.5,
    fill: 'orange',
  });

  const fixedGroup = new fabric.Group(fixedRects, {
    width: 100,
    height: 100,
    layoutManager: new fabric.LayoutManager(new fabric.FixedLayout()),
  });

  const fitGroup = new fabric.Group(fitRects);

  canvas.add(fixedGroup, purpleRect, fitGroup, orangeRect);

  fixedGroup.add(purpleRect);
  fitGroup.add(orangeRect);
  canvas.requestRenderAll();
}
