import type { Point } from 'fabric';
import { expect, test } from '../../../fixtures/base';

test('Control hit regions', async ({ page, canvasUtil }) => {
  await canvasUtil.executeInBrowser((canvas) => {
    const rect = canvas.getActiveObject()!;
    const render = ({ x, y }: Point, fill: string) => {
      const ctx = canvas.getTopContext();
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    };
    for (let y = 0; y <= canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const point = new window.fabric.Point(x, y);
        rect.findControl(point, true) && render(point, 'indigo');
        rect.findControl(point) && render(point, 'magenta');
      }
    }
  }, null);
  expect(await canvasUtil.screenshot()).toMatchSnapshot();
});
