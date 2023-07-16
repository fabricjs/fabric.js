import { expect, test } from '@playwright/test';
import '../../../utils/setupTest';
import { TestUtil } from '../../../utils/TestUtil';

test('startImmediatePropagation: mousemove + setActiveObject', async ({
  page,
}) => {
  const util = new TestUtil(page);
  await page.mouse.move(300, 360);
  await page.mouse.down();
  await page.mouse.move(300, 100, { steps: 40 });
  expect(await util.screenshot()).toMatchSnapshot({
    name: 'moved.png',
  });
  await page.mouse.move(300, 360, { steps: 40 });
  await page.mouse.up();
  expect(await util.screenshot()).toMatchSnapshot({
    name: 'up.png',
  });
});
