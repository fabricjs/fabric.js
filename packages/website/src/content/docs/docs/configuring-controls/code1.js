const canvas = new fabric.Canvas(canvasEl);

const text = new fabric.FabricText('Fabric.JS', {
  cornerStyle: 'round',
  cornerStrokeColor: 'blue',
  cornerColor: 'lightblue',
  cornerStyle: 'circle',
  padding: 10,
  transparentCorners: false,
  cornerDashArray: [2, 2],
  borderColor: 'orange',
  borderDashArray: [3, 1, 3],
  borderScaleFactor: 2,
});
canvas.add(text);
canvas.centerObject(text);
canvas.setActiveObject(text);