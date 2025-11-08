import * as fabric from 'fabric';

export function testCase(canvas: fabric.Canvas) {
  const text2 = new fabric.Textbox(
    'On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided.',
    {
      objectCaching: false,
      fontFamily: 'Arial',
      strokeWidth: 0,
      top: 120,
      left: 260,
      fontSize: 24,
      width: 600,
    },
  );
  canvas.setDimensions({ width: 900, height: 700 });
  canvas.add(text2);
  canvas.centerObject(text2);
}
