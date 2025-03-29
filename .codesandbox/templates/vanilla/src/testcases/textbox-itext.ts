import * as fabric from 'fabric';

export function testCase(canvas: fabric.Canvas) {
  const textValue = 'Lorem ipsum dolor sit amet consecutrioeioreieo';
  const text = new fabric.Textbox(textValue, {
    width: 200,
    top: 20,
    fill: '',
    stroke: 'red',
  });
  canvas.add(text);
  canvas.centerObjectH(text);
}
