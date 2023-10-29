import * as fabric from 'fabric';
import './styles.css';

var canvas;

canvas = new fabric.Canvas('canvas');

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
  fill: 'transparent',
  stroke: 'black',
  strokeWidth: 10,
  originX: 'center',
  originY: 'center',
  scaleX: 1.4,
  scaleY: 1.1,
  strokeUniform: false, // doesn't change
  objectCaching: false,
});

//  edit from here
canvas.setDimensions({
  width: 900,
  height: 500,
});

canvas.add(polyObj);

polyObj.skewX = 10;
canvas.renderAll();
