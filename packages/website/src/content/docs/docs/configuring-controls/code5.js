const canvas = new fabric.Canvas(canvasEl);

// deactivate constructor control assignment
fabric.InteractiveFabricObject.createControls = () => {
    return {};
}

const controls = fabric.controlsUtils.createObjectDefaultControls();
delete controls.mtr;
fabric.InteractiveFabricObject.ownDefaults.controls = {
    ...controls,
    mySpecialControl: new fabric.Control({
      x: -0.5,
      y: 0.25,
    }),
}

const rect = new fabric.Rect({ width: 100, height: 100, fill: 'green' });
const rect2 = new fabric.Rect({ width: 100, height: 100, fill: 'orange', top: 100, left: 200 });

// adding a control dynamically after creation of instances on defaults will have effect on every object
fabric.InteractiveFabricObject.ownDefaults.controls.myOtherControls = new fabric.Control({
  x: 0.5,
  y: -0.25,
});

canvas.add(rect, rect2);
canvas.centerObject(rect);
canvas.setActiveObject(rect);