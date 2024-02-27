import * as fabric from 'fabric';

export function testCase(canvas: fabric.Canvas) {
  const textValue = 'fabric.js sandbox';
  const text = new fabric.Textbox(textValue, {
    originX: 'center',
    splitByGrapheme: true,
    width: 200,
    top: 20,
    backgroundColor: 'yellow',
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
      textValue
    ),
    clipPath: new fabric.Circle({
      radius: 50,
      originX: 'center',
      originY: 'center',
      scaleX: 2,
      inverted: true,
      fill: 'blue',
      // opacity: 0.4,
    }),
  });
  const rect = new fabric.Rect({
    fill: 'blue',
    width: 100,
    height: 50,
    left: 0,
    top: 100,
  });
  canvas.centerObject(text);
  canvas.centerObject(rect);
  const group = new fabric.Group([rect, text], {
    subTargetCheck: true,
    interactive: true,
    clipPath: new fabric.Circle({
      radius: 100,
      originX: 'center',
      originY: 'center',
    }),
  });
  canvas.add(group);

  function animate(toState) {
    fabric.util.animate({
      startValue: 1 - Number(toState),
      endValue: Number(toState),
      onChange: (value) => {
        text.clipPath?.set({
          scaleX: Math.max(value, 0.1) * 2,
          opacity: value,
        });
        text.set({ dirty: true });
        canvas.renderAll();
      },
      onComplete: () => animate(!toState),
      duration: 150,
      easing: toState
        ? fabric.util.ease.easeInOutQuad
        : fabric.util.ease.easeInOutSine,
    });
    // text.clipPath!.animate(
    //   {
    //     scaleX: Math.max(Number(toState), 0.1) * 2,
    //     opacity: Number(toState),
    //   },
    //   {
    //     onChange: () => canvas.requestRenderAll(),
    //     onComplete: () => animate(!toState),
    //     duration: 150,
    //     easing: toState
    //       ? fabric.util.ease.easeInOutQuad
    //       : fabric.util.ease.easeInOutSine,
    //   }
    // );
  }
  animate(1);
}
