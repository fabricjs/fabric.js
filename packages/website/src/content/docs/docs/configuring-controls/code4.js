const canvas = new fabric.Canvas(canvasEl);

fabric.Textbox.createControls = () => {
  const controls = fabric.controlsUtils.createTextboxDefaultControls();
  delete controls.mtr;
  return {
    controls: {
      ...controls,
      mySpecialControl: new fabric.Control({
        x: -0.5,
        y: 0.25,
      }),
    }
  }
}

const text = new fabric.Textbox('Fabric.JS');
const text2 = new fabric.Textbox('Fabric.JS');

canvas.add(text, text2);
canvas.centerObject(text);
canvas.setActiveObject(text);