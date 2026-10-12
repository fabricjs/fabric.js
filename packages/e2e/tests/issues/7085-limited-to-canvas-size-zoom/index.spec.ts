import type { Page } from '@playwright/test';
import type { Canvas } from 'fabric';
import { expect, test } from '../../../fixtures/base';
import type { CanvasUtil } from '../../../utils/CanvasUtil';

const setup = (
  canvasUtil: CanvasUtil,
  zoom: number,
  limitedToCanvasSize: boolean,
) =>
  canvasUtil.executeInBrowser(
    (canvas: Canvas, { zoom, limitedToCanvasSize }) => {
      canvas.remove(...canvas.getObjects());
      canvas.clearContext(canvas.contextTop);
      canvas.setZoom(zoom);
      canvas.freeDrawingBrush!.limitedToCanvasSize = limitedToCanvasSize;
      canvas.renderAll();
    },
    { zoom, limitedToCanvasSize },
  );

const drawStroke = async (page: Page, canvasUtil: CanvasUtil) => {
  const box = (await canvasUtil.upperCanvas.boundingBox())!;
  await page.mouse.move(box.x + 40, box.y + 60);
  await page.mouse.down();
  await page.mouse.move(box.x + 340, box.y + 60, { steps: 20 });
  await page.mouse.move(box.x + 340, box.y + 360, { steps: 20 });
  await page.mouse.up();
  await canvasUtil.executeInBrowser((canvas: Canvas) => canvas.renderAll());
  return canvasUtil.screenshot();
};

test('#7085 limitedToCanvasSize keeps the full stroke on a zoomed canvas', async ({
  page,
  canvasUtil,
}) => {
  // reference: same zoom and gesture without limiting, nothing leaves the canvas
  await setup(canvasUtil, 0.5, false);
  expect(await drawStroke(page, canvasUtil)).toMatchSnapshot({
    name: 'limited-brush-zoomed-out.png',
  });

  // actual: limitedToCanvasSize should not drop points inside the canvas
  await setup(canvasUtil, 0.5, true);
  expect(await drawStroke(page, canvasUtil)).toMatchSnapshot({
    name: 'limited-brush-zoomed-out.png',
    maxDiffPixelRatio: 0.002,
  });
});
