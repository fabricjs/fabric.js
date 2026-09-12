const canvas = new fabric.Canvas(canvasEl);

fabric.Object.ownDefaults.transparentCorners = false;

const rect1 = new fabric.Rect({
  width: 200,
  height: 100,
  left: 0,
  top: 50,
  angle: 30,
  fill: 'rgba(255,0,0,0.5)',
});

const rect2 = new fabric.Rect({
  width: 100,
  height: 100,
  left: 350,
  top: 250,
  angle: -10,
  fill: 'rgba(0,200,0,0.5)',
});

const rect3 = new fabric.Rect({
  width: 50,
  height: 100,
  left: 275,
  top: 350,
  angle: 45,
  stroke: '#eee',
  strokeWidth: 10,
  fill: 'rgba(0,0,200,0.5)',
});

const circle = new fabric.Circle({
  radius: 50,
  left: 275,
  top: 75,
  fill: '#aac',
});

const triangle = new fabric.Triangle({
  width: 100,
  height: 100,
  left: 50,
  top: 300,
  fill: '#cca',
});

canvas.add(rect1, rect2, rect3, circle, triangle);
canvas.on({
  'object:moving': onChange,
  'object:scaling': onChange,
  'object:rotating': onChange,
  'object:skewing': onChange,
});

const hit = new fabric.Circle({
  radius: 5,
  originX: 'center',
  originY: 'center',
  opacity: 0.5,
});

function onChange({ target }) {
  target.setCoords();
  const ctx = canvas.getTopContext();
  canvas.clearContext(ctx);
  canvas.forEachObject((obj) => {
    if (obj === target) {
      obj.set('opacity', 1);
      return;
    }
    const intersection = fabric.Intersection.intersectPolygonPolygon(
      target.getCoords(true),
      obj.getCoords(true)
    );

    hit.set({ fill: obj.fill });
    if (
      intersection.status === 'Intersection' ||
      intersection.status === 'Coincident' ||
      obj.isContainedWithinObject(target, true) ||
      target.isContainedWithinObject(obj, true)
    ) {
      obj.set('opacity', 0.5);
      ctx.save();
      ctx.transform(...canvas.viewportTransform);
      hit.transform(ctx);
      intersection.points.forEach(({ x, y }) => {
        ctx.save();
        ctx.translate(x, y);
        hit._render(ctx);
        ctx.restore();
      });
      ctx.restore();
    } else {
      obj.set('opacity', 1);
    }
  });
}
