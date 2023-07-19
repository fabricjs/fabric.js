import { expect, test } from '@playwright/test';

import '../../../setup';

test('test', async ({ page }) => {
  const canvas = page.locator('canvas.upper-canvas');
  await canvas.click({
    position: {
      x: 256,
      y: 65,
    },
    delay: 200,
  });
  await canvas.click({
    position: {
      x: 276,
      y: 152,
    },
    delay: 200,
  });
  await page.mouse.down();
  await page.mouse.move(160, 66, { steps: 40 });
  await page.mouse.up();
  await canvas.press('Control+c');
  await canvas.click({
    position: {
      x: 276,
      y: 152,
    },
    delay: 200,
  });
  await canvas.press('Enter');
  await canvas.press('Enter');
  await canvas.press('Control+v');
  await canvas.click({
    position: {
      x: 346,
      y: 371,
    },
  });
  await canvas.press('Enter');
  await canvas.press('Enter');
  await canvas.press('x');
  await canvas.click({
    position: {
      x: 244,
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
      x: 270,
      y: 203,
    },
  });
  await canvas.press('Enter');
  await canvas.click({
    position: {
      x: 236,
      y: 336,
    },
  });
  await canvas.press('#');
  await canvas.click({
    position: {
      x: 203,
      y: 334,
    },
  });
  await canvas.press('#');
  await canvas.click({
    position: {
      x: 338,
      y: 423,
    },
  });
  await canvas.press('#');
  await canvas.click({
    position: {
      x: 252,
      y: 480,
    },
  });
  await canvas.press('#');
  await canvas.click({
    position: {
      x: 181,
      y: 231,
    },
  });
  await canvas.press('#');
  await canvas.click({
    position: {
      x: 191,
      y: 265,
    },
  });
  await canvas.press('#');
  await canvas.click({
    position: {
      x: 282,
      y: 158,
    },
  });
  await canvas.press('#');
  await canvas.click({
    position: {
      x: 179,
      y: 146,
    },
  });
  await canvas.press('#');
  await canvas.click({
    position: {
      x: 237,
      y: 65,
    },
  });
  await canvas.press('#');
  await canvas.click({
    position: {
      x: 231,
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
