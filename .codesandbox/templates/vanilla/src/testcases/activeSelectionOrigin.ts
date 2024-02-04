import * as fabric from 'fabric';

fabric.FabricObject.ownDefaults.originX = 'right';
fabric.FabricObject.ownDefaults.originY = 'bottom';

fabric.ActiveSelection.ownDefaults.originX = 'left';
fabric.ActiveSelection.ownDefaults.originY = 'top';

export function testCase(canvas: fabric.Canvas, objectCaching = true) {
  var rect1 = new fabric.Rect({
    left: 150,
    top: 150,
    fill: 'red',
    width: 60,
    height: 60,
    stroke: 'yellow',
    strokeWidth: 0,
    transparentCorners: false,
    cornerStyle: 'rect',
    cornerColor: '#87CEFA',
    cornerSize: 6,
    cornerStrokeColor: '#2F4F4F',
    hasControls: true,
    lockSkewingX: true,
    lockSkewingY: true,
    lockRotation: true,
    _controlsVisibility: { mtr: false },
  });
  canvas.add(rect1);

  var rect2 = new fabric.Rect({
    left: 250,
    top: 250,
    fill: 'lightgreen',
    width: 60,
    height: 60,
    stroke: 'yellow',
    strokeWidth: 0,
    transparentCorners: false,
    cornerStyle: 'rect',
    cornerColor: '#87CEFA',
    cornerSize: 6,
    cornerStrokeColor: '#2F4F4F',
    hasControls: true,
    lockSkewingX: true,
    lockSkewingY: true,
    lockRotation: true,
    _controlsVisibility: { mtr: false },
  });
  canvas.add(rect2);

  var rect3 = new fabric.Rect({
    left: 300,
    top: 300,
    fill: 'yellow',
    width: 60,
    height: 60,
    strokeWidth: 0,
    transparentCorners: false,
    cornerStyle: 'rect',
    cornerColor: '#87CEFA',
    cornerSize: 6,
    cornerStrokeColor: '#2F4F4F',
    hasControls: true,
    lockSkewingX: true,
    lockSkewingY: true,
    lockRotation: true,
    _controlsVisibility: { mtr: false },
  });
  canvas.add(rect3);

  Promise.all([rect1, rect2, rect3].map((obj) => obj.clone())).then((objs) =>
    canvas.add(...objs)
  );

  const as = new fabric.ActiveSelection([rect1, rect3, rect2], { canvas });
  canvas.setActiveObject(as);
  //   as.add(rect1);
  //   as.add(rect3);
}
