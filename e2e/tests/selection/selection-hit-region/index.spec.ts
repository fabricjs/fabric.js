import { expect, test } from '../../../fixtures/base';

test('Selection hit regions', async ({ canvasUtil }) => {
  // prepare some common functions
  await canvasUtil.executeInBrowser((canvas) => {
    const render = ({ x, y }: fabric.XY, fill: string) => {
      const ctx = canvas.getTopContext();
      ctx.fillStyle = fill;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.fillRect(x, y, 1, 1);
      ctx.fill();
    };

    window.renderRectsPadding = (rects) => {
      for (let y = 0; y <= canvas.height; y += 2) {
        for (let x = 0; x < canvas.width; x += 2) {
          rects.some((rect) => {
            if (canvas._checkTarget(rect, new fabric.Point(x, y))) {
              render({ x, y }, rect.fill as string);
            }
          });
        }
      }
    };
  });

  await canvasUtil.executeInBrowser((canvas) => {
    const group = canvas.getObjects()[0] as fabric.Group;
    const rects = group.getObjects();
    window.renderRectsPadding(rects);
  });

  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'group-padding.png',
  });

  await canvasUtil.executeInBrowser((canvas) => {
    const group = canvas.getObjects()[0] as fabric.Group;
    const rects = group.getObjects();
    group.scaleX = 0.5;
    group.scaleY = 0.5;
    group.rotate(45);
    canvas.centerObject(group);
    canvas.contextTopDirty = true;
    canvas.renderAll();
    window.renderRectsPadding(rects);
  });

  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'transformed-group-padding.png',
  });

  await canvasUtil.executeInBrowser((canvas) => {
    const group = canvas.getObjects()[0] as fabric.Group;
    const rects = group.getObjects();
    canvas.setZoom(2);
    canvas.viewportCenterObject(group);
    canvas.contextTopDirty = true;
    canvas.renderAll();
    window.renderRectsPadding(rects);
  });

  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'zoomed-transformed-group-padding.png',
  });
});
