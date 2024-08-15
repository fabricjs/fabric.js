import { expect, test } from '@playwright/test';
import setup from '../../../setup';
import { CanvasUtil } from '../../../utils/CanvasUtil';

setup();

test('Control hit regions', async ({ page }) => {
  const canvasUtil = new CanvasUtil(page);
  await canvasUtil.executeInBrowser((canvas) => {
    const rect = canvas.getActiveObject();
    const render = ({ x, y }: fabric.Point, fill: string) => {
      const ctx = canvas.getTopContext();
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    };
    for (let y = 0; y <= canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const point = new fabric.Point(x, y);
        rect.findControl(point, true) && render(point, 'indigo');
        rect.findControl(point) && render(point, 'magenta');
      }
    }
  });
  expect(await new CanvasUtil(page).screenshot()).toMatchSnapshot();
});
