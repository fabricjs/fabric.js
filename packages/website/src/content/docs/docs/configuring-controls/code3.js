const canvas = new fabric.Canvas(canvasEl);

const text = new fabric.FabricText('Fabric.JS', { controls: {
    ...fabric.FabricText.createControls().controls,
    mySpecialControl: new fabric.Control({
        x: -0.5,
        y: 0.25,
    }),
} });
const rect = new fabric.Rect({ width: 100, height: 100, fill: 'green', controls: {
    ...fabric.FabricText.createControls().controls,
    mySpecialControl: new fabric.Control({
        x: 0.5,
        y: -0.25,
    }),
} });

canvas.add(text, rect);
canvas.centerObject(text);
canvas.setActiveObject(text);