import * as fabric from 'fabric';

export function testCase(canvas: fabric.Canvas) {
  const path = new fabric.Path(
    'M 4 8 L 10 1 L 13 0 L 12 3 L 5 9 C 6 10 6 11 7 10 C 8 10 8 12 7 12 Q 4 13 2 11 C 1 9 2 6 3 6 C 2 7 3 7 4 8 M 10 1 L 10 3 L 12 3 L 10.2 2.8 L 10 1 Z',
    {
      stroke: 'red',
      strokeWidth: 0.1,
      cornerStyle: 'circle',
      objectCaching: false,
      scaleX: 20,
      scaleY: 20,
      fill: 'transparent',
      left: 100,
      top: 100,
    }
  );
  (path.controls = fabric.controlsUtils.createPathControls(path)),
    canvas.add(path);
}
