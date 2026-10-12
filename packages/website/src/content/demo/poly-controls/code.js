const canvas = new fabric.Canvas(canvasEl);

const points = [
  {
    x: 3,
    y: 4,
  },
  {
    x: 16,
    y: 3,
  },
  {
    x: 30,
    y: 5,
  },
  {
    x: 25,
    y: 55,
  },
  {
    x: 19,
    y: 44,
  },
  {
    x: 15,
    y: 30,
  },
  {
    x: 15,
    y: 55,
  },
  {
    x: 9,
    y: 55,
  },
  {
    x: 6,
    y: 53,
  },
  {
    x: -2,
    y: 55,
  },
  {
    x: -4,
    y: 40,
  },
  {
    x: 0,
    y: 20,
  },
];

const poly = new fabric.Polygon(points, {
  left: 200,
  top: 50,
  fill: 'yellow',
  strokeWidth: 1,
  stroke: 'grey',
  scaleX: 5,
  scaleY: 5,
  objectCaching: false,
  transparentCorners: false,
  cornerColor: 'blue',
});
canvas.viewportTransform = [0.7, 0, 0, 0.7, -50, 50];
canvas.add(poly);

let editing = false;
poly.on('mousedblclick', () => {
  editing = !editing;
  if (editing) {
    poly.cornerStyle = 'circle';
    poly.cornerColor = 'rgba(0,0,255,0.5)';
    poly.hasBorders = false;
    poly.controls = fabric.controlsUtils.createPolyControls(poly);
  } else {
    poly.cornerColor = 'blue';
    poly.cornerStyle = 'rect';
    poly.hasBorders = true;
    poly.controls = fabric.controlsUtils.createObjectDefaultControls();
  }
  poly.setCoords();
  canvas.requestRenderAll();
});
