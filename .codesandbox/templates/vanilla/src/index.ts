import * as fabric from 'fabric';
import './styles.css';

const el = document.getElementById('canvas');
const canvas = (window.canvas = new fabric.Canvas(el));

//  edit from here
canvas.setDimensions({
  width: 900,
  height: 500,
});

var obj,
  style = {
    transparentCorners: false,
    cornerStyle: 'rect',
    cornerSize: 6,
    cornerColor: 'blue',
    cornerStrokeColor: 'white',
  },
  id = -1;

var line = new fabric.Line([200, 340, 800, 340], {
  fill: 'red',
  stroke: 'red',
  strokeWidth: 5,
});
canvas.add(line);

var pts = [
  {
    x: 300,
    y: 200,
  },
  {
    x: 440,
    y: 340,
  },
  {
    x: 520,
    y: 220,
  },
  {
    x: 580,
    y: 280,
  },
];

var polyObj = new fabric.Polyline(pts, {
  id: id++,
  fill: 'transparent',
  stroke: 'black',
  strokeWidth: 5,
  originX: 'center',
  originY: 'center',
  strokeUniform: true,
  objectCaching: false,
  //exactBoundingBox:true
});

var polyObj2 = new fabric.Polyline(
  pts.map((p) => ({ ...p })),
  {
    id: id++,
    fill: 'transparent',
    stroke: 'green',
    strokeWidth: 5,
    originX: 'center',
    originY: 'center',
    strokeUniform: false,
    objectCaching: false,
    //exactBoundingBox:true
  }
);

const renderControl = (style) => {
  return (ctx, left, top, styleOverride, fabricObject) => {
    styleOverride = style || {};
    fabric.Control.prototype.render.call(
      this,
      ctx,
      left,
      top,
      styleOverride,
      fabricObject
    );
  };
};

var controls = fabric.controlsUtils.createPolyControls(polyObj);
var controls2 = fabric.controlsUtils.createPolyControls(polyObj2);
for (const [key, value] of Object.entries(controls)) {
  value.render = renderControl(style);
  polyObj.controls[key] = value;
  controls2[key].render = renderControl(style);
  polyObj2.controls[key] = controls2[key];
}
canvas.add(polyObj, polyObj2);

canvas.on('selection:created', function () {
  obj = canvas.getActiveObject();
  console.log(`${obj.left}, ${obj.top}, ${obj.width}, ${obj.height}`);
});
canvas.on('selection:cleared', function () {
  obj = '';
});
