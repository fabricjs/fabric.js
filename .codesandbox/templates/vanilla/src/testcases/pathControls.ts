import * as fabric from 'fabric';

export function testCase(canvas: fabric.Canvas) {
  const path = new fabric.Path(
    'M 50 50 L 150 50 C 150 100, 50 100, 50 150 Q 100 200, 150 150 Z',
    {
      stroke: 'red',
      strokeWidth: 2,
      cornerStyle: 'circle',
      objectCaching: false,
      fill: 'transparent',
      left: 100,
      top: 100,
    }
  );
  path.controls = fabric.controlsUtils.createPathControls(path, {
    controlPointStyle: {
      controlFill: 'red',
      controlStroke: 'black',
    },
    pointStyle: {
      controlFill: 'green',
      controlStroke: 'black',
    },
  });
  canvas.add(path);
  console.log(path.controls);
  path.on('modifyPath', (opt) => {
    console.log(opt.commandIndex, opt.pointIndex);
  });
}
