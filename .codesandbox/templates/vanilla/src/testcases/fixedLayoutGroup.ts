import * as fabric from 'fabric';

export function testCase(canvas: fabric.Canvas) {
  const rects = [
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

  const purpleRect = new fabric.Rect({
    width: 100,
    height: 100,
    top: 105,
    left: 110,
    opacity: 0.5,
    fill: 'purple',
  });

  const fixedGroup = new fabric.Group(rects, {
    width: 100,
    height: 100,
    layoutManager: new fabric.LayoutManager(new fabric.FixedLayout()),
  });

  canvas.add(fixedGroup, purpleRect);

  fixedGroup.add(purpleRect);
}
