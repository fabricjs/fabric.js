import * as fabric from 'fabric';
import * as extensions from 'fabric/extensions';

export function testCase(canvas: fabric.Canvas) {
  extensions.addGestures(canvas);
  canvas.on('pinch', extensions.pinchEventHandler.bind(canvas));
  canvas.on('rotate', extensions.rotateEventHandler.bind(canvas));
  canvas.on('mouse:dblclick', () => console.log('double'));
  canvas.on('mouse:tripleclick', () => console.log('triple'));
  const text2 = new fabric.IText(
    'On the other hand, we denounce with righteous indignation and dislike men who\n are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire\n, that they cannot foresee the pain and trouble that are bound to ensue;\n and equal blame belongs to those who fail in their duty through weakness of will, which is the same as\n saying through shrinking from toil and pain.\n These cases are perfectly simple and easy to distinguish.\n In a free hour, when our power of choice is untrammelled and\n when nothing prevents our being able to do what we like best, every pleasure is to\n be welcomed and every pain avoided.',
    {
      objectCaching: false,
      fontFamily: 'Arial',
      strokeWidth: 0,
      top: 120,
      textAlign: 'center',
      left: 260,
      fontSize: 24,
      width: 600,
    },
  );
  canvas.setDimensions({ width: 900, height: 700 });
  canvas.add(text2);
  canvas.centerObject(text2);
}
