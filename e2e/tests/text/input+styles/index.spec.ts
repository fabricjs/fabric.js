import { CanvasUtil } from '../../../utils/CanvasUtil';
import { expect, test } from '@playwright/test';

import '../../../setup';

test('test', async ({ page }) => {
  const canvasUtil = new CanvasUtil(page);
  await expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: '1-initial.png',
  });
  await canvasUtil.click({
    position: {
      x: 156,
      y: 65,
    },
    delay: 200,
  });
  await canvasUtil.click({
    position: {
      x: 176,
      y: 152,
    },
    delay: 200,
  });
  await page.mouse.down();
  await page.mouse.move(60, 66, { steps: 40 });
  await page.mouse.up();
  await canvasUtil.press('Control+c');
  await canvasUtil.click({
    position: {
      x: 176,
      y: 152,
    },
    delay: 200,
  });
  await canvasUtil.press('Enter');
  await canvasUtil.press('a');
  await canvasUtil.press('b');
  await canvasUtil.press('c');
  await canvasUtil.press('Enter');
  await expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: '2-before-pasting.png',
  });
  await canvasUtil.press('Control+v');
  await expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: '3-after-pasting.png',
  });
  // await canvasUtil.click({
  //   position: {
  //     x: 246,
  //     y: 371,
  //   },
  // });
  // await canvasUtil.press('Enter');
  // await canvasUtil.press('Enter');
  // await canvasUtil.press('x');
  // await canvasUtil.click({
  //   position: {
  //     x: 144,
  //     y: 202,
  //   },
  // });
  // await canvasUtil.press('Enter');
  // await canvasUtil.press('Enter');
  // await canvasUtil.press('Enter');
  // await canvasUtil.press('Enter');
  // await canvasUtil.press('Backspace');
  // await canvasUtil.press('Backspace');
  // await canvasUtil.press('ArrowUp');
  // await canvasUtil.press('ArrowUp');
  // await canvasUtil.press('Delete');
  // await canvasUtil.click({
  //   position: {
  //     x: 170,
  //     y: 203,
  //   },
  // });
  // await canvasUtil.press('Enter');
  // await canvasUtil.click({
  //   position: {
  //     x: 136,
  //     y: 336,
  //   },
  // });
  // await canvasUtil.press('#');
  // await canvasUtil.click({
  //   position: {
  //     x: 103,
  //     y: 334,
  //   },
  // });
  // await canvasUtil.press('#');
  // await canvasUtil.click({
  //   position: {
  //     x: 238,
  //     y: 423,
  //   },
  // });
  // await canvasUtil.press('#');
  // await canvasUtil.click({
  //   position: {
  //     x: 52,
  //     y: 480,
  //   },
  // });
  // await canvasUtil.press('#');
  // await canvasUtil.click({
  //   position: {
  //     x: 81,
  //     y: 231,
  //   },
  // });
  // await canvasUtil.press('#');
  // await canvasUtil.click({
  //   position: {
  //     x: 91,
  //     y: 265,
  //   },
  // });
  // await canvasUtil.press('#');
  // await canvasUtil.click({
  //   position: {
  //     x: 182,
  //     y: 158,
  //   },
  // });
  // await canvasUtil.press('#');
  // await canvasUtil.click({
  //   position: {
  //     x: 79,
  //     y: 146,
  //   },
  // });
  // await canvasUtil.press('#');
  // await canvasUtil.click({
  //   position: {
  //     x: 137,
  //     y: 65,
  //   },
  // });
  // await canvasUtil.press('#');
  // await canvasUtil.click({
  //   position: {
  //     x: 131,
  //     y: 265,
  //   },
  // });
  // await expect(await canvasUtil.screenshot()).toMatchSnapshot();
  // await canvasUtil.press('Enter');
  // await canvasUtil.press('Enter');
  // await canvasUtil.press('#');
  // await canvasUtil.press('Backspace');
  // await canvasUtil.press('Backspace');
  // await canvasUtil.press('Backspace');
  // await canvasUtil.press('Backspace');
  // await canvasUtil.press('Backspace');
  // await canvasUtil.press('Backspace');
  // await canvasUtil.press('Backspace');
  // await canvasUtil.press('Backspace');
  // await canvasUtil.press('Delete');
  // await canvasUtil.press('Delete');
  // await canvasUtil.press('Delete');
  // await canvasUtil.press('Enter');
  // await canvasUtil.press('Enter');
  // await canvasUtil.press('Backspace');
  // await canvasUtil.press('ArrowUp');
  // await canvasUtil.press('Delete');
  // await expect(await canvasUtil.screenshot()).toMatchSnapshot();
});
