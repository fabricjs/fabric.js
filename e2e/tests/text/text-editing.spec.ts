import { expect, test } from '@playwright/test';
import { ObjectUtil } from '../../utils/ObjectUtil';
import { TestUtil } from '../../utils/TestUtil';
import '../../utils/setupTest';

test('textbox typing and resizing', async ({ page }) => {
  const util = new TestUtil(page);
  const textboxUtil = new ObjectUtil('textbox', page);
  const textCenter = await textboxUtil.getObjectCenter();

  expect(await util.screenshot()).toMatchSnapshot({ name: 'initial' });

  await util.clickCanvas({
    position: textCenter,
    clickCount: 2,
    delay: 200,
  });

  expect(await util.screenshot()).toMatchSnapshot({ name: 'start' });

  await page
    .locator('textarea')
    .type(
      'insert text in a textbox from the keyboard will wrap text on current textbox width',
      {
        // delay: 160,
      }
    );

  expect(await util.screenshot()).toMatchSnapshot({ name: 'typed' });

  const mrControlPoint = await textboxUtil.getObjectControlPoint('mr');

  // click outside to stop editing
  await util.clickCanvas({
    position: {
      x: mrControlPoint.x + 20,
      y: mrControlPoint.y,
    },
    clickCount: 1,
    delay: 200,
  });
  expect(await util.screenshot()).toMatchSnapshot({ name: 'exit_editing' });

  // click the object to select it
  await util.clickCanvas({
    position: textCenter,
  });

  // drag the mr control
  await page.mouse.move(mrControlPoint.x, mrControlPoint.y);
  await page.mouse.down();
  await page.mouse.move(mrControlPoint.x + 300, mrControlPoint.y, {
    steps: 40,
  });
  expect(await util.screenshot()).toMatchSnapshot({
    name: 'increase_width_mr',
  });
  // drag in the opposite direction
  await page.mouse.move(mrControlPoint.x - 300, mrControlPoint.y, {
    steps: 60,
  });
  await page.mouse.up();
  expect(await util.screenshot()).toMatchSnapshot({
    name: 'decrease_width_mr',
  });

  // drag the ml control
  const mlControlPoint = await textboxUtil.getObjectControlPoint('ml');
  await page.mouse.move(mlControlPoint.x, mlControlPoint.y);
  await page.mouse.down();
  await page.mouse.move(mlControlPoint.x - 300, mlControlPoint.y, {
    steps: 40,
  });
  expect(await util.screenshot()).toMatchSnapshot({
    name: 'increase_width_ml',
  });
  // drag in the opposite direction
  await page.mouse.move(mlControlPoint.x + 300, mlControlPoint.y, {
    steps: 60,
  });
  await page.mouse.up();
  expect(await util.screenshot()).toMatchSnapshot({
    name: 'decrease_width_ml',
  });
});
