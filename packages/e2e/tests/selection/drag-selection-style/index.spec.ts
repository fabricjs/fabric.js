import type { Page } from '@playwright/test';
import type { Canvas } from 'fabric';
import { expect, test } from '../../../fixtures/base';
import type { CanvasUtil } from '../../../utils/CanvasUtil';

/**
 * Draws a free drawing stroke with the given brush dash array,
 * then leaves drawing mode.
 */
const freeDraw = async (
  page: Page,
  canvasUtil: CanvasUtil,
  strokeDashArray: number[] | null,
) => {
  await canvasUtil.executeInBrowser(
    (canvas: Canvas, { strokeDashArray }) => {
      canvas.freeDrawingBrush!.strokeDashArray = strokeDashArray;
      canvas.isDrawingMode = true;
    },
    { strokeDashArray },
  );
  const box = (await canvasUtil.upperCanvas.boundingBox())!;
  await page.mouse.move(box.x + 30, box.y + 30);
  await page.mouse.down();
  await page.mouse.move(box.x + 270, box.y + 50, { steps: 10 });
  await page.mouse.up();
  await canvasUtil.executeInBrowser((canvas: Canvas) => {
    canvas.isDrawingMode = false;
    canvas.renderAll();
  });
};

/**
 * Drags a selection rectangle on empty canvas and screenshots it
 * while the mouse is still pressed, then releases the mouse.
 */
const screenshotDragSelection = async (page: Page, canvasUtil: CanvasUtil) => {
  const box = (await canvasUtil.upperCanvas.boundingBox())!;
  await page.mouse.move(box.x + 50, box.y + 90);
  await page.mouse.down();
  await page.mouse.move(box.x + 250, box.y + 270, { steps: 10 });
  const image = await canvasUtil.screenshot();
  await page.mouse.up();
  return image;
};

// https://github.com/fabricjs/fabric.js/issues/7732
test('drag selection stays solid after drawing with a dashed brush', async ({
  page,
  canvasUtil,
}) => {
  // reference: drag selection before any free drawing happened
  expect(await screenshotDragSelection(page, canvasUtil)).toMatchSnapshot({
    name: 'solid-selection.png',
  });

  // actual: same drag selection after drawing with a dashed brush
  await freeDraw(page, canvasUtil, [20, 20]);
  expect(await screenshotDragSelection(page, canvasUtil)).toMatchSnapshot({
    name: 'solid-selection.png',
    maxDiffPixelRatio: 0.005,
  });
});

test('drag selection keeps its own dash pattern after drawing with a dashed brush', async ({
  page,
  canvasUtil,
}) => {
  await canvasUtil.executeInBrowser((canvas) => {
    canvas.selectionDashArray = [7, 5];
  });
  const beforeDrawing = await screenshotDragSelection(page, canvasUtil);

  await freeDraw(page, canvasUtil, [20, 20]);

  expect(await screenshotDragSelection(page, canvasUtil)).toEqual(
    beforeDrawing,
  );
});

// https://github.com/fabricjs/fabric.js/issues/9123
test('drag selection smaller than its border draws no border', async ({
  page,
  canvasUtil,
}) => {
  const blank = await canvasUtil.screenshot();
  const box = (await canvasUtil.upperCanvas.boundingBox())!;
  await page.mouse.move(box.x + 150, box.y + 150);
  await page.mouse.down();
  // a click that fires a mousemove without moving
  await page.mouse.move(box.x + 150, box.y + 150, { steps: 5 });
  expect(await canvasUtil.screenshot()).toEqual(blank);
  // pointer jitter, thinner than the 4px border
  await page.mouse.move(box.x + 152, box.y + 153);
  expect(await canvasUtil.screenshot()).toEqual(blank);
  // one axis exactly the border width still draws
  await page.mouse.move(box.x + 154, box.y + 160);
  expect(await canvasUtil.screenshot()).not.toEqual(blank);
  await page.mouse.up();
});
