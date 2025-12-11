import * as fabric from 'fabric';

export async function testCase(canvas: fabric.Canvas) {
  canvas.preserveObjectStacking = true;
  canvas.setDimensions({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const image = await fabric.FabricImage.fromURL(
    'https://www.w3schools.com/tags/img_girl.jpg',
    {},
    { scaleX: 0.5, scaleY: 0.5, top: 100, left: 100, selectable: true },
  );
  const fixedGroup = new fabric.Group([image], {
    width: image.width,
    height: image.height,
    layoutManager: new fabric.LayoutManager(new fabric.FixedLayout()),
    subTargetCheck: true,
    interactive: true,
    selectable: false,
    backgroundColor: 'red',
    top: 300,
    left: 300,
  });
  canvas.add(fixedGroup);
  fixedGroup.setCoords();

  // FixedLayout position is significantly inaccurate when canvas zoom is below 0.5
  setTimeout(() => {
    canvas.zoomToPoint(canvas.getCenterPoint(), 0.1);
    canvas.renderAll();
  }, 3000);
}
