import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures/base';
import type { CanvasUtil } from '../../../utils/CanvasUtil';

const tests = [
  {
    name: 'selection stale state #9087',
    step: (page: Page) =>
      test.step('deselect', async () => {
        await page.mouse.move(20, 20);
        await page.mouse.down();
        await page.mouse.up();
      }),
  },
  {
    name: 'replacing selection',
    step: (page: Page, canvasUtil: CanvasUtil) =>
      test.step('replace selection', () =>
        canvasUtil.executeInBrowser((canvas) => {
          canvas.setActiveObject(
            new window.fabric.ActiveSelection(canvas.getActiveObjects()),
          );
        }, null)),
  },
];

for (const { name, step } of tests) {
  test(name, async ({ page, canvasUtil }) => {
    await test.step('select', async () => {
      await page.mouse.move(20, 20);
      await page.mouse.down();
      await page.mouse.move(600, 600, { steps: 20 });
      await page.mouse.up();
    });
    await test.step('rotate', async () => {
      await page.mouse.move(400, 150);
      await page.mouse.down();
      await page.mouse.move(570, 150, { steps: 20 });
      await page.mouse.up();
    });
    await step(page, canvasUtil);
    await test.step('select', async () => {
      await page.mouse.move(20, 20);
      await page.mouse.down();
      await page.mouse.move(600, 600, { steps: 20 });
      await page.mouse.up();
    });
    expect(await canvasUtil.screenshot()).toMatchSnapshot({
      name: 'selection-stale-state.png',
    });
  });
}
