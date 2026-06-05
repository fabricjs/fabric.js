import { expect, test } from '../../../fixtures/base';
import type * as fabric from 'fabric';
import type { FabricObject } from 'fabric';

declare const globalThis: {
  renderRectsPadding(rects: FabricObject[]): void;
};

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

    globalThis.renderRectsPadding = (rects) => {
      for (let y = 0; y <= canvas.height; y += 2) {
        for (let x = 0; x < canvas.width; x += 2) {
          rects.some((rect) => {
            const p = new window.fabric.Point(x, y);
            const pt = p.transform(
              window.fabric.util.invertTransform(canvas.viewportTransform),
            );
            if (canvas._checkTarget(rect, pt)) {
              render({ x, y }, rect.fill as string);
            }
          });
        }
      }
    };
  }, null);

  await canvasUtil.executeInBrowser((canvas) => {
    const group = canvas.getObjects()[0] as fabric.Group;
    const rects = group.getObjects();
    globalThis.renderRectsPadding(rects);
  }, null);

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
    globalThis.renderRectsPadding(rects);
  }, null);

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
    globalThis.renderRectsPadding(rects);
  }, null);

  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'zoomed-transformed-group-padding.png',
  });
});
