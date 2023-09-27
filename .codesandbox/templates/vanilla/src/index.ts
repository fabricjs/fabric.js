import * as fabric from 'fabric';
import './styles.css';

const el = document.getElementById('canvas');
const canvas = (window.canvas = new fabric.Canvas(el, {
  width: 500,
  height: 500,
  viewportTransform: fabric.util.multiplyTransformMatrixArray([
    fabric.util.createTranslateMatrix(100, 50),
    fabric.util.createScaleMatrix(0.5, 0.75),
  ]),
}));

//  edit from here
const textValue = 'fabric.js sandbox';
const text = new fabric.Textbox(textValue, {
  originX: 'center',
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
    textValue
  ),
});
canvas.add(
  new fabric.Group(
    [
      text,
      new fabric.Group(
        [
          new fabric.Rect({ width: 10, height: 10 }),
          new fabric.Group(
            [
              new fabric.Rect({ width: 10, height: 10 }),
              new fabric.Group(
                [
                  new fabric.Rect({ width: 10, height: 10 }),
                  new fabric.Group(
                    [
                      new fabric.Rect({ width: 10, height: 10 }),
                      new fabric.Group(
                        [new fabric.Rect({ width: 10, height: 10 })],
                        { subTargetCheck: true, interactive: true }
                      ),
                    ],
                    {
                      skewY: 45,
                      subTargetCheck: true,
                      interactive: true,
                    }
                  ),
                ],
                {
                  skewX: 45,
                  subTargetCheck: true,
                  interactive: true,
                }
              ),
            ],
            { scaleY: 2, subTargetCheck: true, interactive: true }
          ),
        ],
        { scaleX: 2, subTargetCheck: true, interactive: true }
      ),
    ],
    { left: 100, subTargetCheck: true, interactive: true }
  )
);
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
    }
  );
}

const rainbow = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'indigo',
  'violet',
].reverse();
canvas.on('mouse:move', ({ pointer, target }) => {
  const ctx = canvas.getTopContext();
  canvas.clearContext(ctx);
  if (!target) {
    return;
  }

  let step = 0;
  const draw = (arg0: fabric.Point | fabric.Object) => {
    step++;
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = rainbow[step % rainbow.length];
    ctx.beginPath();
    ctx.arc(pointer.x, pointer.y, step * 5, 0, Math.PI * 2);
    ctx.moveTo(
      pointer.x + step * 5 * Math.cos((step % 4) * Math.PI),
      pointer.y + step * 5 * Math.sin((step % 4) * Math.PI)
    );

    if (arg0 instanceof fabric.Object) {
      const { left, top, width, height } = arg0.getBoundingRect(true);
      const center = arg0.getCenterPoint();
      ctx.lineTo(center.x, center.y);
      ctx.stroke();
      ctx.transform(...canvas.viewportTransform);
      ctx.strokeRect(left, top, width, height);
    } else {
      ctx.lineTo(arg0.x, arg0.y);
      ctx.stroke();
    }
    ctx.restore();
  };

  draw(target);
  target.getAncestors(true).forEach((group) => {
    draw(group);
  });
  draw(
    fabric.util.sendPointToPlane(new fabric.Point(), canvas.viewportTransform)
  );
  !fabric.util.isIdentityMatrix(canvas.viewportTransform) &&
    draw(new fabric.Point());
});
// canvas.on('after:render', () => {
//   const ctx = canvas.getTopContext();
//   canvas.clearContext(ctx);
// });
