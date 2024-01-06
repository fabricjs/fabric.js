import * as fabric from 'fabric';

export function testCase(canvas: fabric.Canvas) {
  const polygonRed = new fabric.Polygon(
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
    }
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
    }
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
      strokeUniform: true,
      exactBoundingBox: true,
      strokeMiterLimit: 9999,
      skewX: 10,
      transparentCorners: false,
      cornerStyle: 'circle',
      hasBorders: false,
      controls: fabric.controlsUtils.createPolyControls(3),
      objectCaching: false,
    }
  );

  canvas.add(polygonRed);
  canvas.add(polygonGreen);
  canvas.add(polygonBlue);
  canvas.centerObjectH(polygonRed);
  canvas.centerObjectH(polygonGreen);
  canvas.centerObjectH(polygonBlue);
}
