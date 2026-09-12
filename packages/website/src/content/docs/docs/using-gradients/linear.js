const canvas = new fabric.Canvas(canvasEl);

const rect = new fabric.Rect({
  width: 280,
  height: 160,
  fill: new fabric.Gradient({
    type: 'linear',
    // a horizontal axis: left edge to right edge of the 280px wide rect
    coords: { x1: 0, y1: 0, x2: 280, y2: 0 },
    colorStops: [
      { offset: 0, color: '#7c3aed' },
      { offset: 0.5, color: '#0284c7' },
      { offset: 1, color: '#fbbf24' },
    ],
  }),
});

canvas.add(rect);
canvas.centerObject(rect);
