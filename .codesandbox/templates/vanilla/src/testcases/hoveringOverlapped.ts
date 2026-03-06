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
  canvas.renderAll();

  const map = canvas._objects.reduce((sum, a) => ((sum[a.id] = a), sum), {});
  let hoverId;

  canvas.on('mouse:over', (e) => {
    console.log({
      c: e.currentTarget?.id,
      t: e.target?.id,
      sp: canvas._isSelectionKeyPressed(e.e),
    });
    hoverId = canvas._isSelectionKeyPressed(e.e)
      ? e.currentTarget?.id
      : e.target?.id;
    canvas.requestRenderAll();
  });
  canvas.on('mouse:out', () => {
    hoverId = undefined;
    canvas.requestRenderAll();
  });

  const lastDrawControls = fabric.Canvas.prototype.drawControls;
  fabric.Canvas.prototype.drawControls = function (ctx) {
    drawHoverBorder.call(this, ctx);
    return lastDrawControls.call(this, ctx);
  };
  function drawHoverBorder(ctx) {
    const obj = map[hoverId];
    if (!obj) return;
    const vpt = this.viewportTransform;
    const matrix = fabric.util.multiplyTransformMatrices(
      vpt,
      obj.calcTransformMatrix(),
    );
    const options = fabric.util.qrDecompose(matrix);
    ctx.save();
    ctx.translate(options.translateX, options.translateY);
    ctx.lineWidth = 3;
    if (obj.flipX) options.angle -= 180;
    ctx.rotate(
      fabric.util.degreesToRadians(obj.group ? options.angle : obj.angle),
    );
    obj.drawBorders(ctx, options, { borderColor: obj.borderColor });
    ctx.restore();
  }
}
