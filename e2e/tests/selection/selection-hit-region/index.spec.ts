import { expect, test } from '@playwright/test';
import setup from '../../../setup';
import { CanvasUtil } from '../../../utils/CanvasUtil';

setup();

test('Selection hit regions', async ({ page }) => {
  const canvasUtil = new CanvasUtil(page);
  await canvasUtil.executeInBrowser((canvas) => {
    const group = canvas.getObjects()[0] as fabric.Group;
    const rects = group.getObjects();
    const render = ({ x, y }: fabric.XY, fill: string) => {
      const ctx = canvas.getTopContext();
      ctx.fillStyle = fill;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.fillRect(x, y, 1, 1);
      ctx.fill();
    };
    for (let y = 0; y <= canvas.height; y += 2) {
      for (let x = 0; x < canvas.width; x += 2) {
        rects.some((rect) => {
          if (canvas._checkTarget(rect, new fabric.Point(x, y))) {
            render({ x, y }, rect.fill as string);
          }
        });
      }
    }
  });
  expect(await new CanvasUtil(page).screenshot()).toMatchSnapshot();
});
