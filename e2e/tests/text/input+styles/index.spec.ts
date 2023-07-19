import { expect, test } from '@playwright/test';

import '../../../setup';

test('test', async ({ page }) => {
  const canvas = page.locator('canvas.upper-canvas');
  await canvas.click({
    position: {
      x: 156,
      y: 65,
    },
    delay: 200,
  });
  await canvas.click({
    position: {
      x: 176,
      y: 152,
    },
    delay: 200,
  });
  await page.mouse.down();
  await page.mouse.move(60, 66, { steps: 40 });
  await page.mouse.up();
  await canvas.press('Control+c');
  await canvas.click({
    position: {
      x: 176,
      y: 152,
    },
    delay: 200,
  });
  await canvas.press('Enter');
  await canvas.press('Enter');
  await canvas.press('Control+v');
  await canvas.click({
    position: {
      x: 246,
      y: 371,
    },
  });
  await canvas.press('Enter');
  await canvas.press('Enter');
  await canvas.press('x');
  await canvas.click({
    position: {
      x: 144,
      y: 202,
    },
  });
  await canvas.press('Enter');
  await canvas.press('Enter');
  await canvas.press('Enter');
  await canvas.press('Enter');
  await canvas.press('Backspace');
  await canvas.press('Backspace');
  await canvas.press('ArrowUp');
  await canvas.press('ArrowUp');
  await canvas.press('Delete');
  await canvas.click({
    position: {
      x: 170,
      y: 203,
    },
  });
  await canvas.press('Enter');
  await canvas.click({
    position: {
      x: 136,
      y: 336,
    },
  });
  await canvas.press('#');
  await canvas.click({
    position: {
      x: 103,
      y: 334,
    },
  });
  await canvas.press('#');
  await canvas.click({
    position: {
      x: 238,
      y: 423,
    },
  });
  await canvas.press('#');
  await canvas.click({
    position: {
      x: 52,
      y: 480,
    },
  });
  await canvas.press('#');
  await canvas.click({
    position: {
      x: 81,
      y: 231,
    },
  });
  await canvas.press('#');
  await canvas.click({
    position: {
      x: 91,
      y: 265,
    },
  });
  await canvas.press('#');
  await canvas.click({
    position: {
      x: 182,
      y: 158,
    },
  });
  await canvas.press('#');
  await canvas.click({
    position: {
      x: 79,
      y: 146,
    },
  });
  await canvas.press('#');
  await canvas.click({
    position: {
      x: 137,
      y: 65,
    },
  });
  await canvas.press('#');
  await canvas.click({
    position: {
      x: 131,
      y: 265,
    },
  });
  await expect(await canvas.screenshot()).toMatchSnapshot();
  await canvas.press('Enter');
  await canvas.press('Enter');
  await canvas.press('#');
  await canvas.press('Backspace');
  await canvas.press('Backspace');
  await canvas.press('Backspace');
  await canvas.press('Backspace');
  await canvas.press('Backspace');
  await canvas.press('Backspace');
  await canvas.press('Backspace');
  await canvas.press('Backspace');
  await canvas.press('Delete');
  await canvas.press('Delete');
  await canvas.press('Delete');
  await canvas.press('Enter');
  await canvas.press('Enter');
  await canvas.press('Backspace');
  await canvas.press('ArrowUp');
  await canvas.press('Delete');
  await expect(await canvas.screenshot()).toMatchSnapshot();
});
