const canvas = new fabric.Canvas(canvasEl, {
  backgroundColor: '#f5f5f5',
});

//   import { createLinearGradientControls } from 'fabric/extensions';
const { createLinearGradientControls } = extensions;

// A plain Gradient instance. The controls are bound to this object and edit
// its `coords` and `colorStops` in place as you drag.
const gradient = new fabric.Gradient({
  type: 'linear',
  coords: { x1: 40, y1: 40, x2: 360, y2: 210 },
  colorStops: [
    { offset: 0.1, color: '#7c3aed' },
    { offset: 0.4, color: '#0284c7' },
    { offset: 0.7, color: '#059669' },
    { offset: 0.9, color: '#fbbf24' },
  ],
});

const rect = new fabric.Rect({
  width: 400,
  height: 250,
  left: canvas.getWidth() / 2,
  top: canvas.getHeight() / 2,
  originX: 'center',
  originY: 'center',
  fill: gradient,
  cornerColor: '#ffffff',
  cornerStrokeColor: '#334155',
  borderColor: '#334155',
  transparentCorners: false,
  cornerStyle: 'circle',
});

// Merge the gradient handles into the object's own controls: the two endpoints
// of the gradient vector (lgp_1, lgp_2) plus one handle per color stop
// (lgo_0 ... lgo_3).
rect.controls = {
  ...rect.controls,
  ...createLinearGradientControls(gradient),
};

canvas.add(rect);
canvas.setActiveObject(rect);
