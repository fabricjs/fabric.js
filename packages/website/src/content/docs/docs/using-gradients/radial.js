const canvas = new fabric.Canvas(canvasEl);

const rect = new fabric.Rect({
  width: 280,
  height: 160,
  fill: new fabric.Gradient({
    type: 'radial',
    // both circles share a centre, so the gradient spreads evenly outwards
    coords: { x1: 140, y1: 80, r1: 0, x2: 140, y2: 80, r2: 150 },
    colorStops: [
      { offset: 0, color: '#fbbf24' },
      { offset: 0.5, color: '#0284c7' },
      { offset: 1, color: '#7c3aed' },
    ],
  }),
});

canvas.add(rect);
canvas.centerObject(rect);
