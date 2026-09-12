let _clipboard;
function Copy() {
  // clone what are you copying since you
  // may want copy and paste on different moment.
  // and you do not want the changes happened
  // later to reflect on the copy.
  canvas
    .getActiveObject()
    .clone()
    .then((cloned) => {
      _clipboard = cloned;
    });
}

async function Paste() {
  // clone again, so you can do multiple copies.
  const clonedObj = await _clipboard.clone();
  canvas.discardActiveObject();
  clonedObj.set({
    left: clonedObj.left + 10,
    top: clonedObj.top + 10,
    evented: true,
  });
  if (clonedObj instanceof fabric.ActiveSelection) {
    // active selection needs a reference to the canvas.
    clonedObj.canvas = canvas;
    clonedObj.forEachObject((obj) => {
      canvas.add(obj);
    });
    // this should solve the unselectability
    clonedObj.setCoords();
  } else {
    canvas.add(clonedObj);
  }
  _clipboard.top += 10;
  _clipboard.left += 10;
  canvas.setActiveObject(clonedObj);
  canvas.requestRenderAll();
}

// not using addEventListener to avoid cleanup logic in the demo code
document.getElementById('copy').onclick = () => Copy();
document.getElementById('paste').onclick = () => Paste();

const canvas = new fabric.Canvas(canvasEl);
// create a rectangle object
const rect = new fabric.Rect({
  left: 100,
  top: 50,
  fill: '#D81B60',
  width: 100,
  height: 100,
  strokeWidth: 2,
  stroke: '#880E4F',
  rx: 10,
  ry: 10,
  angle: 45,
  hasControls: true,
});

canvas.add(rect);

// create a rectangle object
const rect2 = new fabric.Rect({
  left: 200,
  top: 50,
  fill: '#F06292',
  width: 100,
  height: 100,
  strokeWidth: 2,
  stroke: '#880E4F',
  rx: 10,
  ry: 10,
  angle: 45,
  hasControls: true,
});

canvas.add(rect2);

const circle1 = new fabric.Circle({
  radius: 65,
  fill: '#039BE5',
  left: 0,
});

const circle2 = new fabric.Circle({
  radius: 65,
  fill: '#4FC3F7',
  left: 110,
  opacity: 0.7,
});

const group = new fabric.Group([circle1, circle2], {
  left: 40,
  top: 250,
});

canvas.add(group);