import * as fabric from 'fabric';

export function testCase(canvas: fabric.Canvas) {
  const textValue = 'LOL';
  const path = new fabric.Path(
    'M0 200 v-200 h200      a100,100 90 0,1 0,200     a100,100 90 0,1 -200,0     z',
    {
      fill: '',
      stroke: 'red',
    },
  );
  const text = new fabric.IText(textValue, {
    width: 200,
    top: 20,
    path,
    objectCaching: false,
  });
  canvas.add(text);
  canvas.centerObjectH(text);
}
