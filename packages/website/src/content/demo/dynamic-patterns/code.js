const canvas = new fabric.Canvas(canvasEl);
fabric.FabricObject.ownDefaults.transparentCorners = false;
const $ = (id) => document.getElementById(id);
const padding = 0;

fabric.Image.fromURL('../assets/pug.jpg').then((img) => {
  img.scaleToWidth(20);
  const patternSourceCanvas = new fabric.StaticCanvas();
  patternSourceCanvas.setDimensions({
    width: img.getScaledWidth() + padding,
    height: img.getScaledHeight() + padding,
  });
  patternSourceCanvas.add(img);
  patternSourceCanvas.renderAll();
  const pattern = new fabric.Pattern({
    source: patternSourceCanvas.getElement(),
    repeat: 'repeat',
  });
  canvas.add(
    new fabric.Polygon(
      [
        { x: 185, y: 0 },
        { x: 250, y: 100 },
        { x: 385, y: 170 },
        { x: 0, y: 245 },
      ],
      {
        left: 0,
        top: 200,
        angle: -30,
        fill: pattern,
        objectCaching: false,
        stroke: 'black'
      },
    ),
  );

  $('img-width').oninput = function () {
    img.scaleToWidth(parseInt(this.value, 10));
    patternSourceCanvas.setDimensions({
      width: img.getScaledWidth() + padding,
      height: img.getScaledHeight() + padding,
    });
    patternSourceCanvas.renderAll();
    canvas.requestRenderAll();
  };
  $('img-angle').oninput = function () {
    img.set('angle', this.value);
    patternSourceCanvas.renderAll();
    canvas.requestRenderAll();
  };
  $('img-padding').oninput = function () {
    padding = parseInt(this.value, 10);
    patternSourceCanvas.setDimensions({
      width: img.getScaledWidth() + padding,
      height: img.getScaledHeight() + padding,
    });
    patternSourceCanvas.renderAll();
    canvas.requestRenderAll();
  };
  $('img-offset-x').oninput = function () {
    pattern.offsetX = parseInt(this.value, 10);
    canvas.requestRenderAll();
  };
  $('img-offset-y').oninput = function () {
    pattern.offsetY = parseInt(this.value, 10);
    canvas.requestRenderAll();
  };
  $('img-repeat').onclick = function () {
    pattern.repeat = this.checked ? 'repeat' : 'no-repeat';
    canvas.requestRenderAll();
  };
});