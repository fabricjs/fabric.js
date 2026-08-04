const canvas = new fabric.Canvas(canvasEl);

fabric.Object.prototype.noScaleCache = false;
/*
	strokeUniform works better without scalingCache
	Objects in group are not scaled directly, so stroke uniform will not have effect.
*/
function toggleUniform() {
	var aObject = canvas.getActiveObject();
	if (aObject.type === 'activeSelection') {
		aObject.getObjects().forEach(function(obj) {
			obj.set('strokeUniform', !obj.strokeUniform);
		});
	} else {
		aObject.set('strokeUniform', !aObject.strokeUniform);
	}
	canvas.requestRenderAll();
}

// create a rectangle object
const rect = new fabric.Rect({
    left: 100,
    top: 50,
    fill: '#D81B60',
    width: 50,
    height: 50,
    strokeWidth: 2,
    stroke: "#880E4F",
    rx: 10,
    ry: 10,
    angle: 45,
    scaleX: 3,
    scaleY: 3,
    hasControls: true
});

canvas.add(rect);

const circle1 = new fabric.Circle({
    radius: 65,
    fill: '#039BE5',
    left: 0,
    stroke: 'red',
    strokeWidth: 3
});

const circle2 = new fabric.Circle({
    radius: 65,
    fill: '#4FC3F7',
    left: 110,
    opacity: 0.7,
    stroke: 'blue',
    strokeWidth: 3,
    strokeUniform: true
});

canvas.add(circle1);
canvas.add(circle2);
