import * as fabric from 'fabric';

export function testCase(canvas: fabric.Canvas) {
  const polygonFlatRed = new fabric.Polygon(
    [
      { x: 0, y: 0 },
      { x: 200, y: 0 },
    ],
    {
      top: 100,
      stroke: 'red',
      strokeWidth: 4,
      transparentCorners: false,
      cornerStyle: 'circle',
      hasBorders: false,
      controls: fabric.controlsUtils.createPolyControls(2),
      objectCaching: false,
    },
  );

  const polygonGreen = new fabric.Polygon(
    [
      { x: 0, y: 0 },
      { x: 200, y: 50 },
    ],
    {
      top: 200,
      stroke: 'green',
      strokeWidth: 4,
      transparentCorners: false,
      cornerStyle: 'circle',
      hasBorders: false,
      controls: fabric.controlsUtils.createPolyControls(2),
      objectCaching: false,
    },
  );

  const polygonBlue = new fabric.Polygon(
    [
      { x: 0, y: 100 },
      { x: 50, y: 0 },
      { x: 100, y: 100 },
    ],
    {
      top: 300,
      stroke: 'blue',
      strokeWidth: 40,
      scaleX: 2,
      scaleY: 1,
      angle: 15,
      strokeUniform: true,
      exactBoundingBox: true,
      strokeMiterLimit: 9999,
      skewX: 10,
      skewY: 10,
      transparentCorners: false,
      cornerStyle: 'circle',
      hasBorders: false,
      controls: fabric.controlsUtils.createPolyControls(3),
      objectCaching: false,
    },
  );

  const polygonPurple = new fabric.Polygon(
    [
      { x: 0, y: 100 },
      { x: 50, y: 0 },
      { x: 100, y: 100 },
    ],
    {
      top: 300,
      stroke: 'purple',
      fill: '',
      strokeWidth: 40,
      scaleX: 2,
      scaleY: 1,
      angle: 10,
      strokeUniform: true,
      exactBoundingBox: false,
      strokeMiterLimit: 9999,
      skewX: 10,
      skewY: 10,
      transparentCorners: false,
      cornerStyle: 'circle',
      hasBorders: false,
      controls: fabric.controlsUtils.createPolyControls(3),
      objectCaching: true,
    },
  );

  const polygonYellow = new fabric.Polygon(
    [
      { x: 0, y: 100 },
      { x: 50, y: 0 },
      { x: 100, y: 100 },
    ],
    {
      top: 300,
      stroke: 'yellow',
      fill: '',
      strokeWidth: 40,
      scaleX: 2,
      scaleY: 1,
      angle: 10,
      exactBoundingBox: true,
      strokeMiterLimit: 9999,
      skewX: 10,
      skewY: 10,
      transparentCorners: false,
      cornerStyle: 'circle',
      hasBorders: false,
      controls: fabric.controlsUtils.createPolyControls(3),
      objectCaching: false,
    },
  );

  const polygonOrange = new fabric.Polygon(
    [
      { x: 0, y: 100 },
      { x: 50, y: 0 },
      { x: 100, y: 100 },
    ],
    {
      top: 300,
      fill: '',
      stroke: 'orange',
      strokeWidth: 40,
      scaleX: 2,
      scaleY: 1,
      angle: 10,
      strokeMiterLimit: 9999,
      skewX: 10,
      skewY: 10,
      transparentCorners: false,
      cornerStyle: 'circle',
      hasBorders: false,
      controls: fabric.controlsUtils.createPolyControls(3),
      objectCaching: false,
    },
  );

  canvas.add(polygonFlatRed);
  canvas.add(polygonGreen);
  canvas.add(polygonBlue);
  canvas.add(polygonOrange);
  canvas.add(polygonPurple);
  canvas.add(polygonYellow);
  canvas.centerObjectH(polygonFlatRed);
  canvas.centerObjectH(polygonGreen);
  canvas.centerObjectH(polygonBlue);
}
