import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import setup from '../../../setup';
import { CanvasUtil } from '../../../utils/CanvasUtil';

setup();

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
    step: (page: Page) =>
      test.step('replace selection', () =>
        new CanvasUtil(page).executeInBrowser((canvas) => {
          canvas.setActiveObject(
            new fabric.ActiveSelection(canvas.getActiveObjects()),
          );
        })),
  },
];

for (const { name, step } of tests) {
  test(name, async ({ page }) => {
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
    await step(page);
    await test.step('select', async () => {
      await page.mouse.move(20, 20);
      await page.mouse.down();
      await page.mouse.move(600, 600, { steps: 20 });
      await page.mouse.up();
    });
    expect(await new CanvasUtil(page).screenshot()).toMatchSnapshot({
      name: 'selection-stale-state.png',
    });
  });
}
