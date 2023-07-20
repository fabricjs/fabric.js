import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:1234/');
  const canvas = page.locator('canvas').nth(1);
  await canvas.click({
    position: {
      x: 227,
      y: 50,
    },
  });
  await page.mouse.dblclick(227, 50);
  await canvas.dragTo(canvas, {
    sourcePosition: {
      x: 227,
      y: 50,
    },
    targetPosition: {
      x: 340,
      y: 140,
    },
  });
  expect(await canvas.screenshot()).toMatchSnapshot();
});

/**
 * import { expect, test } from '@playwright/test';

import '../../../setup';

test('test', async ({ page }) => {
  const canvas = page.locator('canvas').nth(1);
  await canvas.click({
    position: {
      x: 227,
      y: 50,
    },
  });
  await page.mouse.dblclick(227, 50);
  // await canvas.hover({
  //   position: {
  //     x: 227,
  //     y: 50,
  //   },
  // });
  // await page.mouse.down();
  // await canvas.hover({
  //   position: {
  //     x: 230,
  //     y: 60,
  //   },
  // });
  // await page.mouse.move(340, 140, { steps: 100 });
  // await canvas.hover({
  //   position: {
  //     x: 340,
  //     y: 140,
  //   },
  // });
  // await page.mouse.up();

  await page.dragAndDrop('canvas.upper-canvas', 'canvas.upper-canvas', {
    sourcePosition: {
      x: 227,
      y: 50,
    },
    targetPosition: {
      x: 300,
      y: 140,
    },
    force: true,
    timeout: 5000,
  });

  // await canvas.dragTo(canvas, {
  //   sourcePosition: {
  //     x: 227,
  //     y: 50,
  //   },
  //   targetPosition: {
  //     x: 300,
  //     y: 140,
  //   },
  //   force: true,
  //   timeout: 5000,
  // });
  expect(await canvas.screenshot()).toMatchSnapshot();
  await page.waitForTimeout(20000);
});

 */
