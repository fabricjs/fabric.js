import * as fabric from 'fabric';

export function testCase(canvas: fabric.Canvas, objectCaching = true) {
  function renderNamedControl(
    this: fabric.Control,
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: fabric.FabricObject,
  ) {
    ctx.save();
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(this.name || '??', left - 12, top - 3);
    ctx.restore();
  }

  canvas.preserveObjectStacking = true;
  const rect = new fabric.Rect({
    left: 100,
    top: 50,
    width: 100,
    height: 100,
    flipX: false,
    fill: 'blue',
    padding: 20,
  });

  const controls = rect.controls;

  Object.entries(controls).forEach(([key, control]) => {
    control.name = key;
    control.render = renderNamedControl;
  });

  const rect2 = new fabric.Rect({
    top: 200,
    width: 50,
    height: 50,
    fill: 'red',
    flipX: true,
    opacity: 1,
    controls,
    padding: 20,
  });

  const g = new fabric.Group([rect], {
    subTargetCheck: true,
    interactive: true,
    objectCaching,
    skewX: 0,
    angle: 90,
    flipY: true,
    controls,
  });
  const g2 = new fabric.Group([rect2], {
    top: 100,
    left: 100,
    subTargetCheck: true,
    interactive: true,
    objectCaching,
    angle: 0,
    flipY: false,
    controls,
  });
  canvas.add(g);
  canvas.add(g2);
}
