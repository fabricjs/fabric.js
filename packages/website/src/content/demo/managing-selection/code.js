function add() {
    const { width, height } = canvas;
    var red = new fabric.Rect({
        top: Math.random() * (height - 25),
        left: Math.random() * (width - 40),
        width: 80,
        height: 50,
        fill: 'red'
    });
    var blue = new fabric.Rect({
        top: Math.random() * (height - 35),
        left: Math.random() * (width - 25),
        width: 50,
        height: 70,
        fill: 'blue'
    });
    var green = new fabric.Rect({
        top: Math.random() * (height - 30),
        left: Math.random() * (width - 30),
        width: 60,
        height: 60,
        fill: 'green'
    });
    canvas.add(red, blue, green);
}

const $ = (id) => document.getElementById(id);

const canvas = new fabric.Canvas(canvasEl);
add();
fabric.FabricObject.ownDefaults.transparentCorners = false;
  
$('addmore').onclick = add;

$('multiselect').onclick = function() {
    canvas.discardActiveObject();
    var sel = new fabric.ActiveSelection(canvas.getObjects(), {
        canvas: canvas,
    });
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();
}

$('group').onclick = function() {
    if (!canvas.getActiveObject()) {
        return;
    }
    console.log(canvas.getActiveObject().type)
    if (canvas.getActiveObject().type !== 'activeSelection' && canvas.getActiveObject().type !== 'activeselection') {
        return;
    }
    const group = new fabric.Group(canvas.getActiveObject().removeAll())
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.requestRenderAll();
}

$('ungroup').onclick = function() {
    const group = canvas.getActiveObject();
    if (!group || group.type !== 'group') {
        return;
    }
    canvas.remove(group);
    var sel = new fabric.ActiveSelection(group.removeAll(), {
        canvas: canvas,
    });
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();
}

$('discard').onclick = function() {
    canvas.discardActiveObject();
    canvas.requestRenderAll();
}