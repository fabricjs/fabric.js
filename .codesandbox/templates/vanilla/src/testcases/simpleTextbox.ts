import * as fabric from 'fabric';

export function testCase(canvas: fabric.Canvas) {
  const textValue = 'fabric.js sandbox';
  const text = new fabric.Textbox(textValue, {
    originX: 'center',
    splitByGrapheme: true,
    width: 200,
    top: 20,
    styles: fabric.util.stylesFromArray(
      [
        {
          style: {
            fontWeight: 'bold',
            fontSize: 64,
          },
          start: 0,
          end: 9,
        },
      ],
      textValue,
    ),
  });
  canvas.add(text);
  canvas.centerObjectH(text);
  function animate(toState) {
    text.animate(
      { scaleX: Math.max(toState, 0.1) * 2 },
      {
        onChange: () => canvas.renderAll(),
        onComplete: () => animate(!toState),
        duration: 1000,
        easing: toState
          ? fabric.util.ease.easeInOutQuad
          : fabric.util.ease.easeInOutSine,
      },
    );
  }
  // animate(1);
}
