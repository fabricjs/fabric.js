import { expect, test } from '@playwright/test';
import { CanvasUtil } from '../../../utils/CanvasUtil';

import '../../../setup';

test('startImmediatePropagation: mousemove + setActiveObject', async ({
  page,
}) => {
  const canvasUtil = new CanvasUtil(page);
  await page.mouse.move(300, 360);
  await page.mouse.down();
  await page.mouse.move(300, 100, { steps: 40 });
  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'moved.png',
  });
  await page.mouse.move(300, 360, { steps: 40 });
  await page.mouse.up();
  expect(await canvasUtil.screenshot()).toMatchSnapshot({
    name: 'up.png',
  });
});
