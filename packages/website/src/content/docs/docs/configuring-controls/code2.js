const canvas = new fabric.Canvas(canvasEl);

fabric.InteractiveFabricObject.ownDefaults = {
    ...fabric.InteractiveFabricObject.ownDefaults,
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
}

const text = new fabric.FabricText('Fabric.JS');
const rect = new fabric.Rect({ width: 100, height: 100, fill: 'green' });

canvas.add(text, rect);
canvas.centerObject(text);
canvas.setActiveObject(text);